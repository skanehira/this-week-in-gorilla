import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

interface OgpOptions {
  title: string;
  bookImageUrl?: string;
}

async function loadFont() {
  const fontPath = path.join(
    process.cwd(),
    ".vitepress",
    "fonts",
    "NotoSansJP-Bold.ttf",
  );
  try {
    return await fs.readFile(fontPath);
  } catch {
    // フォントがない場合はダウンロード
    console.log("Downloading Noto Sans JP font...");
    const response = await fetch(
      "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf",
    );
    const fontData = Buffer.from(await response.arrayBuffer());
    await fs.mkdir(path.dirname(fontPath), { recursive: true });
    await fs.writeFile(fontPath, fontData as any);
    return fontData;
  }
}

async function loadLocalImageFile(): Promise<string> {
  const profilePath = path.join(process.cwd(), ".vitepress", "profile.jpg");
  const imageBuffer = await fs.readFile(profilePath);
  return `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
}

export async function generateOgpImage(options: OgpOptions): Promise<Buffer> {
  const { title, bookImageUrl } = options;

  const fontData = await loadFont();
  const profileImageUrl = await loadLocalImageFile();

  // OGP画像のテンプレート
  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#E6F2FF",
          padding: "40px",
          fontFamily: "Noto Sans JP",
        },
        children: [
          // 白いカード
          {
            type: "div",
            props: {
              style: {
                width: "100%",
                height: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                padding: "60px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              },
              children: [
                // タイトル部分
                {
                  type: "div",
                  props: {
                    style: {
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "40px",
                    },
                    children: [
                      // 本の画像（ある場合）
                      bookImageUrl
                        ? {
                          type: "img",
                          props: {
                            src: bookImageUrl,
                            style: {
                              width: "180px",
                              height: "250px",
                              objectFit: "cover",
                              borderRadius: "12px",
                              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            },
                          },
                        }
                        : null,
                      // タイトル
                      {
                        type: "h1",
                        props: {
                          style: {
                            flex: 1,
                            fontSize: bookImageUrl ? "48px" : "64px",
                            fontWeight: "bold",
                            lineHeight: 1.3,
                            color: "#1a1a1a",
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                          children: title,
                        },
                      },
                    ].filter(Boolean),
                  },
                },
                // 著者情報（下部）
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginTop: "40px",
                    },
                    children: [
                      // アバター
                      {
                        type: "img",
                        props: {
                          src: profileImageUrl,
                          style: {
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          },
                        },
                      },
                      // ユーザー名
                      {
                        type: "span",
                        props: {
                          style: {
                            fontSize: "20px",
                            color: "#4a5568",
                            fontWeight: "500",
                          },
                          children: "skanehira",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Noto Sans JP",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  // SVGをPNGに変換
  const resvg = new Resvg(svg, {
    background: "rgba(26, 26, 26, 0)", // 背景色を不透明に設定
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });
  const pngData = resvg.render();
  return pngData.asPng();
}

export function getOgpImagePath(filePath: string, content?: string): string {
  // ファイルパスと内容の両方を使ってハッシュを生成
  const hashInput = content ? `${filePath}:${content}` : filePath;
  const hash = createHash("md5").update(hashInput).digest("hex");
  return `.vitepress/cache/ogp/${hash}.png`;
}

export async function saveOgpImage(
  buffer: Buffer,
  outputPath: string,
): Promise<void> {
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(outputPath, buffer as any);
}
