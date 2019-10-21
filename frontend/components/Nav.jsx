import React from 'react';
import NavEcomBar from './NavEcomBar';
import NavToolbarContainer from './NavToolbarContainer';
import NavCategoryBar from './NavCategoryBar';

export default () => {
  return (
    <section className="nav-bar">
      <NavEcomBar />
      <NavToolbarContainer />
      <NavCategoryBar />
    </section>
  );
};