import { RECEIVE_ORDER_ITEM, REMOVE_ORDER_ITEM } from '../actions/order_item_actions';
import { RECEIVE_ORDER } from '../actions/order_actions';
import { RECEIVE_PRODUCT } from '../actions/product_actions';
import { LOGOUT_CURRENT_USER } from '../actions/session_actions';

import { merge } from 'lodash';

const orderItemsReducer = (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;

  switch (action.type) {
    case RECEIVE_ORDER_ITEM:
      newState = merge({}, oldState, {[action.orderItem.id]: action.orderItem});
      return newState;
    case REMOVE_ORDER_ITEM:
      newState = merge({}, oldState);
      delete newState[action.orderItemId];
      return newState;
    case RECEIVE_ORDER:
      newState = merge({}, newState, action.orderItems);
      return newState;
    case RECEIVE_PRODUCT:
      newState = merge({}, oldState, action.payload.order_items);
      return newState;
    case LOGOUT_CURRENT_USER:
      return {};
    default:
      return oldState;
  }
}

export default orderItemsReducer;