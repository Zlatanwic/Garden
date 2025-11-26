import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Personal Space",
  description: "A personal blog and portfolio built with VitePress",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/posts' },
      { text: 'About', link: '/about' }
    ],

    sidebar: {
      '/posts/': [],
      '/': [
        {
          text: 'Recent Posts',
          items: [
            { text: 'Hello World', link: '/posts/hello-world' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  markdown: {
    theme: 'one-dark-pro'
  }
})
