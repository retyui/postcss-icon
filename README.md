# postcss-icon

![postcss-icon](https://raw.githubusercontent.com/retyui/postcss-icon/master/logo.png)

[![npm](https://img.shields.io/npm/v/postcss-icon.svg)](https://www.npmjs.com/package/postcss-icon)
[![AppVeyor](https://img.shields.io/appveyor/ci/retyui/postcss-icon.svg?label=win)](https://ci.appveyor.com/project/retyui/postcss-icon)
[![Travis](https://img.shields.io/travis/retyui/postcss-icon.svg?label=unix)](https://travis-ci.org/retyui/postcss-icon)
[![David](https://img.shields.io/david/retyui/postcss-icon.svg)](https://david-dm.org/retyui/postcss-icon)

PostCSS plugin that adds `css icons` from Icon sets

Now you do not need to connect the entire style library for css icons.

## Ison sets:

### Font icons:

- [postcss-icon.material-design](https://github.com/retyui/postcss-icon.material-design) (count icons : 932) [result demo](https://retyui.github.io/postcss-icon/material-design/)
- [postcss-icon.font-awesome-v4](https://github.com/retyui/postcss-icon.font-awesome-v4) (count icons : 786) [result demo](https://retyui.github.io/postcss-icon/font-awesome-v4/)

### Css only icons:

- [postcss-icon.cssicon](https://github.com/retyui/postcss-icon.cssicon) (count icons : 192) [result demo](https://retyui.github.io/postcss-icon/cssicon/)
- [postcss-icon.icono](https://github.com/retyui/postcss-icon.icono) (count icons : 131) [result demo](https://retyui.github.io/postcss-icon/icono/)
- [postcss-icon.rosa](https://github.com/retyui/postcss-icon.rosa) (count icons : 78) [result demo](https://retyui.github.io/postcss-icon/rosa/)
- [postcss-icon.airpwn](https://github.com/retyui/postcss-icon.airpwn) (count icons : 39) [result demo](https://retyui.github.io/postcss-icon/airpwn/)
- [postcss-icon.stiffi](https://github.com/retyui/postcss-icon.stiffi) (count icons : 34) [result demo](https://retyui.github.io/postcss-icon/stiffi/)
- [postcss-icon.joshnh](https://github.com/retyui/postcss-icon.joshnh) (count icons : 24) [result demo](https://retyui.github.io/postcss-icon/joshnh/)

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

**Input:**

```css
.icon.bad-name{
  @icon: 404-not-found-name;
}
.icon{
  color: gold;
  @icon: prefix-name;
}
```

**Output:**

```css
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

## Usage

```js
const postcss     = require('postcss');
const postcssIcon = require('postcss-icon');
// exemple for all icon Set
postcss(
  postcssIcon(
    { prefix: 'md-',  data: require('postcss-icon.material-design') },
    { prefix: 'fa-',  data: require('postcss-icon.font-awesome-v4') },
    { prefix: 'cssicon-',  data: require('postcss-icon.cssicon') },
    { prefix: 'icono-',  data: require('postcss-icon.icono') },
    { prefix: 'rose-',  data: require('postcss-icon.rosa') },
    { prefix: 'airpwn-',  data: require('postcss-icon.airpwn') },
    { prefix: 'stiffi-',  data: require('postcss-icon.stiffi') },
    { prefix: 'joshnh-',  data: require('postcss-icon.joshnh') }
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
```

Support table (2018-1-15):

| Type | Support |
|---|---|
| [woff2](https://caniuse.com/#feat=woff2) | 78.53% |
| [woff](https://caniuse.com/#feat=woff) | 94.36% |
| [ttf](https://caniuse.com/#feat=ttf) | 94.73% |
| [svg](https://caniuse.com/#feat=svg-fonts) | 25.36% |
| [eot](https://caniuse.com/#feat=eot) | 3.41% |
