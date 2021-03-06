import { RECEIVE_ORDER } from '../actions/order_actions';
import { RECEIVE_PRODUCT } from '../actions/product_actions';
import { LOGOUT_CURRENT_USER } from '../actions/session_actions';

import { merge } from 'lodash';


export default (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;

  switch (action.type) {
    case RECEIVE_ORDER:
      newState = merge({}, oldState, action.order);
      return newState;
    case RECEIVE_PRODUCT:
      return merge({}, oldState, action.payload.orders);
    case LOGOUT_CURRENT_USER:
      return {};
    default:
      return oldState;
  }
}