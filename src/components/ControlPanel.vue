<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';

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
    <div class="control-panel__title">
      <h1 class="control-panel__heading">🏇 Horse Racing Game</h1>
      <p class="control-panel__subtitle">Generate a program and start the race!</p>
    </div>
    
    <div class="control-panel__buttons">
      <button
        class="btn btn--primary"
        :disabled="isRacing"
        @click="handleGenerateSchedule"
      >
        <span class="btn__icon">🎲</span>
        <span class="btn__text">Generate Program</span>
      </button>
      
      <button
        class="btn btn--success"
        :disabled="!isScheduleGenerated || isRacing || allRacesCompleted"
        @click="handleStartRace"
      >
        <span class="btn__icon">▶️</span>
        <span class="btn__text">Start Race</span>
      </button>
      
      <button
        v-if="isRacing"
        class="btn btn--warning"
        @click="handlePauseResume"
      >
        <span class="btn__icon">{{ isPaused ? '▶️' : '⏸️' }}</span>
        <span class="btn__text">{{ isPaused ? 'Resume' : 'Pause' }}</span>
      </button>
      
      <button
        class="btn btn--secondary"
        :disabled="isRacing && !isPaused"
        @click="handleReset"
      >
        <span class="btn__icon">🔄</span>
        <span class="btn__text">Reset</span>
      </button>
    </div>
    
    <div v-if="isRacing && !isPaused" class="control-panel__status">
      <div class="status-indicator status-indicator--racing">
        <span class="status-indicator__dot"></span>
        <span>Racing Round {{ currentRoundNumber }}...</span>
      </div>
    </div>
    
    <div v-else-if="isRacing && isPaused" class="control-panel__status">
      <div class="status-indicator status-indicator--paused">
        <span>⏸️ Paused - Round {{ currentRoundNumber }}</span>
      </div>
    </div>
    
    <div v-else-if="allRacesCompleted" class="control-panel__status">
      <div class="status-indicator status-indicator--complete">
        <span>🎉 All Races Completed!</span>
      </div>
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

.control-panel__title {
  text-align: center;
  margin-bottom: 24px;
}

.control-panel__heading {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

.control-panel__status {
  margin-top: 20px;
  display: flex;
  justify-content: center;
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
