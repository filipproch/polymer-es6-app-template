(function () {
  'use strict'

  const reducersObject = {}

  /**
   * app.page
   */
  const PageReducer = (state = null, action) => {
    switch (action.type) {
      case TemplateApp.Actions.UPDATE_PAGE:
        return action.pageId
      default:
        return state
    }
  }

  /**
   * app.auth.user
   */
  const AuthUserReducer = (state = null, action) => {
    switch (action.type) {
      default:
        return state
    }
  }

  /**
   * app.auth.state
   */
  const AuthStateReducer = (state = 'initializing', action) => {
    switch (action.type) {
      default:
        return state
    }
  }

  /**
   * app.auth
   */
  const AuthReducer = Redux.combineReducers({
    user: AuthUserReducer,
    state: AuthStateReducer
  })

  reducersObject[ 'app' ] = Redux.combineReducers({
    page: PageReducer,
    auth: AuthReducer
  })

  /*
   TODO: register your reducers here
   */

  const storeReducer = Redux.combineReducers(reducersObject)

  const store = Redux.createStore(storeReducer)
  store.subscribe((state) => {
    console.log('state=', state)
  })

  TemplateApp.Redux = TemplateApp.Redux || {
      Store: store,
      Behavior: PolymerRedux(store)
    }

})()