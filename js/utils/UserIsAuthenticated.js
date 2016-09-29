import { UserAuthWrapper } from 'redux-auth-wrapper';
import { replace } from 'react-router-redux';

export default UserAuthWrapper({
  authSelector: state => state.get('user').toJS(),
  redirectAction: (newLoc) => (dispatch) => dispatch(replace(newLoc)),
  wrapperDisplayName: 'UserIsAuthenticated'
});
