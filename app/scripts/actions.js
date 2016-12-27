(function () {
  'use strict'

  TemplateApp.Actions = TemplateApp.Actions || {}

  /**
   * Dispatches updatePage action to Redux
   * @type {Function}
   */
  TemplateApp.updatePage = TemplateApp.updatePage || function (pageId) {
      TemplateApp.Redux.Store.dispatch({
        type: TemplateApp.Actions.UPDATE_PAGE,
        pageId: pageId
      })
    }

  /**
   *
   * @type {string}
   */
  TemplateApp.Actions.UPDATE_PAGE = 'update_page'

})()