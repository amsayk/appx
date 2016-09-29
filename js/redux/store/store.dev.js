import { createStore, applyMiddleware, compose } from 'redux';

import array from '../middlewares/array';

import Immutable from 'immutable';

import { client as apolloClient } from 'apollo-client';

import {
  SELECT_COMPANY,
} from 'redux/reducers/sidebar/constants';

import {
  HELP_SKIPPED,
  STEP_COMPLETED,
} from 'redux/reducers/help/constants';

import { middleware as reduxCookieMiddleware } from 'redux-cookie-persist-middleware';

import { persistState } from 'redux-devtools';
import DevTools from 'containers/DevTools';

import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import { createHistory, useBeforeUnload } from 'history';

import { useRouterHistory } from 'react-router';

import thunk from 'redux-thunk';

import ReduxWorker from 'worker?inline!../worker.js';

import makeRootReducer, { injectReducers } from '../reducers';

import { applyWorker } from 'redux-worker';

import { getBeforeUnloadMessage } from 'utils/unbeforeunload';

const browserHistory = useBeforeUnload(useRouterHistory(createHistory))({ basename: '/', });

browserHistory.listenBeforeUnload(function () {
  return getBeforeUnloadMessage();
});

const middlewares = [
  thunk.withExtraArgument(apolloClient),
  array,
  routerMiddleware(browserHistory),
  reduxCookieMiddleware({
    [SELECT_COMPANY]: {
      reducerKey: 'sidebar.selectedCompanyId',
      cookieKey: 'selectedCompanyId',
    },

    [HELP_SKIPPED]: {
      reducerKey: 'help.skipped',
      cookieKey: 'helpSkipped',
    },

    [STEP_COMPLETED]: {
      reducerKey: 'help.completed',
      cookieKey: 'stepsCompleted',
    },
  })
];

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

const worker = new ReduxWorker();

const enhancer = compose(
  applyMiddleware(...middlewares),
  applyWorker(worker),

  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),

  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
);

export const store = createStore(makeRootReducer(), Immutable.fromJS(window.__APP_STATE__ || {}), enhancer);

store.asyncReducers = {};
store.injectReducers = (reducers) => injectReducers(store, reducers);

export const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.get('routing').toJS(),
});
