import { parse as pathParse } from "path";
import { decl, parse as postcssParse } from "postcss";

import { NAME } from "./config";
import { IconSet } from "./IconSet";
import { isString, to16Number } from "./helps.js";
import { CustomFont } from "./CustomFont.js";

export class FontIconSet extends IconSet {
  constructor({ name, keymap, ttf, css, prefix, output = {}, cache = false }) {
    super();
    this._name = name;
    this._prefix = prefix;
    this._keymap = keymap;
    this._ttfBuffer = ttf;
    this._css = postcssParse(css);
    this._cache = cache;

    this._output = {
      fontFamily: "",
      inline: "woff2",
      formats: ["woff2", "woff"],
      // extractAll: () => {},
      path: "",
      filename: "[css-name]-[set-name].[hash:4].[ext]",
      // url: (fontFile, cssFile) => {},
      ...output
    };
    this.narmolizationOutput();

    // fix for fonteditor-core toBase64 node
    if (global.btoa === undefined) {
      global.btoa = data => Buffer.from(data).toString("base64");
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
      return types.split(",").map(e => e.trim());
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
    const outputPath =
      this._output.path || pathParse(toPath || fromPath || process.cwd()).dir;

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
      fromPath,
      toPath,
      output: this._output,
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
              value: `'\\${to16Number(iconNum).toUpperCase()}'`
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
      this._ttfBuffer,
      this._cache
    ).sliceGlyf({
      type: "ttf",
      subset: this.getSubSet()
    });
  }
}

function isAfterOrBeforeSelector(selector) {
  return selector.includes(":after") || selector.includes(":before");
}
