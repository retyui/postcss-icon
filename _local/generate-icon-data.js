const { promisify } = require("util");
const { resolve } = require("path");
const { getContent } = require("./request.js");
const { iconSetsMap } = require("./config.js");
const writeFileAsync = promisify(require("fs").writeFile);

(async () => {
	await Promise.all(
		[...config.entries()].filter(e => e.type === 'font').map(async ([name, opt]) => {
			const {
				delimiter,
				fontName,
				mapName
			} = require(`../../${name}/config.js`);

			const [dataIcons, font] = await Promise.all(
				opt.getContent(delimiter)
			);
			const {site, hummanName} = opt;
			await Promise.all([
				writeFileAsync(
					// create Map {"name": "unicode str"}
					resolve(__dirname, `../../${name}/${mapName}`),
					`module.exports = new Map([\n${dataIcons
						.map(([name, unicode]) => `\t["${name}", 0x${unicode}]`)
						.join(",\n")}\n]);\n`
				),
				writeFileAsync(
					resolve(__dirname, `../../${name}/${fontName}`),
					font
				) // clone font file
			]);
		})
	);
})();
