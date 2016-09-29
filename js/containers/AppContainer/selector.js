import { createSelector } from 'utils/reselect';

const getCurrentUser = (state) => state.get('user').toJS();

export default createSelector(
  [ getCurrentUser],
  (user) => ({ user })
);
