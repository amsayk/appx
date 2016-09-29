import Parse from 'parse';

import { USER_LOGGED_IN, USER_LOGGED_OUT,  } from './constants';

import { push } from 'react-router-redux';

export function login(payload) {
  return {
    type: USER_LOGGED_IN,
    payload,
  };
}

export function logout() {
  return (dispatch, getState, client) => {

    function doLogout(){
      dispatch({ type: USER_LOGGED_OUT });
      dispatch(push('/'));
      client.resetStore();
    }

    Parse.User.logOut().always(doLogout);
  };
}
