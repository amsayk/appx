import { createSelector } from 'utils/reselect';

const sidebarCollapsed = (state) => state.getIn(['sidebar', 'sidebarCollapsed']);
const groupExpanded = (state) => state.getIn(['sidebar', 'groupExpanded']);

export default createSelector(
  [ sidebarCollapsed, groupExpanded ],
  (sidebarCollapsed, groupExpanded) => ({ sidebarCollapsed, groupExpanded, })
);
