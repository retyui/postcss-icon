import fs from "fs";
import { tmpdir } from "os";
import { promisify } from "util";
import regeneratorRuntime from "regenerator-runtime";

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const accessAsycn = promisify(fs.access);

import {
	parse as pathParse,
	relative as pathRelative,
	join as pathJoin
} from "path";

import { decl, parse as postcssParse } from "postcss/lib/postcss";

import { NAME } from "./config";
import { IconSet } from "./IconSet";
import { isFunction, isString, to16Number, generateHash } from "./helps.js";

export class FontIconSet extends IconSet {
	constructor({ name, keymap, ttf, css, prefix, output = {} }) {
		super();
		this._name = name;
		this._prefix = prefix;
		this._keymap = keymap;
		this._ttfBuffer = ttf;
		this._css = postcssParse(css);

		this._output = {
			fontFamily: "",
			inline: "woff2",
			formats: ["woff2", "woff"],
			resolve: false,
			extractAll: file => {
			},
			path: "",
			filename: "../fonts/[name][style-name][hash].[ext]",
			...output
		};
		this.narmolizationOutput();

		// fix for fonteditor-core toBase64 node
		if (global.btoa === undefined) {
			global.btoa = data => Buffer.from(data)
				.toString("base64");
		}
	}

	narmolizationOutput() {
		this._output.formats = this.narmolizationTypes(
			this._output.formats,
			"formats"
		);
		if (isString(this._output.inline)) {
			this._output.inline = this.narmolizationTypes(
				this._output.inline,
				"inline"
			);
		}
	}

	narmolizationTypes(types, propName) {
		if (Array.isArray(types)) {
			return types;
		}
		if (isString(types)) {
			return types.split(",")
				.map(e => e.trim());
		}

		throw new Error(
			`[${NAME}] The property (${propName}) value should be 'Array' or 'String', Icon set: ${
				this._name
				}`
		);
	}

	narmolizationIconName(name) {
		return this._prefix === "" ? name : name.replace(this._prefix, "");
	}

	nameToUnicode(iconName) {
		return this._keymap.get(this.narmolizationIconName(iconName));
	}

	hasIcon(name) {
		return this._keymap.has(this.narmolizationIconName(name));
	}

	async applyIcons({ root, result }) {
		const { from: fromPath, to: toPath } = result.opts;
		const baseNode = this._css.nodes[0].clone();
		const outputPath = this._output.path || pathParse(fromPath).dir;
		for (const nodesSet of this._linker.rootMap.values()) {
			for (const [iconName, nodes] of nodesSet) {
				this.processNodes({
					iconName,
					baseNode,
					nodes
				});
			}
		}

		const font = this.getCustomFont();
		const fontFamilyStr = await font.createFontFace({
			output: this._output,
			toPath,
			fromPath,
			outputPath
		});

		baseNode.append(
			decl({
				prop: "font-family",
				value: `'${font.fontFamily}'`
			})
		);

		root.prepend(fontFamilyStr, baseNode);
	}

	processNodes({ iconName, nodes, baseNode }) {
		const iconNum = this.nameToUnicode(iconName);
		const allSelectorsNodes = nodes
			.map(node => {
				if (isAfterOrBeforeSelector(node.selector)) {
					node.prepend(
						decl({
							prop: "content",
							value: `'\\${to16Number(iconNum)
								.toUpperCase()}'`
						})
					);
				}
				return node.selector;
			})
			.join(", ");
		baseNode.selector += `, ${allSelectorsNodes}`;
	}

	getSubSet() {
		const subset = new Set();
		for (const nodesSet of this._linker.rootMap.values()) {
			for (const iconName of nodesSet.keys()) {
				subset.add(this.nameToUnicode(iconName));
			}
		}
		return [...subset]; // to array
	}

	getCustomFont() {
		return new CustomFont(
			this._name.replace(`${NAME}.`, ""),
			this._ttfBuffer
		).sliceGlyf({
			type: "ttf",
			subset: this.getSubSet()
		});
	}
}

class CustomFont {
	constructor(name, buffer) {
		this._name = name;
		this._buffer = buffer;
		this._font = null;
		this._ff = "";
		this._hash = "";
	}

	sliceGlyf({ type, subset }) {
		this._hash = generateHash(subset.toString());

		const { Font } = require("fonteditor-core");

		this._font = Font.create(this._buffer, {
			type,
			subset
		});

		const defaultFontFamily = this._font.data.name.fontFamily;

		this._ff = `${defaultFontFamily} ${this.getHash()}`;
		this._font.data.name.fullName = this._ff;
		this._font.data.name.fontFamily = this._ff;
		return this;
	}

	get fontFamily() {
		return this._ff;
	}

	async createFontFace({ output, fromPath, toPath, outputPath }) {
		const { inline, formats, resolve } = output;
		const baseOpt = {
			resolve,
			fromPath,
			toPath,
			outputPath
		};
		let urlsStr = "";

		if (Array.isArray(inline)) {
			// mixed inline + file
			urlsStr = (await Promise.all([
				this._inlineFontSrc(inline),
				this._fileFontSrc({
					formats: formats.filter(e => !inline.includes(e)),
					...baseOpt
				})
			]))
				.filter(Boolean)
				.join(", ");
		} else if (inline === true) {
			// inline all formats
			urlsStr = await this._inlineFontSrc(formats);
		} else {
			// save all formats
			urlsStr = await this._fileFontSrc({ formats, ...baseOpt });
		}

		return this._createFontFace(urlsStr);
	}

	async _inlineFontSrc(formats) {
		return await Promise.all(formats.map(
			async (format) =>
				`url('${await this.fontToBase64(format)}') ${CustomFont.getFormat(
					format
				)}`));}
	async toBuffer(type) {

const cache = await this._getFromCache(type);if (cache) {return cache;
		}

		const buffer = this._toBuffer(type);

		await this._saveToCache(buffer, type);

		return buffer;
	}

	getTmpName(type) {
		return pathJoin(tmpdir(), `${NAME}-${this._name}-${this._hash}.${type}`);
	}

	async _saveToCache(buffer, type) {
		const cacheFile = this.getTmpName(type);
		try {
			await writeFileAsync(cacheFile, buffer); // save to chache folder
			return true;
		} catch (e) {
			return false;
		}
	}

	async _getFromCache(type) {
		const cacheFile = this.getTmpName(type);
		try {
			await accessAsycn(cacheFile, fs.constants.F_OK | fs.constants.R_OK);
			return await readFileAsync(cacheFile);
		} catch (e) {
			return false;
		}
	}

	_toBuffer(type) {
		if (type === "woff2") {
			const ttf2woff2 = require("ttf2woff2");
			return ttf2woff2(this._font.write({ type: "ttf" }));
		}

		return this._font.write({ type });
	}

	async fontToBase64(type) {
		if (type === "woff2") {
			return `data:application/font-woff2;charset=utf-8;base64,${(await this.toBuffer("woff2")).toString("base64")}`;
		} else if (type === "ttf") {
			return `data:font/truetype;charset=utf-8;base64,${(await this.toBuffer("ttf")).toString("base64")}`;
		} else if (type === "woff") {
			return this._font.toBase64({ type }); // support: woff ; bad support: ttf,eot,svg
		}

		throw Error(
			`[${NAME}] Inline font not supported for this formats : ${type}`
		);
	}

	getHash(len = 4) {
		return this._hash.substr(0, len);
	}

	async _fileFontSrc({
						   formats,
						   fromPath,
						   toPath,
						   outputPath = ".",
						   resolve
					   }) {
		return (await Promise.all(
			formats.map(async format => {
				let result;

				if (isFunction(resolve)) {
					result = this._resolve({
						fromPath,
						format
					});
				} else {
					const { name } = pathParse(fromPath);
					result = `${outputPath}/${name}-icons-${
						this._name
						}.${format}`;
				}

				let outPutFile = "";
				let relativeUrl = false;

				if (isString(result)) {
					outPutFile = result;
					relativeUrl = pathRelative(
						pathParse(toPath || fromPath).dir,
						outPutFile
					);
				} else {
					outPutFile = result.file;
					relativeUrl = result.url;
				}

				await writeFileAsync(outPutFile, await await this.toBuffer(format));

				return `url(${relativeUrl}) ${CustomFont.getFormat(format)}`;
			})
		)).join(", ");
	}

	_createFontFace(srcStr) {
		return `@font-face {\n\tfont-family: '${
			this.fontFamily
			}';\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: ${srcStr};\n}\n`;
	}

	static getFormat(type) {
		return `format('${getFormatName(type)}')`;
	}
}

function isAfterOrBeforeSelector(selector) {
	return selector.includes(":after") || selector.includes(":before");
}

const getFormatName = (formats => {
	return function getFormatName(format) {
		return formats[format] ? formats[format] : format;
	};
})({
	eot: "embedded-opentype",
	ttf: "truetype"
});
