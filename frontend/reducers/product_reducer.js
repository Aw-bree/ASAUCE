import { RECEIVE_PRODUCTS, RECEIVE_PRODUCT } from '../actions/product_actions';
import { RECEIVE_ORDER } from '../actions/order_actions';

import { merge } from 'lodash';

export default (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;

  switch (action.type) {
    case RECEIVE_PRODUCTS:
      newState = merge({}, newState, action.payload.products);
      return newState;
    case RECEIVE_PRODUCT:
      newState = merge({}, newState, { [action.payload.product.id]: action.payload.product });
      return newState;
    case RECEIVE_ORDER:
      newState = merge({}, newState, action.products);
      return newState;
    default:
      return oldState;
  }
}