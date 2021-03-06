import user from './user/reducer';
import app from './app/reducer';
import snackbar from './snackbar/reducer';

import { USER_LOGGED_OUT } from './user/constants';

import {
  combineReducers
} from 'redux-immutable';

import routerReducer from './routing/reducer';

import {reducer as formReducer} from 'redux-form/immutable';

const reducers = {
  app,
  user,
  snackbar,
  form: formReducer.plugin({
    login: (state, action) => {
      switch (action.type) {
        case USER_LOGGED_OUT:
          return state ? state.mergeDeep({
            values: {
              password: undefined,
            },
          }) : state;
        default:
          return state
      }
    },
  }),
};

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    routing: routerReducer,
    ...reducers,
    ...asyncReducers,
  });
};

export const injectReducers = (store, reducers) => {
  reducers.forEach(({ key, reducer }) => {
    store.asyncReducers[key] = reducer;
  });
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
