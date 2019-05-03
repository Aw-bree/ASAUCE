import React from 'react';
import EcomBar from './ecom_bar';
import ToolbarContainer from './toolbar_container';
import CategoryBar from './category_bar';

export default () => {
  return (
    <section className="nav-bar">
      <EcomBar />
      <ToolbarContainer />
      <CategoryBar />
    </section>
  );
};