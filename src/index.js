import { comment, plugin } from "postcss";
import { LazyIconSet } from "./LazyIconSet.js";
import { NAME } from "./config";


export default plugin(NAME, (options) => {
	if (!options) {
		console.log(
			`[${NAME}]`,
			"Error: Options data for the css icon can not be empty!"
		);
		return root => {
			walkAtRuleIcon(root, nodeToComment);
		};
	}

	const lazy = new LazyIconSet(options);

	return (root, result) => {
		// Step 1: find all icons in this file
		walkAtRuleIcon(root, atRuleIcon => {
			const iconAdded = lazy.addIcon({
				root: closestRoot(atRuleIcon),
				parent: atRuleIcon.parent,
				iconName: clearValue(atRuleIcon.params)
			});

			if (iconAdded) {
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
		return lazy.applySet({root, result}); // return Promise
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

function clearValue(val) {
	return val.replace(/['"]/g, "");
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
