const host = "https://raw.githubusercontent.com/";

exports = {
	pluginName: "postcss-icon",
	iconSetsMap: new Map([
		[
			`${PLIcon}.material-design`,
			{
				type: "font",
				hummanName: "Material icons",
				site: "https://material.io/icons/",
				prefix: "md-",
				iconNameExample: "home",
				base: `${host}google/material-design-icons/master/iconfont`,
				getContent(delimiter) {
					return [
						getContent(`${this.base}/MaterialIcons-Regular.ijmap`)
							.then(
								content =>
									JSON.parse(content.toString("utf8")).icons
							)
							.then(icons =>
								Object.keys(icons).map(unicode => {
									const { name } = icons[unicode];
									return [
										name
											.toLowerCase()
											.replace(/\s/g, delimiter),
										unicode.toUpperCase()
									];
								})
							),
						getContent(`${this.base}/MaterialIcons-Regular.ttf`)
					];
				}
			}
		],
		[
			`${PLIcon}.font-awesome-v4`,
			{
				type: "font",
				hummanName: "Font Awesome",
				site: "http://fontawesome.io/",
				prefix: "fa-",
				iconNameExample: "500px",
				base: `${host}FortAwesome/Font-Awesome/master/`,
				getContent() {
					return [
						getContent(`${this.base}scss/_variables.scss`)
							.then(scss => {
								scss = scss.toString("utf8");
								return scss.substr(scss.indexOf("$fa-var-"));
							})
							.then(clearScss => {
								return clearScss
									.split(";")
									.map(e => e.trim())
									.filter(Boolean)
									.map(e => e.split(":"))
									.map(([name, code]) => {
										if (!name || !code) {
											console.log(name, code);
										}
										return [
											name.replace("$fa-var-", "").trim(),
											code
												.replace(/['"\\]/g, "")
												.trim()
												.toUpperCase()
										];
									});
							}),
						getContent(`${this.base}fonts/fontawesome-webfont.ttf`)
					];
				}
			}
		],

		[
			`${PLIcon}.cssicon`,
			{
				type: "css",
				hummanName: "cssicon.space",
				prefix: "cssicon-",
				iconNameExample: "close",
				site: "http://cssicon.space",
				get based() {
					return `[${this.hummanName}](${this.site})`;
				},
				preview: "https://retyui.github.io/postcss-icon/cssicon/"
			}
		],
		[
			`${PLIcon}.icono`,
			{
				type: "css",
				hummanName: "Icono",
				prefix: "icono-",
				iconNameExample: "search",
				site: "https://saeedalipoor.github.io/icono/",
				get based() {
					return `[${this.hummanName}](${this.site})`;
				},
				preview: "https://retyui.github.io/postcss-icon/icono/"
			}
		],
		[
			`${PLIcon}.rosa`,
			{
				type: "css",
				hummanName: "Rosa icons",
				prefix: "rose-",
				iconNameExample: "power",
				site: "https://codepen.io/RRoberts/pen/LxZwQP",
				get based() {
					return `[CSS Icons, a pen by Rosa](${this.site})`;
				},
				preview: "https://retyui.github.io/postcss-icon/rosa/"
			}
		],
		[
			`${PLIcon}.airpwn`,
			{
				type: "css",
				hummanName: "Airpwn icons",
				prefix: "airpwn-",
				iconNameExample: "heart",
				site: "https://codepen.io/airpwn/pen/hgdBc",
				get based() {
					return `[css icon set, a pen by airpwn](${this.site})`;
				},
				preview: "https://retyui.github.io/postcss-icon/airpwn/"
			}
		],
		[
			`${PLIcon}.stiffi`,
			{
				type: "css",
				hummanName: "Sti#i icons",
				prefix: "stiffi-",
				iconNameExample: "comment",
				site: "https://codepen.io/stiffi/pen/ysbCd",
				get based() {
					return `[css icons, a pen by sti#i](${this.site})`;
				},
				preview: "https://retyui.github.io/postcss-icon/stiffi/"
			}
		],
		[
			`${PLIcon}.joshnh`,
			{
				type: "css",
				hummanName: "joshnh/Pure-CSS-Icons",
				prefix: "joshnh-",
				iconNameExample: "pause",
				site: "https://github.com/joshnh/Pure-CSS-Icons",
				get based() {
					return `[${this.hummanName}](${this.site})`;
				},
				preview: "https://retyui.github.io/postcss-icon/joshnh/"
			}
		]
	])
};
