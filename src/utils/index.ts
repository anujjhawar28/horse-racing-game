import type { Horse, RaceRound, RaceResult, HorseRaceState } from '@/types';
import { RaceStatus } from '@/types';
import { HORSE_NAMES, HORSE_COLORS, RACE_CONFIG, ROUND_DISTANCES } from '@/constants';

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

export function generateHorses(): Horse[] {
  const horses: Horse[] = [];
  for (let i = 0; i < RACE_CONFIG.TOTAL_HORSES; i++) {
    horses.push({
      id: i + 1,
      name: HORSE_NAMES[i]!,
      color: HORSE_COLORS[i]!,
      condition: getRandomInt(RACE_CONFIG.MIN_CONDITION, RACE_CONFIG.MAX_CONDITION)
    });
  }
  return horses;
}

export function selectHorsesForRound(horses: Horse[]): Horse[] {
  return shuffleArray(horses).slice(0, RACE_CONFIG.HORSES_PER_ROUND);
}

export function generateRaceSchedule(horses: Horse[]): RaceRound[] {
  const rounds: RaceRound[] = [];
  for (let i = 1; i <= RACE_CONFIG.TOTAL_ROUNDS; i++) {
    rounds.push({
      roundNumber: i,
      distance: ROUND_DISTANCES[i]!,
      horses: selectHorsesForRound(horses),
      status: RaceStatus.PENDING,
      results: []
    });
  }
  return rounds;
}

export function calculateHorseSpeed(condition: number): number {
  const conditionFactor = 0.5 + (condition / 100) * 0.5;
  const randomFactor = 0.85 + Math.random() * 0.3;
  return conditionFactor * randomFactor;
}

export function initializeRaceState(horses: Horse[]): HorseRaceState[] {
  return horses.map(horse => ({
    horse,
    position: 0,
    finished: false,
    finishTime: null,
    rank: null
  }));
}

export function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;
  return `${seconds}.${milliseconds.toString().padStart(3, '0')}s`;
}

export function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]!);
}

export function sortResultsByTime(results: RaceResult[]): RaceResult[] {
  return [...results].sort((a, b) => a.finishTime - b.finishTime);
}

export function calculateProgress(position: number, distance: number): number {
  return Math.min((position / distance) * 100, 100);
}
