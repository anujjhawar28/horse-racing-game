<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import type { RaceRound } from '@/types';
import { RaceStatus } from '@/types';

const store = useStore();
const rounds = computed(() => store.getters.allRounds);
const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated);
const currentRoundNumber = computed(() => store.getters.currentRoundNumber);
const isRacing = computed(() => store.getters.isRacing);

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

function getStatusText(round: RaceRound): string {
  switch (round.status) {
    case RaceStatus.RUNNING:
      return '🏃 Racing';
    case RaceStatus.FINISHED:
      return '✅ Completed';
    default:
      return '⏳ Pending';
  }
}

function isCurrentRound(round: RaceRound): boolean {
  return isRacing.value && round.roundNumber === currentRoundNumber.value;
}
</script>

<template>
  <div class="race-schedule">
    <div class="race-schedule__header">
      <h2 class="race-schedule__title">📋 Race Schedule</h2>
    </div>
    
    <div v-if="!isScheduleGenerated" class="race-schedule__empty">
      <p>Click "Generate Program" to create a race schedule</p>
    </div>
    
    <div v-else class="race-schedule__rounds">
      <div
        v-for="round in rounds"
        :key="round.roundNumber"
        class="round-card"
        :class="{ 
          'round-card--active': isCurrentRound(round),
          'round-card--finished': round.status === RaceStatus.FINISHED
        }"
      >
        <div class="round-card__header">
          <span class="round-card__number">Round {{ round.roundNumber }}</span>
          <span 
            class="round-card__status"
            :class="getStatusClass(round)"
          >
            {{ getStatusText(round) }}
          </span>
        </div>
        
        <div class="round-card__distance">
          <span class="round-card__distance-icon">📏</span>
          <span class="round-card__distance-value">{{ round.distance }}m</span>
        </div>
        
        <div class="round-card__horses">
          <div class="round-card__horses-header">
            <span>Participants:</span>
          </div>
          <div class="round-card__horses-list">
            <div
              v-for="horse in round.horses"
              :key="horse.id"
              class="round-card__horse"
              :title="horse.name"
            >
              <span 
                class="round-card__horse-color"
                :style="{ backgroundColor: horse.color }"
              />
              <span class="round-card__horse-name">{{ horse.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.race-schedule {
  background: var(--section-bg, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.race-schedule__header {
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.race-schedule__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
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
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
}

.round-card {
  background: var(--card-bg, #ffffff);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.round-card--active {
  border-left-color: var(--accent-color, #3498db);
  background: var(--card-active-bg, #e8f4fc);
  animation: pulse 1.5s infinite;
}

.round-card--finished {
  border-left-color: var(--success-color, #2ecc71);
  opacity: 0.9;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
  }
}

.round-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.round-card__number {
  font-weight: 700;
  font-size: 16px;
  color: var(--text-primary, #1a1a1a);
}

.round-card__status {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
}

.status--pending {
  background: var(--status-pending-bg, #f0f0f0);
  color: var(--status-pending-text, #666666);
}

.status--running {
  background: var(--status-running-bg, #fff3cd);
  color: var(--status-running-text, #856404);
  animation: blink 1s infinite;
}

.status--finished {
  background: var(--status-finished-bg, #d4edda);
  color: var(--status-finished-text, #155724);
}

@keyframes blink {
  50% {
    opacity: 0.7;
  }
}

.round-card__distance {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary, #666666);
}

.round-card__distance-icon {
  font-size: 16px;
}

.round-card__distance-value {
  font-weight: 600;
  color: var(--text-primary, #1a1a1a);
}

.round-card__horses-header {
  font-size: 12px;
  color: var(--text-secondary, #666666);
  margin-bottom: 8px;
}

.round-card__horses-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.round-card__horse {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--horse-chip-bg, #f0f0f0);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.round-card__horse-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.round-card__horse-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}
</style>
