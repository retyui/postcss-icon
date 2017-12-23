const postcss = require("postcss");
const { writeFileSync, readFileSync } = require("fs");
const { resolve } = require("path");

(async () => {
	const testSource = [
		{ from: "./icono/src.css", to: "./icono/plugin.css" },
		{ from: "./joshnh/src.css", to: "./joshnh/plugin.css" },
		{ from: "./cssicon/src.css", to: "./cssicon/plugin.css" }
	];
	await Promise.all(
		testSource.map(async ({ from, to }) => {
			try {
				const { messages, css } = await postcss(
					require("../lib/index.js")(
						{
							prefix: "icono-",
							data: require("postcss-icon.icono")
						},
						{
							prefix: "joshua-",
							data: require("postcss-icon.joshnh")
						},
						{
							prefix: "cssicon-",
							data: require("postcss-icon.cssicon")
						}
					)
				).process(readFileSync(resolve(__dirname, from)), { from, to });

				writeFileSync(resolve(__dirname, to), css);
				messages
					.filter(i => i.type === "warning")
					.map(e => console.log(e.toString()));
			} catch (e) {
				console.error(e);
			}
		})
	);
})();
