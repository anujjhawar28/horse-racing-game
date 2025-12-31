<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Tab {
  id: string;
  label: string;
  icon?: Component;
  badge?: string | number;
  badgeVariant?: 'default' | 'live' | 'success';
  disabled?: boolean;
}

interface Props {
  tabs: Tab[];
  modelValue: string;
  size?: 'sm' | 'md';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const activeTab = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
});

function selectTab(tab: Tab) {
  if (!tab.disabled) {
    activeTab.value = tab.id;
  }
}
</script>

<template>
  <div class="base-tabs" :class="`base-tabs--${size}`">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="base-tabs__tab"
      :class="{ 
        'base-tabs__tab--active': activeTab === tab.id,
        'base-tabs__tab--disabled': tab.disabled
      }"
      :disabled="tab.disabled"
      @click="selectTab(tab)"
    >
      <component v-if="tab.icon" :is="tab.icon" :size="size === 'sm' ? 14 : 16" />
      <span class="base-tabs__label">{{ tab.label }}</span>
      <span 
        v-if="tab.badge !== undefined" 
        class="base-tabs__badge"
        :class="`base-tabs__badge--${tab.badgeVariant || 'default'}`"
      >
        {{ tab.badge }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.base-tabs {
  display: flex;
  gap: 4px;
  padding: 12px 12px 0;
  border-bottom: 2px solid var(--border-color, #e0e0e0);
}

.base-tabs__tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  background: transparent;
  font-weight: 600;
  color: var(--text-secondary, #666666);
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s ease;
  position: relative;
}

.base-tabs--md .base-tabs__tab {
  padding: 12px 16px;
  font-size: 14px;
}

.base-tabs--sm .base-tabs__tab {
  padding: 10px 12px;
  font-size: 13px;
}

.base-tabs__tab:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
  color: var(--text-primary, #1a1a1a);
}

.base-tabs__tab--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-tabs__tab--active {
  background: var(--card-bg, #ffffff);
  color: var(--accent-color, #3498db);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.base-tabs__tab--active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--card-bg, #ffffff);
}

.base-tabs__label {
  white-space: nowrap;
}

.base-tabs__badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.base-tabs__badge--default {
  background: var(--accent-color, #3498db);
  color: white;
}

.base-tabs__badge--live {
  background: #e74c3c;
  color: white;
  font-size: 9px;
  border-radius: 4px;
  animation: pulse-live 1s infinite;
}

.base-tabs__badge--success {
  background: var(--success-color, #27ae60);
  color: white;
}

@keyframes pulse-live {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}
</style>
