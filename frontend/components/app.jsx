import React from 'react';
import { Route } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../utils/route_utils';
import NavBarContainer from './nav_bar/nav_bar_container';
import LoginContainer from './session/login_container';
import SignupContainer from './session/signup_container';
import Footer from './footer/footer';
import Home from './home/home';

// got ternary from: https://reacttraining.com/react-router/web/example/modal-gallery
export default () => (
  <div>
    <AuthRoute exact path="/login" component={LoginContainer} />
    <AuthRoute exact path="/signup" component={SignupContainer} />
    <Route path="/" component={NavBarContainer} />
    <Route exact path="/" component={Home} />
    <Route path="/" component={Footer} />
  </div>
);

