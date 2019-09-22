import { RECEIVE_ORDER_ITEM, REMOVE_ORDER_ITEM } from '../actions/order_items';
import { RECEIVE_ORDER } from '../actions/orders';
import { RECEIVE_PRODUCT } from '../actions/products';
import { merge } from 'lodash';
import { LOGOUT_CURRENT_USER } from '../actions/session';


const orderItemsReducer = (oldState = {}, action) => {
  let newState = Object.assign({}, oldState);
  let orderItems;
  Object.freeze(oldState);

  switch (action.type) {
    case RECEIVE_ORDER_ITEM:
      newState = Object.assign(newState, {[action.orderItem.id]: action.orderItem});
      return newState;
    case REMOVE_ORDER_ITEM:
      newState = merge({}, oldState);
      delete newState[action.orderItemId];
      return newState;
    case RECEIVE_ORDER:
      newState = Object.assign(newState, action.orderItems);
      return newState;
    case RECEIVE_PRODUCT:
      orderItems = action.payload.order_items;
      return Object.assign(newState, orderItems);
    case LOGOUT_CURRENT_USER:
      return {};
    default:
      return oldState;
  }
}

export default orderItemsReducer;