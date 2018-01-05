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

var _require = require("util"),
    promisify = _require.promisify;

if (!promisify) {
	promisify = require("util.promisify");
}
var writeFileAsync = promisify(_fs2.default.writeFile);
var readFileAsync = promisify(_fs2.default.readFile);
var accessAsycn = promisify(_fs2.default.access);

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

			var _require2 = require("fonteditor-core"),
			    Font = _require2.Font;

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
		key: "createFontFace",
		value: function () {
			var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(_ref8) {
				var output = _ref8.output,
				    fromPath = _ref8.fromPath,
				    toPath = _ref8.toPath,
				    outputPath = _ref8.outputPath;
				var inline, formats, resolve, baseOpt, urlsStr;
				return regeneratorRuntime.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								inline = output.inline, formats = output.formats, resolve = output.resolve;
								baseOpt = {
									resolve,
									fromPath,
									toPath,
									outputPath
								};
								urlsStr = "";

								if (!Array.isArray(inline)) {
									_context2.next = 10;
									break;
								}

								_context2.next = 6;
								return Promise.all([this._inlineFontSrc(inline), this._fileFontSrc(_extends({
									formats: formats.filter(function (e) {
										return !inline.includes(e);
									})
								}, baseOpt))]);

							case 6:
								_context2.t0 = Boolean;
								urlsStr = _context2.sent.filter(_context2.t0).join(", ");
								_context2.next = 19;
								break;

							case 10:
								if (!(inline === true)) {
									_context2.next = 16;
									break;
								}

								_context2.next = 13;
								return this._inlineFontSrc(formats);

							case 13:
								urlsStr = _context2.sent;
								_context2.next = 19;
								break;

							case 16:
								_context2.next = 18;
								return this._fileFontSrc(_extends({
									formats
								}, baseOpt));

							case 18:
								urlsStr = _context2.sent;

							case 19:
								return _context2.abrupt("return", this._createFontFace(urlsStr));

							case 20:
							case "end":
								return _context2.stop();
						}
					}
				}, _callee2, this);
			}));

			function createFontFace(_x2) {
				return _ref9.apply(this, arguments);
			}

			return createFontFace;
		}()
	}, {
		key: "_inlineFontSrc",
		value: function _inlineFontSrc(formats) {
			var _this2 = this;

			var tmp = formats.map(function () {
				var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(format) {
					var url;
					return regeneratorRuntime.wrap(function _callee3$(_context3) {
						while (1) {
							switch (_context3.prev = _context3.next) {
								case 0:
									_context3.next = 2;
									return _this2.fontToBase64(format);

								case 2:
									url = _context3.sent;
									return _context3.abrupt("return", `url('${url}') ${CustomFont.getFormat(format)}`);

								case 4:
								case "end":
									return _context3.stop();
							}
						}
					}, _callee3, _this2);
				}));

				return function (_x3) {
					return _ref10.apply(this, arguments);
				};
			}());
			return Promise.all(tmp);
		}
	}, {
		key: "toBuffer",
		value: function () {
			var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(type) {
				var cache, buffer;
				return regeneratorRuntime.wrap(function _callee4$(_context4) {
					while (1) {
						switch (_context4.prev = _context4.next) {
							case 0:
								_context4.next = 2;
								return this._getFromCache(type);

							case 2:
								cache = _context4.sent;

								if (!cache) {
									_context4.next = 5;
									break;
								}

								return _context4.abrupt("return", cache);

							case 5:
								buffer = this._toBuffer(type);
								_context4.next = 8;
								return this._saveToCache(buffer, type);

							case 8:
								return _context4.abrupt("return", buffer);

							case 9:
							case "end":
								return _context4.stop();
						}
					}
				}, _callee4, this);
			}));

			function toBuffer(_x4) {
				return _ref11.apply(this, arguments);
			}

			return toBuffer;
		}()
	}, {
		key: "getTmpName",
		value: function getTmpName(type) {
			return (0, _path.join)((0, _os.tmpdir)(), `${_config.NAME}-${this._name}-${this._hash}.${type}`);
		}
	}, {
		key: "_saveToCache",
		value: function () {
			var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(buffer, type) {
				var cacheFile;
				return regeneratorRuntime.wrap(function _callee5$(_context5) {
					while (1) {
						switch (_context5.prev = _context5.next) {
							case 0:
								cacheFile = this.getTmpName(type);
								_context5.prev = 1;
								_context5.next = 4;
								return writeFileAsync(cacheFile, buffer);

							case 4:
								return _context5.abrupt("return", true);

							case 7:
								_context5.prev = 7;
								_context5.t0 = _context5["catch"](1);
								return _context5.abrupt("return", false);

							case 10:
							case "end":
								return _context5.stop();
						}
					}
				}, _callee5, this, [[1, 7]]);
			}));

			function _saveToCache(_x5, _x6) {
				return _ref12.apply(this, arguments);
			}

			return _saveToCache;
		}()
	}, {
		key: "_getFromCache",
		value: function () {
			var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(type) {
				var cacheFile;
				return regeneratorRuntime.wrap(function _callee6$(_context6) {
					while (1) {
						switch (_context6.prev = _context6.next) {
							case 0:
								cacheFile = this.getTmpName(type);
								_context6.prev = 1;
								_context6.next = 4;
								return accessAsycn(cacheFile, _fs2.default.constants.F_OK | _fs2.default.constants.R_OK);

							case 4:
								_context6.next = 6;
								return readFileAsync(cacheFile);

							case 6:
								return _context6.abrupt("return", _context6.sent);

							case 9:
								_context6.prev = 9;
								_context6.t0 = _context6["catch"](1);
								return _context6.abrupt("return", false);

							case 12:
							case "end":
								return _context6.stop();
						}
					}
				}, _callee6, this, [[1, 9]]);
			}));

			function _getFromCache(_x7) {
				return _ref13.apply(this, arguments);
			}

			return _getFromCache;
		}()
	}, {
		key: "_toBuffer",
		value: function _toBuffer(type) {
			if (type === "woff2") {
				var ttf2woff2 = require("ttf2woff2");
				return ttf2woff2(this._font.write({ type: "ttf" }));
			}

			return this._font.write({ type });
		}
	}, {
		key: "fontToBase64",
		value: function () {
			var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(type) {
				var data, _data;

				return regeneratorRuntime.wrap(function _callee7$(_context7) {
					while (1) {
						switch (_context7.prev = _context7.next) {
							case 0:
								if (!(type === "woff2")) {
									_context7.next = 7;
									break;
								}

								_context7.next = 3;
								return this.toBuffer("woff2");

							case 3:
								data = _context7.sent;
								return _context7.abrupt("return", `data:application/font-woff2;charset=utf-8;base64,${data.toString("base64")}`);

							case 7:
								if (!(type === "ttf")) {
									_context7.next = 14;
									break;
								}

								_context7.next = 10;
								return this.toBuffer("ttf");

							case 10:
								_data = _context7.sent;
								return _context7.abrupt("return", `data:font/truetype;charset=utf-8;base64,${_data.toString("base64")}`);

							case 14:
								if (!(type === "woff")) {
									_context7.next = 16;
									break;
								}

								return _context7.abrupt("return", this._font.toBase64({ type }));

							case 16:
								throw Error(`[${_config.NAME}] Inline font not supported for this formats : ${type}`);

							case 17:
							case "end":
								return _context7.stop();
						}
					}
				}, _callee7, this);
			}));

			function fontToBase64(_x8) {
				return _ref14.apply(this, arguments);
			}

			return fontToBase64;
		}()
	}, {
		key: "getHash",
		value: function getHash() {
			var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

			return this._hash.substr(0, len);
		}
	}, {
		key: "_fileFontSrc",
		value: function () {
			var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(_ref15) {
				var _this3 = this;

				var formats = _ref15.formats,
				    fromPath = _ref15.fromPath,
				    toPath = _ref15.toPath,
				    _ref15$outputPath = _ref15.outputPath,
				    outputPath = _ref15$outputPath === undefined ? "." : _ref15$outputPath,
				    resolve = _ref15.resolve;
				return regeneratorRuntime.wrap(function _callee9$(_context9) {
					while (1) {
						switch (_context9.prev = _context9.next) {
							case 0:
								_context9.next = 2;
								return Promise.all(formats.map(function () {
									var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(format) {
										var result, _pathParse, name, outPutFile, relativeUrl;

										return regeneratorRuntime.wrap(function _callee8$(_context8) {
											while (1) {
												switch (_context8.prev = _context8.next) {
													case 0:
														result = void 0;


														if ((0, _helps.isFunction)(resolve)) {
															result = _this3._resolve({
																fromPath,
																format
															});
														} else {
															_pathParse = (0, _path.parse)(fromPath), name = _pathParse.name;

															result = `${outputPath}/${name}-icons-${_this3._name}.${format}`;
														}

														outPutFile = "";
														relativeUrl = false;


														if ((0, _helps.isString)(result)) {
															outPutFile = result;
															relativeUrl = (0, _path.relative)((0, _path.parse)(toPath || fromPath).dir, outPutFile);
														} else {
															outPutFile = result.file;
															relativeUrl = result.url;
														}

														_context8.t0 = writeFileAsync;
														_context8.t1 = outPutFile;
														_context8.next = 9;
														return _this3.toBuffer(format);

													case 9:
														_context8.next = 11;
														return _context8.sent;

													case 11:
														_context8.t2 = _context8.sent;
														_context8.next = 14;
														return (0, _context8.t0)(_context8.t1, _context8.t2);

													case 14:
														return _context8.abrupt("return", `url(${relativeUrl}) ${CustomFont.getFormat(format)}`);

													case 15:
													case "end":
														return _context8.stop();
												}
											}
										}, _callee8, _this3);
									}));

									return function (_x11) {
										return _ref17.apply(this, arguments);
									};
								}()));

							case 2:
								return _context9.abrupt("return", _context9.sent.join(", "));

							case 3:
							case "end":
								return _context9.stop();
						}
					}
				}, _callee9, this);
			}));

			function _fileFontSrc(_x10) {
				return _ref16.apply(this, arguments);
			}

			return _fileFontSrc;
		}()
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