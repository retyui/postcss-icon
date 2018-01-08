import fs from "fs";
import { tmpdir } from "os";
import mkdirp from "mkdirp-promise";
import { isFunction, isString, isNumber, generateHash } from "./helps.js";
import { NAME } from "./config";
import {
	isAbsolute,
	join as pathJoin,
	parse as pathParse,
	relative as pathRelative
} from "path";

let { promisify } = require("util");
if (!promisify) {
	promisify = require("util.promisify");
}
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);
const accessAsycn = promisify(fs.access);

const getFormatName = (formats => {
	return function getFormatName(format) {
		return formats[format] ? formats[format] : format;
	};
})({
	eot: "embedded-opentype",
	ttf: "truetype"
});

const REGEXP_SET_NAME = /\[set-name\]/g;
const REGEXP_CSS_NAME = /\[css-name\]/g;
const REGEXP_HASH = /\[hash(:\d)?\]/g;
const REGEXP_EXT = /\[ext\]/g;

export class CustomFont {
	constructor(name, buffer, cache) {
		this._name = name;
		this._buffer = buffer;
		this._font = {};
		this._ff = "";
		this._hash = "";
		this._cache = cache;
	}

	sliceGlyf({ type, subset }) {
		this._hash = generateHash(subset.toString());

		const { Font } = require("fonteditor-core");

		this._font = Font.create(this._buffer, {
			type,
			subset
		});

		const defaultFontFamily = this._font.data.name.fontFamily;

		this._ff = `${defaultFontFamily} ${this.getHash(6)}`;
		this._font.data.name.fullName = this._ff;
		this._font.data.name.fontFamily = this._ff;
		return this;
	}

	get fontFamily() {
		return this._ff;
	}

	async createFontFace(data) {
		const { output } = data;
		const { inline, formats } = output;

		let urlsStr = "";

		if (Array.isArray(inline)) {
			// mixed inline + file
			urlsStr = (await Promise.all([
				this._inlineFontSrc(inline),
				this._fileFontSrc({
					formats: formats.filter(e => !inline.includes(e)),
					...data
				})
			]))
				.filter(Boolean)
				.join(", ");
		} else if (inline === true) {
			// inline all formats
			urlsStr = await this._inlineFontSrc(formats);
		} else {
			// save all formats
			urlsStr = await this._fileFontSrc({
				formats,
				...data
			});
		}

		return this._createFontFace(urlsStr);
	}

	_inlineFontSrc(formats) {
		const tmp = formats.map(async format => {
			const url = await this.fontToBase64(format);
			return `url('${url}') ${CustomFont.getFormat(format)}`;
		});
		return Promise.all(tmp);
	}

	async toBuffer(type) {
		const cache = await this._getFromCache(type);

		if (cache) {
			return cache;
		}

		const buffer = this._toBuffer(type);

		await this._saveToCache(buffer, type);

		return buffer;
	}

	getTmpName(type) {
		return pathJoin(
			tmpdir(),
			`${NAME}-${this._name}-${this._hash}.${type}`
		);
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
		if (
			await this._checkAccess(
				cacheFile,
				fs.constants.F_OK | fs.constants.R_OK
			)
		) {
			return await readFileAsync(cacheFile);
		}
		return false;
	}

	async _checkAccess(path, flag) {
		try {
			return undefined === (await accessAsycn(path, flag));
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
			const data = await this.toBuffer("woff2");
			return `data:application/font-woff2;charset=utf-8;base64,${data.toString(
				"base64"
			)}`;
		} else if (type === "ttf") {
			const data = await this.toBuffer("ttf");
			return `data:font/truetype;charset=utf-8;base64,${data.toString(
				"base64"
			)}`;
		}

		return this._font.toBase64({ type });
	}

	getHash(len) {
		if (isNumber(len)) {
			return this._hash.substr(0, len);
		}
		return this._hash;
	}
	_prepareFileName({ filename, cssFile, ext }) {
		if (isFunction(filename)) {
			filename = filename({
				setName: this._name,
				cssFile,
				ext
			});
		}
		return filename;
	}

	_getFileName(data) {
		const cssFileName = pathParse(data.fromPath).name;

		const filename = this._prepareFileName({
			filename: data.filename,
			cssFile: data.fromPath,
			ext: data.ext
		});
		const isFilenameHasHash = this._filenameHasHash(filename);

		if (isString(filename)) {
			return [
				filename
					.replace(REGEXP_SET_NAME, this._name)
					.replace(REGEXP_CSS_NAME, cssFileName)
					.replace(REGEXP_HASH, (s, count) => {
						const hashLen = count
							? Number(count.replace(":", ""))
							: 4;
						return this.getHash(hashLen);
					})
					.replace(REGEXP_EXT, data.ext),
				isFilenameHasHash
			];
		}

		throw new Error("Output filename must be a Strung!");
	}

	_filenameHasHash(filename) {
		return REGEXP_HASH.test(filename);
	}

	async _fileFontSrc(data) {
		const { formats, fromPath, toPath, outputPath, output } = data;
		const { filename, url } = output;
		return (await Promise.all(
			formats.map(async format => {
				const cssDir = pathParse(toPath || fromPath).dir;
				const cssFilePath = outputPath ? outputPath : cssDir;

				const [fontFilename, isFilenameHasHash] = this._getFileName({
					ext: format,
					fromPath,
					filename
				});

				let absoluteFontFileName = fontFilename;
				if (!isAbsolute(absoluteFontFileName)) {
					absoluteFontFileName = pathJoin(
						cssFilePath,
						absoluteFontFileName
					);
				}

				let relativeUrl = pathRelative(cssDir, absoluteFontFileName);

				if (isFunction(url)) {
					relativeUrl = url({
						setName: this._name,
						cssFile: fromPath,
						fontName: fontFilename,
						hash: this.getHash()
					});
				}

				await mkdirp(pathParse(absoluteFontFileName).dir);

				const isCreateNewFile = isFilenameHasHash
					? !await this._checkAccess(
							absoluteFontFileName,
							fs.constants.F_OK | fs.constants.R_OK
						)
					: true;

				if (isCreateNewFile) {
					const fontData = await this.toBuffer(format);
					await writeFileAsync(absoluteFontFileName, fontData);
				}

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
