(function () {
  'use strict'

  function lazyLoadWCPolyfillsIfNecessary (callback) {
    callback = callback || null

    let onload = () => {
      if (!window.HTMLImports) {
        document.dispatchEvent(new CustomEvent('WebComponentsReady', { bubbles: true }))
      }
      if (callback) {
        callback()
      }
    }

    let webComponentsSupported = (
    'registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template'))

    if (webComponentsSupported) {
      onload()
    } else {
      let script = document.createElement('script')
      script.async = true
      script.src = '/bower_components/webcomponentsjs/webcomponents-lite.min.js'
      script.onload = onload
      document.head.appendChild(script)
    }

    let chromeVersion = TemplateApp.Utils.BrowserInfo.getChromeVersion()
    let ffVersion = TemplateApp.Utils.BrowserInfo.getFirefoxVersion()
    if (!(chromeVersion && chromeVersion >= 46 || ffVersion && ffVersion >= 40) && TemplateApp.Config.env !== 'dev') {
      let script = document.createElement('script')
      // script.async = true;
      script.src = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=es6,intl'
      document.head.appendChild(script)
      // todo: ga('send', 'event', 'browser', 'unsupported-es6-intl', navigator.userAgent)
    }
  }

  /**
   * Analytics for user install banner action
   */
  // See https://developers.google.com/web/fundamentals/engage-and-retain/app-install-banners/advanced
  window.addEventListener('beforeinstallprompt', function (event) {
    // todo: TemplateApp.Analytics.trackEvent('installprompt', 'fired')

    event.userChoice.then(function (choiceResult) {
      // todo: TemplateApp.Analytics.trackEvent('installprompt', choiceResult.outcome, choiceResult.platform)
    })
  })

  function initApp () {
    lazyLoadWCPolyfillsIfNecessary()
  }

  initApp()
})()