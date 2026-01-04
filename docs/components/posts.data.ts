import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/**/*.md', {
    excerpt: true,
    transform(raw) {
        return raw
            .filter(({ url }) => url !== '/posts/')
            .map(post => {
                const parts = post.url.split('/')
                const category = parts.length > 3 ? parts[parts.length - 2] : 'General'
                return {
                    ...post,
                    category
                }
            })
            .sort((a, b) => {
                return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
            })
    }
})
