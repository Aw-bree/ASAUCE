import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from './footer/footer';
import Home from './home/home';
import NavBarContainer from './nav_bar/nav_bar_container';
import ProductsIndexContainer from './products/product_index_container';

export default (state) => (
  <div id="main">
    <Route path="/" component={NavBarContainer} />
    <Route exact path="/" component={Home} />
    <Route exact path="/products" component={ProductsIndexContainer} />
    <Route path="/" component={Footer} />
  </div>
);