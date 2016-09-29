import { createSelector } from 'utils/reselect';

const getFilterText = (state) => state.getIn([ 'body', 'filterText' ]);

const selector = createSelector(
  [ getFilterText ],
  (filterText) => ({ filterText }),
);

export default selector;
