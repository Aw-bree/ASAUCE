import React from 'react';
import { Link } from 'react-router-dom';
import EcomBar from './ecom_bar';
import Toolbar from './toolbar';
import CategoryBar from './category_bar';

export default ({ currentUser, logout }) => {
  const display = currentUser ? (
    <section className="auth-buttons">
      <p>`Hello {currentUser.first_name}`</p>
      <button onClick={logout}>Log Out!</button>
    </section>
  ) : (
      <section className="auth-buttons">
        <Link to="/signup">Sign Up</Link>
        <Link to="/login">Log In</Link>
      </section>
    );

  return (
    <section className="nav-bar">
      <EcomBar />
      <Toolbar />
      {display}
      <CategoryBar />
    </section>
  );
};