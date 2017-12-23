import { comment, parse, plugin } from "postcss";
import { objectMap } from "./utils.js";

const NAME = "postcss-icon";

export default plugin(NAME, (...listIconData) => {
	if (listIconData.length === 0) {
		console.log(
			`[${NAME}]`,
			"Error: Options data for the css icon can not be empty!"
		);
		return root => {
			walkAtRuleIcon(root, nodeToComment);
		};
	}

	listIconData =
		listIconData.length === 1
			? Array.isArray(listIconData[0])
				? listIconData[0]
				: [listIconData[0]]
			: listIconData;

	const AllIcons = getMapAllIcons(listIconData);

	return (root, result) => {
		const currentList = new Map();

		// Step 1: find all icons in this file
		walkAtRuleIcon(root, atRuleIcon => {
			const iconName = clearValue(atRuleIcon.params);
			if (AllIcons.has(iconName)) {
				const rootOrMq = closestRoot(atRuleIcon);
				if (!currentList.has(rootOrMq)) {
					currentList.set(rootOrMq, new Map());
				}
				const rootMap = currentList.get(rootOrMq);
				if (!rootMap.get(iconName)) {
					rootMap.set(iconName, []);
				}
				const iconMap = rootMap.get(iconName);
				iconMap.push(atRuleIcon.parent);
				atRuleIcon.remove();
			} else {
				atRuleIcon.warn(
					result,
					`Icon with the name \`${atRuleIcon.params}\` not found!`
				);
				nodeToComment(atRuleIcon);
			}
		});

		// Step 2: Extend all finded icons
		for (const [rootOrMq, nodesSet] of currentList) {
			for (const [iconName, nodes] of nodesSet) {
				processExtend({
					extendRules: AllIcons.get(iconName),
					userRules: nodes,
					parent: rootOrMq
				});
			}
		}
	};
});

function nodeToComment(atRuleIcon) {
	atRuleIcon.replaceWith(comment({ text: atRuleIcon.toString() }));
}

function walkAtRuleIcon(root, func) {
	root.walkAtRules(atRuleIcon => {
		if (
			(atRuleIcon.name && atRuleIcon.name === "icon") ||
			atRuleIcon.name === "icon:"
		) {
			func(atRuleIcon);
		}
	});
}

function getMapAllIcons(listIconData) {
	return listIconData
		.map(({ prefix = "", data = {} }) => prefixIconNames(prefix, data))
		.reduce((allIcons, isonSet) => {
			objectMap(isonSet, (nodes, iconName) => {
				if (allIcons.has(iconName)) {
					console.log(
						`[${NAME}]`,
						`Warn: the iconName \`${iconName}\` already declared! Use a different prefix to avoid conflicts.`
					);
				} else {
					allIcons.set(iconName, nodes);
				}
			});
			return allIcons;
		}, new Map());
}

function isOneUseIcon(userRules) {
	return userRules.length === 1;
}

function processExtend({ extendRules, userRules, parent }) {
	if (userRules.length !== 0) {
		const allSelectors = userRules.map(({ selector }) => selector);
		const tmpRoot = parse(extendRules.join("\n"));
		const isOneUseRule = isOneUseIcon(userRules);
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
			tmpCloner.cloneProps();
		}
		if (tmpRoot.nodes.length) {
			parent.insertBefore(userRules[0], tmpRoot.nodes);
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
	cloneProps() {
		if (this.tmpNodes.length !== 0) {
			this.toNode.prepend(...this.tmpNodes);
		}
	}
}

function clearValue(val) {
	return val.replace(/['"]/g, "");
}

function prefixIconNames(prefix, obj) {
	const tmp = {};
	objectMap(obj, (val, key) => {
		tmp[prefix + key] = val;
	});
	return tmp;
}

function closestRoot({ parent }) {
	if (parent === undefined) {
		return false;
	}
	if (
		(parent.type === "atrule" && parent.name === "media") ||
		parent.type === "root"
	) {
		return parent;
	}
	return closestRoot(parent);
}
