<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';
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

const leftTab = ref('horses');
const rightTab = ref('schedule');

const leftTabs = computed(() => [
  { id: 'horses', label: 'Horses', icon: markRaw(Zap) },
  { 
    id: 'track', 
    label: 'Race Track', 
    icon: markRaw(Flag), 
    disabled: !isScheduleGenerated.value,
    badge: isRacing.value ? 'LIVE' : undefined,
    badgeVariant: 'live' as const
  }
]);

const rightTabs = computed(() => [
  { id: 'schedule', label: 'Schedule', icon: markRaw(ClipboardList) },
  { 
    id: 'results', 
    label: 'Results', 
    icon: markRaw(Trophy),
    badge: allResults.value.length || undefined
  }
]);

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
          <BaseTabs v-model="leftTab" :tabs="leftTabs" />
          
          <div class="app__tab-content">
            <HorseList v-show="leftTab === 'horses'" />
            <RaceTrack v-show="leftTab === 'track'" />
          </div>
        </div>
        
        <!-- Right: Schedule/Results Tabs -->
        <aside class="app__panel app__panel--sidebar">
          <BaseTabs v-model="rightTab" :tabs="rightTabs" />
          
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

.app__tab-content {
  flex: 1;
  overflow: auto;
  background: var(--card-bg, #ffffff);
  border-radius: 0 0 12px 12px;
}

.app__tab-content > * {
  height: auto;
  min-height: 100%;
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
