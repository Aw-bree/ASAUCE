import {
  RECEIVE_PRODUCTS,
  RECEIVE_PRODUCT } from '../actions/products';
import merge from 'lodash/merge';

const productsReducer = (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;

  switch (action.type) {
    case RECEIVE_PRODUCTS:
      newState = merge({}, action.products)
      return newState;
    case RECEIVE_PRODUCT:
      newState = merge({}, oldState, {[action.productId]: action.product});
      return newState;
    default:
      return oldState;
  }
}

export default productsReducer;