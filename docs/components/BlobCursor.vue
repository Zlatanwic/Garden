<script setup lang="ts">
import gsap from 'gsap';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

interface BlobCursorProps {
  blobType?: 'circle' | 'square';
  fillColor?: string;
  trailCount?: number;
  sizes?: number[];
  innerSizes?: number[];
  innerColor?: string;
  opacities?: number[];
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  filterId?: string;
  filterStdDeviation?: number;
  filterColorMatrixValues?: string;
  useFilter?: boolean;
  fastDuration?: number;
  slowDuration?: number;
  fastEase?: string;
  slowEase?: string;
  zIndex?: number;
  positionMode?: 'fixed' | 'absolute';
}

const props = withDefaults(defineProps<BlobCursorProps>(), {
  blobType: 'circle',
  fillColor: '#27FF64',
  trailCount: 3,
  sizes: () => [60, 125, 75],
  innerSizes: () => [20, 35, 25],
  innerColor: 'rgba(255,255,255,0.8)',
  opacities: () => [0.6, 0.6, 0.6],
  shadowColor: 'rgba(0,0,0,0.75)',
  shadowBlur: 5,
  shadowOffsetX: 10,
  shadowOffsetY: 10,
  filterId: 'blob',
  filterStdDeviation: 30,
  filterColorMatrixValues: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10',
  useFilter: true,
  fastDuration: 0.1,
  slowDuration: 0.5,
  fastEase: 'power3.out',
  slowEase: 'power1.out',
  zIndex: 100,
  positionMode: 'fixed'
});

const containerRef = useTemplateRef<HTMLDivElement>('containerRef');
const blobsRef = ref<(HTMLElement | null)[]>([]);

const updateOffset = () => {
  if (!containerRef.value) return { left: 0, top: 0 };
  const rect = containerRef.value.getBoundingClientRect();
  return { left: rect.left, top: rect.top };
};

const handleMove = (e: MouseEvent | TouchEvent) => {
  const { left, top } = updateOffset();
  const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
  const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

  blobsRef.value.forEach((el, i) => {
    if (!el) return;

    const isLead = i === 0;
    gsap.to(el, {
      x: x - left,
      y: y - top,
      duration: isLead ? props.fastDuration : props.slowDuration,
      ease: isLead ? props.fastEase : props.slowEase
    });
  });
};

onMounted(() => {
  if (!containerRef.value) return;
  
  const target = props.positionMode === 'absolute' ? containerRef.value.parentElement || window : window;
  
  target.addEventListener('mousemove', handleMove as EventListener);
  target.addEventListener('touchmove', handleMove as EventListener);
  window.addEventListener('resize', updateOffset);
});

onUnmounted(() => {
  const target = props.positionMode === 'absolute' && containerRef.value?.parentElement ? containerRef.value.parentElement : window;
  
  target.removeEventListener('mousemove', handleMove as EventListener);
  target.removeEventListener('touchmove', handleMove as EventListener);
  window.removeEventListener('resize', updateOffset);
});
</script>

<template>
  <div
    ref="containerRef"
    class="blob-cursor-container"
    :style="{ 
      zIndex: props.zIndex,
      position: props.positionMode as any
    }"
  >
    <svg v-if="props.useFilter" class="blob-filter-svg">
      <filter :id="props.filterId">
        <feGaussianBlur in="SourceGraphic" result="blur" :stdDeviation="props.filterStdDeviation" />
        <feColorMatrix in="blur" :values="props.filterColorMatrixValues" />
      </filter>
    </svg>

    <div
      class="blob-layer"
      :style="{
        filter: props.useFilter ? `url(#${props.filterId})` : undefined
      }"
    >
      <div
        v-for="(_, i) in props.trailCount"
        :key="i"
        :ref="
          el => {
            blobsRef[i] = el as HTMLElement | null;
          }
        "
        class="blob"
        :style="{
          width: `${props.sizes[i]}px`,
          height: `${props.sizes[i]}px`,
          borderRadius: props.blobType === 'circle' ? '50%' : '0',
          backgroundColor: props.fillColor,
          opacity: props.opacities[i],
          boxShadow: `${props.shadowOffsetX}px ${props.shadowOffsetY}px ${props.shadowBlur}px 0 ${props.shadowColor}`
        }"
      >
        <div
          class="inner-blob"
          :style="{
            width: `${props.innerSizes[i]}px`,
            height: `${props.innerSizes[i]}px`,
            top: `${(props.sizes[i] - props.innerSizes[i]) / 2}px`,
            left: `${(props.sizes[i] - props.innerSizes[i]) / 2}px`,
            backgroundColor: props.innerColor,
            borderRadius: props.blobType === 'circle' ? '50%' : '0'
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.blob-cursor-container {
  position: fixed; /* Changed from relative to fixed to cover screen */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Ensure clicks pass through */
  overflow: hidden;
}

.blob-filter-svg {
  position: absolute;
  width: 0;
  height: 0;
}

.blob-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: default;
  pointer-events: none;
  user-select: none;
}

.blob {
  position: absolute;
  transform: translate(-50%, -50%);
  will-change: transform;
}

.inner-blob {
  position: absolute;
}
</style>
