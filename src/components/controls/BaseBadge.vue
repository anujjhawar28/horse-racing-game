<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'live';
  size?: 'sm' | 'md' | 'lg';
  pill?: boolean;
  dot?: boolean;
  animated?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  pill: false,
  dot: false,
  animated: false
});

const badgeClasses = computed(() => [
  'base-badge',
  `base-badge--${props.variant}`,
  `base-badge--${props.size}`,
  {
    'base-badge--pill': props.pill,
    'base-badge--dot': props.dot,
    'base-badge--animated': props.animated
  }
]);
</script>

<template>
  <span :class="badgeClasses">
    <span v-if="dot" class="base-badge__dot"></span>
    <slot />
  </span>
</template>

<style scoped>
.base-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  border-radius: 4px;
}

/* Sizes */
.base-badge--sm {
  padding: 2px 6px;
  font-size: 10px;
}

.base-badge--md {
  padding: 4px 10px;
  font-size: 12px;
}

.base-badge--lg {
  padding: 6px 14px;
  font-size: 14px;
}

/* Pill shape */
.base-badge--pill {
  border-radius: 20px;
}

/* Variants */
.base-badge--default {
  background: var(--badge-bg, #e0e0e0);
  color: var(--text-secondary, #666666);
}

.base-badge--primary {
  background: var(--accent-color, #3498db);
  color: white;
}

.base-badge--success {
  background: var(--success-color, #27ae60);
  color: white;
}

.base-badge--warning {
  background: #f39c12;
  color: white;
}

.base-badge--danger {
  background: #e74c3c;
  color: white;
}

.base-badge--info {
  background: #17a2b8;
  color: white;
}

.base-badge--live {
  background: #e74c3c;
  color: white;
}

/* Dot indicator */
.base-badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.base-badge--animated .base-badge__dot,
.base-badge--live .base-badge__dot {
  animation: pulse-dot 1s infinite;
}

.base-badge--animated {
  animation: pulse-badge 1.5s infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes pulse-badge {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.02);
  }
}
</style>
