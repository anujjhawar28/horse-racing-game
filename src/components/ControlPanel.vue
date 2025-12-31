<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import { Dices, Play, Pause, RotateCcw, Trophy, CircleDot } from 'lucide-vue-next';

const store = useStore();

const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated);
const isRacing = computed(() => store.getters.isRacing);
const isPaused = computed(() => store.getters.isPaused);
const allRacesCompleted = computed(() => store.getters.allRacesCompleted);
const currentRoundNumber = computed(() => store.getters.currentRoundNumber);

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
      
      <div v-if="isRacing && !isPaused" class="status-indicator status-indicator--racing">
        <span class="status-indicator__dot"></span>
        <span>Racing Round {{ currentRoundNumber }}...</span>
      </div>
      
      <div v-else-if="isRacing && isPaused" class="status-indicator status-indicator--paused">
        <Pause :size="16" />
        <span>Paused - Round {{ currentRoundNumber }}</span>
      </div>
      
      <div v-else-if="allRacesCompleted" class="status-indicator status-indicator--complete">
        <Trophy :size="16" />
        <span>All Races Completed!</span>
      </div>
    </div>
    
    <div class="control-panel__buttons">
      <button
        class="btn btn--primary"
        :disabled="isRacing"
        @click="handleGenerateSchedule"
      >
        <Dices :size="18" />
        <span class="btn__text">Generate Program</span>
      </button>
      
      <button
        v-if="isScheduleGenerated && !isRacing && !allRacesCompleted"
        class="btn btn--success"
        @click="handleStartRace"
      >
        <Play :size="18" />
        <span class="btn__text">Start Race</span>
      </button>
      
      <button
        v-if="isRacing"
        class="btn btn--warning"
        @click="handlePauseResume"
      >
        <Play v-if="isPaused" :size="18" />
        <Pause v-else :size="18" />
        <span class="btn__text">{{ isPaused ? 'Resume' : 'Pause' }}</span>
      </button>
      
      <button
        class="btn btn--secondary"
        :disabled="isRacing && !isPaused"
        @click="handleReset"
      >
        <RotateCcw :size="18" />
        <span class="btn__text">Reset</span>
      </button>
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

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn:not(:disabled):active {
  transform: translateY(0);
}

.btn--primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.btn--success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.btn--secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn--secondary:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn--warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.btn__icon {
  font-size: 18px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-indicator--racing {
  background: rgba(255, 193, 7, 0.3);
  border: 1px solid rgba(255, 193, 7, 0.5);
}

.status-indicator--paused {
  background: rgba(243, 156, 18, 0.3);
  border: 1px solid rgba(243, 156, 18, 0.5);
}

.status-indicator--complete {
  background: rgba(46, 204, 113, 0.3);
  border: 1px solid rgba(46, 204, 113, 0.5);
}

.status-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffc107;
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0.3;
  }
}
</style>
