import React, {} from 'react';
import {
  Route,
  IndexRedirect,
  Redirect,
} from 'react-router';

import Login from 'containers/Login/Login';
import AppContainerRoute from 'containers/AppContainer/server';
import RootContainer from 'containers/RootContainer';

export default (store) => (
  <Route path='/' component={RootContainer}>

    <IndexRedirect to={'/app'}/>

    <Route
      {...AppContainerRoute(store)}
    />

    <Route
      path={'login'}
      component={Login}
    />

    <Redirect from={'*'} to={'/app'}/>

  </Route>
);

