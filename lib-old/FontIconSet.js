"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FontIconSet = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _os = require("os");

var _util = require("util");

var _path = require("path");

var _postcss = require("postcss/lib/postcss");

var _config = require("./config");

var _IconSet2 = require("./IconSet");

var _helps = require("./helps.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import regeneratorRuntime from "regenerator-runtime/runtime";

var writeFileAsync = (0, _util.promisify)(_fs2.default.writeFile);
var readFileAsync = (0, _util.promisify)(_fs2.default.readFile);
var accessAsycn = (0, _util.promisify)(_fs2.default.access);

var FontIconSet = exports.FontIconSet = function (_IconSet) {
	_inherits(FontIconSet, _IconSet);

	function FontIconSet(_ref) {
		var name = _ref.name,
		    keymap = _ref.keymap,
		    ttf = _ref.ttf,
		    css = _ref.css,
		    prefix = _ref.prefix,
		    _ref$output = _ref.output,
		    output = _ref$output === undefined ? {} : _ref$output;

		_classCallCheck(this, FontIconSet);

		var _this = _possibleConstructorReturn(this, (FontIconSet.__proto__ || Object.getPrototypeOf(FontIconSet)).call(this));

		_this._name = name;
		_this._prefix = prefix;
		_this._keymap = keymap;
		_this._ttfBuffer = ttf;
		_this._css = (0, _postcss.parse)(css);

		_this._output = _extends({
			fontFamily: "",
			inline: "woff2",
			formats: ["woff2", "woff"],
			resolve: false,
			// extractAll: () => {},
			path: "",
			filename: "../fonts/[name][style-name][hash].[ext]"
		}, output);
		_this.narmolizationOutput();

		// fix for fonteditor-core toBase64 node
		if (global.btoa === undefined) {
			global.btoa = function (data) {
				return Buffer.from(data).toString("base64");
			};
		}
		return _this;
	}

	_createClass(FontIconSet, [{
		key: "narmolizationOutput",
		value: function narmolizationOutput() {
			this._output.formats = this.narmolizationTypes(this._output.formats, "formats");
			if ((0, _helps.isString)(this._output.inline)) {
				this._output.inline = this.narmolizationTypes(this._output.inline, "inline");
			}
		}
	}, {
		key: "narmolizationTypes",
		value: function narmolizationTypes(types, propName) {
			if (Array.isArray(types)) {
				return types;
			}
			if ((0, _helps.isString)(types)) {
				return types.split(",").map(function (e) {
					return e.trim();
				});
			}

			throw new Error(`[${_config.NAME}] The property (${propName}) value should be 'Array' or 'String', Icon set: ${this._name}`);
		}
	}, {
		key: "narmolizationIconName",
		value: function narmolizationIconName(name) {
			return this._prefix === "" ? name : name.replace(this._prefix, "");
		}
	}, {
		key: "nameToUnicode",
		value: function nameToUnicode(iconName) {
			return this._keymap.get(this.narmolizationIconName(iconName));
		}
	}, {
		key: "hasIcon",
		value: function hasIcon(name) {
			return this._keymap.has(this.narmolizationIconName(name));
		}
	}, {
		key: "applyIcons",
		value: function () {
			var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
				var root = _ref2.root,
				    result = _ref2.result;

				var _result$opts, fromPath, toPath, baseNode, outputPath, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, nodesSet, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _ref4, _ref5, iconName, nodes, font, fontFamilyStr;

				return regeneratorRuntime.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_result$opts = result.opts, fromPath = _result$opts.from, toPath = _result$opts.to;
								baseNode = this._css.nodes[0].clone();
								outputPath = this._output.path || (0, _path.parse)(fromPath).dir;
								_iteratorNormalCompletion = true;
								_didIteratorError = false;
								_iteratorError = undefined;
								_context.prev = 6;
								_iterator = this._linker.rootMap.values()[Symbol.iterator]();

							case 8:
								if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
									_context.next = 32;
									break;
								}

								nodesSet = _step.value;
								_iteratorNormalCompletion2 = true;
								_didIteratorError2 = false;
								_iteratorError2 = undefined;
								_context.prev = 13;

								for (_iterator2 = nodesSet[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									_ref4 = _step2.value;
									_ref5 = _slicedToArray(_ref4, 2);
									iconName = _ref5[0];
									nodes = _ref5[1];

									this.processNodes({
										iconName,
										baseNode,
										nodes
									});
								}
								_context.next = 21;
								break;

							case 17:
								_context.prev = 17;
								_context.t0 = _context["catch"](13);
								_didIteratorError2 = true;
								_iteratorError2 = _context.t0;

							case 21:
								_context.prev = 21;
								_context.prev = 22;

								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}

							case 24:
								_context.prev = 24;

								if (!_didIteratorError2) {
									_context.next = 27;
									break;
								}

								throw _iteratorError2;

							case 27:
								return _context.finish(24);

							case 28:
								return _context.finish(21);

							case 29:
								_iteratorNormalCompletion = true;
								_context.next = 8;
								break;

							case 32:
								_context.next = 38;
								break;

							case 34:
								_context.prev = 34;
								_context.t1 = _context["catch"](6);
								_didIteratorError = true;
								_iteratorError = _context.t1;

							case 38:
								_context.prev = 38;
								_context.prev = 39;

								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}

							case 41:
								_context.prev = 41;

								if (!_didIteratorError) {
									_context.next = 44;
									break;
								}

								throw _iteratorError;

							case 44:
								return _context.finish(41);

							case 45:
								return _context.finish(38);

							case 46:
								font = this.getCustomFont();
								_context.next = 49;
								return font.createFontFace({
									output: this._output,
									toPath,
									fromPath,
									outputPath
								});

							case 49:
								fontFamilyStr = _context.sent;


								baseNode.append((0, _postcss.decl)({
									prop: "font-family",
									value: `'${font.fontFamily}'`
								}));

								root.prepend(fontFamilyStr, baseNode);

							case 52:
							case "end":
								return _context.stop();
						}
					}
				}, _callee, this, [[6, 34, 38, 46], [13, 17, 21, 29], [22,, 24, 28], [39,, 41, 45]]);
			}));

			function applyIcons(_x) {
				return _ref3.apply(this, arguments);
			}

			return applyIcons;
		}()
	}, {
		key: "processNodes",
		value: function processNodes(_ref6) {
			var iconName = _ref6.iconName,
			    nodes = _ref6.nodes,
			    baseNode = _ref6.baseNode;

			var iconNum = this.nameToUnicode(iconName);
			var allSelectorsNodes = nodes.map(function (node) {
				if (isAfterOrBeforeSelector(node.selector)) {
					node.prepend((0, _postcss.decl)({
						prop: "content",
						value: `'\\${(0, _helps.to16Number)(iconNum).toUpperCase()}'`
					}));
				}
				return node.selector;
			}).join(", ");
			baseNode.selector += `, ${allSelectorsNodes}`;
		}
	}, {
		key: "getSubSet",
		value: function getSubSet() {
			var subset = new Set();
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = this._linker.rootMap.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var nodesSet = _step3.value;
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {
						for (var _iterator4 = nodesSet.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var iconName = _step4.value;

							subset.add(this.nameToUnicode(iconName));
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return [].concat(_toConsumableArray(subset)); // to array
		}
	}, {
		key: "getCustomFont",
		value: function getCustomFont() {
			return new CustomFont(this._name.replace(`${_config.NAME}.`, ""), this._ttfBuffer).sliceGlyf({
				type: "ttf",
				subset: this.getSubSet()
			});
		}
	}]);

	return FontIconSet;
}(_IconSet2.IconSet);

var CustomFont = function () {
	function CustomFont(name, buffer) {
		_classCallCheck(this, CustomFont);

		this._name = name;
		this._buffer = buffer;
		this._font = null;
		this._ff = "";
		this._hash = "";
	}

	_createClass(CustomFont, [{
		key: "sliceGlyf",
		value: function sliceGlyf(_ref7) {
			var type = _ref7.type,
			    subset = _ref7.subset;

			this._hash = (0, _helps.generateHash)(subset.toString());

			var _require = require("fonteditor-core"),
			    Font = _require.Font;

			this._font = Font.create(this._buffer, {
				type,
				subset
			});

			var defaultFontFamily = this._font.data.name.fontFamily;

			this._ff = `${defaultFontFamily} ${this.getHash()}`;
			this._font.data.name.fullName = this._ff;
			this._font.data.name.fontFamily = this._ff;
			return this;
		}
	}, {
		key: "getTmpName",


		// async createFontFace({ output, fromPath, toPath, outputPath }) {
		// 	const { inline, formats, resolve } = output;
		// 	const baseOpt = {
		// 		resolve,
		// 		fromPath,
		// 		toPath,
		// 		outputPath
		// 	};
		// 	let urlsStr = "";

		// 	if (Array.isArray(inline)) {
		// 		// mixed inline + file
		// 		urlsStr = (await Promise.all([
		// 			this._inlineFontSrc(inline),
		// 			this._fileFontSrc({
		// 				formats: formats.filter(e => !inline.includes(e)),
		// 				...baseOpt
		// 			})
		// 		]))
		// 			.filter(Boolean)
		// 			.join(", ");
		// 	} else if (inline === true) {
		// 		// inline all formats
		// 		urlsStr = await this._inlineFontSrc(formats);
		// 	} else {
		// 		// save all formats
		// 		urlsStr = await this._fileFontSrc({
		// 			formats,
		// 			...baseOpt
		// 		});
		// 	}

		// 	return this._createFontFace(urlsStr);
		// }

		// _inlineFontSrc(formats) {
		// 	return Promise.all(
		// 		formats.map(
		// 			async format =>
		// 				`url('${await this.fontToBase64(
		// 					format
		// 				)}') ${CustomFont.getFormat(format)}`
		// 		)
		// 	);
		// }

		// async toBuffer(type) {
		// 	const cache = await this._getFromCache(type);

		// 	if (cache) {
		// 		return cache;
		// 	}

		// 	const buffer = this._toBuffer(type);

		// 	await this._saveToCache(buffer, type);

		// 	return buffer;
		// }

		value: function getTmpName(type) {
			return (0, _path.join)((0, _os.tmpdir)(), `${_config.NAME}-${this._name}-${this._hash}.${type}`);
		}

		// async _saveToCache(buffer, type) {
		// 	const cacheFile = this.getTmpName(type);
		// 	try {
		// 		await writeFileAsync(cacheFile, buffer); // save to chache folder
		// 		return true;
		// 	} catch (e) {
		// 		return false;
		// 	}
		// }

		// async _getFromCache(type) {
		// 	const cacheFile = this.getTmpName(type);
		// 	try {
		// 		await accessAsycn(cacheFile, fs.constants.F_OK | fs.constants.R_OK);
		// 		return await readFileAsync(cacheFile);
		// 	} catch (e) {
		// 		return false;
		// 	}
		// }

	}, {
		key: "_toBuffer",
		value: function _toBuffer(type) {
			if (type === "woff2") {
				var ttf2woff2 = require("ttf2woff2");
				return ttf2woff2(this._font.write({ type: "ttf" }));
			}

			return this._font.write({ type });
		}

		// async fontToBase64(type) {
		// 	if (type === "woff2") {
		// 		return `data:application/font-woff2;charset=utf-8;base64,${(await this.toBuffer(
		// 			"woff2"
		// 		)).toString("base64")}`;
		// 	} else if (type === "ttf") {
		// 		return `data:font/truetype;charset=utf-8;base64,${(await this.toBuffer(
		// 			"ttf"
		// 		)).toString("base64")}`;
		// 	} else if (type === "woff") {
		// 		return this._font.toBase64({ type }); // support: woff ; bad support: ttf,eot,svg
		// 	}

		// 	throw Error(
		// 		`[${NAME}] Inline font not supported for this formats : ${type}`
		// 	);
		// }

	}, {
		key: "getHash",
		value: function getHash() {
			var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

			return this._hash.substr(0, len);
		}

		// async _fileFontSrc({
		// 	formats,
		// 	fromPath,
		// 	toPath,
		// 	outputPath = ".",
		// 	resolve
		// }) {
		// 	const files = await Promise.all(
		// 		formats.map(async format => {
		// 			let result;

		// 			if (isFunction(resolve)) {
		// 				result = this._resolve({
		// 					fromPath,
		// 					format
		// 				});
		// 			} else {
		// 				const { name } = pathParse(fromPath);
		// 				result = `${outputPath}/${name}-icons-${
		// 					this._name
		// 				}.${format}`;
		// 			}

		// 			let outPutFile = "";
		// 			let relativeUrl = false;

		// 			if (isString(result)) {
		// 				outPutFile = result;
		// 				relativeUrl = pathRelative(
		// 					pathParse(toPath || fromPath).dir,
		// 					outPutFile
		// 				);
		// 			} else {
		// 				outPutFile = result.file;
		// 				relativeUrl = result.url;
		// 			}

		// 			await writeFileAsync(
		// 				outPutFile,
		// 				await await this.toBuffer(format)
		// 			);

		// 			return `url(${relativeUrl}) ${CustomFont.getFormat(format)}`;
		// 		})
		// 	);

		// 	return files.join(", ");
		// }

	}, {
		key: "_createFontFace",
		value: function _createFontFace(srcStr) {
			return `@font-face {\n\tfont-family: '${this.fontFamily}';\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: ${srcStr};\n}\n`;
		}
	}, {
		key: "fontFamily",
		get: function get() {
			return this._ff;
		}
	}], [{
		key: "getFormat",
		value: function getFormat(type) {
			return `format('${getFormatName(type)}')`;
		}
	}]);

	return CustomFont;
}();

function isAfterOrBeforeSelector(selector) {
	return selector.includes(":after") || selector.includes(":before");
}

var getFormatName = function (formats) {
	return function getFormatName(format) {
		return formats[format] ? formats[format] : format;
	};
}({
	eot: "embedded-opentype",
	ttf: "truetype"
});