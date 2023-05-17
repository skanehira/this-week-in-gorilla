import { defineConfig } from 'vitepress'
import { DefaultTheme } from 'vitepress/types/default-theme';
import fs from 'node:fs'

const mdPattern = /\.md$/;
function isMd(file: string) {
  return mdPattern.test(file);
}

function subItems(dir: string): DefaultTheme.SidebarItem[] {
  const entries = fs.readdirSync(dir).filter((file) => {
    const stat = fs.statSync(dir);
    return (stat.isFile() && isMd(file)) || stat.isDirectory()
  });

  const items: DefaultTheme.SidebarItem[] = [];
  for (const entry of entries) {
    if (entry == 'index.md') {
      continue
    }
    const path = `${dir}/${entry}`;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      const item: DefaultTheme.SidebarItem = { text: entry, link: `/${path}/index.md`, items: [] }
      item.items = subItems(path)
      items.push(item)
    } else {
      const item = { text: entry.replace(mdPattern, ''), link: `/${path}` }
      items.push(item)
    }
  }

  return items
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/this-week-in-gorilla/',
  title: "This Week in Gorilla",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/docs/2023/index' },
    ],

    sidebar: [
      {
        text: 'docs',
        items: subItems('docs')
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
