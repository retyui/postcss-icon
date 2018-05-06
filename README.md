# postcss-icon


![postcss-icon](https://raw.githubusercontent.com/retyui/postcss-icon/master/logo.png)

[![npm](https://img.shields.io/npm/v/postcss-icon.svg)](https://www.npmjs.com/package/postcss-icon)
[![npm download count postcss-icon](https://img.shields.io/npm/dm/postcss-icon.svg)](https://www.npmjs.com/package/postcss-icon)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-icon.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-icon)
[![Travis](https://img.shields.io/travis/retyui/postcss-icon.svg?label=unix)](https://travis-ci.org/retyui/postcss-icon)
[![Greenkeeper badge](https://badges.greenkeeper.io/retyui/postcss-icon.svg)](https://greenkeeper.io/)

PostCSS plugin that adds `css icons` from Icon sets

Now you do not need to connect the entire style library for css icons.

## Ison sets:

### Font icons:

- [![npm download count postcss-icon.material-design](https://img.shields.io/npm/dm/postcss-icon.material-design.svg)](https://www.npmjs.com/package/postcss-icon.material-design) [postcss-icon.material-design](https://github.com/retyui/postcss-icon.material-design) (count icons : 932) [result demo](https://retyui.github.io/postcss-icon/material-design/)
- [![npm download count postcss-icon.font-awesome-v4](https://img.shields.io/npm/dm/postcss-icon.font-awesome-v4.svg)](https://www.npmjs.com/package/postcss-icon.font-awesome-v4) [postcss-icon.font-awesome-v4](https://github.com/retyui/postcss-icon.font-awesome-v4) (count icons : 786) [result demo](https://retyui.github.io/postcss-icon/font-awesome-v4/)

### Css only icons:

- [![npm download count postcss-icon.cssicon](https://img.shields.io/npm/dm/postcss-icon.cssicon.svg)](https://www.npmjs.com/package/postcss-icon.cssicon) [postcss-icon.cssicon](https://github.com/retyui/postcss-icon.cssicon) (count icons : 192) [result demo](https://retyui.github.io/postcss-icon/cssicon/)
- [![npm download count postcss-icon.icono](https://img.shields.io/npm/dm/postcss-icon.icono.svg)](https://www.npmjs.com/package/postcss-icon.icono) [postcss-icon.icono](https://github.com/retyui/postcss-icon.icono) (count icons : 131) [result demo](https://retyui.github.io/postcss-icon/icono/)
- [![npm download count postcss-icon.rosa](https://img.shields.io/npm/dm/postcss-icon.rosa.svg)](https://www.npmjs.com/package/postcss-icon.rosa) [postcss-icon.rosa](https://github.com/retyui/postcss-icon.rosa) (count icons : 78) [result demo](https://retyui.github.io/postcss-icon/rosa/)
- [![npm download count postcss-icon.airpwn](https://img.shields.io/npm/dm/postcss-icon.airpwn.svg)](https://www.npmjs.com/package/postcss-icon.airpwn) [postcss-icon.airpwn](https://github.com/retyui/postcss-icon.airpwn) (count icons : 39) [result demo](https://retyui.github.io/postcss-icon/airpwn/)
- [![npm download count postcss-icon.stiffi](https://img.shields.io/npm/dm/postcss-icon.stiffi.svg)](https://www.npmjs.com/package/postcss-icon.stiffi) [postcss-icon.stiffi](https://github.com/retyui/postcss-icon.stiffi) (count icons : 34) [result demo](https://retyui.github.io/postcss-icon/stiffi/)
- [![npm download count postcss-icon.joshnh](https://img.shields.io/npm/dm/postcss-icon.joshnh.svg)](https://www.npmjs.com/package/postcss-icon.joshnh) [postcss-icon.joshnh](https://github.com/retyui/postcss-icon.joshnh) (count icons : 24) [result demo](https://retyui.github.io/postcss-icon/joshnh/)

## Install for postcss

```bash
# the plugin
npm install --save-dev postcss-icon

# and the icon set you need
npm install --save-dev postcss-icon.material-design
npm install --save-dev postcss-icon.font-awesome-v4
npm install --save-dev postcss-icon.cssicon
npm install --save-dev postcss-icon.icono
npm install --save-dev postcss-icon.rosa
npm install --save-dev postcss-icon.airpwn
npm install --save-dev postcss-icon.stiffi
npm install --save-dev postcss-icon.joshnh
```

## Input:

```css
.icon.bad-name{
  @icon: 404-not-found-name;
}
.icon{
  color: gold;
  @icon: prefix-name;
}
```

## Output:

```css
@font-face { /*  */ } /* added if you use font icon set */

.icon.bad-name{
  /* @icon: 404-not-found-name */
}
.icon::after{
  content: '';
  /* ... */
}
/* after  before  i  span */
.icon{
  color: #000;
  width: 20px;
  heigth: 20px;
  /* ... */
  color: gold;
}
```

## Usage ([more examples](https://github.com/retyui/postcss-icon/tree/master/example/))

```js
const { resolve } = require('path');
const postcss     = require('postcss');
const postcssIcon = require('postcss-icon');

const fontSetOptions = {
  inline: ["woff2"],
  path: resolve(__dirname, "./public/assets/fonts/"), // folder to save all font files. Required absolute path!
  formats: ["woff2", "woff" /*, "ttf", "svg", "eot"*/],
  filename: "[css-name]-[set-name].[hash:4].[ext]",
  url({ cssFile, fontName, hash }) { // function help fix url resolve
    // const urlWithQueryHash = `../fonts/${fontName}?v=${hash.substr(0, 5)}`;
    // const exmapleResolveUrl = `../fonts/${fontName}`;
    return fontName;
  }
};
// example for all icon Set
postcss(
  postcssIcon({
    "postcss-icon.material-design": {
      ...fontSetOptions,
      prefix: 'md-'
    },
    "postcss-icon.font-awesome-v4": {
      ...fontSetOptions,
      prefix: 'fa-'
    },
    "postcss-icon.cssicon": { prefix: 'cssicon-' },
    "postcss-icon.icono": { prefix: 'icono-' },
    "postcss-icon.rosa": { prefix: 'rose-' },
    "postcss-icon.airpwn": { prefix: 'airpwn-' },
    "postcss-icon.stiffi": { prefix: 'stiffi-' },
    "postcss-icon.joshnh": { prefix: 'joshnh-' }
  })
);
```

## Options


## Formats Support table (2018-1-15):

| Type | Support |
|---|---|
| [woff2](https://caniuse.com/#feat=woff2) | 78.53% |
| [woff](https://caniuse.com/#feat=woff) | 94.36% |
| [ttf](https://caniuse.com/#feat=ttf) | 94.73% |
| [svg](https://caniuse.com/#feat=svg-fonts) | 25.36% |
| [eot](https://caniuse.com/#feat=eot) | 3.41% |
