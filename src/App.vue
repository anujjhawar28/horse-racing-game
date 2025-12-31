<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useStore } from '@/store';
import ControlPanel from './components/ControlPanel.vue';
import HorseList from './components/HorseList.vue';
import RaceSchedule from './components/RaceSchedule.vue';
import RaceTrack from './components/RaceTrack.vue';
import RaceResults from './components/RaceResults.vue';
import { Zap, Flag, ClipboardList, Trophy, CircleDot } from 'lucide-vue-next';

const store = useStore();
const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated);
const isRacing = computed(() => store.getters.isRacing);
const allResults = computed(() => store.getters.allResults);

const leftTab = ref<'horses' | 'track'>('horses');
const rightTab = ref<'schedule' | 'results'>('schedule');

watch(isRacing, (racing) => {
  if (racing) {
    leftTab.value = 'track';
  }
});

watch(() => store.getters.isScheduleGenerated, (generated) => {
  if (!generated) {
    leftTab.value = 'horses';
  }
});
</script>

<template>
  <div class="app">
    <header class="app__header">
      <ControlPanel />
    </header>
    
    <main class="app__main">
      <div class="app__layout">
        <!-- Left: Horses/Track Tabs -->
        <div class="app__panel app__panel--main">
          <div class="app__tabs">
            <button 
              class="app__tab" 
              :class="{ 'app__tab--active': leftTab === 'horses' }"
              @click="leftTab = 'horses'"
            >
              <Zap :size="16" /> Horses
            </button>
            <button 
              class="app__tab" 
              :class="{ 'app__tab--active': leftTab === 'track' }"
              @click="leftTab = 'track'"
              :disabled="!isScheduleGenerated"
            >
              <Flag :size="16" /> Race Track
              <span v-if="isRacing" class="app__tab-live">LIVE</span>
            </button>
          </div>
          
          <div class="app__tab-content">
            <HorseList v-show="leftTab === 'horses'" />
            <RaceTrack v-show="leftTab === 'track'" />
          </div>
        </div>
        
        <!-- Right: Schedule/Results Tabs -->
        <aside class="app__panel app__panel--sidebar">
          <div class="app__tabs">
            <button 
              class="app__tab" 
              :class="{ 'app__tab--active': rightTab === 'schedule' }"
              @click="rightTab = 'schedule'"
            >
              <ClipboardList :size="16" /> Schedule
            </button>
            <button 
              class="app__tab" 
              :class="{ 'app__tab--active': rightTab === 'results' }"
              @click="rightTab = 'results'"
            >
              <Trophy :size="16" /> Results
              <span v-if="allResults.length" class="app__tab-badge">{{ allResults.length }}</span>
            </button>
          </div>
          
          <div class="app__tab-content">
            <RaceSchedule v-show="rightTab === 'schedule'" />
            <RaceResults v-show="rightTab === 'results'" />
          </div>
        </aside>
      </div>
    </main>
    
    <footer class="app__footer">
      <p><CircleDot :size="14" class="footer-icon" /> Horse Racing Game - Built with Vue.js & Vuex</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--app-bg, #e8ecf1);
}

.app__header {
  padding: 20px;
  flex-shrink: 0;
}

.app__main {
  flex: 1;
  padding: 0 20px 20px;
  overflow: hidden;
}

.app__layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.app__panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--section-bg, #f8f9fa);
  border-radius: 12px;
}

.app__panel--main {
  min-height: 0;
}

.app__tabs {
  display: flex;
  gap: 4px;
  padding: 12px 12px 0;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.app__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary, #666666);
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s ease;
  position: relative;
}

.app__tab:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary, #1a1a1a);
}

.app__tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app__tab--active {
  background: var(--card-bg, #ffffff);
  color: var(--accent-color, #3498db);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.app__tab--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--card-bg, #ffffff);
}

.app__tab-badge {
  background: var(--accent-color, #3498db);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
}

.app__tab-live {
  background: #e74c3c;
  color: white;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  animation: pulse-live 1s infinite;
}

@keyframes pulse-live {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.app__tab-content {
  flex: 1;
  overflow: hidden;
  background: var(--card-bg, #ffffff);
  border-radius: 0 0 12px 12px;
}

.app__tab-content > * {
  height: 100%;
  border-radius: 0;
  background: transparent;
}

.app__footer {
  padding: 16px 20px;
  text-align: center;
  color: var(--text-secondary, #666666);
  font-size: 14px;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.05);
}

.app__footer p {
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .app__layout {
    grid-template-columns: 1fr 340px;
  }
}

@media (max-width: 992px) {
  .app__layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    height: auto;
    min-height: auto;
  }
  
  .app__panel--main {
    min-height: 500px;
  }
  
  .app__panel--sidebar {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .app__layout {
    gap: 16px;
  }
  
  .app__panel--main {
    min-height: 400px;
  }
  
  .app__panel--sidebar {
    max-height: 350px;
  }
  
  .app__tab {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
