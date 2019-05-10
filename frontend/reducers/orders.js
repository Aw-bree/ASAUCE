import { RECEIVE_ORDER } from '../actions/orders';
import { RECEIVE_PRODUCT } from '../actions/products';
import { LOGOUT_CURRENT_USER } from '../actions/session';
import { merge } from 'lodash';

const ordersReducer = (oldState = {}, action) => {
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

export default ordersReducer;