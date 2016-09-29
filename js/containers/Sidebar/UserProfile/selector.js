import { createSelector } from 'utils/reselect';

const getMenuOpen = (state) => state.getIn(['sidebar', 'menuOpen']);

export default createSelector(
  [ getMenuOpen ],
  (menuOpen) => ({ menuOpen, })
);
