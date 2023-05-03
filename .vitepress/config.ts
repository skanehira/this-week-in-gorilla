import { defineConfig } from 'vitepress'
import fs from 'node:fs'

const mdPattern = /\.md$/;
function isMd(file: string) {
  return mdPattern.test(file);
}

function subItems(dir: string) {
  return fs.readdirSync(dir).filter((file) => {
    return isMd(file)
  }).map((file) => {
    return { text: file.replace(mdPattern, ''), link: `/${dir}/${file}` }
  })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/this-week-in-gorilla/',
  title: "This Week in Gorilla",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/' }
    ],

    sidebar: [
      {
        text: '2023',
        items: subItems('docs/2023')
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/skanehira/this-week-in-gorilla' },
      { icon: 'twitter', link: 'https://twitter.com/gorilla0513' }
    ],

    search: {
      provider: 'local'
    }
  }
})
