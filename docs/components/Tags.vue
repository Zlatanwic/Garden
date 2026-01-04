<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './posts.data'

interface Post {
  title: string
  url: string
  frontmatter: {
    title?: string
    date?: string
    tags?: string[]
    description?: string
    [key: string]: any
  }
}

const selectedTag = ref('')

const tags = computed(() => {
  const counts: Record<string, number> = {}
  posts.forEach((post: Post) => {
    const postTags = post.frontmatter.tags || []
    postTags.forEach((tag: string) => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })
  return counts
})

const filteredPosts = computed(() => {
  if (!selectedTag.value) {
    return posts
  }
  return posts.filter((post: Post) => {
    const postTags = post.frontmatter.tags || []
    return postTags.includes(selectedTag.value)
  })
})

const toggleTag = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
}
</script>

<template>
  <div class="tags-page">
    <div class="tags-header">
      <h1 class="page-title">Explore Topics</h1>
      <p class="page-subtitle">Filter articles by selecting tags below</p>
    </div>
    
    <div class="tags-cloud">
      <button
        v-for="(count, tag) in tags"
        :key="tag"
        class="tag-pill"
        :class="{ active: selectedTag === tag }"
        @click="toggleTag(String(tag))"
      >
        <span class="tag-name">#{{ tag }}</span>
        <span class="tag-count">{{ count }}</span>
      </button>
    </div>

    <div class="posts-grid">
      <div v-if="filteredPosts.length === 0" class="empty-state">
        No posts found for this tag.
      </div>
      <transition-group name="list">
        <a 
          v-for="post in filteredPosts" 
          :key="post.url" 
          :href="withBase(post.url)"
          class="post-card"
        >
          <div class="card-content">
            <h2 class="post-title">{{ post.title }}</h2>
            <p v-if="post.frontmatter.excerpt || post.frontmatter.description" class="post-excerpt">
              {{ post.frontmatter.excerpt || post.frontmatter.description }}
            </p>
            <div class="card-footer">
              <span class="post-date">{{ post.frontmatter.date?.split('T')[0] }}</span>
              <div v-if="post.frontmatter.tags" class="post-tags-list">
                <span v-for="tag in post.frontmatter.tags" :key="tag" class="mini-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </a>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
.tags-page {
  padding: 2rem 0;
  max-width: 900px;
  margin: 0 auto;
}

.tags-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: -webkit-linear-gradient(315deg, var(--vp-c-brand) 25%, var(--vp-c-brand-light));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-bottom: 4rem;
}

.tag-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
}

.tag-pill:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.tag-pill.active {
  background-color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.tag-pill.active .tag-count {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.tag-name {
  font-weight: 500;
}

.tag-count {
  background-color: var(--vp-c-bg);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
  transition: all 0.2s;
}

/* Post Grid */
.posts-grid {
  display: grid;
  gap: 20px;
}

.post-card {
  display: block;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.post-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.post-excerpt {
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.post-date {
  font-size: 0.9rem;
  color: var(--vp-c-text-3);
}

.post-tags-list {
  display: flex;
  gap: 8px;
}

.mini-tag {
  font-size: 0.8rem;
  color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
  padding: 2px 8px;
  border-radius: 4px;
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
