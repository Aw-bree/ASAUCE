import { RECEIVE_PRODUCT_ITEM, } from '../actions/product_items';
import { RECEIVE_PRODUCT } from '../actions/products';
import { merge } from 'lodash';

export default (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;
  switch (action.type) {
    case RECEIVE_PRODUCT_ITEM:
      newState = merge({}, oldState, { [action.productItem.id]: action.productItem });
      return newState;
    case RECEIVE_PRODUCT:
      if (!action.product.productItems) return {};
      return action.product.productItems;
    default:
      return oldState;
  }
};