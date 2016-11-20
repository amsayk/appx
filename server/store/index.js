import { createStore, applyMiddleware, compose } from 'redux';

import {
  INIT,
} from 'utils/environment';

import { composeWithDevTools } from 'remote-redux-devtools';

import makeRootReducer, { injectReducers } from './reducers';

import thunk from 'redux-thunk';

import array from 'redux/middlewares/array';

const middlewares = [
  thunk,
  array
];

const composeEnhancers = composeWithDevTools({ realtime: true, name: 'Isomorphic Appx', });

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares),
);

export default () => {
  const store = createStore(makeRootReducer(), enhancer);

  store.asyncReducers = {};
  store.injectReducers = (reducers) => injectReducers(store, reducers);

  store.dispatch({ type: INIT });

  return store;
};

