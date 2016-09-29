import { createSelector } from 'utils/reselect';

import Immutable from 'immutable';

const displayMatches = (state) => state.getIn(['app', 'displayMatches']);
const onLine = (state) => state.getIn(['app', 'onLine']);
const getHelp = (state) => state.get('help', HELP_EMPTY).toJS();

export default createSelector(
  [ displayMatches, onLine, getHelp ],
  (displayMatches, onLine, help) => ({ displayMatches, onLine, help, })
);

const HELP_EMPTY = Immutable.fromJS({
  completed: [],
  skipped: false,
});
