import {
  OPEN_MODAL,
  CLOSE_MODAL,
} from './constants';

import Immutable from 'immutable';

const initialState = Immutable.fromJS({

  account: {
    modalOpen: false,
  },

  pdfViewer: {
    modalOpen: false,
  },

  company: {
    modalOpen: false,
  },

  form: {
    modalOpen: false,
  },

});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case OPEN_MODAL:

      return state.merge({
        [action.key]: {
          modalOpen: true,
          state: action.state,
        }
      });

    case CLOSE_MODAL:

      return state.merge({
        [action.key]: {
          modalOpen: false,
          state: undefined,
        }
      });

    default:
      return state;
  }
}
