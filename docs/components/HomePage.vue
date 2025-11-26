<script setup lang="ts">
import { onMounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { withBase } from 'vitepress'
import SplitText from './SplitText.vue'
import GlitchText from './GlitchText.vue'
import LogoLoop from './LogoLoop.vue'
import MagicBento from './MagicBento.vue'
import ScrambleText from './ScrambleText.vue'
import RippleGrid from './RippleGrid.vue'

// --- Data ---
const techLogos = [
    { node: '<span style="font-size: 1.5rem; font-weight: bold;">Rust</span>', title: "Rust", href: "https://rust-lang.org" },
    { node: '<span style="font-size: 1.5rem; font-weight: bold;">C</span>', title: "C", href: "https://rust-lang.org" },
    { node: '<span style="font-size: 1.5rem; font-weight: bold;">C++</span>', title: "C++", href: "https://rust-lang.org" },
    { node: '<span style="font-size: 1.5rem; font-weight: bold;">Vue.js</span>', title: "Vue.js", href: "https://vuejs.org" },
  { node: '<span style="font-size: 1.5rem; font-weight: bold;">Vite</span>', title: "Vite", href: "https://vitejs.dev" },
  { node: '<span style="font-size: 1.5rem; font-weight: bold;">TypeScript</span>', title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: '<span style="font-size: 1.5rem; font-weight: bold;">GSAP</span>', title: "GSAP", href: "https://greensock.com" },
  { node: '<span style="font-size: 1.5rem; font-weight: bold;">Node.js</span>', title: "Node.js", href: "https://nodejs.org" },
  { node: '<span style="font-size: 1.5rem; font-weight: bold;">Python</span>', title: "Python", href: "https://python.org" },
]

const hobbies = [
  { 
    title: 'Coding', 
    icon: '💻', 
    description: 'rust build everything and unix environment advanced programming', 
    label: 'Passion',
    colSpan: 2,
    rowSpan: 2,
    color: '#1e1e2e',
    className: 'bento-large'
  },
  { 
    title: 'Music', 
    icon: '🎵', 
    description: 'British rock and hard rock', 
    label: 'Relaxation',
    colSpan: 2,
    rowSpan: 1,
    color: '#181825',
    className: 'bento-wide'
  },
  { 
    title: 'Reading', 
    icon: '📚', 
    description: 'Sci-fi & Philosophy.', 
    label: 'Learning',
    colSpan: 1,
    rowSpan: 1,
    color: '#313244',
    className: 'bento-box'
  },
  { 
    title: 'Gaming', 
    icon: '🎮', 
    description: 'Rockstar games,CRPGs,ARPGs', 
    label: 'Fun',
    colSpan: 1,
    rowSpan: 1,
    color: '#45475a',
    className: 'bento-box'
  },
]

// --- Animation ---
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)

  // 1. Hero 进场动画
  const tl = gsap.timeline()
  tl.from('.hero-overline', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
})
</script>

<template>
  <div class="home-page-wrapper">
    <!-- Background Layer -->
    <div class="ripple-background">
      <RippleGrid
      :enable-rainbow="false"
      grid-color="rgba(59,130,246,0.15)"
      :ripple-intensity="0.05"
      :grid-size="10"
      :grid-thickness="15"
      :mouse-interaction="true"
      :mouse-interaction-radius="1.2"
      :opacity="0.8"
      />
    </div>

    <div class="noise-overlay"></div>

    <section class="section hero-section">
      <div class="container hero-container">
        <span class="hero-overline">HELLO WORLD</span>
        
        <h1 class="hero-title">
          <SplitText text="Li Kuo" />
        </h1>
        
        <p class="hero-subtitle">System Programming & AI Tech</p>
        <p class="hero-desc">Dreaming about find a job in deeplearning system area.</p>
        
        <div class="hero-ctas">
          <a :href="withBase('/posts/')" class="btn btn-primary">View Blogs</a>
          <a href="https://github.com/Zlatanwic" target="_blank" class="btn btn-ghost">GitHub</a>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <span>Scroll</span>
        <div class="line"></div>
      </div>
    </section>

    <section class="section intro-section">
      <div class="container intro-grid">
        <div class="intro-top">
          <div class="sticky-wrapper">
            <GlitchText
              children="Who Am I?"
              :speed="0.5"
              :enable-shadows="true"
              :enable-on-hover="false"
            />
          </div>
        </div>
        
        <div class="intro-bottom intro-content">
            <ScrambleText
              :className="'max-w-[800px] font-mono font-medium text-[clamp(14px,4vw,32px)] text-white mx-auto'"
              :radius="100"
              :duration="1.2"
              :speed="0.5"
              scrambleChars=".:"
            >
            <p>
              I am a System Programming and AI Research enthusiast. 
              My current focus is on rCore, rewriting C projects in Rust, and Multi-focus Image Fusion.
            </p>
            <p>
              I also have experience in blockchain and web development.
               My ultimate goal is to specialize in Deep Learning Systems (MLSys).
            </p>
            <p>
              I’m always eager to learn and improve—suggestions and mentorship are highly appreciated.
               Feel free to connect!
            </p>
          </ScrambleText>
        </div>
      </div>
    </section>

    <section class="section tech-section">
      <div class="container">
        <p class="section-overline">MY ARSENAL</p>
        <h2 class="section-title">Tech Stack</h2>
        <h3>maybe you can talk with me about :</h3>
        <div class="logo-wrapper">
          <LogoLoop :logos="techLogos" :speed="80" />
        </div>
      </div>
    </section>

    <section class="section hobbies-section">
      <div class="container">
        <h2 class="section-title left-align">Beyond Coding</h2>
        <div class="bento-grid-wrapper">
          <MagicBento
            :cards="hobbies"
            :text-auto-hide="true"
            :enable-stars="true"
            :enable-spotlight="true"
            :enable-border-glow="true"
            :enable-tilt="true"
            :enable-magnetism="true"
            :click-effect="true"
            :spotlight-radius="300"
            :particle-count="12"
            glow-color="59, 130, 246"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* --- 0. 全局变量与基础设定 --- */
.home-page-wrapper {
  width: 100%;
  overflow-x: hidden;
  background-color: var(--vp-c-bg); /* 适配 VitePress 主题色 */
  color: var(--vp-c-text-1);
  position: relative;
}

/* 背景层 */
.ripple-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0; /* 最底层 */
  /* pointer-events: none; */ /* 暂时注释掉，看是否影响交互 */
}

/* 噪点叠加层 */
.noise-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 9999;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

.section {
  padding: 8rem 2rem;
  position: relative;
  z-index: 1; /* 确保内容在背景之上 */
  background: transparent; /* 背景透明 */
}

.container {
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
}

/* --- 1. Hero Section --- */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  overflow: hidden;
  padding-top: 0; /* 垂直居中 */
}

.hero-container {
  position: relative;
  z-index: 1;
}

.hero-overline {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: var(--vp-c-brand);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
}

.hero-title {
  /* Clamp 实现响应式大字 */
  font-size: clamp(3.5rem, 9vw, 7.5rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.04em;
  color: var(--vp-c-text-1);
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 2rem);
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.hero-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  max-width: 550px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.hero-ctas {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

/* 按钮样式 */
.btn {
  padding: 0.8rem 2.2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.btn-primary {
  background: var(--vp-c-brand);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--vp-c-border);
  color: var(--vp-c-text-1);
}
.btn-ghost:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

/* 滚动指示器 */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.6;
}
.scroll-indicator span {
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.scroll-indicator .line {
  width: 1px; height: 40px;
  background: var(--vp-c-text-3);
}

/* --- 2. Intro Section --- */
.intro-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 4rem 0;
}

.intro-top {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
}

.sticky-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.intro-content {
  width: 100%;
  max-width: 800px;
  text-align: center;
  padding: 0 1rem;
}

.intro-content p {
  font-size: 1.25rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-2);
}

.highlight {
  color: var(--vp-c-text-1);
  font-weight: 600;
  position: relative;
  display: inline-block;
}
.highlight::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 0; width: 100%; height: 8px;
  background: var(--vp-c-brand-dimm, rgba(59,130,246,0.15));
  z-index: -1;
  transform: rotate(-1deg);
}

/* --- 3. Tech Stack & Hobbies --- */
.section-overline {
  text-align: center;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}
.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  text-align: center;
  color: var(--vp-c-text-1);
}
.section-title.left-align { text-align: left; }

.logo-wrapper {
  margin-top: 2rem;
  /* 左右边缘渐变遮罩 */
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.bento-grid-wrapper {
  width: 100%;
}

@media (max-width: 768px) {
  .hero-title { font-size: 3.5rem; }
  .intro-grid {
    gap: 2rem;
  }
}
</style>