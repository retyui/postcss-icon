"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _postcss = require("postcss");

var _LazyIconSet = require("./LazyIconSet.js");

var _config = require("./config");

exports.default = (0, _postcss.plugin)(_config.NAME, function (options) {
	if (!options) {
		console.log(`[${_config.NAME}]`, "Error: Options data for the css icon can not be empty!");
		return function (root) {
			walkAtRuleIcon(root, nodeToComment);
		};
	}

	var lazy = new _LazyIconSet.LazyIconSet(options);

	return function (root, result) {
		// Step 1: find all icons in this file
		walkAtRuleIcon(root, function (atRuleIcon) {
			var iconAdded = lazy.addIcon({
				root: closestRoot(atRuleIcon),
				parent: atRuleIcon.parent,
				iconName: clearValue(atRuleIcon.params)
			});

			if (iconAdded) {
				atRuleIcon.remove();
			} else {
				atRuleIcon.warn(result, `Icon with the name \`${atRuleIcon.params}\` not found!`);
				nodeToComment(atRuleIcon);
			}
		});

		// Step 2: Extend all finded icons
		return lazy.applySet({
			root,
			result
		}); // return Promise
	};
});


function nodeToComment(atRuleIcon) {
	atRuleIcon.replaceWith((0, _postcss.comment)({ text: atRuleIcon.toString() }));
}

function walkAtRuleIcon(root, func) {
	root.walkAtRules(function (atRuleIcon) {
		if (atRuleIcon.name && atRuleIcon.name === "icon" || atRuleIcon.name === "icon:") {
			func(atRuleIcon);
		}
	});
}

function clearValue(val) {
	return val.replace(/['"]/g, "");
}

function closestRoot(_ref) {
	var parent = _ref.parent;

	if (parent === undefined) {
		return false;
	}
	if (parent.type === "atrule" && parent.name === "media" || parent.type === "root") {
		return parent;
	}
	return closestRoot(parent);
}