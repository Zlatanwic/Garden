<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  splitType: {
    type: String,
    default: 'chars', // 'chars', 'words', 'lines' (simplified to chars/words for now)
  },
  duration: {
    type: Number,
    default: 0.5
  },
  delay: {
    type: Number,
    default: 0
  },
  from: {
    type: Object,
    default: () => ({ opacity: 0, y: 20 })
  },
  to: {
    type: Object,
    default: () => ({ opacity: 1, y: 0 })
  },
  className: {
    type: String,
    default: ''
  }
})

const container = ref<HTMLElement | null>(null)

const animate = () => {
  if (!container.value) return
  
  const elements = container.value.children
  gsap.fromTo(
    elements,
    props.from,
    {
      ...props.to,
      duration: props.duration,
      delay: props.delay / 1000, // convert ms to s if needed, or assume s. Usage said 100 (ms?) or 0.6 (s). Let's assume seconds for duration and ms for delay if > 10.
      stagger: 0.05,
      ease: 'power2.out'
    }
  )
}

onMounted(() => {
  animate()
})

watch(() => props.text, animate)

const splitContent = () => {
  if (props.splitType === 'chars') {
    return props.text.split('').map(char => char === ' ' ? '&nbsp;' : char)
  }
  return props.text.split(' ')
}
</script>

<template>
  <div ref="container" :class="className" class="split-text-container">
    <span
      v-for="(item, index) in splitContent()"
      :key="index"
      class="split-item"
      style="display: inline-block;"
      v-html="item"
    ></span>
  </div>
</template>

<style scoped>
.split-text-container {
  display: inline-block;
}
</style>
