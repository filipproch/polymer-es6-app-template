(function () {
  'use strict'

  TemplateApp.Utils = TemplateApp.Utils || {}

  /**
   * Provides utils methods to obtain information about & from browser
   */
  TemplateApp.Utils.BrowserInfo = TemplateApp.Utils.BrowserInfo || class {
      static isIOS () {
        return (/(iPhone|iPad|iPod)/gi).test(navigator.platform)
      }

      static isAndroid () {
        return (/Android/gi).test(navigator.userAgent)
      }

      static isSafari () {
        const userAgent = navigator.userAgent
        return (/Safari/gi).test(userAgent) && !(/Chrome/gi).test(userAgent)
      }

      static isIE () {
        const userAgent = navigator.userAgent
        return (/Trident/gi).test(userAgent)
      }

      static isEdge () {
        return /Edge/i.test(navigator.userAgent)
      }

      static isFF () {
        const userAgent = navigator.userAgent
        return (/Firefox/gi).test(userAgent)
      }

      static isTouchScreen () {
        return ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch
      }

      /**
       * Returns the Chrome version number.
       * @return {Number} The Chrome version number.
       */
      static getChromeVersion () {
        const raw = navigator.userAgent.match(/Chrome\/([0-9]+)\./)
        return raw ? parseInt(raw[ 1 ], 10) : false
      }

      /**
       * Returns the Firefox version number.
       * @return {Number} The Firefox version number.
       */
      static getFirefoxVersion () {
        const raw = navigator.userAgent.match(/Firefox\/([0-9]+)\./)
        return raw ? parseInt(raw[ 1 ], 10) : false
      }

      static getUserLanguage () {
        let lang = window.navigator.languages ? window.navigator.languages[ 0 ] : null
        lang = lang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage
        if (lang.indexOf('-') !== -1) {
          lang = lang.split('-')[ 0 ]
        }
        if (lang.indexOf('_') !== -1) {
          lang = lang.split('_')[ 0 ]
        }
        return lang
      }

    }

})()