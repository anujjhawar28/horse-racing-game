export interface Horse {
  id: number;
  name: string;
  color: string;
  condition: number;
}

export interface HorseRaceState {
  horse: Horse;
  position: number;
  finished: boolean;
  finishTime: number | null;
  rank: number | null;
}

export interface RaceRound {
  roundNumber: number;
  distance: number;
  horses: Horse[];
  status: RaceStatus;
  results: RaceResult[];
}

export const RaceStatus = {
  PENDING: 'pending',
  RUNNING: 'running',
  FINISHED: 'finished'
} as const;

export type RaceStatus = typeof RaceStatus[keyof typeof RaceStatus];

export interface RaceResult {
  horse: Horse;
  position: number;
  finishTime: number;
}

export interface RaceSchedule {
  rounds: RaceRound[];
  currentRound: number;
  isGenerated: boolean;
}

export interface RootState {
  horses: Horse[];
  schedule: RaceSchedule;
  currentRaceState: HorseRaceState[];
  isRacing: boolean;
  raceResults: RaceResult[][];
}

export const ROUND_DISTANCES: Record<number, number> = {
  1: 1200,
  2: 1400,
  3: 1600,
  4: 1800,
  5: 2000,
  6: 2200
};

export const TOTAL_HORSES = 20;
export const HORSES_PER_ROUND = 10;
export const TOTAL_ROUNDS = 6;
