import cookie from 'react-cookie';

import {
  isServer,
  INIT,
} from 'utils/environment';

import {
  HELP_SKIPPED,
  STEP_COMPLETED,
} from './constants';

import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  completed: cookie.load('stepsCompleted') || [],
  skipped: Boolean(cookie.load('helpSkipped')),
});

export default function reducer(state = initialState, action){
  if (action.type === HELP_SKIPPED) {
    return state.merge({
      skipped: true,
    });
  }

  if (action.type === STEP_COMPLETED) {
    return state.merge({
      completed: state.get('completed').concat([ action.id ]),
    });
  }

  if (action.type === INIT) {
    return isServer ? Immutable.fromJS({
      completed: cookie.load('stepsCompleted') || [],
      skipped: Boolean(cookie.load('helpSkipped')),
    }) : state;
  }

  return state;
}
