(() => {
	// REQUERED fix border-radius 0/0 values!
	const rules = Array.from($('[href="icono.min.css"]').sheet.rules);
	const allIcons = {};
	Array.from($$("i[class*=icono-]")).map(iconElement => {
		const allCss = rules
			.map(rule => {
				if (rule instanceof CSSStyleRule) {
					const selectors = rule.selectorText.split(",");
					const filteredSel = selectors
						.map(sel => {
							selClear = sel.split("::")[0];
							return iconElement.matches(selClear)
								? sel.trim()
								: false;
						})
						.filter(e => e);
					const allSelectors = filteredSel
						.filter(e => e)
						.map(e => {
							const all = e.split("::");
							all[0] = `%extend%`;
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

// https://github.com/saeedalipoor/icono
// https://github.com/wentin/cssicon
// https://github.com/joshnh/Pure-CSS-Icons
// https://codepen.io/stiffi/pen/ysbCd?q=css+icons&limit=all&type=type-pens
// https://codepen.io/RRoberts/pen/LxZwQP?limit=all&page=2&q=css+icons
// https://codepen.io/airpwn/pen/hgdBc?limit=all&page=4&q=css+icons
