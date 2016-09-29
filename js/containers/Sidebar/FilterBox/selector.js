import { createSelector } from 'utils/reselect';

const getFilterText = (state) => state.getIn([ 'sidebar', 'filterText' ]);

export default createSelector(
  [ getFilterText ],
  (filterText) => ({ filterText, })
);
