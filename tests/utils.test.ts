/**
 * Horse Racing Game - Utility Functions Unit Tests
 */
import { describe, it, expect } from 'vitest';
import {
  getRandomInt,
  shuffleArray,
  generateHorses,
  selectHorsesForRound,
  generateRaceSchedule,
  calculateHorseSpeed,
  formatTime,
  getOrdinalSuffix,
  calculateProgress
} from '@/utils';
import { RACE_CONFIG } from '@/constants';

describe('Utility Functions', () => {
  describe('getRandomInt', () => {
    it('should return a number within the specified range', () => {
      for (let i = 0; i < 100; i++) {
        const result = getRandomInt(1, 10);
        expect(result).toBeGreaterThanOrEqual(1);
        expect(result).toBeLessThanOrEqual(10);
      }
    });

    it('should return the same number when min equals max', () => {
      const result = getRandomInt(5, 5);
      expect(result).toBe(5);
    });
  });

  describe('shuffleArray', () => {
    it('should return an array of the same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      expect(shuffled.length).toBe(original.length);
    });

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      original.forEach(item => {
        expect(shuffled).toContain(item);
      });
    });

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      shuffleArray(original);
      expect(original).toEqual(originalCopy);
    });
  });

  describe('generateHorses', () => {
    it('should generate exactly 20 horses', () => {
      const horses = generateHorses();
      expect(horses.length).toBe(RACE_CONFIG.TOTAL_HORSES);
    });

    it('should generate horses with unique IDs', () => {
      const horses = generateHorses();
      const ids = horses.map(h => h.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(horses.length);
    });

    it('should generate horses with unique colors', () => {
      const horses = generateHorses();
      const colors = horses.map(h => h.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(horses.length);
    });

    it('should generate horses with condition between 1 and 100', () => {
      const horses = generateHorses();
      horses.forEach(horse => {
        expect(horse.condition).toBeGreaterThanOrEqual(RACE_CONFIG.MIN_CONDITION);
        expect(horse.condition).toBeLessThanOrEqual(RACE_CONFIG.MAX_CONDITION);
      });
    });

    it('should generate horses with names', () => {
      const horses = generateHorses();
      horses.forEach(horse => {
        expect(horse.name).toBeTruthy();
        expect(typeof horse.name).toBe('string');
      });
    });
  });

  describe('selectHorsesForRound', () => {
    it('should select exactly 10 horses', () => {
      const horses = generateHorses();
      const selected = selectHorsesForRound(horses);
      expect(selected.length).toBe(RACE_CONFIG.HORSES_PER_ROUND);
    });

    it('should select horses from the provided pool', () => {
      const horses = generateHorses();
      const selected = selectHorsesForRound(horses);
      selected.forEach(selectedHorse => {
        expect(horses.some(h => h.id === selectedHorse.id)).toBe(true);
      });
    });

    it('should not modify the original horses array', () => {
      const horses = generateHorses();
      const originalLength = horses.length;
      selectHorsesForRound(horses);
      expect(horses.length).toBe(originalLength);
    });
  });

  describe('generateRaceSchedule', () => {
    it('should generate exactly 6 rounds', () => {
      const horses = generateHorses();
      const schedule = generateRaceSchedule(horses);
      expect(schedule.length).toBe(RACE_CONFIG.TOTAL_ROUNDS);
    });

    it('should assign correct distances to each round', () => {
      const horses = generateHorses();
      const schedule = generateRaceSchedule(horses);
      
      expect(schedule[0]!.distance).toBe(1200);
      expect(schedule[1]!.distance).toBe(1400);
      expect(schedule[2]!.distance).toBe(1600);
      expect(schedule[3]!.distance).toBe(1800);
      expect(schedule[4]!.distance).toBe(2000);
      expect(schedule[5]!.distance).toBe(2200);
    });

    it('should assign correct round numbers', () => {
      const horses = generateHorses();
      const schedule = generateRaceSchedule(horses);
      
      schedule.forEach((round, index) => {
        expect(round.roundNumber).toBe(index + 1);
      });
    });

    it('should assign 10 horses to each round', () => {
      const horses = generateHorses();
      const schedule = generateRaceSchedule(horses);
      
      schedule.forEach(round => {
        expect(round.horses.length).toBe(RACE_CONFIG.HORSES_PER_ROUND);
      });
    });

    it('should initialize all rounds with pending status', () => {
      const horses = generateHorses();
      const schedule = generateRaceSchedule(horses);
      
      schedule.forEach(round => {
        expect(round.status).toBe('pending');
      });
    });

    it('should initialize all rounds with empty results', () => {
      const horses = generateHorses();
      const schedule = generateRaceSchedule(horses);
      
      schedule.forEach(round => {
        expect(round.results).toEqual([]);
      });
    });
  });

  describe('calculateHorseSpeed', () => {
    it('should return a positive number', () => {
      const speed = calculateHorseSpeed(50);
      expect(speed).toBeGreaterThan(0);
    });

    it('should generally return higher speed for higher condition', () => {
      // Test multiple times due to randomness
      let highConditionFaster = 0;
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        const lowSpeed = calculateHorseSpeed(10);
        const highSpeed = calculateHorseSpeed(90);
        if (highSpeed > lowSpeed) highConditionFaster++;
      }
      
      // Should be faster most of the time (accounting for randomness)
      expect(highConditionFaster).toBeGreaterThan(iterations * 0.6);
    });
  });

  describe('formatTime', () => {
    it('should format milliseconds to seconds with 3 decimal places', () => {
      expect(formatTime(1000)).toBe('1.000s');
      expect(formatTime(1500)).toBe('1.500s');
      expect(formatTime(12345)).toBe('12.345s');
    });

    it('should handle zero milliseconds', () => {
      expect(formatTime(0)).toBe('0.000s');
    });

    it('should pad milliseconds with leading zeros', () => {
      expect(formatTime(1001)).toBe('1.001s');
      expect(formatTime(1010)).toBe('1.010s');
    });
  });

  describe('getOrdinalSuffix', () => {
    it('should return correct suffix for 1st, 2nd, 3rd', () => {
      expect(getOrdinalSuffix(1)).toBe('1st');
      expect(getOrdinalSuffix(2)).toBe('2nd');
      expect(getOrdinalSuffix(3)).toBe('3rd');
    });

    it('should return th for 4-20', () => {
      expect(getOrdinalSuffix(4)).toBe('4th');
      expect(getOrdinalSuffix(10)).toBe('10th');
      expect(getOrdinalSuffix(11)).toBe('11th');
      expect(getOrdinalSuffix(12)).toBe('12th');
      expect(getOrdinalSuffix(13)).toBe('13th');
      expect(getOrdinalSuffix(20)).toBe('20th');
    });

    it('should handle 21st, 22nd, 23rd correctly', () => {
      expect(getOrdinalSuffix(21)).toBe('21st');
      expect(getOrdinalSuffix(22)).toBe('22nd');
      expect(getOrdinalSuffix(23)).toBe('23rd');
    });
  });

  describe('calculateProgress', () => {
    it('should return 0 when position is 0', () => {
      expect(calculateProgress(0, 1000)).toBe(0);
    });

    it('should return 100 when position equals distance', () => {
      expect(calculateProgress(1000, 1000)).toBe(100);
    });

    it('should return 50 when position is half of distance', () => {
      expect(calculateProgress(500, 1000)).toBe(50);
    });

    it('should not exceed 100', () => {
      expect(calculateProgress(1500, 1000)).toBe(100);
    });
  });
});
