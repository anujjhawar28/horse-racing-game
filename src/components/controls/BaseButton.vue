<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: Component;
  iconPosition?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  iconPosition: 'left'
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  { 'base-button--disabled': props.disabled }
]);

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event);
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <component 
      v-if="icon && iconPosition === 'left'" 
      :is="icon" 
      :size="size === 'sm' ? 14 : size === 'lg' ? 20 : 18" 
      class="base-button__icon"
    />
    <span class="base-button__text">
      <slot />
    </span>
    <component 
      v-if="icon && iconPosition === 'right'" 
      :is="icon" 
      :size="size === 'sm' ? 14 : size === 'lg' ? 20 : 18" 
      class="base-button__icon"
    />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.base-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.base-button:not(:disabled):active {
  transform: translateY(0);
}

/* Sizes */
.base-button--sm {
  padding: 8px 16px;
  font-size: 13px;
}

.base-button--md {
  padding: 12px 24px;
  font-size: 15px;
}

.base-button--lg {
  padding: 16px 32px;
  font-size: 17px;
}

/* Variants */
.base-button--primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.base-button--secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.base-button--secondary:not(:disabled):hover {
  background: rgba(255, 255, 255, 0.3);
}

.base-button--success {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.base-button--warning {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
}

.base-button--danger {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

/* Disabled state */
.base-button--disabled,
.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.base-button__icon {
  flex-shrink: 0;
}

.base-button__text {
  white-space: nowrap;
}
</style>
