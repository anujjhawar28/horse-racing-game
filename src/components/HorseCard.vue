<script setup lang="ts">
import type { Horse } from '@/types';

defineProps<{
  horse: Horse;
  showCondition?: boolean;
  compact?: boolean;
}>();
</script>

<template>
  <div 
    class="horse-card" 
    :class="{ 'horse-card--compact': compact }"
  >
    <div 
      class="horse-card__color" 
      :style="{ backgroundColor: horse.color }"
    />
    <div class="horse-card__info">
      <span class="horse-card__name">{{ horse.name }}</span>
      <span v-if="showCondition" class="horse-card__condition">
        Condition: {{ horse.condition }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.horse-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--card-bg, #ffffff);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.horse-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.horse-card--compact {
  padding: 8px 12px;
  gap: 8px;
}

.horse-card__color {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.3),
              0 2px 4px rgba(0, 0, 0, 0.2);
}

.horse-card--compact .horse-card__color {
  width: 24px;
  height: 24px;
}

.horse-card__info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.horse-card__name {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary, #1a1a1a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.horse-card--compact .horse-card__name {
  font-size: 12px;
}

.horse-card__condition {
  font-size: 12px;
  color: var(--text-secondary, #666666);
}

.horse-card--compact .horse-card__condition {
  font-size: 10px;
}
</style>
