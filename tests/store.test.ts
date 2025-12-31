/**
 * Horse Racing Game - Vuex Store Unit Tests
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/store';
import type { HorseRaceState } from '@/types';
import { RaceStatus } from '@/types';
import { RACE_CONFIG } from '@/constants';

describe('Vuex Store', () => {
  beforeEach(() => {
    // Reset store before each test
    store.commit('RESET_GAME');
  });

  describe('Initial State', () => {
    it('should have 20 horses initially', () => {
      expect(store.state.horses.length).toBe(RACE_CONFIG.TOTAL_HORSES);
    });

    it('should have an empty schedule initially', () => {
      expect(store.state.schedule.rounds.length).toBe(0);
      expect(store.state.schedule.isGenerated).toBe(false);
    });

    it('should not be racing initially', () => {
      expect(store.state.isRacing).toBe(false);
    });

    it('should have empty race state initially', () => {
      expect(store.state.currentRaceState.length).toBe(0);
    });

    it('should have no results initially', () => {
      expect(store.state.allResults.length).toBe(0);
    });
  });

  describe('Getters', () => {
    it('allHorses should return all horses', () => {
      expect(store.getters.allHorses.length).toBe(RACE_CONFIG.TOTAL_HORSES);
    });

    it('isScheduleGenerated should return false initially', () => {
      expect(store.getters.isScheduleGenerated).toBe(false);
    });

    it('isScheduleGenerated should return true after generating', () => {
      store.commit('GENERATE_SCHEDULE');
      expect(store.getters.isScheduleGenerated).toBe(true);
    });

    it('currentRoundNumber should start at 1', () => {
      expect(store.getters.currentRoundNumber).toBe(1);
    });

    it('currentRound should return null when no schedule', () => {
      expect(store.getters.currentRound).toBe(null);
    });

    it('currentRound should return round after generating', () => {
      store.commit('GENERATE_SCHEDULE');
      expect(store.getters.currentRound).not.toBe(null);
      expect(store.getters.currentRound?.roundNumber).toBe(1);
    });

    it('allRacesCompleted should return false initially', () => {
      expect(store.getters.allRacesCompleted).toBe(false);
    });
  });

  describe('Mutations', () => {
    describe('GENERATE_SCHEDULE', () => {
      it('should generate 6 rounds', () => {
        store.commit('GENERATE_SCHEDULE');
        expect(store.state.schedule.rounds.length).toBe(RACE_CONFIG.TOTAL_ROUNDS);
      });

      it('should set isGenerated to true', () => {
        store.commit('GENERATE_SCHEDULE');
        expect(store.state.schedule.isGenerated).toBe(true);
      });

      it('should reset current round to 0', () => {
        store.commit('GENERATE_SCHEDULE');
        expect(store.state.schedule.currentRound).toBe(0);
      });

      it('should clear all results', () => {
        store.commit('GENERATE_SCHEDULE');
        expect(store.state.allResults.length).toBe(0);
      });

      it('should assign correct distances', () => {
        store.commit('GENERATE_SCHEDULE');
        const rounds = store.state.schedule.rounds;
        
        expect(rounds[0]!.distance).toBe(1200);
        expect(rounds[1]!.distance).toBe(1400);
        expect(rounds[2]!.distance).toBe(1600);
        expect(rounds[3]!.distance).toBe(1800);
        expect(rounds[4]!.distance).toBe(2000);
        expect(rounds[5]!.distance).toBe(2200);
      });
    });

    describe('RESET_GAME', () => {
      it('should regenerate horses', () => {
        store.commit('RESET_GAME');
        // Horses might have different conditions
        expect(store.state.horses.length).toBe(RACE_CONFIG.TOTAL_HORSES);
      });

      it('should clear schedule', () => {
        store.commit('GENERATE_SCHEDULE');
        store.commit('RESET_GAME');
        expect(store.state.schedule.rounds.length).toBe(0);
        expect(store.state.schedule.isGenerated).toBe(false);
      });

      it('should stop racing', () => {
        store.commit('SET_IS_RACING', true);
        store.commit('RESET_GAME');
        expect(store.state.isRacing).toBe(false);
      });
    });

    describe('SET_CURRENT_ROUND', () => {
      it('should update current round', () => {
        store.commit('GENERATE_SCHEDULE');
        store.commit('SET_CURRENT_ROUND', 3);
        expect(store.state.schedule.currentRound).toBe(3);
      });
    });

    describe('UPDATE_ROUND_STATUS', () => {
      it('should update round status', () => {
        store.commit('GENERATE_SCHEDULE');
        store.commit('UPDATE_ROUND_STATUS', { 
          roundIndex: 0, 
          status: RaceStatus.RUNNING 
        });
        expect(store.state.schedule.rounds[0]!.status).toBe(RaceStatus.RUNNING);
      });
    });

    describe('SET_IS_RACING', () => {
      it('should set racing state', () => {
        store.commit('SET_IS_RACING', true);
        expect(store.state.isRacing).toBe(true);
        
        store.commit('SET_IS_RACING', false);
        expect(store.state.isRacing).toBe(false);
      });
    });

    describe('INITIALIZE_RACE_STATE', () => {
      it('should initialize race state for horses', () => {
        store.commit('GENERATE_SCHEDULE');
        const horses = store.state.schedule.rounds[0]!.horses;
        store.commit('INITIALIZE_RACE_STATE', horses);
        
        expect(store.state.currentRaceState.length).toBe(RACE_CONFIG.HORSES_PER_ROUND);
      });

      it('should set initial position to 0', () => {
        store.commit('GENERATE_SCHEDULE');
        const horses = store.state.schedule.rounds[0]!.horses;
        store.commit('INITIALIZE_RACE_STATE', horses);
        
        store.state.currentRaceState.forEach((state: HorseRaceState) => {
          expect(state.position).toBe(0);
          expect(state.finished).toBe(false);
          expect(state.finishTime).toBe(null);
          expect(state.rank).toBe(null);
        });
      });
    });

    describe('UPDATE_HORSE_POSITION', () => {
      it('should update horse position', () => {
        store.commit('GENERATE_SCHEDULE');
        const horses = store.state.schedule.rounds[0]!.horses;
        store.commit('INITIALIZE_RACE_STATE', horses);
        
        const horseId = horses[0]!.id;
        store.commit('UPDATE_HORSE_POSITION', { horseId, position: 500 });
        
        const horseState = store.state.currentRaceState.find((h: HorseRaceState) => h.horse.id === horseId);
        expect(horseState?.position).toBe(500);
      });
    });

    describe('FINISH_HORSE', () => {
      it('should mark horse as finished', () => {
        store.commit('GENERATE_SCHEDULE');
        const horses = store.state.schedule.rounds[0]!.horses;
        store.commit('INITIALIZE_RACE_STATE', horses);
        
        const horseId = horses[0]!.id;
        store.commit('FINISH_HORSE', { 
          horseId, 
          finishTime: 10000, 
          rank: 1 
        });
        
        const horseState = store.state.currentRaceState.find((h: HorseRaceState) => h.horse.id === horseId);
        expect(horseState?.finished).toBe(true);
        expect(horseState?.finishTime).toBe(10000);
        expect(horseState?.rank).toBe(1);
      });
    });

    describe('ADD_RACE_RESULTS', () => {
      it('should add results to allResults', () => {
        const mockResults = [
          { horse: store.state.horses[0], position: 1, finishTime: 10000 },
          { horse: store.state.horses[1], position: 2, finishTime: 10500 }
        ];
        
        store.commit('ADD_RACE_RESULTS', mockResults);
        expect(store.state.allResults.length).toBe(1);
        expect(store.state.allResults[0]).toEqual(mockResults);
      });
    });

    describe('ADVANCE_ROUND', () => {
      it('should increment current round', () => {
        store.commit('GENERATE_SCHEDULE');
        expect(store.state.schedule.currentRound).toBe(0);
        
        store.commit('ADVANCE_ROUND');
        expect(store.state.schedule.currentRound).toBe(1);
      });

      it('should not exceed maximum rounds', () => {
        store.commit('GENERATE_SCHEDULE');
        
        // Advance to last round
        for (let i = 0; i < 10; i++) {
          store.commit('ADVANCE_ROUND');
        }
        
        expect(store.state.schedule.currentRound).toBe(5); // Max is 5 (0-indexed)
      });
    });
  });

  describe('Actions', () => {
    describe('generateSchedule', () => {
      it('should generate a valid schedule', async () => {
        await store.dispatch('generateSchedule');
        expect(store.state.schedule.isGenerated).toBe(true);
        expect(store.state.schedule.rounds.length).toBe(RACE_CONFIG.TOTAL_ROUNDS);
      });
    });

    describe('resetGame', () => {
      it('should reset the game state', async () => {
        await store.dispatch('generateSchedule');
        await store.dispatch('resetGame');
        
        expect(store.state.schedule.isGenerated).toBe(false);
        expect(store.state.schedule.rounds.length).toBe(0);
      });
    });
  });
});
