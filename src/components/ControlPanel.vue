<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { useStore } from '@/store';
import { BaseButton, BaseBadge } from './controls';
import { Dices, Play, Pause, RotateCcw, Trophy, CircleDot } from 'lucide-vue-next';

const store = useStore();

const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated);
const isRacing = computed(() => store.getters.isRacing);
const isPaused = computed(() => store.getters.isPaused);
const allRacesCompleted = computed(() => store.getters.allRacesCompleted);
const currentRoundNumber = computed(() => store.getters.currentRoundNumber);

const DicesIcon = markRaw(Dices);
const PlayIcon = markRaw(Play);
const PauseIcon = markRaw(Pause);
const RotateCcwIcon = markRaw(RotateCcw);

function handleGenerateSchedule() {
  store.dispatch('generateSchedule');
}

function handleStartRace() {
  store.dispatch('startRacing');
}

function handlePauseResume() {
  if (isPaused.value) {
    store.dispatch('resumeRacing');
  } else {
    store.dispatch('pauseRacing');
  }
}

function handleReset() {
  store.dispatch('resetGame');
}
</script>

<template>
  <div class="control-panel">
    <div class="control-panel__header">
      <div class="control-panel__title">
        <h1 class="control-panel__heading"><CircleDot :size="28" class="heading-icon" /> Horse Racing Game</h1>
        <p class="control-panel__subtitle">Generate a program and start the race!</p>
      </div>
      
      <BaseBadge v-if="isRacing && !isPaused" variant="warning" dot animated>
        Racing Round {{ currentRoundNumber }}...
      </BaseBadge>
      
      <BaseBadge v-else-if="isRacing && isPaused" variant="warning">
        <Pause :size="14" /> Paused - Round {{ currentRoundNumber }}
      </BaseBadge>
      
      <BaseBadge v-else-if="allRacesCompleted" variant="success">
        <Trophy :size="14" /> All Races Completed!
      </BaseBadge>
    </div>
    
    <div class="control-panel__buttons">
      <BaseButton
        variant="primary"
        :icon="DicesIcon"
        :disabled="isRacing"
        @click="handleGenerateSchedule"
      >
        Generate Program
      </BaseButton>
      
      <BaseButton
        v-if="isScheduleGenerated && !isRacing && !allRacesCompleted"
        variant="success"
        :icon="PlayIcon"
        @click="handleStartRace"
      >
        Start Race
      </BaseButton>
      
      <BaseButton
        v-if="isRacing"
        variant="warning"
        :icon="isPaused ? PlayIcon : PauseIcon"
        @click="handlePauseResume"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </BaseButton>
      
      <BaseButton
        variant="secondary"
        :icon="RotateCcwIcon"
        :disabled="isRacing && !isPaused"
        @click="handleReset"
      >
        Reset
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
}

.control-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.control-panel__title {
  text-align: left;
  flex: 1;
}

.control-panel__heading {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;
}

.heading-icon {
  flex-shrink: 0;
}

.control-panel__subtitle {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.control-panel__buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
