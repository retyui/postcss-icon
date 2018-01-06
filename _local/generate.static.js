const { promisify } = require("util");
const { resolve } = require("path");

const readFileAsync = promisify(require("fs").readFile);
const writeFileAsync = promisify(require("fs").writeFile);

const postcss = require("postcss");


// create css/html for font icon set
createCssHtml();

const githubStaticBase = resolve(
	__dirname,
	"../../retyui.github.io/postcss-icon/"
);
const getFilesFromStatic = file => resolve(githubStaticBase, file);

(async () => {
	const testSource = [
		{ from: getFilesFromStatic("icono/src.css"), to: getFilesFromStatic("icono/plugin.css")},
		{ from: getFilesFromStatic("joshnh/src.css"), to: getFilesFromStatic("joshnh/plugin.css")},
		{ from: getFilesFromStatic("cssicon/src.css"), to: getFilesFromStatic("cssicon/plugin.css")},
		{ from: getFilesFromStatic("rosa/src.css"), to: getFilesFromStatic("rosa/plugin.css")},
		{ from: getFilesFromStatic("stiffi/src.css"), to: getFilesFromStatic("stiffi/plugin.css")},
		{ from: getFilesFromStatic("airpwn/src.css"), to: getFilesFromStatic("airpwn/plugin.css")},
		{ from: getFilesFromStatic("material-design/src.css"), to: getFilesFromStatic("material-design/plugin.css")},
		{ from: getFilesFromStatic("font-awesome-v4/src.css"), to: getFilesFromStatic("font-awesome-v4/plugin.css")}
	];

	await Promise.all(
		testSource.map(async ({ from, to }) => {
			try {
				const { messages, css } = await postcss(
					require("../lib/index.js")({
						custom0: {prefix: "icono-", ...require("../../postcss-icon.icono")},
						custom1: {prefix: "joshua-", ...require("../../postcss-icon.joshnh")},
						custom2: {prefix: "cssicon-", ...require("../../postcss-icon.cssicon")},
						custom3: {prefix: "rosa-", ...require("../../postcss-icon.rosa")},
						custom4: {prefix: "stiffi-", ...require("../../postcss-icon.stiffi")},
						custom5: {prefix: "airpwn-", ...require("../../postcss-icon.airpwn")},
						md: {prefix: "md-", ...require("../../postcss-icon.material-design"), output: { inline: false }},
						fa: {prefix: "fa-", ...require("../../postcss-icon.font-awesome-v4"), output: { inline: false }}
					}),
					require("postcss-merge-rules")
				).process(await readFileAsync(resolve(__dirname, from)), {
					from,
					to
				});

				await writeFileAsync(resolve(__dirname, to), css);
				messages
					.filter(i => i.type === "warning")
					.map(e => console.log(e.toString()));
			} catch (e) {
				console.error(e, e.stack);
			}
		})
	);
})();

async function createCssHtml() {
	await [
		...new Map([
			["font-awesome-v4", { prefix: "fa-" }],
			["material-design", { prefix: "md-" }]
		])
	].map(async ([name, opt]) => {
		const keymap = [...require(`../../postcss-icon.${name}`).keymap];

		const a = resolve(
			__dirname,
			`../../retyui.github.io/postcss-icon/${name}/index.html`
		);

		const preHtml = (await readFileAsync(a)).toString("utf8");
		await writeFileAsync(
			a,
			preHtml.substr(0, preHtml.indexOf("<body>") + 6) +
				keymap
					.map(
						([a, b]) => `
	<span class="c-icon c-icon--${a}">
		<span class="c-icon__name">${a}</span>
		<span class="c-icon__code"><code>&amp;#x${b
			.toString(16)
			.toUpperCase()};</code></span>
	</span>`
					)
					.join("")
		);
		await writeFileAsync(
			resolve(
				__dirname,
				`../../retyui.github.io/postcss-icon/${name}/src.css`
			),
			keymap
				.map(
					([name]) => `
.c-icon--${name}::before{ @icon ${opt.prefix}${name}; }`
				)
				.join("")
		);
	});
}
