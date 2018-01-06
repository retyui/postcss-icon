// https://caniuse.com/#feat=woff2
// https://caniuse.com/#feat=woff
// https://caniuse.com/#feat=ttf
// https://caniuse.com/#feat=eot
// https://caniuse.com/#feat=svg-fonts



const { writeFileSync } = require("fs");
const {resolve} = require('path');
const {iconSetsMap} = require('./config.js')

writeFileSync(
	resolve(__dirname, "../README.md"),
	`# postcss-icon

![postcss-icon](https://raw.githubusercontent.com/retyui/postcss-icon/master/logo.png)

[![npm](https://img.shields.io/npm/v/postcss-icon.svg)](https://www.npmjs.com/package/postcss-icon)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-icon.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-icon)
[![Travis](https://img.shields.io/travis/retyui/postcss-icon.svg?label=unix)](https://travis-ci.org/retyui/postcss-icon)
[![David](https://img.shields.io/david/retyui/postcss-icon.svg)](https://david-dm.org/retyui/postcss-icon)

PostCSS plugin that adds \`css icons\` from Icon sets

Now you do not need to connect the entire style library for css icons.

## Ison sets:
${}


## Install for postcss
\`\`\`bash
# the plugin
npm install --save-dev postcss-icon

# and the icon set you need
npm install --save-dev ${[...iconSetsMap.keys()].map((e,i)=> i === 2 ? e+'\nnpm install --save-dev' : e).join(' ')}
\`\`\`

**Input:**
\`\`\`css
.icon.bad-name{
	@icon: 404-not-found-name;
}

.icon{
	color: gold;
	@icon: prefix-name;
}
\`\`\`

**Output:**
\`\`\`css
.icon.bad-name{
	/* @icon: 404-not-found-name */
}

.icon::after{
	content: '';
	/* ... */
}
/* after \ before \ i \ span */
.icon{
	color: #000;
	width: 20px;
	heigth: 20px;
	/* ... */
	color: gold;
}
\`\`\`

## Usage
\`\`\`js
const postcss     = require('postcss');
const postcssIcon = require('postcss-icon');

// postcss(require('postcss-icon')(iconSetDataList))
// exemple all icon Set
postcss(
	postcssIcon(
${[...iconSetsMap].map(([name,data])=> `\t\t{ prefix: '${data.prefix}',\tdata: require('${name}') }`).join(',\n')}
	)
);

// example custom data set
postcss([
	postcssIcon({
		prefix: "custom-",
		data: {
			iconName: [
				".extend {color: gold; /* ... all styles */}",
				".extend::after, .extend::before {position: absolute; /* ... all styles */}",
				".extend i, {color: gold; /* all styles */}"
			],
			pen: [".extend { /* ... */}" /* , ... */]
		}
	})
]);
\`\`\`

## Work algorithm
![Work algorithm](https://raw.githubusercontent.com/retyui/postcss-icon/master/draw.png)
`
);

for (const [name, data] of iconSetsMap) {
	const {
		based = "",
		preview = "",
		nameSet = "",
		prefix = "",
		iconNameExample = ""
	} = data;
	console.log(`
cd ${name} ; git status; git add . ; git status ; git commit -m "update readme"; npm version patch ; npm publish ; git push origin master; cd ..;
`);
	writeFileSync(
		resolve(__dirname,`../../${name}/README.md`),
		`
# ${name}

Icon set data for [postcss-icon plugin](https://github.com/retyui/postcss-icon)

Based on ${based}

[![${nameSet}](https://raw.githubusercontent.com/retyui/${name}/master/preview.png)](${preview})


## Install
\`\`\`bash
npm install -D ${name} postcss-icon
# or
yarn add -D ${name} postcss-icon
\`\`\`

## Use
\`\`\`js
const postcss     = require('postcss');
const postcssIcon = require('postcss-icon');
const dataIcono   = require('${name}');

const CSS = \`
.custom-selector{
	@icon: ${prefix}${iconNameExample}; /* '${prefix}' is Prefix , '${iconNameExample}' is name Icon*/ }
/* or */
.custom-selector2{
	@icon ${prefix}${iconNameExample}; }
\`;

postcss(
	postcssIcon({
		prefix: '${prefix}', /* required when using multiple Icon data sets */
		data: dataIcono
	})
).process(CSS).then(({css, messages}) => {
	console.log(css);
	messages
		.filter(i => i.type === "warning")
		.map(e => console.log(e.toString()));
});
\`\`\`

# Other icon sets:
${(() => {
			let all = "";
			for (const [_name, _data] of iconSetsMap) {
				const { preview = "" } = _data;
				if (name !== _name) {
					all += `- [${_name}](https://github.com/retyui/${_name}) (count icons : ${countIcons(
						_name
					)}) [result demo](${preview})\n`;
				}
			}
			return all;
		})()}

## All name icons (count: ${countIcons(name)}) [result demo](${preview})

\`\`\`js
Object.keys(require('${name}')).sort().join(', ')
\`\`\`
${Object.keys(require(`../../${name}`))
			.sort()
			.map(e => `\`${e}\``)
			.join(", ")}`
	);
}

function countIcons(name) {
	const result = require(`../../${name}`);

	return Array.from(Object.keys(result)).length;
}


function listIconSets(ignore=false){
	[...iconSetsMap]
		.filter(e => ignore ? e.name !== ignore : true)
		.map(([name, data]) => {
			return [
				`- [${name}](https://github.com/retyui/${name})`
				(count icons : ${countIcons(name)})`
				[result demo](${data.preview})`
			].join(' ');
		});
}
