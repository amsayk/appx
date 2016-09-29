let AppContainer;

export default (store) => ({
  path: 'app',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {

      if(AppContainer){
        /*  Return getComponent   */
        cb(null, AppContainer);
        return;
      }

      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const { default : Component, } = require('./AppContainer');

      const { default : UserIsAuthenticated, } = require('utils/UserIsAuthenticated');

      AppContainer = UserIsAuthenticated(Component);

      const { default : modalsReducer, } = require('redux/reducers/modals/reducer');
      const { default : sidebarReducer, } = require('redux/reducers/sidebar/reducer');
      const { default : helpReducer, } = require('redux/reducers/help/reducer');
      const { default : bodyReducer, } = require('redux/reducers/body/reducer');

      store.injectReducers([
        { key: 'modals', reducer: modalsReducer },
        { key: 'sidebar', reducer: sidebarReducer },
        { key: 'help', reducer: helpReducer },
        { key: 'body', reducer: bodyReducer },
      ]);

      /*  Return getComponent   */
      cb(null, AppContainer);

      /* Webpack named bundle   */
    }, 'AppContainer');
  }
});
