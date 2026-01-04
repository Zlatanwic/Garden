<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as posts } from './posts.data.ts'
import ElectricBorder from './ElectricBorder.vue'
import { withBase } from 'vitepress'

const selectedCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(posts.map(p => p.category || 'General'))
  return ['All', ...Array.from(cats)].sort()
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'All') {
    return posts
  }
  return posts.filter(p => (p.category || 'General') === selectedCategory.value)
})

function formatDate(date: any) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="post-square">
    <h1 class="page-title">Blog Posts</h1>
    <div class="category-filter">
      <button
        v-for="category in categories"
        :key="category"
        class="filter-btn"
        :class="{ active: selectedCategory === category }"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="posts-grid">
      <a
        v-for="post in filteredPosts"
        :key="post.url"
        :href="withBase(post.url)"
        class="post-card-link"
      >
        <ElectricBorder
          :color="'#3b82f6'"
          :speed="1"
          :chaos="0.3"
          :thickness="2"
          :style="{ borderRadius: '12px', height: '100%' }"
        >
          <div class="post-card">
            <h2 class="post-title">{{ post.frontmatter.title }}</h2>
            <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
            </div>
          </div>
        </ElectricBorder>
      </a>
    </div>
  </div>
</template>

<style scoped>
.post-square {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  color: var(--vp-c-text-1);
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
}

.filter-btn:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

.filter-btn.active {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card-link {
  text-decoration: none !important;
  display: block;
  height: 100%;
}

.post-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.5rem;
  height: 100%;
  min-height: 280px; /* Increased height */
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-2px);
}

.post-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}

.post-excerpt {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin-bottom: auto; /* Push meta to bottom */
  line-height: 1.6;
  flex-grow: 1;
}

.post-meta {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.post-date {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
}
</style>
