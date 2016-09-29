import { createStore, applyMiddleware, compose } from 'redux';

import {
  INIT,
} from 'utils/environment';

import devTools from 'remote-redux-devtools';

import makeRootReducer, { injectReducers } from './reducers';

import thunk from 'redux-thunk';

import array from 'redux/middlewares/array';

const middlewares = [
  thunk,
  array
];

const enhancer = compose(
  applyMiddleware(...middlewares),
  devTools({
    name: 'Isomorphic Appx',
    realtime: true,
  })
);

export default () => {
  const store = createStore(makeRootReducer(), enhancer);

  store.asyncReducers = {};
  store.injectReducers = (reducers) => injectReducers(store, reducers);

  store.dispatch({ type: INIT });

  // If you have other enhancers & middlewares
  // update the store after creating / changing to allow devTools to use them
  devTools.updateStore(store);

  return store;
};
