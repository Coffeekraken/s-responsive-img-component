import 'babel-polyfill'
import 'webcomponents.js/webcomponents-lite'
// import '@webcomponents/webcomponentsjs/bundles/webcomponents-ce'
// import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter'
import 'coffeekraken-sugar/js/features/all'
import SResponsiveImgComponent from '../../../dist/index'

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
