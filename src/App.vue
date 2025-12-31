<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from '@/store';
import ControlPanel from './components/ControlPanel.vue';
import HorseList from './components/HorseList.vue';
import RaceSchedule from './components/RaceSchedule.vue';
import RaceTrack from './components/RaceTrack.vue';
import RaceResults from './components/RaceResults.vue';

const store = useStore();
const isScheduleGenerated = computed(() => store.getters.isScheduleGenerated);
const isRacing = computed(() => store.getters.isRacing);
const allResults = computed(() => store.getters.allResults);

const activeTab = ref<'schedule' | 'results'>('schedule');
</script>

<template>
  <div class="app">
    <header class="app__header">
      <ControlPanel />
    </header>
    
    <main class="app__main">
      <!-- Before Program Generated: Show Horse List Full Width -->
      <div v-if="!isScheduleGenerated" class="app__pre-race">
        <HorseList />
      </div>
      
      <!-- After Program Generated: Show Race Layout -->
      <div v-else class="app__layout">
        <!-- Left: Race Track (Main Focus) -->
        <div class="app__track-section">
          <RaceTrack />
        </div>
        
        <!-- Right: Tabbed Schedule/Results -->
        <aside class="app__sidebar">
          <div class="app__tabs">
            <button 
              class="app__tab" 
              :class="{ 'app__tab--active': activeTab === 'schedule' }"
              @click="activeTab = 'schedule'"
            >
              📋 Schedule
            </button>
            <button 
              class="app__tab" 
              :class="{ 'app__tab--active': activeTab === 'results' }"
              @click="activeTab = 'results'"
            >
              🏆 Results
              <span v-if="allResults.length" class="app__tab-badge">{{ allResults.length }}</span>
            </button>
          </div>
          
          <div class="app__tab-content">
            <RaceSchedule v-show="activeTab === 'schedule'" />
            <RaceResults v-show="activeTab === 'results'" />
          </div>
        </aside>
      </div>
    </main>
    
    <footer class="app__footer">
      <p>🏇 Horse Racing Game - Built with Vue.js & Vuex</p>
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

.app__pre-race {
  height: calc(100vh - 200px);
  min-height: 400px;
}

.app__layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.app__track-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.app__sidebar {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--section-bg, #f8f9fa);
  border-radius: 12px;
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

.app__tab:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary, #1a1a1a);
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
  
  .app__track-section {
    min-height: 500px;
  }
  
  .app__sidebar {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .app__layout {
    gap: 16px;
  }
  
  .app__track-section {
    min-height: 400px;
  }
  
  .app__sidebar {
    max-height: 350px;
  }
  
  .app__tab {
    padding: 10px 12px;
    font-size: 13px;
  }
}
</style>
