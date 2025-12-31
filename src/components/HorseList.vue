<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '@/store';
import HorseCard from './HorseCard.vue';

const store = useStore();
const horses = computed(() => store.getters.allHorses);
</script>

<template>
  <div class="horse-list">
    <div class="horse-list__header">
      <h2 class="horse-list__title">🐴 Available Horses</h2>
      <span class="horse-list__count">{{ horses.length }} </span>
    </div>
    
    <div class="horse-list__grid">
      <HorseCard
        v-for="horse in horses"
        :key="horse.id"
        :horse="horse"
        :show-condition="true"
      />
    </div>
  </div>
</template>

<style scoped>
.horse-list {
  background: var(--section-bg, #f8f9fa);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.horse-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.horse-list__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary, #1a1a1a);
}

.horse-list__count {
  font-size: 14px;
  color: var(--text-secondary, #666666);
  background: var(--badge-bg, #e0e0e0);
  padding: 4px 12px;
  border-radius: 20px;
}

.horse-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  overflow-y: auto;
  flex: 1;
  padding-right: 8px;
}
</style>
