// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages はリポジトリ名の下に置かれるので base が要る。
// https://cyross.github.io/2686V_2686VFX/
// サイドバーの表示・非表示。
//
// 描き直す前に当てないと、閉じている人の画面で一瞬サイドバーが見えてしまう
// ので、head へ入れて先に動かす。押したときの動きも同じところに置き、
// document へ 1 つだけ聞き手を付ける。ボタンはページごとに作り直されるため。
const sidebarToggleScript = `
(function () {
	var root = document.documentElement;

	function mark(hidden) {
		var list = document.querySelectorAll('.sidebar-toggle');

		for (var i = 0; i < list.length; i++) {
			list[i].setAttribute('aria-pressed', String(hidden));
		}
	}

	try {
		if (localStorage.getItem('sidebar') === 'hidden') root.dataset.sidebar = 'hidden';
	} catch (e) {}

	document.addEventListener('click', function (ev) {
		var button = ev.target.closest && ev.target.closest('.sidebar-toggle');

		if (!button) return;

		var hidden = root.dataset.sidebar !== 'hidden';

		if (hidden) {
			root.dataset.sidebar = 'hidden';
		} else {
			delete root.dataset.sidebar;
		}

		mark(hidden);

		try {
			localStorage.setItem('sidebar', hidden ? 'hidden' : 'shown');
		} catch (e) {}
	});

	document.addEventListener('DOMContentLoaded', function () {
		mark(root.dataset.sidebar === 'hidden');
	});
})();
`;

export default defineConfig({
	site: 'https://cyross.github.io',
	base: '/2686V-v4-Tutrial',
	integrations: [
		starlight({
			title: {
				ja: '2686Vファミリー チュートリアル',
				en: '2686V Manual',
			},
			// description は言語別に分けられないので、各ページ側で書き分ける
			description: 'レトロ音源・チップチューン VST「2686V」シリーズの使い方',
			// 日本語を既定にして、URL に言語を付けない。英語は /en/ の下。
			defaultLocale: 'root',
			locales: {
				root: { label: '日本語', lang: 'ja' },
				en: { label: 'English', lang: 'en' },
			},
			// サイドバーの開き具合。描き直す前に当てないと、閉じている人の画面で
			// 一瞬サイドバーが見えてしまう。
			head: [
				{
					tag: 'script',
					content: sidebarToggleScript,
				},
			],
			customCss: [
				'./src/styles/theme.css',
				'./src/styles/layout.css',
				'./src/styles/sidebar-toggle.css',
			],
			// ヘッダーの右端へ、サイドバーの表示切り替えを足す
			components: {
				SocialIcons: './src/components/SocialIcons.astro',
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/cyross/2686V_2686VFX/',
				},
			],
			// 章立ては、書けたページから順に足していく。
			// 実在しないページを並べると、その場で失敗して気づける。
			sidebar: [
				{
					label: 'チュートリアル',
					translations: { en: 'Tutorials' },
					// 書けたものから足していくので、フォルダの中身をそのまま出す
					items: [{ autogenerate: { directory: 'tutorials' } }],
				},
			],
		}),
	],
});
