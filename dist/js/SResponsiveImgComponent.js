'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _sNativeWebComponent = require('coffeekraken-sugar/js/core/sNativeWebComponent');

var _sNativeWebComponent2 = _interopRequireDefault(_sNativeWebComponent);

var _debounce = require('coffeekraken-sugar/js/utils/functions/debounce');

var _debounce2 = _interopRequireDefault(_debounce);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// store the properties by name
var __responsiveProperties = {};

/**
 * Provide a nice way to make images responsive without using srcset and sizes attributes.
 * Register a preset first
 * ```js
 * SResponsiveImgComponent.registerPreset('default', {
 *   widths: [{
 *     width: 340,
 *     name: 'mobile',
 *     pixelRatios: [1,2]
 *   }, {
 *     width: 640,
 *     name: 'tablet',
 *     pixelRatios: [1,2]
 *   }, {
 *     width: 1280,
 *     name: 'desktop',
 *     pixelRatios: [1,2]
 *   }],
 *   computeSrc: (src, widthObj) => {
 *     return src + `?auto=compress&w={width}&fit=crop&fm=png&dpr={pixelRatio}`
 *   }
 * })
 * ```
 * @example    html
 * <img lazy-src="https://assets.imgix.net/hp/snowshoe.jpg" is="s-responsive-img" />
 *
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 */

var SResponsiveImgComponent = function (_native) {
  _inherits(SResponsiveImgComponent, _native);

  function SResponsiveImgComponent() {
    _classCallCheck(this, SResponsiveImgComponent);

    return _possibleConstructorReturn(this, (SResponsiveImgComponent.__proto__ || Object.getPrototypeOf(SResponsiveImgComponent)).apply(this, arguments));
  }

  _createClass(SResponsiveImgComponent, [{
    key: 'componentMount',


    /**
     * Mount component
     * @definition    SWebComponent.componentMount
     */
    value: function componentMount() {
      _get(SResponsiveImgComponent.prototype.__proto__ || Object.getPrototypeOf(SResponsiveImgComponent.prototype), 'componentMount', this).call(this);

      // get the original src
      this._originalSrc = this.getAttribute('src') || this.getAttribute('data-src') || this.getAttribute('lazy-src');

      // stop here if the image has no src
      if (!this._originalSrc) return;

      // check if has a responsive properties name
      if (this.props.preset && __responsiveProperties[this.props.preset]) {
        // merge the props
        this.props = _extends({}, this.props, __responsiveProperties[this.props.preset]);
      }

      // throttle the window resize function to avoid to much
      // calls
      this._onWindowResize = (0, _debounce2.default)(this.__onWindowResize.bind(this), 500);

      // listen for window resize
      window.addEventListener('resize', this._onWindowResize);

      // first resize
      this.__onWindowResize();
    }

    /**
     * Component unmount
     * @definition    SWebComponent.componentUnmount
     */

  }, {
    key: 'componentUnmount',
    value: function componentUnmount() {
      _get(SResponsiveImgComponent.prototype.__proto__ || Object.getPrototypeOf(SResponsiveImgComponent.prototype), 'componentUnmount', this).call(this);
      // stop listening for window resize
      window.removeEventListener('resize', this._onWindowResize);
    }

    /**
     * Component will receive prop
     * @definition    SWebComponent.componentWillReceiveProp
     */

  }, {
    key: 'componentWillReceiveProp',
    value: function componentWillReceiveProp(name, newVal, oldVal) {
      switch (name) {
        case 'lazySrc':
        case 'dataSrc':
          if (!newVal) return;
          if (!newVal.toString().match(/^[a-zA-Z0-9_/]/)) return;
          // save the new original src
          this._originalSrc = newVal;
          // apply the new src
          this._applySrc();
          break;
      }
    }

    /**
     * Apply the good src to the image
     * @return    {void}
     */

  }, {
    key: '_applySrc',
    value: function _applySrc() {
      // calculate the width of the image
      var imageWidth = this.offsetWidth;
      var appliedWidth = this.props.widths[0] || 0;

      // grab the best available width
      for (var i = 0; i < this.props.widths.length; i++) {
        var widthObj = this.props.widths[i];
        appliedWidth = widthObj;
        if (imageWidth < widthObj.width) {
          // that mean that the image is larger
          // that the current applied width
          // so we stop the loop
          break;
        }
      }

      // make sure we have a name
      if (!appliedWidth.name) {
        appliedWidth.name = appliedWidth.width.toString();
      }

      // set the exactWidth property
      appliedWidth.exactWidth = imageWidth;

      // check pixel ratios
      if (window.devicePixelRatio && appliedWidth.pixelRatios) {
        if (appliedWidth.pixelRatios.indexOf(window.devicePixelRatio) !== -1) {
          appliedWidth.pixelRatio = window.devicePixelRatio;
        } else {
          appliedWidth.pixelRatio = 1;
        }
      } else {
        appliedWidth.pixelRatio = 1;
      }

      // conpute the src
      var src = this._computeSrc(appliedWidth);

      // load and set the src
      this._loadAndSetSrc(src);
    }

    /**
     * Load the new image and set the src
     * @param    {String}    src    The src to set
     * @return    {void}
     */

  }, {
    key: '_loadAndSetSrc',
    value: function _loadAndSetSrc(src) {
      var _this2 = this;

      // load the new image
      var img = new window.Image();
      img.onload = function () {
        // set the new src
        _this2.setAttribute('src', src);
      };
      img.src = src;
    }

    /**
     * Compute the new src
     * @param    {Object}    widthObj    The width object that will be applied
     * @return    {String}    The new src to apply
     */

  }, {
    key: '_computeSrc',
    value: function _computeSrc(widthObj) {
      // store the new src
      var src = this._originalSrc;
      // check if has a computeSrc setting
      if (this.props.computeSrc) {
        src = this.props.computeSrc.apply(this, [src, widthObj]);
      }
      // compute the tokens
      src = src.replace(/\{[a-zA-Z0-9_-]+\}/g, function (match) {
        var key = match.replace('{', '').replace('}', '');
        if (widthObj[key]) {
          return widthObj[key];
        }
        return match;
      });

      // return the computed src
      return src;
    }

    /**
     * When the window is resized
     * @param    {Event}    e    The event
     * @return    {void}
     */

  }, {
    key: '__onWindowResize',
    value: function __onWindowResize(e) {
      // apply the good image src
      this._applySrc();
    }
  }], [{
    key: 'registerPreset',

    /**
     * Register an image responsive properties by preset name
     * @param    {String}    preset    The responsive properties preset name
     * @param    {Object}    options    The responsive properties options
     */
    value: function registerPreset(preset, options) {
      __responsiveProperties[preset] = options;
    }

    /**
     * Default props
     * @definition    SWebComponent.defaultProps
     */

  }, {
    key: 'defaultCss',


    /**
     * Default css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return '\n      img[is="' + componentNameDash + '"] {\n        width: 100%;\n      }\n    ';
    }
  }, {
    key: 'defaultProps',
    get: function get() {
      return {

        /**
         * Specify a registered preset to use as properties
         * @prop
         * @type    {String}
         */
        preset: 'default',

        /**
         * Store the available widths object for this image in an array.
         * A width object has to be shaped like so at least:
         * ```
         * {
         *   width: 1200,
         *   name: 'tablet'
         * }
         * ```
         * @type    {String|Array}
         */
        widths: [],

        /**
         * Data src to delay the download of the image. Same as lazySrc
         * @prop
         * @type    {String}
         */
        dataSrc: null,

        /**
         * Lazy src to delay the download of the image. Same as dataSrc.
         * @prop
         * @type    {String}
         */
        lazySrc: null,

        /**
         * Specify a function that will compute the src before applying it.
         * Will have as parameters the original src and the best suited width object.
         * @prop
         * @type    {Function}
         */
        computeSrc: null
      };
    }
  }]);

  return SResponsiveImgComponent;
}((0, _sNativeWebComponent2.default)(window.HTMLImageElement));

exports.default = SResponsiveImgComponent;