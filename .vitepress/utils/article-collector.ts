import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getOgpImagePath } from "../ogp-generator";

export interface ArticleData {
	title: string;
	link: string;
	date: string;
	description?: string;
	ogpImage?: string;
	filePath: string;
}

/**
 * Collect articles from specified directory
 */
export function collectArticles(
	baseDir: string,
	relativePath: string = "",
	basePath: string = "/",
): ArticleData[] {
	const articles: ArticleData[] = [];
	const targetDir = path.join(baseDir, relativePath);

	if (!fs.existsSync(targetDir)) {
		return articles;
	}

	const entries = fs.readdirSync(targetDir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(targetDir, entry.name);
		const relativeFilePath = relativePath
			? path.join(relativePath, entry.name)
			: entry.name;

		if (entry.isDirectory()) {
			// Recursively collect from subdirectories
			articles.push(...collectArticles(baseDir, relativeFilePath, basePath));
		} else if (
			entry.isFile() &&
			entry.name.endsWith(".md") &&
			entry.name !== "index.md"
		) {
			try {
				const content = fs.readFileSync(fullPath, "utf-8");
				const { data: frontmatter, content: markdownContent } = matter(content);

				// Extract title from frontmatter or first h1
				let title = frontmatter.title;
				if (!title) {
					const titleMatch = markdownContent.match(/^#\s+(.+)$/m);
					title = titleMatch
						? titleMatch[1].trim()
						: path.basename(entry.name, ".md");
				}

				// Generate link (remove .md extension and add base path)
				const link = `${basePath}${relativeFilePath.replace(/\.md$/, "").replace(/\\/g, "/")}`;

				// Extract date from frontmatter or filename
				let date = frontmatter.date;
				if (!date) {
					// Try to extract date from filename (YYYY-MM-DD format)
					const dateMatch = entry.name.match(/(\d{4}-\d{2}-\d{2})/);
					if (dateMatch) {
						date = dateMatch[1];
					} else {
						// Fallback to file modification time
						const stats = fs.statSync(fullPath);
						date = stats.mtime.toISOString().split("T")[0];
					}
				}

				// Extract description from frontmatter or content
				let description = frontmatter.description;
				if (!description) {
					description = extractDescription(markdownContent);
				}

				// Generate OGP image path if available
				let ogpImage: string | undefined;
				if (frontmatter.ogpImage) {
					ogpImage = frontmatter.ogpImage;
				} else if (frontmatter.head) {
					// Check for og:image in head meta tags
					const ogImageMeta = frontmatter.head.find(
						(meta: any[]) => meta[1]?.property === "og:image",
					);
					if (ogImageMeta && ogImageMeta[1]?.content) {
						ogpImage = ogImageMeta[1].content;
					}
				} else {
					// Try to find generated OGP image using the exact same logic as ogp-generator
					const ogpPath = getOgpImagePath(relativeFilePath, content);
					const hash = path.basename(ogpPath, ".png");

					const distOgpPath = path.join(
						process.cwd(),
						".vitepress",
						"dist",
						"ogp",
						`${hash}.png`,
					);
					const cacheOgpPath = path.join(
						process.cwd(),
						".vitepress",
						"cache",
						"ogp",
						`${hash}.png`,
					);

					if (fs.existsSync(distOgpPath)) {
						// Use dist path for production
						const ogpRelativePath = `${basePath}ogp/${hash}.png`;
						ogpImage = ogpRelativePath;
					} else if (fs.existsSync(cacheOgpPath)) {
						// Use cache path and convert to dist path for production
						const ogpRelativePath = `${basePath}ogp/${hash}.png`;
						ogpImage = ogpRelativePath;
					} else {
						// Fallback to default logo
						ogpImage = `${basePath}logo.png`;
					}
				}

				articles.push({
					title,
					link,
					date:
						typeof date === "string" ? date : date.toISOString().split("T")[0],
					description,
					ogpImage,
					filePath: relativeFilePath,
				});
			} catch (error) {
				console.warn(`Failed to process article: ${fullPath}`, error);
			}
		}
	}

	return articles;
}

/**
 * Extract description from markdown content
 */
function extractDescription(content: string, maxLength: number = 120): string {
	// Remove frontmatter
	const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, "");

	// Remove markdown headers
	const withoutHeaders = withoutFrontmatter.replace(/^#+\s+.*/gm, "");

	// Remove HTML tags first
	const withoutHtml = withoutHeaders.replace(/<[^>]*>/g, "");

	// Remove markdown formatting
	const plainText = withoutHtml
		.replace(/\*\*(.*?)\*\*/g, "$1") // Bold
		.replace(/\*(.*?)\*/g, "$1") // Italic
		.replace(/`(.*?)`/g, "$1") // Code
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
		.trim();

	// Get first paragraph
	const firstParagraph = plainText.split("\n\n")[0].replace(/\n/g, " ").trim();

	// Limit to specified length
	if (firstParagraph.length > maxLength) {
		return firstParagraph.substring(0, maxLength) + "...";
	}

	return firstParagraph || "";
}

/**
 * Sort articles by date (newest first)
 */
export function sortArticlesByDate(articles: ArticleData[]): ArticleData[] {
	return articles.sort((a, b) => {
		const dateA = new Date(a.date).getTime();
		const dateB = new Date(b.date).getTime();
		return dateB - dateA;
	});
}
