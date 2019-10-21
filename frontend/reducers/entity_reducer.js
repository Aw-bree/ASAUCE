import { combineReducers } from 'redux';

import productReducer from './product_reducer';
import productItemReducer from './product_item_reducer';
import orderReducer from './order_reducer';
import orderItemReducer from './order_item_reducer';
import attributeReducer from './attribute_reducer';

export default combineReducers({
  products: productReducer,
  productItems: productItemReducer,
  orders: orderReducer,
  orderItems: orderItemReducer,
  attributes: attributeReducer
});