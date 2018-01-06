const {nameToUnicode , getFont,mapIconNames} = require('../src/index.js')();
const {writeFileSync} = require('fs');

function rand(max,min=0){
	return Math.floor(Math.random() * (max - min) + min);
}

const arrIconNames = [...mapIconNames.keys()];

const icons = new Array(rand(69)).fill('').map(() => arrIconNames[rand(arrIconNames.length)]);
[
	'woff2',
	'woff',
	'ttf',
	'eot',
	'svg'
].map(type => {
	writeFileSync(__dirname+`/test.${type}.html`, `
<!DOCTYPE html>
<html>
<head>
	<style>
${getFont(nameToUnicode(icons), type)}
	</style>
	<title>${type}</title>
</head>
<body>
	${icons.map(name => `<i class="material-icons">&#x${(+nameToUnicode(name)).toString(16).toUpperCase()};</i>`).join('\n')}
</body>
</html>
`)
});
