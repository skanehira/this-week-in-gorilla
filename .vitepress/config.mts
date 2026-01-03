import { default as footnote } from 'markdown-it-footnote';
import { defineConfig, SiteConfig } from "vitepress";
import { DefaultTheme } from "vitepress/types/default-theme";
import fs from "node:fs";
import { generateOgpImage, getOgpImagePath, saveOgpImage } from './ogp-generator';
import path from "node:path";
import matter from 'gray-matter';
import { createHash } from 'node:crypto';

const mdPattern = /\.md$/;
function isMd(file: string) {
  return mdPattern.test(file);
}

function subItems(dir: string): DefaultTheme.SidebarItem[] {
  const entries = fs.readdirSync(dir).filter((file) => {
    const stat = fs.statSync(dir);
    return (stat.isFile() && isMd(file)) || stat.isDirectory();
  });

  const items: DefaultTheme.SidebarItem[] = [];
  for (const entry of entries) {
    if (entry == "index.md") {
      continue;
    }
    const path = `${dir}/${entry}`;
    const stat = fs.statSync(path);
    if (stat.isDirectory()) {
      const item: DefaultTheme.SidebarItem = {
        text: entry,
        link: `/${path}/index.md`,
        items: [],
      };
      item.items = subItems(path);
      items.push(item);
    } else {
      const item = { text: entry.replace(mdPattern, ""), link: `/${path}` };
      items.push(item);
    }
  }

  return items;
}

// フォントを事前にダウンロード
async function ensureFont() {
  const fontPath = path.join(process.cwd(), ".vitepress", "fonts", "NotoSansJP-Bold.ttf");
  if (!fs.existsSync(fontPath)) {
    console.log("Downloading Noto Sans JP font...");
    const response = await fetch(
      "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf",
    );
    const fontData = Buffer.from(await response.arrayBuffer());
    fs.mkdirSync(path.dirname(fontPath), { recursive: true });
    fs.writeFileSync(fontPath, fontData as any);
  }
}

// OGP画像生成の共通処理
async function generateAllOgpImages() {
  const filesToProcess: string[] = [];

  // すべてのMarkdownファイルを収集
  const collectFiles = (dir: string, basePath: string = '') => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        collectFiles(fullPath, relativePath);
      } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.includes('index.md')) {
        filesToProcess.push(relativePath);
      }
    }
  };

  collectFiles(process.cwd());

  // すべてのMarkdownファイルを処理
  const processFile = async (filePath: string) => {
    if (!filePath.endsWith('.md') || filePath.includes('index.md')) {
      return;
    }

    try {
      // 相対パスを使用するため、絶対パスに変換してファイルを読み込む
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      const content = fs.readFileSync(absolutePath, 'utf-8');

      // OGP画像のパスを取得（内容ベースのハッシュを使用）
      const ogpPath = getOgpImagePath(filePath, content);

      // 既に画像が存在する場合、ハッシュ値を確認
      if (fs.existsSync(ogpPath)) {
        // ファイル名からハッシュ値を抽出
        const filename = path.basename(ogpPath);
        const existingHash = filename.replace('.png', '');

        // 現在のコンテンツのハッシュ値を計算（getOgpImagePathと同じ方式）
        const hashInput = `${filePath}:${content}`;
        const currentHash = createHash('md5').update(hashInput).digest('hex');

        // ハッシュ値が同じ場合はスキップ
        if (existingHash === currentHash) {
          return;
        }

        // ハッシュ値が異なる場合は既存ファイルを削除して再生成
        console.log(`Content changed, regenerating OGP for ${filePath}`);
        fs.unlinkSync(ogpPath);
      }
      const { data } = matter(content);

      // タイトルを取得（frontmatterにない場合は最初の#ヘッダーから取得）
      let title = data.title || data.head?.find((meta: any[]) =>
        meta[1]?.property === 'og:title'
      )?.[1]?.content;

      // タイトルがfrontmatterにない場合、マークダウンの最初の#ヘッダーを探す
      if (!title) {
        const firstHeaderMatch = content.match(/^#\s+(.+)$/m);
        if (firstHeaderMatch) {
          title = firstHeaderMatch[1].trim();
        }
      }

      // それでもタイトルが見つからない場合はスキップ
      if (!title) {
        console.error(`No title found for ${filePath}`);
        return;
      }

      // すでに手動でOGP画像が設定されている場合はスキップ
      const hasManualOgp = data.head?.find((meta: any[]) =>
        meta[1]?.property === 'og:image'
      );
      if (hasManualOgp) {
        return;
      }

      console.log(`Generating OGP for ${filePath}`);
      // OGP画像を生成
      const ogpBuffer = await generateOgpImage({
        title,
        bookImageUrl: data.bookImage,
      });
      console.log(`Successfully: ${filePath}`);

      // 画像を保存
      await saveOgpImage(ogpBuffer, ogpPath);
    } catch (error) {
      console.error(`Failed to generate OGP for ${filePath}:`, error);
    }
  };

  await Promise.all(filesToProcess.map(processFile));
}

// 初期化時にフォントをダウンロード
await ensureFont();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/this-week-in-gorilla/",
  title: "This Week in Gorilla",
  description: "This Week in Gorilla",
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/this-week-in-gorilla/logo.png' }],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { property: "og:site_name", content: "This Week in Gorilla" }],
    ["meta", { property: "og:title", content: "This Week in Gorilla" }],
    ["meta", { property: "og:image", content: "https://i.gyazo.com/6331356f2874b0447a987b9bcfe4e033.png" }],
  ],
  lastUpdated: true,
  themeConfig: {
    lastUpdatedText: "最終更新日",
    logo: "/logo.png",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Notes", link: "/notes/2023/index" },
      { text: "Articles", link: "/articles/index" },
      { text: "Books", link: "/books/index" },
      { text: "Camps", link: "/camps/index" },
    ],

    sidebar: [
      {
        text: "notes",
        items: subItems("notes"),
        collapsed: true,
      },
      {
        text: "articles",
        items: subItems("articles"),
        collapsed: true,
      },
      {
        text: "books",
        link: "/books/index.md",
        items: subItems("books"),
        collapsed: true,
      },
      {
        text: "camps",
        link: "/camps/index.md",
        items: subItems("camps"),
        collapsed: true,
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/skanehira/this-week-in-gorilla",
      },
      { icon: "twitter", link: "https://twitter.com/gorilla0513" },
    ],

    search: {
      provider: "local",
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023 skanehira'
    },

    editLink: {
      pattern: 'https://github.com/skanehira/this-week-in-gorilla/edit/main/:path'
    },
  },
  markdown: {
    config: (md) => {
      md.use(footnote)
    }
  },


  // ビルド後にキャッシュをコピー
  async buildEnd(config: SiteConfig) {
    // OGP画像を生成
    await generateAllOgpImages();

    // キャッシュされたOGP画像をdistディレクトリにコピー
    const cacheDir = '.vitepress/cache/ogp';
    const distDir = '.vitepress/dist/ogp';

    if (fs.existsSync(cacheDir)) {
      // distディレクトリを作成
      fs.mkdirSync(distDir, { recursive: true });

      // キャッシュからdistにコピー
      const files = fs.readdirSync(cacheDir);
      for (const file of files) {
        if (file.endsWith('.png')) {
          fs.copyFileSync(
            path.join(cacheDir, file),
            path.join(distDir, file)
          );
        }
      }
    }
  },

  // transformHeadフックで動的にOGPメタタグを追加
  transformHead({ pageData }) {
    const { filePath, frontmatter } = pageData;

    if (!filePath || filePath.includes('index.md')) {
      return [];
    }

    // すでに手動でOGP画像が設定されている場合はスキップ
    const hasManualOgp = frontmatter.head?.find((meta: any[]) =>
      meta[1]?.property === 'og:image'
    );
    if (hasManualOgp) {
      return [];
    }

    try {
      // ファイルの内容を読み込む
      const absolutePath = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
      const content = fs.readFileSync(absolutePath, 'utf-8');
      const { data } = matter(content);

      // タイトルを取得（frontmatterにない場合は最初の#ヘッダーから取得）
      let title = data.title || frontmatter.title;

      // タイトルがfrontmatterにない場合、マークダウンの最初の#ヘッダーを探す
      if (!title) {
        const firstHeaderMatch = content.match(/^#\s+(.+)$/m);
        if (firstHeaderMatch) {
          title = firstHeaderMatch[1].trim();
        }
      }

      // それでもタイトルが見つからない場合はスキップ
      if (!title) {
        return [];
      }

      // OGP画像のパスを取得（内容ベースのハッシュを使用）
      const ogpPath = getOgpImagePath(filePath, content);

      // cacheパスをdistパスに変換
      const distPath = ogpPath.replace('.vitepress/cache/', '.vitepress/dist/');
      const ogpRelativePath = `/this-week-in-gorilla/${distPath.replace('.vitepress/dist/', '')}`;

      // ドメインを動的に検出
      const domain = detectDomain();
      const ogpAbsoluteUrl = `${domain}${ogpRelativePath}`;

      return [
        ['meta', { property: 'og:image', content: ogpAbsoluteUrl }],
      ];
    } catch (error) {
      console.error(`Failed to generate OGP for ${filePath}:`, error);
      return [];
    }
  }
});


// ドメインを動的に検出する関数
function detectDomain(): string {
  // 1. 環境変数から取得（優先度最高）
  if (process.env.VITE_OGP_DOMAIN) {
    return process.env.VITE_OGP_DOMAIN;
  }

  // 2. CNAMEファイルから読み取り（GitHub Pages カスタムドメイン）
  try {
    const cnamePath = path.join(process.cwd(), 'CNAME');
    if (fs.existsSync(cnamePath)) {
      const domain = fs.readFileSync(cnamePath, 'utf-8').trim();
      if (domain) {
        return `https://${domain}`;
      }
    }
  } catch (e) {
    // CNAMEファイルが読めない場合は無視
  }

  // 3. GitHub Actions環境変数
  if (process.env.GITHUB_REPOSITORY) {
    const [owner, _] = process.env.GITHUB_REPOSITORY.split('/');
    // GitHub Pagesのカスタムドメインが設定されていない場合のデフォルト
    return `https://${owner}.github.io`;
  }

  // 4. デフォルト値
  return 'https://skanehira.github.io';
}

