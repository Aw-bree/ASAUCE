import React from 'react';
import { Link } from 'react-router-dom';
import EcomBar from './ecom_bar';
import Toolbar from './toolbar';

export default ({ currentUser, logout }) => {
  const display = currentUser ? (
    <div>
      <button onClick={logout}>Log Out!</button>
    </div>
  ) : (
      <div>
        <Link className="btn" to="/signup">Sign Up</Link>
        <Link className="btn" to="/login">Log In</Link>
      </div>
    );

  return (
    <div class-name="nav-bar">
      <EcomBar />
      <Toolbar />
      {display}
      {/* <Banner /> */}
    </div>
  );
};