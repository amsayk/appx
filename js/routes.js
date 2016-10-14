import React, {} from 'react';
import {
  Route,
  IndexRedirect,
  Redirect,
} from 'react-router';

import LoginRoute from 'containers/Login';

import AppContainerRoute from 'containers/AppContainer';

import RootContainer from 'containers/RootContainer';

export default (store) => {

  return (
    <Route path='/' component={RootContainer}>

      <IndexRedirect to={'/app'}/>

      <Route {...AppContainerRoute(store)}/>

      <Route {...LoginRoute(store)}/>

      <Redirect from={'*'} to={'/app'}/>

    </Route>
  );
};

