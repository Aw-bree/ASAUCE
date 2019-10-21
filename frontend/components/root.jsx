import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { AuthRoute } from '../utils/route_util';
import LoginContainer from './LoginContainer';
import SignupContainer from './SignupContainer';
import Main from './Main';


export default ({ store }) => (
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <AuthRoute exact path="/login" component={LoginContainer} />
        <AuthRoute exact path="/signup" component={SignupContainer} />
        <Route path="/" component={Main} />
      </Switch>
    </HashRouter>
  </Provider>
);