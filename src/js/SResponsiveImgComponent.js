import __native from 'coffeekraken-sugar/js/core/sNativeWebComponent'
import __debounce from 'coffeekraken-sugar/js/utils/functions/debounce'

// store the properties by name
const __responsiveProperties = {}

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
export default class SResponsiveImgComponent extends __native(window.HTMLImageElement) {
  /**
   * Register an image responsive properties by preset name
   * @param    {String}    preset    The responsive properties preset name
   * @param    {Object}    options    The responsive properties options
   */
  static registerPreset (preset, options) {
    __responsiveProperties[preset] = options
  }

  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   */
  static get defaultProps () {
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
    }
  }

  /**
   * Default css
   * @protected
   */
  static defaultCss (componentName, componentNameDash) {
    return `
      img[is="${componentNameDash}"] {
        width: 100%;
      }
    `
  }

  /**
   * Mount component
   * @definition    SWebComponent.componentMount
   */
  componentMount () {
    super.componentMount()

    // get the original src
    this._originalSrc = this.getAttribute('src') || this.getAttribute('data-src') || this.getAttribute('lazy-src')

    // stop here if the image has no src
    if (!this._originalSrc) return

    // check if has a responsive properties name
    if (this.props.preset && __responsiveProperties[this.props.preset]) {
      // merge the props
      this.props = {
        ...this.props,
        ...__responsiveProperties[this.props.preset]
      }
    }

    // throttle the window resize function to avoid to much
    // calls
    this._onWindowResize = __debounce(this.__onWindowResize.bind(this), 500)

    // listen for window resize
    window.addEventListener('resize', this._onWindowResize)

    // first resize
    this.__onWindowResize()
  }

  /**
   * Component unmount
   * @definition    SWebComponent.componentUnmount
   */
  componentUnmount () {
    super.componentUnmount()
    // stop listening for window resize
    window.removeEventListener('resize', this._onWindowResize)
  }

  /**
   * Component will receive prop
   * @definition    SWebComponent.componentWillReceiveProp
   */
  componentWillReceiveProp (name, newVal, oldVal) {
    switch (name) {
      case 'lazySrc':
      case 'dataSrc':
        if (!newVal) return
        if (!newVal.toString().match(/^[a-zA-Z0-9_/]/)) return
        // save the new original src
        this._originalSrc = newVal
        // apply the new src
        this._applySrc()
        break
    }
  }

  /**
   * Apply the good src to the image
   * @return    {void}
   */
  _applySrc () {
    // calculate the width of the image
    const imageWidth = this.offsetWidth
    const imageHeight = this.offsetHeight
    let appliedWidth = this.props.widths[0] || 0

    // grab the best available width
    for (let i = 0; i < this.props.widths.length; i++) {
      let widthObj = this.props.widths[i]
      appliedWidth = widthObj
      if (imageWidth < widthObj.width) {
        // that mean that the image is larger
        // that the current applied width
        // so we stop the loop
        break
      }
    }

    // make sure we have a name
    if (!appliedWidth.name) {
      appliedWidth.name = appliedWidth.width.toString()
    }

    // set the exactWidth and exactHeight property
    appliedWidth.exactWidth = imageWidth
    appliedWidth.exactHeight = imageHeight

    // check pixel ratios
    if (window.devicePixelRatio && appliedWidth.pixelRatios) {
      if (appliedWidth.pixelRatios.indexOf(window.devicePixelRatio) !== -1) {
        appliedWidth.pixelRatio = window.devicePixelRatio
      } else {
        appliedWidth.pixelRatio = 1
      }
    } else {
      appliedWidth.pixelRatio = 1
    }

    // conpute the src
    let src = this._computeSrc(appliedWidth)

    // load and set the src
    this._loadAndSetSrc(src)
  }

  /**
   * Load the new image and set the src
   * @param    {String}    src    The src to set
   * @return    {void}
   */
  _loadAndSetSrc (src) {
    // load the new image
    const img = new window.Image()
    img.onload = () => {
      // set the new src
      this.setAttribute('src', src)
    }
    img.src = src
  }

  /**
   * Compute the new src
   * @param    {Object}    widthObj    The width object that will be applied
   * @return    {String}    The new src to apply
   */
  _computeSrc (widthObj) {
    // store the new src
    let src = this._originalSrc
    // check if has a computeSrc setting
    if (this.props.computeSrc) {
      src = this.props.computeSrc.apply(this, [src, widthObj])
    }
    // compute the tokens
    src = src.replace(/\{[a-zA-Z0-9_-]+\}/g, (match) => {
      const key = match.replace('{', '').replace('}', '')
      if (widthObj[key]) {
        return widthObj[key]
      }
      return match
    })

    // return the computed src
    return src
  }

  /**
   * When the window is resized
   * @param    {Event}    e    The event
   * @return    {void}
   */
  __onWindowResize (e) {
    // apply the good image src
    this._applySrc()
  }
}
