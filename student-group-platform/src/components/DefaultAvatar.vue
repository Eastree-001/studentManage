<template>
  <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size">
    <circle :cx="size / 2" :cy="size / 2" :r="size / 2" :fill="backgroundColor" />
    <text
      :x="'50%'"
      :y="'50%'"
      text-anchor="middle"
      dy=".3em"
      fill="#fff"
      :font-size="size * 0.4"
      font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      font-weight="600"
    >
      {{ initials }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  name?: string;
  size?: number;
}>(), {
  name: '',
  size: 40,
});

const initials = computed(() => {
  if (!props.name) return '';
  // Take the last 2 characters
  return props.name.slice(-2);
});

const colorPalette = [
  '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
  '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
  '#f1c40f', '#e67e22', '#e74c3c', '#95a5a6', '#f39c12',
  '#d35400', '#c0392b', '#7f8c8d'
];

const backgroundColor = computed(() => {
  if (!props.name) return '#bdc3c7'; // A default grey if no name
  // Simple hash function to get a consistent color based on the name
  let hash = 0;
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colorPalette.length);
  return colorPalette[index];
});
</script>
