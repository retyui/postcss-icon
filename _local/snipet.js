(() => {
	const rules = Array.from($('[href="origin.css"]').sheet.rules);
	const allIcons = {};
	Array.from($$("div.icon")).map(iconElement => {
		const allCss = rules
			.map(rule => {
				if (rule instanceof CSSStyleRule) {
					const selectors = rule.selectorText.split(",");
					const filteredSel = selectors
						.map(sel => {
							selClear = sel
								.trim()
								.split("::")[0]
								.split(" ")[0];
							return iconElement.matches(selClear)
								? {
										sel: sel.trim(),
										className: iconElement.className
									}
								: false;
						})
						.filter(e => e);
					const allSelectors = filteredSel
						.map(e => {
							const all = e.sel.split("::");
							all[0] = all[0].split(" ");
							all[0][0] = `.extend`;
							all[0] = all[0].join(" ");
							return all.join("::");
						})
						.join(", ");
					if (allSelectors !== "") {
						return `${allSelectors} { ${rule.style.cssText} }`;
					}
				}
				return false;
			})
			.filter(e => e);
		allIcons[iconElement.className] = allCss;
	});
	console.log(JSON.stringify(allIcons));
})();
