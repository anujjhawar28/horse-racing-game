<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@/store';
import type { RaceRound } from '@/types';
import { RaceStatus } from '@/types';

const store = useStore();
const rounds = computed(() => store.getters.allRounds);
const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated);
const currentRoundNumber = computed(() => store.getters.currentRoundNumber);
const isRacing = computed(() => store.getters.isRacing);

const expandedRound = ref<number | null>(null);

function toggleExpand(roundNumber: number) {
  expandedRound.value = expandedRound.value === roundNumber ? null : roundNumber;
}

function getStatusClass(round: RaceRound): string {
  switch (round.status) {
    case RaceStatus.RUNNING:
      return 'status--running';
    case RaceStatus.FINISHED:
      return 'status--finished';
    default:
      return 'status--pending';
  }
}

function getStatusIcon(round: RaceRound): string {
  switch (round.status) {
    case RaceStatus.RUNNING:
      return '🏃';
    case RaceStatus.FINISHED:
      return '✅';
    default:
      return '⏳';
  }
}

function isCurrentRound(round: RaceRound): boolean {
  return isRacing.value && round.roundNumber === currentRoundNumber.value;
}
</script>

<template>
  <div class="race-schedule">
    <div v-if="!isScheduleGenerated" class="race-schedule__empty">
      <p>Click "Generate Program" to create a race schedule</p>
    </div>
    
    <div v-else class="race-schedule__rounds">
      <div
        v-for="round in rounds"
        :key="round.roundNumber"
        class="round-row"
        :class="{ 
          'round-row--active': isCurrentRound(round),
          'round-row--finished': round.status === RaceStatus.FINISHED,
          'round-row--expanded': expandedRound === round.roundNumber
        }"
      >
        <div class="round-row__main" @click="toggleExpand(round.roundNumber)">
          <div class="round-row__left">
            <span 
              class="round-row__status"
              :class="getStatusClass(round)"
            >
              {{ getStatusIcon(round) }}
            </span>
            <span class="round-row__number">R{{ round.roundNumber }}</span>
            <span class="round-row__distance">{{ round.distance }}m</span>
          </div>
          <div class="round-row__right">
            <div class="round-row__horses-preview">
              <span
                v-for="horse in round.horses.slice(0, 5)"
                :key="horse.id"
                class="round-row__horse-dot"
                :style="{ backgroundColor: horse.color }"
                :title="horse.name"
              />
              <span v-if="round.horses.length > 5" class="round-row__more">
                +{{ round.horses.length - 5 }}
              </span>
            </div>
            <span class="round-row__expand">
              {{ expandedRound === round.roundNumber ? '▼' : '▶' }}
            </span>
          </div>
        </div>
        
        <div v-if="expandedRound === round.roundNumber" class="round-row__details">
          <div class="round-row__horses-grid">
            <div
              v-for="(horse, index) in round.horses"
              :key="horse.id"
              class="round-row__horse"
            >
              <span class="round-row__horse-lane">{{ index + 1 }}</span>
              <span 
                class="round-row__horse-color"
                :style="{ backgroundColor: horse.color }"
              />
              <span class="round-row__horse-name">{{ horse.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-schedule {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.race-schedule__empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666666);
  font-style: italic;
}

.race-schedule__rounds {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}

.round-row {
  background: var(--section-bg, #f8f9fa);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.round-row--active {
  border-left-color: var(--success-color, #27ae60);
  background: rgba(39, 174, 96, 0.1);
}

.round-row--finished {
  opacity: 0.7;
}

.round-row--expanded {
  background: var(--card-bg, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.round-row__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.round-row__main:hover {
  background: rgba(0, 0, 0, 0.03);
}

.round-row__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.round-row__status {
  font-size: 14px;
}

.round-row__number {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary, #1a1a1a);
  min-width: 28px;
}

.round-row__distance {
  font-size: 13px;
  color: var(--text-secondary, #666666);
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 4px;
}

.round-row__right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.round-row__horses-preview {
  display: flex;
  align-items: center;
  gap: 3px;
}

.round-row__horse-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.round-row__more {
  font-size: 11px;
  color: var(--text-secondary, #666666);
  margin-left: 2px;
}

.round-row__expand {
  font-size: 10px;
  color: var(--text-secondary, #666666);
  transition: transform 0.2s ease;
}

.round-row__details {
  padding: 0 12px 12px;
  border-top: 1px solid var(--border-color, #e0e0e0);
  margin-top: 4px;
}

.round-row__horses-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding-top: 10px;
}

.round-row__horse {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  padding: 4px 6px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 4px;
}

.round-row__horse-lane {
  font-size: 10px;
  color: var(--text-secondary, #666666);
  min-width: 14px;
}

.round-row__horse-color {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.round-row__horse-name {
  color: var(--text-primary, #1a1a1a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status--running {
  animation: pulse 1s ease-in-out infinite;
}

.status--finished {
  opacity: 0.6;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>