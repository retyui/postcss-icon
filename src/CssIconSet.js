import { IconSet } from "./IconSet";
import { parse } from "postcss";

export class CssIconSet extends IconSet {
  constructor({ name, styles, prefix = "" }) {
    super();

    this._name = name;
    this._styles = styles;
    this._prefix = prefix;
  }

  get(iconName) {
    const key =
      this._prefix === "" ? iconName : iconName.replace(this._prefix, "");
    return this._styles.get(key);
  }

  hasIcon(name) {
    return this.get(name) !== undefined;
  }

  applyIcons() {
    for (const [rootOrMq, nodesSet] of this._linker.rootMap) {
      for (const [iconName, nodes] of nodesSet) {
        this.processExtend({
          extendRules: this.get(iconName),
          userRules: nodes,
          parent: rootOrMq
        });
      }
    }
  }

  static isOneUseIcon(userRules) {
    return userRules.length === 1;
  }

  processExtend({ extendRules, userRules, parent }) {
    if (userRules.length !== 0) {
      const allSelectors = userRules.map(({ selector }) => selector);
      const tmpRoot = parse(extendRules.join("\n"));
      const isOneUseRule = CssIconSet.isOneUseIcon(userRules);
      let tmpCloner;

      if (isOneUseRule) {
        tmpCloner = new TmpContainer({ toNode: userRules[0] });
      }

      tmpRoot.walkRules(rule => {
        if (isOneUseRule && rule.selector === ".extend") {
          tmpCloner.addProps(rule);
          rule.remove();
        } else {
          const extendedSelector = rule.selectors
            .map(selector =>
              allSelectors
                .map(userSelect =>
                  selector.replace(/\.extend/g, userSelect.trim())
                )
                .join(",")
            )
            .join(",");

          rule.selector = extendedSelector;
        }
      });

      if (isOneUseRule) {
        tmpCloner.applyClonedProps();
      }

      if (tmpRoot.nodes.length) {
        parent.insertBefore(userRules[0], tmpRoot.nodes);
      }
    }
  }
}

class TmpContainer {
  constructor({ toNode }) {
    this.toNode = toNode;
    this.tmpNodes = [];
  }

  addProps(fromNode) {
    this.tmpNodes.push(...fromNode.nodes);
  }

  applyClonedProps() {
    if (this.tmpNodes.length !== 0) {
      this.toNode.prepend(...this.tmpNodes);
    }
  }
}
