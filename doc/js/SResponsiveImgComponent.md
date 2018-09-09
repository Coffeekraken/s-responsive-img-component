# SResponsiveImgComponent

Provide a nice way to make images responsive without using srcset and sizes attributes.
Register a preset first
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

### Example
```html
	<img lazy-src="https://assets.imgix.net/hp/snowshoe.jpg" is="s-responsive-img" preset="banner" />
```
Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

Extends **__native**




## Attributes

Here's the list of available attribute(s).

### preset

Specify a registered preset to use as properties

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### dataSrc

Data src to delay the download of the image. Same as lazySrc

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### lazySrc

Lazy src to delay the download of the image. Same as dataSrc.

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### computeSrc

Specify a function that will compute the src before applying it.
Will have as parameters the original src and the best suited width object.

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **null**



## Properties


### widths

Store the available widths object for this image in an array.
A width object has to be shaped like so at least:
```
{
  width: 1200,
  name: 'tablet'
}
```

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) , [Array](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array) }**

Default : **[]**


## Methods


### registerPreset

Register an image responsive properties by preset name


#### Parameters
Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
preset  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The responsive properties preset name  |  required  |
options  |  **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**  |  The responsive properties options  |  required  |

**Static**


### defaultProps

Default props

**Static**


### componentMount

Mount component


### componentUnmount

Component unmount


### componentWillReceiveProp

Component will receive prop