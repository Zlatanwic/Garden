<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  logos: {
    type: Array as () => { node: string; title: string; href: string }[],
    required: true
  },
  speed: {
    type: Number,
    default: 50 // pixels per second
  },
  direction: {
    type: String,
    default: 'left'
  },
  gap: {
    type: Number,
    default: 40
  },
  pauseOnHover: {
    type: Boolean,
    default: true
  }
})

const container = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
let animation: gsap.core.Tween | null = null

// Duplicate logos to create seamless loop
const displayLogos = computed(() => [...props.logos, ...props.logos, ...props.logos])

onMounted(() => {
  if (!track.value || !container.value) return

  const trackWidth = track.value.scrollWidth / 3 // Width of one set
  const duration = trackWidth / props.speed

  animation = gsap.to(track.value, {
    x: props.direction === 'left' ? -trackWidth : 0,
    duration: duration,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => parseFloat(x) % trackWidth)
    }
  })

  if (props.direction === 'right') {
      // Start from -trackWidth and move to 0
      gsap.set(track.value, { x: -trackWidth })
      animation = gsap.to(track.value, {
        x: 0,
        duration: duration,
        ease: 'none',
        repeat: -1,
         modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % trackWidth - trackWidth)
         }
      })
  }
})

const pause = () => {
  if (props.pauseOnHover && animation) animation.pause()
}

const resume = () => {
  if (props.pauseOnHover && animation) animation.play()
}
</script>

<template>
  <div
    ref="container"
    class="logo-loop-container"
    @mouseenter="pause"
    @mouseleave="resume"
  >
    <div ref="track" class="logo-track" :style="{ gap: gap + 'px' }">
      <a
        v-for="(logo, index) in displayLogos"
        :key="index"
        :href="logo.href"
        class="logo-item"
        target="_blank"
        rel="noopener noreferrer"
        :title="logo.title"
        v-html="logo.node"
      ></a>
    </div>
  </div>
</template>

<style scoped>
.logo-loop-container {
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.logo-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  will-change: transform;
}

.logo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-2);
  transition: color 0.3s, transform 0.3s;
  text-decoration: none;
}

.logo-item:hover {
  color: var(--vp-c-brand);
  transform: scale(1.1);
}
</style>
