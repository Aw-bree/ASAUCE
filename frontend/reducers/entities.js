import { combineReducers } from 'redux';
import productsReducer from './products';
import productItemsReducer from './product_items';
import ordersReducer from './orders';
import orderItemsReducer from './order_items';

export default combineReducers({
  products: productsReducer,
  productItems: productItemsReducer,
  orders: ordersReducer,
  orderItems: orderItemsReducer
});