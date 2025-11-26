<template>
  <div class="glitch-text" :class="computedClasses" :style="inlineStyles" :data-text="children">
    {{ children }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration'?: string;
  '--before-duration'?: string;
  '--after-shadow'?: string;
  '--before-shadow'?: string;
}

const props = withDefaults(defineProps<GlitchTextProps>(), {
  speed: 0.5,
  enableShadows: true,
  enableOnHover: false,
  className: ''
});

const inlineStyles = computed(
  (): CustomCSSProperties => ({
    '--after-duration': `${props.speed * 3}s`,
    '--before-duration': `${props.speed * 2}s`,
    '--after-shadow': props.enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': props.enableShadows ? '5px 0 cyan' : 'none'
  })
);

const computedClasses = computed(() => {
  const classes = [];
  if (props.enableOnHover) {
    classes.push('hover-effect');
  } else {
    classes.push('always-glitch');
  }
  if (props.className) {
    classes.push(props.className);
  }
  return classes.join(' ');
});
</script>

<style scoped>
.glitch-text {
  color: white;
  font-weight: 900;
  white-space: nowrap;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  user-select: none;
  cursor: pointer;
  font-size: clamp(2rem, 10vw, 8rem);
  line-height: 1; /* Ensure bounding box matches text height */
  display: inline-block; /* Wrap text tightly */
}

/* Base pseudo-element styles */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  color: white;
  background: #0b0b0b; /* Match your theme background or use transparent if needed */
  overflow: hidden;
  clip-path: inset(0 0 0 0);
}

/* Always Glitch Mode */
.glitch-text.always-glitch::after {
  left: 10px;
  text-shadow: var(--after-shadow, -10px 0 red);
  animation: animate-glitch var(--after-duration, 3s) infinite linear alternate-reverse;
}

.glitch-text.always-glitch::before {
  left: -10px;
  text-shadow: var(--before-shadow, 10px 0 cyan);
  animation: animate-glitch var(--before-duration, 2s) infinite linear alternate-reverse;
}

/* Hover Effect Mode */
.glitch-text.hover-effect::before,
.glitch-text.hover-effect::after {
  opacity: 0;
  animation: none;
}

.glitch-text.hover-effect:hover::before {
  opacity: 1;
  left: -10px;
  text-shadow: var(--before-shadow, 10px 0 cyan);
  animation: animate-glitch var(--before-duration, 2s) infinite linear alternate-reverse;
}

.glitch-text.hover-effect:hover::after {
  opacity: 1;
  left: 10px;
  text-shadow: var(--after-shadow, -10px 0 red);
  animation: animate-glitch var(--after-duration, 3s) infinite linear alternate-reverse;
}

@keyframes animate-glitch {
  0% { clip-path: inset(20% 0 50% 0); }
  5% { clip-path: inset(10% 0 60% 0); }
  10% { clip-path: inset(15% 0 55% 0); }
  15% { clip-path: inset(25% 0 35% 0); }
  20% { clip-path: inset(30% 0 40% 0); }
  25% { clip-path: inset(40% 0 20% 0); }
  30% { clip-path: inset(10% 0 60% 0); }
  35% { clip-path: inset(15% 0 55% 0); }
  40% { clip-path: inset(25% 0 35% 0); }
  45% { clip-path: inset(30% 0 40% 0); }
  50% { clip-path: inset(20% 0 50% 0); }
  55% { clip-path: inset(10% 0 60% 0); }
  60% { clip-path: inset(15% 0 55% 0); }
  65% { clip-path: inset(25% 0 35% 0); }
  70% { clip-path: inset(30% 0 40% 0); }
  75% { clip-path: inset(40% 0 20% 0); }
  80% { clip-path: inset(20% 0 50% 0); }
  85% { clip-path: inset(10% 0 60% 0); }
  90% { clip-path: inset(15% 0 55% 0); }
  95% { clip-path: inset(25% 0 35% 0); }
  100% { clip-path: inset(30% 0 40% 0); }
}
</style>
