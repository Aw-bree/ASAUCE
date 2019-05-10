import {
  RECEIVE_PRODUCTS,
  RECEIVE_PRODUCT } from '../actions/products';
import { RECEIVE_ORDER } from '../actions/orders';
import { RECEIVE_ORDER_ITEM } from '../actions/order_items'
import { merge } from 'lodash/merge';
// window.fetchOrder = fetchOrder;
// import { store } from 'react-redux';
// window.store = store;

const productsReducer = (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState = Object.assign({}, oldState)
  let product;

  switch (action.type) {
    case RECEIVE_PRODUCTS:
      return Object.assign(newState, action.products);
    case RECEIVE_PRODUCT:
      product = action.payload.product;
      return Object.assign(newState, { [product.id]: product });
    case RECEIVE_ORDER:
      return Object.assign(newState, action.products);
    default:
      return oldState;
  }
}

export default productsReducer;