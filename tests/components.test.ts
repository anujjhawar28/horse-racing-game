/**
 * Horse Racing Game - Component Unit Tests
 */
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createStore } from 'vuex';
import type { Store } from 'vuex';
import type { State } from '@/store';
import type { RaceRound, Horse } from '@/types';
import { generateHorses, generateRaceSchedule } from '@/utils';
import HorseCard from '@/components/HorseCard.vue';

// Create a mock store for testing
function createMockStore(initialState?: Partial<State>): Store<State> {
  const horses = generateHorses();
  
  return createStore<State>({
    state: {
      horses,
      schedule: {
        rounds: [],
        currentRound: 0,
        isGenerated: false
      },
      currentRaceState: [],
      isRacing: false,
      isPaused: false,
      allResults: [],
      ...initialState
    },
    getters: {
      allHorses: (state: State) => state.horses,
      raceSchedule: (state: State) => state.schedule,
      isScheduleGenerated: (state: State) => state.schedule.isGenerated,
      currentRoundNumber: (state: State) => state.schedule.currentRound + 1,
      currentRound: (state: State) => state.schedule.rounds[state.schedule.currentRound] || null,
      allRounds: (state: State) => state.schedule.rounds,
      isRacing: (state: State) => state.isRacing,
      isPaused: (state: State) => state.isPaused,
      currentRaceState: (state: State) => state.currentRaceState,
      allResults: (state: State) => state.allResults,
      allRacesCompleted: (state: State) => state.schedule.rounds.every((r: RaceRound) => r.status === 'finished'),
      nextAvailableRound: (state: State) => state.schedule.rounds.findIndex((r: RaceRound) => r.status === 'pending')
    },
    mutations: {
      GENERATE_SCHEDULE(state: State) {
        state.schedule.rounds = generateRaceSchedule(state.horses);
        state.schedule.isGenerated = true;
      },
      SET_IS_RACING(state: State, isRacing: boolean) {
        state.isRacing = isRacing;
      }
    },
    actions: {
      generateSchedule({ commit }: { commit: (type: string) => void }) {
        commit('GENERATE_SCHEDULE');
      },
      startRacing({ commit }: { commit: (type: string, payload?: boolean) => void }) {
        commit('SET_IS_RACING', true);
      },
      resetGame() {
        // Reset logic
      }
    }
  });
}

describe('HorseCard Component', () => {
  const mockHorse: Horse = {
    id: 1,
    name: 'Thunder Bolt',
    color: '#E74C3C',
    condition: 85
  };

  it('renders horse name', () => {
    const wrapper = mount(HorseCard, {
      props: {
        horse: mockHorse
      }
    });
    
    expect(wrapper.text()).toContain('Thunder Bolt');
  });

  it('renders horse color indicator', () => {
    const wrapper = mount(HorseCard, {
      props: {
        horse: mockHorse
      }
    });
    
    const colorDiv = wrapper.find('.horse-card__color');
    expect(colorDiv.exists()).toBe(true);
    expect(colorDiv.attributes('style')).toContain('background-color: rgb(231, 76, 60)');
  });

  it('shows condition when showCondition prop is true', () => {
    const wrapper = mount(HorseCard, {
      props: {
        horse: mockHorse,
        showCondition: true
      }
    });
    
    expect(wrapper.text()).toContain('Condition: 85');
  });

  it('hides condition when showCondition prop is false', () => {
    const wrapper = mount(HorseCard, {
      props: {
        horse: mockHorse,
        showCondition: false
      }
    });
    
    expect(wrapper.text()).not.toContain('Condition:');
  });

  it('applies compact class when compact prop is true', () => {
    const wrapper = mount(HorseCard, {
      props: {
        horse: mockHorse,
        compact: true
      }
    });
    
    expect(wrapper.find('.horse-card--compact').exists()).toBe(true);
  });
});

describe('Component Integration', () => {
  it('should be able to create a store with horses', () => {
    const store = createMockStore();
    expect(store.getters.allHorses.length).toBe(20);
  });

  it('should be able to generate schedule', () => {
    const store = createMockStore();
    store.dispatch('generateSchedule');
    
    expect(store.getters.isScheduleGenerated).toBe(true);
    expect(store.getters.allRounds.length).toBe(6);
  });

  it('should have correct round distances', () => {
    const store = createMockStore();
    store.dispatch('generateSchedule');
    
    const rounds = store.getters.allRounds;
    expect(rounds[0].distance).toBe(1200);
    expect(rounds[1].distance).toBe(1400);
    expect(rounds[2].distance).toBe(1600);
    expect(rounds[3].distance).toBe(1800);
    expect(rounds[4].distance).toBe(2000);
    expect(rounds[5].distance).toBe(2200);
  });

  it('each round should have 10 horses', () => {
    const store = createMockStore();
    store.dispatch('generateSchedule');
    
    const rounds = store.getters.allRounds;
    rounds.forEach((round: { horses: Horse[] }) => {
      expect(round.horses.length).toBe(10);
    });
  });
});
