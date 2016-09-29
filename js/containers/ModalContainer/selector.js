import { createSelector } from 'utils/reselect';

import Immutable from 'immutable';

const getModalOpen = (key) => (state) => state.getIn(['modals', key]).toJS();
const getHelp = (state) => state.get('help', HELP_EMPTY).toJS();

export default (key) => createSelector(
  [ getModalOpen(key), getHelp ],
  ({ modalOpen, state }, help) => ({ modalOpen, ...state, help })
);

const HELP_EMPTY = Immutable.fromJS({
  completed: [],
  skipped: false,
});
