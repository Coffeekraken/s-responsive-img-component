# Coffeekraken s-responsive-img-component <img src=".resources/coffeekraken-logo.jpg" height="25px" />

<p>
	<!-- <a href="https://travis-ci.org/coffeekraken/s-responsive-img-component">
		<img src="https://img.shields.io/travis/coffeekraken/s-responsive-img-component.svg?style=flat-square" />
	</a> -->
	<a href="https://www.npmjs.com/package/coffeekraken-s-responsive-img-component">
		<img src="https://img.shields.io/npm/v/coffeekraken-s-responsive-img-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-responsive-img-component/blob/master/LICENSE.txt">
		<img src="https://img.shields.io/npm/l/coffeekraken-s-responsive-img-component.svg?style=flat-square" />
	</a>
	<!-- <a href="https://github.com/coffeekraken/s-responsive-img-component">
		<img src="https://img.shields.io/npm/dt/coffeekraken-s-responsive-img-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-responsive-img-component">
		<img src="https://img.shields.io/github/forks/coffeekraken/s-responsive-img-component.svg?style=social&label=Fork&style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-responsive-img-component">
		<img src="https://img.shields.io/github/stars/coffeekraken/s-responsive-img-component.svg?style=social&label=Star&style=flat-square" />
	</a> -->
	<a href="https://twitter.com/coffeekrakenio">
		<img src="https://img.shields.io/twitter/url/http/coffeekrakenio.svg?style=social&style=flat-square" />
	</a>
	<a href="http://coffeekraken.io">
		<img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=flat-square&label=coffeekraken.io&colorB=f2bc2b&style=flat-square" />
	</a>
</p>

Provide a nice way to make images responsive without using srcset and sizes attributes.

## Table of content

1. **[Demo](http://components.coffeekraken.io/app/s-responsive-img-component)**
2. [Install](#readme-install)
3. [Get Started](#readme-get-started)
4. [Javascript API](doc/js)
5. [Preset properties](#readme-preset-properties)
6. [Sugar Web Components Documentation](https://github.com/coffeekraken/sugar/blob/master/doc/webcomponent.md)
7. [Browsers support](#readme-browsers-support)
8. [Code linting](#readme-code-linting)
9. [Contribute](#readme-contribute)
10. [Who are Coffeekraken?](#readme-who-are-coffeekraken)
11. [Licence](#readme-license)

<a name="readme-install"></a>
## Install

```
npm install coffeekraken-s-responsive-img-component --save
```

<a name="readme-get-started"></a>
## Get Started

First, import the component into your javascript file like so:

```js
import SResponsiveImgComponent from 'coffeekraken-s-responsive-img-component'
```

Register a preset

```js
SResponsiveImgComponent.registerPreset('banner', {
  widths: [{
    width: 340,
    name: 'mobile',
    pixelRatios: [1,2]
  }, {
    width: 640,
    name: 'tablet',
    pixelRatios: [1,2]
  }, {
    width: 1280,
    name: 'desktop',
    pixelRatios: [1,2]
  }],
  computeSrc: (src, widthObj) => {
    return src + `?auto=compress&w={width}&fit=crop&fm=png&dpr={pixelRatio}`
  }
})
```

Then simply use it inside your html like so:

```html
<img is="s-responsive-img" lazy-src="https://assets.imgix.net/hp/snowshoe.jpg" preset="banner" />
```

<a id="readme-preset-properties"></a>
## Preset properties

Here's the list of properties that the presets accept.

### `widths`

This property is the main one. It's an array of width object. Make sure you enter the width objects in ascendant width order. Here's the supported width object properties:

- `width` : Specify an image size available for this image.
- `name` : A name for this image size.
- `pixelRatios` : An array of available pixel ratios for this image
- Any other key/value pairs you want that will be available in the `computeSrc` function

### `computeSrc`

This property represent a function that will be called before applying the new image src. You will have access to the width object corresponding to the better size to apply. Here's the attributes that you will have:

- `src` : The original image source taken from the original HTML
- `widthObj` : The best suited width object for this image with all your custom key/pairs values

This function need to return the new image `src` to apply. Here's an example:

```js
{
  widths: [{
    // widths here...
  }],
  computeSrc: (src, widthObj) => {
    // {width} is the same as ${widthObj.width}
    return src + `?auto=compress&w={width}&fit=crop&fm=png&dpr={pixelRatio}`
  }
}
```

> If you set some "tokens" like `{width}` in the url, they will be replaced with the corresponding width object property.

<a id="readme-browsers-support"></a>
## Browsers support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari |
| --------- | --------- | --------- | --------- |
| IE11+ | last 2 versions| last 2 versions| last 2 versions

> As browsers are automatically updated, we will keep as reference the last two versions of each but this component can work on older ones as well.

> The webcomponent API (custom elements, shadowDOM, etc...) is not supported in some older browsers like IE10, etc... In order to make them work, you will need to integrate the [corresponding polyfill](https://www.webcomponents.org/polyfills).

<a id="readme-code-linting"></a>
##  Code linting

This package uses some code linting rules. Here's the list:

1. [StandardJS](https://standardjs.com/) for javascript files
2. [Stylelint](https://github.com/stylelint/stylelint) with [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) for `scss` files

> Your commits will not been accepted if the code style is not respected!

<a id="readme-contribute"></a>
## Contribute

This is an open source project and will ever be! You are more that welcomed to contribute to his development and make it more awesome every day.
To do so, you have several possibilities:

1. [Share the love ❤️](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-share-the-love)
2. [Declare issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-declare-issues)
3. [Fix issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-fix-issues)
4. [Add features](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-add-features)
5. [Build web component](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-build-web-component)

<a id="readme-who-are-coffeekraken"></a>
## Who are Coffeekraken

We try to be **some cool guys** that build **some cool tools** to make our (and yours hopefully) **every day life better**.  

#### [More on who we are](https://github.com/Coffeekraken/coffeekraken/blob/master/who-are-we.md)

<a id="readme-license"></a>
## License

The code is available under the [MIT license](LICENSE.txt). This mean that you can use, modify, or do whatever you want with it. This mean also that it is shipped to you for free, so don't be a hater and if you find some issues, etc... feel free to [contribute](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md) instead of sharing your frustrations on social networks like an asshole...
