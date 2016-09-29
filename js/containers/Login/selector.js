import { createSelector } from 'utils/reselect';
import messages from './messages';

import cookie from 'react-cookie';

const isAuthenticatedSelector = state => ! state.get('user').isEmpty();
const redirectSelector = (state, props) => props.location.query.redirect || '/';
const initialValuesSelector = () => ({
  email: cookie.load('app.login', /* doNotParse = */true) || messages.defaultLogin.defaultMessage
});

export default createSelector(
  isAuthenticatedSelector,
  redirectSelector,
  initialValuesSelector,
  (isAuthenticated, redirect, initialValues) => ({ isAuthenticated, redirect, initialValues })
);
