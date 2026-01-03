import { h } from "vue";
import DefaultTheme from "vitepress/theme";
import ArticleCard from "../components/ArticleCard.vue";
import ArticleList from "../components/ArticleList.vue";
import "./custom.css";

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			// https://vitepress.dev/guide/extending-default-theme#layout-slots
		});
	},
	enhanceApp({ app, router, siteData }) {
		// Register components globally
		app.component("ArticleCard", ArticleCard);
		app.component("ArticleList", ArticleList);
	},
};
