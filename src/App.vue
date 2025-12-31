<script setup lang="ts">
import ControlPanel from './components/ControlPanel.vue';
import HorseList from './components/HorseList.vue';
import RaceSchedule from './components/RaceSchedule.vue';
import RaceTrack from './components/RaceTrack.vue';
import RaceResults from './components/RaceResults.vue';
</script>

<template>
  <div class="app">
    <header class="app__header">
      <ControlPanel />
    </header>
    
    <main class="app__main">
      <div class="app__layout">
        <!-- Left Column: Horse List -->
        <aside class="app__sidebar app__sidebar--left">
          <HorseList />
        </aside>
        
        <!-- Center Column: Race Track (Main Focus) -->
        <div class="app__center">
          <RaceTrack />
        </div>
        
        <!-- Right Column: Schedule + Results -->
        <aside class="app__sidebar app__sidebar--right">
          <div class="app__panel">
            <RaceSchedule />
          </div>
          <div class="app__panel">
            <RaceResults />
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

.app__layout {
  display: grid;
  grid-template-columns: 260px 1fr 320px;
  gap: 20px;
  height: calc(100vh - 200px);
  min-height: 600px;
}

.app__sidebar {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app__sidebar--right {
  gap: 16px;
}

.app__panel {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.app__center {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
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
@media (max-width: 1400px) {
  .app__layout {
    grid-template-columns: 240px 1fr 300px;
  }
}

@media (max-width: 1200px) {
  .app__layout {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    height: auto;
    min-height: auto;
  }
  
  .app__sidebar--left {
    grid-column: 1;
    grid-row: 1;
    max-height: 350px;
  }
  
  .app__sidebar--right {
    grid-column: 2;
    grid-row: 1;
    max-height: 350px;
    flex-direction: row;
  }
  
  .app__center {
    grid-column: 1 / -1;
    grid-row: 2;
    min-height: 500px;
  }
}

@media (max-width: 768px) {
  .app__layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .app__sidebar--left {
    grid-column: 1;
    grid-row: 1;
    max-height: 280px;
  }
  
  .app__center {
    grid-column: 1;
    grid-row: 2;
    min-height: 400px;
  }
  
  .app__sidebar--right {
    grid-column: 1;
    grid-row: 3;
    max-height: 400px;
    flex-direction: column;
  }
}
</style>
