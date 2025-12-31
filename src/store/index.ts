import { createStore } from 'vuex';
import type { Store, ActionContext } from 'vuex';
import type { InjectionKey } from 'vue';
import type { Horse, RaceRound, RaceResult, HorseRaceState, RaceSchedule } from '@/types';
import { RaceStatus } from '@/types';
import { generateHorses, generateRaceSchedule } from '@/utils';

export interface State {
  horses: Horse[];
  schedule: RaceSchedule;
  currentRaceState: HorseRaceState[];
  isRacing: boolean;
  isPaused: boolean;
  allResults: RaceResult[][];
}

export const key: InjectionKey<Store<State>> = Symbol();

type Context = ActionContext<State, State>;

function createInitialState(): State {
  return {
    horses: generateHorses(),
    schedule: {
      rounds: [],
      currentRound: 0,
      isGenerated: false
    },
    currentRaceState: [],
    isRacing: false,
    isPaused: false,
    allResults: []
  };
}

export const store = createStore<State>({
  state: createInitialState(),
  
  getters: {
    allHorses: (state: State): Horse[] => state.horses,
    raceSchedule: (state: State): RaceSchedule => state.schedule,
    isScheduleGenerated: (state: State): boolean => state.schedule.isGenerated,
    currentRoundNumber: (state: State): number => state.schedule.currentRound + 1,
    currentRound: (state: State): RaceRound | null => {
      if (state.schedule.rounds.length === 0) return null;
      return state.schedule.rounds[state.schedule.currentRound] || null;
    },
    allRounds: (state: State): RaceRound[] => state.schedule.rounds,
    isRacing: (state: State): boolean => state.isRacing,
    isPaused: (state: State): boolean => state.isPaused,
    currentRaceState: (state: State): HorseRaceState[] => state.currentRaceState,
    allResults: (state: State): RaceResult[][] => state.allResults,
    allRacesCompleted: (state: State): boolean => {
      if (!state.schedule.isGenerated) return false;
      return state.schedule.rounds.every((round: RaceRound) => round.status === RaceStatus.FINISHED);
    },
    nextAvailableRound: (state: State): number => {
      return state.schedule.rounds.findIndex((round: RaceRound) => round.status === RaceStatus.PENDING);
    }
  },
  
  mutations: {
    SET_HORSES(state: State, horses: Horse[]) {
      state.horses = horses;
    },
    
    GENERATE_SCHEDULE(state: State) {
      state.schedule = {
        rounds: generateRaceSchedule(state.horses),
        currentRound: 0,
        isGenerated: true
      };
      state.allResults = [];
      state.currentRaceState = [];
      state.isRacing = false;
      state.isPaused = false;
    },
    
    RESET_GAME(state: State) {
      state.horses = generateHorses();
      state.schedule = {
        rounds: [],
        currentRound: 0,
        isGenerated: false
      };
      state.currentRaceState = [];
      state.isRacing = false;
      state.isPaused = false;
      state.allResults = [];
    },
    
    SET_CURRENT_ROUND(state: State, roundIndex: number) {
      state.schedule.currentRound = roundIndex;
    },
    
    UPDATE_ROUND_STATUS(state: State, { roundIndex, status }: { roundIndex: number; status: RaceStatus }) {
      if (state.schedule.rounds[roundIndex]) {
        state.schedule.rounds[roundIndex]!.status = status;
      }
    },
    
    SET_ROUND_RESULTS(state: State, { roundIndex, results }: { roundIndex: number; results: RaceResult[] }) {
      if (state.schedule.rounds[roundIndex]) {
        state.schedule.rounds[roundIndex]!.results = results;
      }
    },
    
    ADD_RACE_RESULTS(state: State, results: RaceResult[]) {
      state.allResults.push(results);
    },
    
    SET_IS_RACING(state: State, isRacing: boolean) {
      state.isRacing = isRacing;
    },
    
    SET_IS_PAUSED(state: State, isPaused: boolean) {
      state.isPaused = isPaused;
    },
    
    INITIALIZE_RACE_STATE(state: State, horses: Horse[]) {
      state.currentRaceState = horses.map(horse => ({
        horse,
        position: 0,
        finished: false,
        finishTime: null,
        rank: null
      }));
    },
    
    UPDATE_HORSE_POSITION(state: State, { horseId, position }: { horseId: number; position: number }) {
      const horseState = state.currentRaceState.find((h: HorseRaceState) => h.horse.id === horseId);
      if (horseState) {
        horseState.position = position;
      }
    },
    
    FINISH_HORSE(state: State, { horseId, finishTime, rank }: { horseId: number; finishTime: number; rank: number }) {
      const horseState = state.currentRaceState.find((h: HorseRaceState) => h.horse.id === horseId);
      if (horseState) {
        horseState.finished = true;
        horseState.finishTime = finishTime;
        horseState.rank = rank;
      }
    },
    
    CLEAR_RACE_STATE(state: State) {
      state.currentRaceState = [];
    },
    
    ADVANCE_ROUND(state: State) {
      if (state.schedule.currentRound < state.schedule.rounds.length - 1) {
        state.schedule.currentRound++;
      }
    }
  },
  
  actions: {
    generateSchedule({ commit }: Context) {
      commit('GENERATE_SCHEDULE');
    },
    
    resetGame({ commit }: Context) {
      commit('RESET_GAME');
    },
    
    async startRacing({ commit, state, dispatch }: Context) {
      if (!state.schedule.isGenerated || state.isRacing) return;
      
      commit('SET_IS_RACING', true);
      commit('SET_IS_PAUSED', false);
      
      for (let i = state.schedule.currentRound; i < state.schedule.rounds.length; i++) {
        if (!state.isRacing) break;
        
        commit('SET_CURRENT_ROUND', i);
        await dispatch('runRace', i);
        
        if (i < state.schedule.rounds.length - 1 && state.isRacing) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      
      commit('SET_IS_RACING', false);
    },
    
    runRace({ commit, state }: Context, roundIndex: number): Promise<void> {
      return new Promise((resolve) => {
        const round = state.schedule.rounds[roundIndex];
        if (!round) {
          resolve();
          return;
        }
        
        commit('INITIALIZE_RACE_STATE', round.horses);
        commit('UPDATE_ROUND_STATUS', { roundIndex, status: RaceStatus.RUNNING });
        
        const distance = round.distance;
        const startTime = Date.now();
        let finishedCount = 0;
        const results: RaceResult[] = [];
        
        const animate = () => {
          if (!state.isRacing || state.isPaused) {
            if (state.isPaused) {
              requestAnimationFrame(animate);
            }
            return;
          }
          
          const elapsed = Date.now() - startTime;
          
          state.currentRaceState.forEach((horseState: HorseRaceState) => {
            if (horseState.finished) return;
            
            const condition = horseState.horse.condition;
            const baseSpeed = distance / 10000;
            const conditionMultiplier = 0.9 + (condition / 100) * 0.2;
            const randomFactor = 0.7 + Math.random() * 0.6;
            const speed = baseSpeed * conditionMultiplier * randomFactor * 16.67;
            
            const newPosition = Math.min(horseState.position + speed, distance);
            commit('UPDATE_HORSE_POSITION', { 
              horseId: horseState.horse.id, 
              position: newPosition 
            });
            
            if (newPosition >= distance && !horseState.finished) {
              finishedCount++;
              commit('FINISH_HORSE', { 
                horseId: horseState.horse.id, 
                finishTime: elapsed,
                rank: finishedCount
              });
              
              results.push({
                horse: horseState.horse,
                position: finishedCount,
                finishTime: elapsed
              });
            }
          });
          
          if (finishedCount >= round.horses.length) {
            results.sort((a, b) => a.position - b.position);
            commit('SET_ROUND_RESULTS', { roundIndex, results });
            commit('ADD_RACE_RESULTS', results);
            commit('UPDATE_ROUND_STATUS', { roundIndex, status: RaceStatus.FINISHED });
            resolve();
          } else {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      });
    },
    
    stopRacing({ commit }: Context) {
      commit('SET_IS_RACING', false);
      commit('SET_IS_PAUSED', false);
    },
    
    pauseRacing({ commit }: Context) {
      commit('SET_IS_PAUSED', true);
    },
    
    resumeRacing({ commit }: Context) {
      commit('SET_IS_PAUSED', false);
    }
  }
});

export function useStore(): Store<State> {
  return store;
}
