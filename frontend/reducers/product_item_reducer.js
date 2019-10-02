import { RECEIVE_PRODUCT_ITEM, } from '../actions/product_item_actions';
import { RECEIVE_PRODUCT } from '../actions/product_actions';
import { RECEIVE_ORDER } from '../actions/order_actions';

import { merge } from 'lodash';

export default (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;
  let productItems;
  switch (action.type) {
    case RECEIVE_PRODUCT_ITEM:
      newState = merge({}, oldState, { [action.productItem.id]: action.productItem });
      return newState;
    case RECEIVE_PRODUCT:
      productItems = action.payload.product_items;
      return merge({}, oldState, productItems);
    case RECEIVE_ORDER:
      newState = merge({}, newState, action.productItems);
      return newState;
    default:
      return oldState;
  }
};