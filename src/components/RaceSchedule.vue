<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import type { RaceRound } from '@/types';
import { RaceStatus } from '@/types';
import { BaseAccordion, BaseBadge } from './controls';
import { Play, CheckCircle, Clock } from 'lucide-vue-next';

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

function getStatusIcon(round: RaceRound): 'play' | 'check' | 'clock' {
  switch (round.status) {
    case RaceStatus.RUNNING:
      return 'play';
    case RaceStatus.FINISHED:
      return 'check';
    default:
      return 'clock';
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
      <BaseAccordion
        v-for="round in rounds"
        :key="round.roundNumber"
        :class="{ 
          'round-row--active': isCurrentRound(round),
          'round-row--finished': round.status === RaceStatus.FINISHED
        }"
      >
        <template #header>
          <div class="round-row__header">
            <span 
              class="round-row__status"
              :class="getStatusClass(round)"
            >
              <Play v-if="getStatusIcon(round) === 'play'" :size="14" />
              <CheckCircle v-else-if="getStatusIcon(round) === 'check'" :size="14" />
              <Clock v-else :size="14" />
            </span>
            <span class="round-row__number">R{{ round.roundNumber }}</span>
            <BaseBadge size="sm">{{ round.distance }}m</BaseBadge>
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
          </div>
        </template>
        
        <div class="round-row__horses-grid">
          <div
            v-for="(horse, index) in round.horses"
            :key="horse.id"
            class="round-row__horse"
          >
            <span class="round-row__horse-lane">{{ Number(index) + 1 }}</span>
            <span 
              class="round-row__horse-color"
              :style="{ backgroundColor: horse.color }"
            />
            <span class="round-row__horse-name">{{ horse.name }}</span>
          </div>
        </div>
      </BaseAccordion>
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

.round-row--active {
  border-left: 3px solid var(--success-color, #27ae60);
  background: rgba(39, 174, 96, 0.1);
}

.round-row--finished {
  opacity: 0.7;
}

.round-row__header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.round-row__status {
  font-size: 14px;
  display: flex;
  align-items: center;
}

.round-row__number {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary, #1a1a1a);
  min-width: 28px;
}

.round-row__horses-preview {
  display: flex;
  align-items: center;
  gap: 3px;
  margin-left: auto;
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

.round-row__horses-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
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