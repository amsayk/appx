import user from 'redux/reducers/user/reducer';
import app from 'redux/reducers/app/reducer';

import {
  INIT,
} from 'utils/environment';

import {
  combineReducers
} from 'redux-immutable';

import {reducer as formReducer} from 'redux-form/immutable';

const reducers = {
  app,
  user,
  form: formReducer,
};

const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    ...reducers,
    ...asyncReducers,
  });
};

export const injectReducers = (store, reducers) => {
  reducers.forEach(({ key, reducer }) => {
    store.asyncReducers[key] = reducer;
  });
  store.replaceReducer(makeRootReducer(store.asyncReducers));
  store.dispatch({ type: INIT });
};

export default makeRootReducer;

