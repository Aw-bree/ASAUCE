

//automate the process of allowing people to see
// certain components based on their login


import React from 'react';
// these are connected componenets
import { connect } from 'react-redux';
// redirect to dif views, these are route specific, give 
// diff components history, match, location, props
import { Redirect, Route, withRouter } from 'react-router-dom';

// is a user logged in?

const mapStateToProps = state => ({
  loggedIn: Boolean(state.session.currentUser)
});

// pass some args directly
// <AuthRoute path="" component={} 
// need to make component capitalized
// auth routes, redirect them conditions
const Auth = ({ loggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      loggedIn ? <Redirect to="/" /> : <Component {...props} />
    )}
  />
);
// logic with ternary if path matches /products kick out to login 

const Protected = ({ loggedIn, path, component: Component }) => (
  <Route
    path={path}
    render={(props) => (
      loggedIn ? <Component {...props} /> : <Redirect to="/login" />
    )}
  />
);

//still need to connect it
export const AuthRoute = withRouter(connect(mapStateToProps)(Auth));
export const ProtectedRoute = withRouter(connect(mapStateToProps)(Protected));