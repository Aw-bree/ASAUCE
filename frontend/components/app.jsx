import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AuthRoute } from '../utils/route_util';
import LoginContainer from './session/login_container';
import SignupContainer from './session/signup_container';
import Main from './main';


// possible error solution 
//https://stackoverflow.com/questions/49109651/how-to-clear-custom-message-created-by-error-boundary-when-i-navigate-to-other-r

// got ternary from: https://reacttraining.com/react-router/web/example/modal-gallery
export default () => (
  <div id="app">
    <Switch>
      <AuthRoute exact path="/login" component={LoginContainer} />
      <AuthRoute exact path="/signup" component={SignupContainer} />
      <Route path="/" component={Main} />
    </Switch>
  </div>
);

 