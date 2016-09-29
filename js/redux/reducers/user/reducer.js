import {
  isServer,
  INIT,
} from 'utils/environment';

import getCurrentUser from 'utils/getCurrentUser';

import Immutable from 'immutable';

import { USER_LOGGED_IN, USER_LOGGED_OUT  } from './constants';

function maybeUser() {
  const user = getCurrentUser();
  return user ? user.toJSON() : {};
}

const initialState = Immutable.fromJS(maybeUser());

export default function userReducer(state = initialState, { type, payload }) {
  if (type === USER_LOGGED_IN) {
    return Immutable.fromJS(payload);
  }
  if (type === USER_LOGGED_OUT) {
    return Immutable.fromJS({});
  }
  if (type === INIT) {
    return isServer ? Immutable.fromJS(maybeUser()) : state;
  }
  return state;
}
