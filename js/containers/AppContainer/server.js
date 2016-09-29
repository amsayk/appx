import UserIsAuthenticated from 'utils/UserIsAuthenticated';

import modalsReducer from 'redux/reducers/modals/reducer';
import sidebarReducer from 'redux/reducers/sidebar/reducer';
import helpReducer from 'redux/reducers/help/reducer';
import bodyReducer from 'redux/reducers/body/reducer';

import AppContainer from './AppContainer';

export default (store) => ({
  path: 'app',
  /*  Async getComponent is only invoked when route matches   */
  getComponent: function () {
    let Component;

    return (nextState, cb) => {

      if (Component) {
        cb(null, Component);
        return;
      }

      Component = UserIsAuthenticated(AppContainer);

      store.injectReducers([
        { key: 'modals', reducer: modalsReducer },
        { key: 'sidebar', reducer: sidebarReducer },
        { key: 'help', reducer: helpReducer },
        { key: 'body', reducer: bodyReducer },
      ]);

      /*  Return getComponent   */
      cb(null, Component);
    };
  }(),
  onEnter: function () {
    const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
    return connect(UserIsAuthenticated.onEnter);
  }(),
});
