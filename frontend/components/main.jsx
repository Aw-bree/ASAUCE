import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from './footer/footer';
import Home from './home/home';
import NavBarContainer from './nav_bar/nav_bar_container';

export default () => (
  <div id="main">
    <Route path="/" component={NavBarContainer} />
    <Route exact path="/" component={Home} />
    <Route path="/" component={Footer} />
  </div>
);