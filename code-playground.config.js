module.exports = {
  // server port
  port: 3000,

  // title
  title: 's-responsive-img-component',

  // layout
  layout: 'right',

  // compile server
  compileServer: {

    // compile server port
    port: 4000

  },

  // editors
  editors: {
    html: {
      language: 'html',
      data: `
        <h1 class="h3 m-b-small">
          Coffeekraken s-responsive-img-component
        </h1>
        <p class="p m-b-bigger">
          Provide a nice way to make images responsive without using srcset and sizes attributes.
        </p>
        <img is="s-responsive-img" preset="banner" lazy-src="https://assets.imgix.net/hp/snowshoe.jpg" />
      `
    },
    css: {
      language: 'sass',
      data: `
        @import 'node_modules/coffeekraken-sugar/index';
        @import 'node_modules/coffeekraken-s-typography-component/index';

        @include s-setup(());
        @include s-init();
        @include s-classes();
        @include s-typography-classes();

        body {
          padding: s-space(bigger);
        }
      `
    },
    js: {
      language: 'js',
      data: `
        import SResponsiveImgComponent from './dist/index'
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
            return src + '?auto=compress&w={width}&fit=crop&fm=png&dpr={pixelRatio}'
          }
        })
      `
    }
  }
}
