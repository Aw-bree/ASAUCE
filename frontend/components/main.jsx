import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Footer from './footer/footer';
import Home from './home/home';
import NavBarContainer from './nav_bar/nav_bar_container';
import ProductsIndexContainer from './products/product_index_container';
import ProductShowContainer from './products/product_show_container';
import OrdersShowContainer from './orders/orders_show_container';
import { Redirect } from 'react-router-dom';


export default (state) => (
  <div id="main">
    <Route path="/" component={NavBarContainer} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/products" component={ProductsIndexContainer} />
      <Route exact path={"/products/:productId"} component={ProductShowContainer} />
      <Route exact path={"/orders/:orderId"} component={OrdersShowContainer} />
      <Route render={() => <Redirect to={{ pathname: "/" }} />} />
    </Switch>
    <Route path="/" component={Footer} />
  </div>
);

 