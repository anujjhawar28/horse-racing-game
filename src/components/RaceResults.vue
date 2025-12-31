<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';

const store = useStore();
const allResults = computed(() => store.getters.allResults);
const allRounds = computed(() => store.getters.allRounds);

function getPositionLabel(position: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = position % 100;
  return position + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
}

function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

function getMedal(position: number): string {
  switch (position) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '';
  }
}

function getRoundDistance(roundIndex: number): number {
  return allRounds.value[roundIndex]?.distance || 0;
}
</script>

<template>
  <div class="race-results">
    <div class="race-results__header">
      <h2 class="race-results__title">🏆 Race Results</h2>
      <span v-if="allResults.length" class="race-results__count">
        {{ allResults.length }} / 6 races completed
      </span>
    </div>
    
    <div v-if="!allResults.length" class="race-results__empty">
      <p>Results will appear here as races are completed</p>
    </div>
    
    <div v-else class="race-results__content">
      <div
        v-for="(results, roundIndex) in allResults"
        :key="roundIndex"
        class="results-round"
      >
        <div class="results-round__header">
          <span class="results-round__title">
            Round {{ roundIndex + 1 }}
          </span>
          <span class="results-round__distance">
            {{ getRoundDistance(roundIndex) }}m
          </span>
        </div>
        
        <div class="results-round__podium">
          <!-- Second Place -->
          <div v-if="results[1]" class="podium__place podium__place--silver">
            <div class="podium__horse">
              <span 
                class="podium__color"
                :style="{ backgroundColor: results[1].horse.color }"
              />
              <span class="podium__name">{{ results[1].horse.name }}</span>
            </div>
            <div class="podium__medal">🥈</div>
            <div class="podium__block podium__block--silver">2nd</div>
          </div>
          
          <!-- First Place -->
          <div v-if="results[0]" class="podium__place podium__place--gold">
            <div class="podium__horse">
              <span 
                class="podium__color"
                :style="{ backgroundColor: results[0].horse.color }"
              />
              <span class="podium__name">{{ results[0].horse.name }}</span>
            </div>
            <div class="podium__medal">🥇</div>
            <div class="podium__block podium__block--gold">1st</div>
          </div>
          
          <!-- Third Place -->
          <div v-if="results[2]" class="podium__place podium__place--bronze">
            <div class="podium__horse">
              <span 
                class="podium__color"
                :style="{ backgroundColor: results[2].horse.color }"
              />
              <span class="podium__name">{{ results[2].horse.name }}</span>
            </div>
            <div class="podium__medal">🥉</div>
            <div class="podium__block podium__block--bronze">3rd</div>
          </div>
        </div>
        
        <div class="results-round__table">
          <div class="results-table__header">
            <span class="results-table__col results-table__col--pos">Pos</span>
            <span class="results-table__col results-table__col--horse">Horse</span>
            <span class="results-table__col results-table__col--time">Time</span>
          </div>
          <div
            v-for="result in results"
            :key="result.horse.id"
            class="results-table__row"
            :class="{
              'results-table__row--top3': result.position <= 3
            }"
          >
            <span class="results-table__col results-table__col--pos">
              <span class="results-table__medal">{{ getMedal(result.position) }}</span>
              {{ getPositionLabel(result.position) }}
            </span>
            <span class="results-table__col results-table__col--horse">
              <span 
                class="results-table__color"
                :style="{ backgroundColor: result.horse.color }"
              />
              {{ result.horse.name }}
            </span>
            <span class="results-table__col results-table__col--time">
              {{ formatTime(result.finishTime) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-results {
  background: var(--section-bg, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.race-results__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.race-results__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
}

.race-results__count {
  font-size: 14px;
  color: var(--text-secondary, #666666);
  background: var(--badge-bg, #e0e0e0);
  padding: 4px 12px;
  border-radius: 20px;
}

.race-results__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  font-style: italic;
}

.race-results__content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 8px;
}

.results-round {
  background: var(--card-bg, #ffffff);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.results-round__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
}

.results-round__title {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary, #1a1a1a);
}

.results-round__distance {
  font-size: 14px;
  color: var(--text-secondary, #666666);
  background: var(--badge-bg, #f0f0f0);
  padding: 2px 8px;
  border-radius: 4px;
}

/* Podium styles */
.results-round__podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;
  padding: 16px 0;
}

.podium__place {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90px;
}

.podium__horse {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}

.podium__color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.podium__name {
  font-size: 10px;
  font-weight: 600;
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.podium__medal {
  font-size: 28px;
  margin-bottom: 4px;
}

.podium__block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  color: #fff;
  border-radius: 4px 4px 0 0;
}

.podium__block--gold {
  height: 60px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
}

.podium__block--silver {
  height: 45px;
  background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
  color: #000;
}

.podium__block--bronze {
  height: 35px;
  background: linear-gradient(135deg, #CD7F32, #B87333);
}

/* Results table */
.results-round__table {
  font-size: 12px;
}

.results-table__header {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  font-weight: 600;
  color: var(--text-secondary, #666666);
}

.results-table__row {
  display: flex;
  padding: 6px 0;
  border-bottom: 1px solid var(--border-light, #f0f0f0);
  align-items: center;
}

.results-table__row--top3 {
  background: var(--highlight-bg, #fffef0);
}

.results-table__col {
  display: flex;
  align-items: center;
  gap: 6px;
}

.results-table__col--pos {
  width: 60px;
  font-weight: 600;
}

.results-table__col--horse {
  flex: 1;
}

.results-table__col--time {
  width: 70px;
  justify-content: flex-end;
  font-family: monospace;
}

.results-table__medal {
  font-size: 14px;
}

.results-table__color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
}
</style>
