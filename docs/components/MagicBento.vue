<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch, h, type PropType } from 'vue';

// --- 类型定义 ---
export interface BentoCardProps {
  title: string;
  icon?: string;
  description: string;
  label?: string;
  colSpan?: number;
  rowSpan?: number;
  color?: string;
  className?: string; // 支持传入 bento-large 等类名
}

interface BentoProps {
  cards: BentoCardProps[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '0, 200, 83';
const MOBILE_BREAKPOINT = 768;

// --- 逻辑函数 (保持原汁原味) ---
const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `position: absolute; width: 4px; height: 4px; border-radius: 50%; background: rgba(${color}, 1); box-shadow: 0 0 6px rgba(${color}, 0.6); pointer-events: none; z-index: 100; left: ${x}px; top: ${y}px;`;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

// --- 组件定义 (使用 Render Function 避免运行时错误) ---

// 1. ParticleCard
const ParticleCard = defineComponent({
  name: 'ParticleCard',
  props: {
    disableAnimations: Boolean,
    particleCount: { type: Number, default: DEFAULT_PARTICLE_COUNT },
    glowColor: { type: String, default: DEFAULT_GLOW_COLOR },
    enableTilt: { type: Boolean, default: true },
    clickEffect: { type: Boolean, default: false },
    enableMagnetism: { type: Boolean, default: false }
  },
  setup(props, { slots }) {
    const cardRef = ref<HTMLDivElement | null>(null);
    const particlesRef = ref<HTMLDivElement[]>([]);
    const timeoutsRef = ref<number[]>([]);
    const isHoveredRef = ref(false);
    const memoizedParticles = ref<HTMLDivElement[]>([]);
    const particlesInitialized = ref(false);
    const magnetismAnimationRef = ref<gsap.core.Tween | null>(null);

    // ... 粒子动画逻辑 (保持不变) ...
    const initializeParticles = () => {
      if (particlesInitialized.value || !cardRef.value) return;
      const { width, height } = cardRef.value.getBoundingClientRect();
      memoizedParticles.value = Array.from({ length: props.particleCount }, () =>
        createParticleElement(Math.random() * width, Math.random() * height, props.glowColor)
      );
      particlesInitialized.value = true;
    };

    const clearAllParticles = () => {
      timeoutsRef.value.forEach(clearTimeout);
      timeoutsRef.value = [];
      magnetismAnimationRef.value?.kill();
      particlesRef.value.forEach(p => p.remove());
      particlesRef.value = [];
    };

    const animateParticles = () => {
      if (!cardRef.value || !isHoveredRef.value) return;
      if (!particlesInitialized.value) initializeParticles();
      memoizedParticles.value.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.value || !cardRef.value) return;
          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.value.appendChild(clone);
          particlesRef.value.push(clone);
          gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
          gsap.to(clone, { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100, rotation: Math.random() * 360, duration: 2 + Math.random() * 2, ease: 'none', repeat: -1, yoyo: true });
          gsap.to(clone, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
        }, index * 100);
        timeoutsRef.value.push(timeoutId);
      });
    };

    // 事件处理
    const handleMouseEnter = () => {
      isHoveredRef.value = true;
      animateParticles();
      if(cardRef.value) gsap.to(cardRef.value, { y: -2, duration: 0.3, ease: 'power2.out' });
      // Tilt 逻辑简化集成
      if (props.enableTilt && cardRef.value) {
         gsap.to(cardRef.value, { rotateX: 5, rotateY: 5, duration: 0.3, ease: 'power2.out', transformPerspective: 1000 });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.value = false;
      clearAllParticles();
      if(cardRef.value) {
        gsap.to(cardRef.value, { y: 0, rotateX: 0, rotateY: 0, x: 0, duration: 0.3, ease: 'power2.out' });
      }
    };
    
    // 鼠标移动逻辑 (Magnetism + Tilt)
    const handleMouseMove = (e: MouseEvent) => {
        if((!props.enableTilt && !props.enableMagnetism) || !cardRef.value) return;
        const rect = cardRef.value.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (props.enableTilt) {
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            gsap.to(cardRef.value, { rotateX, rotateY, duration: 0.1, ease: 'power2.out', transformPerspective: 1000 });
        }
        if (props.enableMagnetism) {
             const magnetX = (x - centerX) * 0.05;
             const magnetY = (y - centerY) * 0.05;
             magnetismAnimationRef.value = gsap.to(cardRef.value, { x: magnetX, y: magnetY, duration: 0.3, ease: 'power2.out' });
        }
    };

    const handleClick = (e: MouseEvent) => {
        if (!props.clickEffect || !cardRef.value) return;
        const rect = cardRef.value.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // 计算波纹大小...
        const maxDistance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
        const ripple = document.createElement('div');
        // 将样式直接写入
        ripple.style.cssText = `position: absolute; width: ${maxDistance * 2}px; height: ${maxDistance * 2}px; border-radius: 50%; background: radial-gradient(circle, rgba(${props.glowColor}, 0.4) 0%, rgba(${props.glowColor}, 0.2) 30%, transparent 70%); left: ${x - maxDistance}px; top: ${y - maxDistance}px; pointer-events: none; z-index: 1000;`;
        cardRef.value.appendChild(ripple);
        gsap.fromTo(ripple, { scale: 0, opacity: 1 }, { scale: 1, opacity: 0, duration: 0.8, ease: 'power2.out', onComplete: () => ripple.remove() });
    };

    const setupEventListeners = () => {
        if(!cardRef.value) return;
        const el = cardRef.value;
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        el.addEventListener('mousemove', handleMouseMove);
        el.addEventListener('click', handleClick);
    };

    onMounted(() => { nextTick(setupEventListeners); });

    // 渲染函数：对应原代码的 template 结构
    return () => h('div', {
        ref: cardRef,
        class: 'magic-card-inner', // 使用 Scoped CSS 类
        style: { position: 'relative', overflow: 'hidden', height: '100%' }
    }, slots.default ? slots.default() : []);
  }
});

// 2. GlobalSpotlight
const GlobalSpotlight = defineComponent({
  name: 'GlobalSpotlight',
  props: {
    gridRef: { type: [Object, null] as PropType<HTMLDivElement | null>, required: true },
    disableAnimations: Boolean,
    enabled: Boolean,
    spotlightRadius: Number,
    glowColor: String
  },
  setup(props) {
    const spotlightRef = ref<HTMLDivElement | null>(null);
    onMounted(() => {
        const s = document.createElement('div');
        s.className = 'global-spotlight';
        s.style.cssText = `position: fixed; width: 800px; height: 800px; border-radius: 50%; pointer-events: none; background: radial-gradient(circle, rgba(${props.glowColor}, 0.15) 0%, rgba(${props.glowColor}, 0.08) 15%, transparent 70%); z-index: 200; opacity: 0; transform: translate(-50%, -50%); mix-blend-mode: screen; transition: opacity 0.2s;`;
        document.body.appendChild(s);
        spotlightRef.value = s;

        const handleMouseMove = (e: MouseEvent) => {
            if(!spotlightRef.value || !props.gridRef) return;
            // 简单的可见性检查
            const rect = props.gridRef.getBoundingClientRect();
            const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
            
            if(inside) {
                gsap.to(spotlightRef.value, { opacity: 1, left: e.clientX, top: e.clientY, duration: 0.1, ease: 'power2.out' });
                // 计算每个卡片的光照
                const { proximity, fadeDistance } = calculateSpotlightValues(props.spotlightRadius || 300);
                const cards = props.gridRef.querySelectorAll('.card');
                cards.forEach((card: any) => {
                    const cRect = card.getBoundingClientRect();
                    const cx = cRect.left + cRect.width/2;
                    const cy = cRect.top + cRect.height/2;
                    const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cRect.width, cRect.height)/2;
                    const effDist = Math.max(0, dist);
                    let intensity = 0;
                    if(effDist <= proximity) intensity = 1;
                    else if(effDist <= fadeDistance) intensity = (fadeDistance - effDist)/(fadeDistance - proximity);
                    updateCardGlowProperties(card, e.clientX, e.clientY, intensity, props.spotlightRadius || 300);
                });
            } else {
                gsap.to(spotlightRef.value, { opacity: 0, duration: 0.3 });
                const cards = props.gridRef.querySelectorAll('.card');
                cards.forEach((card: any) => card.style.setProperty('--glow-intensity', '0'));
            }
        };
        
        document.addEventListener('mousemove', handleMouseMove);
    });
    return () => h('div', { style: { display: 'none' } });
  }
});

// 3. BentoCardGrid
const BentoCardGrid = defineComponent({
  name: 'BentoCardGrid',
  props: { gridRef: Function },
  setup(props, { slots }) {
    return () => h('div', {
        class: 'bento-section card-responsive', // 对应 CSS 里的类名
        ref: props.gridRef as any,
        style: { fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }
    }, slots.default ? slots.default() : []);
  }
});

// --- 主组件逻辑 ---
const useMobileDetection = () => {
  const isMobile = ref(false);
  onMounted(() => {
    const check = () => isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
    check();
    window.addEventListener('resize', check);
  });
  return isMobile;
};

const props = withDefaults(defineProps<BentoProps>(), {
  cards: () => [],
  textAutoHide: true,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  disableAnimations: false,
  spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
  particleCount: DEFAULT_PARTICLE_COUNT,
  enableTilt: false,
  glowColor: DEFAULT_GLOW_COLOR,
  clickEffect: true,
  enableMagnetism: true
});

const gridRef = ref<HTMLDivElement | null>(null);
const isMobile = useMobileDetection();
const shouldDisableAnimations = computed(() => props.disableAnimations || isMobile.value);

// 样式生成：为了匹配 "细节一样"，我们需要把 Tailwind 的 card 样式手动转成 inline style 或者 class
const getCardStyle = (card: BentoCardProps) => {
    // 如果你在 Home.vue 传入了 colSpan/rowSpan，优先使用 props 里的
    // 如果没有传，就依赖 CSS 里的 nth-child 规则 (你提供的 snippet 里的逻辑)
    const style: any = {
        backgroundColor: card.color || 'var(--background-dark)',
        borderColor: 'var(--border-color)',
        color: 'var(--white)',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-intensity': '0',
        '--glow-radius': '200px'
    };
    
    // 兼容 Home.vue 传过来的 colSpan (为了不破坏你现有的数据逻辑)
    if (!isMobile.value && card.colSpan) style.gridColumn = `span ${card.colSpan}`;
    if (!isMobile.value && card.rowSpan) style.gridRow = `span ${card.rowSpan}`;

    return style;
};

// 空 ref callback 占位
const setupCardRef = (el: any, index: number) => {}; 
</script>

<template>
  <GlobalSpotlight
    v-if="enableSpotlight"
    :grid-ref="gridRef"
    :disable-animations="shouldDisableAnimations"
    :enabled="enableSpotlight"
    :spotlight-radius="spotlightRadius"
    :glow-color="glowColor"
  />

  <BentoCardGrid :grid-ref="(el) => { gridRef = el }">
    <template v-for="(card, index) in props.cards" :key="index">
      
      <component
        :is="enableStars ? ParticleCard : 'div'"
        class="card" 
        :class="[
            card.className, 
            { 'card--border-glow': enableBorderGlow }
        ]"
        :style="getCardStyle(card)"
        :disable-animations="shouldDisableAnimations"
        :particle-count="particleCount"
        :glow-color="glowColor"
        :enable-tilt="enableTilt"
        :click-effect="clickEffect"
        :enable-magnetism="enableMagnetism"
        :ref="!enableStars ? (el: any) => setupCardRef(el, index) : undefined"
      >
        <div class="card__header">
            <span class="card__label" v-if="card.icon" style="font-size: 1.5rem; margin-right: 0.5rem">{{ card.icon }}</span>
           <span class="card__label" v-if="card.label">{{ card.label }}</span>
        </div>
        
        <div class="card__content">
           <h3 class="card__title" :class="{ 'text-clamp-1': textAutoHide }">{{ card.title }}</h3>
           <p class="card__description" :class="{ 'text-clamp-2': textAutoHide }">{{ card.description }}</p>
        </div>
      </component>
    </template>
  </BentoCardGrid>
</template>

<style scoped>
/* 这是 "Tailwind 到 CSS" 的完整翻译 
   完全对应你提供的 snippet 中的类名和逻辑 
*/

/* 1. 网格容器 (.card-responsive) */
.card-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem; /* gap-2 */
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem; /* p-2 */
}

/* 2. 媒体查询逻辑 (完全照搬) */
@media (min-width: 600px) {
  .card-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
  
  /* 如果你不传 props 数据，默认会走这套 nth-child 逻辑 */
  /* 如果传了 props 数据 (Home.vue)，inline-style 会覆盖这里，保证兼容 */
  .card-responsive .card:nth-child(3) {
    grid-column: span 2;
    grid-row: span 2;
  }
  .card-responsive .card:nth-child(4) {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
  }
  .card-responsive .card:nth-child(6) {
    grid-column: 4;
    grid-row: 3;
  }
}

/* 3. 卡片基础样式 (.card) */
/* 对应: flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border border-solid font-light overflow-hidden transition-[box-shadow] duration-300 ease-in-out hover:shadow-[...] */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  aspect-ratio: 4 / 3;
  min-height: 200px;
  width: 100%;
  max-width: 100%;
  padding: 1.25rem; /* p-5 */
  border-radius: 20px;
  border: 1px solid var(--border-color);
  font-weight: 300; /* font-light */
  overflow: hidden;
  transition: box-shadow 0.3s ease-in-out;
  color: #fff; /* text-white */
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* 4. 内部元素样式 */
.card__header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem; /* gap-3 */
  position: relative;
  color: #fff;
}

.card__label {
  font-size: 1rem; /* text-base */
}

.card__content {
  display: flex;
  flex-direction: column;
  position: relative;
  color: #fff;
}

.card__title {
  font-weight: 400; /* font-normal */
  font-size: 1rem; /* text-base */
  margin: 0 0 0.25rem 0; /* m-0 mb-1 */
}

.card__description {
  font-size: 0.75rem; /* text-xs */
  line-height: 1.25rem; /* leading-5 */
  opacity: 0.9;
  margin: 0;
}

/* 5. 边框发光特效 (.card--border-glow) */
.card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px; /* 这里的 6px 对应原代码 padding */
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%
  );
  border-radius: inherit;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1;
  opacity: 0; /* 默认隐藏，hover 显示 */
}

.card--border-glow:hover::after {
  opacity: 1;
}

.card--border-glow:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.4),
    0 0 30px rgba(v-bind(glowColor), 0.2);
}

/* 6. 辅助类 */
.text-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
  --glow-color: v-bind(glowColor);
  --border-color: rgba(255, 255, 255, 0.1); /* 默认边框色 */
  --background-dark: #060010;
  --white: #fff;
}

@media (max-width: 599px) {
  .card-responsive {
    grid-template-columns: 1fr;
    width: 90%;
    margin: 0 auto;
    padding: 0.5rem;
  }
  .card {
    width: 100%;
    min-height: 180px;
  }
}
</style>