<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronRight, ChevronDown } from 'lucide-vue-next';

interface Props {
  expanded?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'bordered' | 'elevated';
}

const props = withDefaults(defineProps<Props>(), {
  expanded: false,
  disabled: false,
  variant: 'default'
});

const emit = defineEmits<{
  'update:expanded': [value: boolean];
  toggle: [expanded: boolean];
}>();

const isExpanded = ref(props.expanded);

const accordionClasses = computed(() => [
  'base-accordion',
  `base-accordion--${props.variant}`,
  {
    'base-accordion--expanded': isExpanded.value,
    'base-accordion--disabled': props.disabled
  }
]);

function toggle() {
  if (!props.disabled) {
    isExpanded.value = !isExpanded.value;
    emit('update:expanded', isExpanded.value);
    emit('toggle', isExpanded.value);
  }
}
</script>

<template>
  <div :class="accordionClasses">
    <div class="base-accordion__header" @click="toggle">
      <div class="base-accordion__header-content">
        <slot name="header" :expanded="isExpanded" />
      </div>
      <span class="base-accordion__icon">
        <ChevronDown v-if="isExpanded" :size="14" />
        <ChevronRight v-else :size="14" />
      </span>
    </div>
    
    <div v-if="isExpanded" class="base-accordion__content">
      <slot :expanded="isExpanded" />
    </div>
  </div>
</template>

<style scoped>
.base-accordion {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s ease;
}

/* Variants */
.base-accordion--default {
  background: var(--section-bg, #f8f9fa);
}

.base-accordion--bordered {
  background: transparent;
  border: 1px solid var(--border-color, #e0e0e0);
}

.base-accordion--elevated {
  background: var(--card-bg, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.base-accordion--expanded.base-accordion--default {
  background: var(--card-bg, #ffffff);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.base-accordion--disabled {
  opacity: 0.6;
}

.base-accordion__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  gap: 12px;
}

.base-accordion--disabled .base-accordion__header {
  cursor: not-allowed;
}

.base-accordion__header:hover {
  background: rgba(0, 0, 0, 0.03);
}

.base-accordion__header-content {
  flex: 1;
  min-width: 0;
}

.base-accordion__icon {
  flex-shrink: 0;
  color: var(--text-secondary, #666666);
  transition: transform 0.2s ease;
}

.base-accordion__content {
  padding: 0 12px 12px;
  border-top: 1px solid var(--border-color, #e0e0e0);
}
</style>
