import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcExclude : [" ./Personal/**/*"],
  base: "/portifolio/blog/",
  outDir : "./../build/blog",
  title: "Leo blog",
  description: "A VitePress Site",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'linkedin', link: "https://www.linkedin.com/in/leonardo-leiman/"},
      { icon: 'github', link: 'https://github.com/Lmedeiros-leiman' },
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      
    ]
  }
})
