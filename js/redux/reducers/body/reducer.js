import {
  FILTER_OPS,
} from './constants';

import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  filterText: '',
});

export default function reducer(state = initialState, action) {
  switch (action.type) {

    case FILTER_OPS:

      return state.merge({
        filterText: action.filterText,
      });

    default:
      return state;
  }
}
