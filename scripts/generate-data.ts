import {
	collectArticles,
	sortArticlesByDate,
} from "../.vitepress/utils/article-collector";
import fs from "node:fs";
import path from "node:path";

async function generateCategoryData() {
	const categories = ["articles", "books", "camps"];
	const basePath = "/this-week-in-gorilla/";

	console.log("🚀 Generating category data...");

	for (const category of categories) {
		const categoryDir = path.join(process.cwd(), category);
		console.log(`📁 Processing category: ${category}`);

		if (!fs.existsSync(categoryDir)) {
			console.log(`⚠️  Directory ${categoryDir} does not exist, skipping`);
			continue;
		}

		try {
			// 記事データを収集（ベースパスを渡す）
			console.log(`📖 Collecting articles for ${category}...`);
			const articles = collectArticles(process.cwd(), category, basePath);
			console.log(`✅ Found ${articles.length} articles in ${category}`);

			const sortedArticles = sortArticlesByDate(articles);

			// JSONファイルを生成
			const dataPath = path.join(categoryDir, `${category}-data.json`);

			console.log(`💾 Writing data to ${dataPath}...`);
			fs.writeFileSync(dataPath, JSON.stringify(sortedArticles, null, 2));
			console.log(`🎉 Successfully generated data for ${category}`);
		} catch (error) {
			console.error(
				`❌ Failed to generate category data for ${category}:`,
				error,
			);
			process.exit(1);
		}
	}

	console.log("🏁 All category data generated successfully!");
}

generateCategoryData().catch((error) => {
	console.error("❌ Failed to generate data:", error);
	process.exit(1);
});
