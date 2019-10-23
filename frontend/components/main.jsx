import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';
import Home from './Home';
import NavContainer from './NavContainer';
import ProductsIndexContainer from './ProductIndexContainer';
import ProductShowContainer from './ProductShowContainer';
import OrdersShowContainer from './OrderIndexContainer';
import Footer from './Footer';


export default (state) => (
  <div id="main">
    <Route path="/" component={NavContainer} />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path={"/products/search"} component={ProductsIndexContainer} />
      <Route exact path={"/products"} component={ProductsIndexContainer} />
      <Route exact path={"/products/:productId"} component={ProductShowContainer} />
      <Route exact path={"/orders/:orderId"} component={OrdersShowContainer} />
      <Route render={() => <Redirect to={{ pathname: "/" }} />} />
    </Switch>
    <Route path="/" component={Footer} />
  </div>
);

 