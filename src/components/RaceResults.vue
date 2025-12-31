<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@/store';
import { Medal, ChevronRight, ChevronDown } from 'lucide-vue-next';

const store = useStore();
const allResults = computed(() => store.getters.allResults);
const allRounds = computed(() => store.getters.allRounds);

const expandedRound = ref<number | null>(allResults.value.length > 0 ? allResults.value.length - 1 : null);

function toggleExpand(roundIndex: number) {
  expandedRound.value = expandedRound.value === roundIndex ? null : roundIndex;
}

function getPositionLabel(position: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = position % 100;
  return position + (suffixes[(v - 20) % 10] ?? suffixes[v] ?? suffixes[0] ?? 'th');
}

function formatTime(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

function getMedalType(position: number): 'gold' | 'silver' | 'bronze' | null {
  switch (position) {
    case 1: return 'gold';
    case 2: return 'silver';
    case 3: return 'bronze';
    default: return null;
  }
}

function getRoundDistance(roundIndex: number): number {
  return allRounds.value[roundIndex]?.distance || 0;
}
</script>

<template>
  <div class="race-results">
    <div v-if="!allResults.length" class="race-results__empty">
      <p>Results will appear here as races complete</p>
    </div>
    
    <div v-else class="race-results__content">
      <div class="race-results__summary">
        {{ allResults.length }} / 6 races completed
      </div>
      
      <div
        v-for="(results, roundIndex) in allResults"
        :key="roundIndex"
        class="result-row"
        :class="{ 'result-row--expanded': expandedRound === Number(roundIndex) }"
      >
        <div class="result-row__main" @click="toggleExpand(Number(roundIndex))">
          <div class="result-row__left">
            <span class="result-row__number">R{{ Number(roundIndex) + 1 }}</span>
            <span class="result-row__distance">{{ getRoundDistance(Number(roundIndex)) }}m</span>
          </div>
          <div class="result-row__winner" v-if="results[0]">
            <Medal :size="14" class="medal medal--gold" />
            <span 
              class="result-row__color"
              :style="{ backgroundColor: results[0].horse.color }"
            />
            <span class="result-row__name">{{ results[0].horse.name }}</span>
          </div>
          <span class="result-row__expand">
            <ChevronDown v-if="expandedRound === Number(roundIndex)" :size="14" />
            <ChevronRight v-else :size="14" />
          </span>
        </div>
        
        <div v-if="expandedRound === Number(roundIndex)" class="result-row__details">
          <div class="result-row__podium">
            <div v-if="results[1]" class="podium podium--silver">
              <Medal :size="24" class="medal medal--silver" />
              <span class="podium__color" :style="{ backgroundColor: results[1].horse.color }"/>
              <span class="podium__name">{{ results[1].horse.name }}</span>
            </div>
            <div v-if="results[0]" class="podium podium--gold">
              <Medal :size="28" class="medal medal--gold" />
              <span class="podium__color" :style="{ backgroundColor: results[0].horse.color }"/>
              <span class="podium__name">{{ results[0].horse.name }}</span>
            </div>
            <div v-if="results[2]" class="podium podium--bronze">
              <Medal :size="24" class="medal medal--bronze" />
              <span class="podium__color" :style="{ backgroundColor: results[2].horse.color }"/>
              <span class="podium__name">{{ results[2].horse.name }}</span>
            </div>
          </div>
          
          <div class="result-row__table">
            <div
              v-for="result in results"
              :key="result.horse.id"
              class="table-row"
              :class="{ 'table-row--top3': result.position <= 3 }"
            >
              <span class="table-row__pos">
                <Medal v-if="getMedalType(result.position)" :size="14" :class="'medal medal--' + getMedalType(result.position)" />
                {{ getPositionLabel(result.position) }}
              </span>
              <span class="table-row__horse">
                <span class="table-row__color" :style="{ backgroundColor: result.horse.color }"/>
                {{ result.horse.name }}
              </span>
              <span class="table-row__time">{{ formatTime(result.finishTime) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-results {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.race-results__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  font-style: italic;
}

.race-results__summary {
  font-size: 12px;
  color: var(--text-secondary, #666666);
  text-align: center;
  padding: 8px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  margin-bottom: 12px;
}

.race-results__content {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-right: 4px;
}

.result-row {
  background: var(--section-bg, #f8f9fa);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.result-row--expanded {
  background: var(--card-bg, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.result-row__main {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  gap: 12px;
}

.result-row__main:hover {
  background: rgba(0, 0, 0, 0.03);
}

.result-row__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.result-row__number {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary, #1a1a1a);
}

.result-row__distance {
  font-size: 12px;
  color: var(--text-secondary, #666666);
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
}

.result-row__winner {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.result-row__medal {
  font-size: 14px;
}

.result-row__color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.result-row__name {
  font-size: 13px;
  color: var(--text-primary, #1a1a1a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-row__expand {
  font-size: 10px;
  color: var(--text-secondary, #666666);
}

.result-row__details {
  padding: 0 12px 12px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  max-height: 280px;
  overflow-y: auto;
}

.result-row__podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px;
  padding: 16px 0;
}

.podium {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.podium__medal {
  font-size: 24px;
}

.podium__color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.podium__name {
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  max-width: 70px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.podium--gold .podium__medal { font-size: 28px; }
.podium--silver .podium__name,
.podium--bronze .podium__name { margin-top: 4px; }

.result-row__table {
  font-size: 12px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  padding-top: 8px;
}

.table-row {
  display: flex;
  padding: 4px 0;
  align-items: center;
}

.table-row--top3 {
  font-weight: 500;
}

.table-row__pos {
  width: 70px;
  font-size: 11px;
}

.table-row__horse {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.table-row__color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.table-row__time {
  font-family: monospace;
  font-size: 11px;
  color: var(--text-secondary, #666666);
}

.medal {
  flex-shrink: 0;
}

.medal--gold {
  color: #FFD700;
}

.medal--silver {
  color: #C0C0C0;
}

.medal--bronze {
  color: #CD7F32;
}

.table-row__pos {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
