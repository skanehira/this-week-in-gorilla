import { describe, it, expect } from "vitest";
import { generateOgpImage } from "./ogp-generator";
import fs from "node:fs";

describe("generateOgpImage", () => {
	it("should generate OGP image with book image from URL", async () => {
		const result = await generateOgpImage({
			title:
				"テスト記事のタイトテスト記事のタイトテスト記事のタイトテスト記事のタイトテスト記事のタイトテスト記事のタイトルルルルルルテスト記事のタイトル",
			bookImageUrl:
				"https://www.oreilly.co.jp/books/images/picture_large978-4-8144-0110-9.jpeg",
		});

		fs.writeFileSync("/tmp/test-ogp-image.png", new Uint8Array(result));

		// 画像が生成されたことを確認
		expect(result).toBeInstanceOf(Buffer);
		expect(result.length).toBeGreaterThan(0);
	});

	it("should generate OGP image without book image", async () => {
		const result = await generateOgpImage({
			title: "画像なしのテスト記事",
		});

		expect(result).toBeInstanceOf(Buffer);
		expect(result.length).toBeGreaterThan(0);
	});
});
