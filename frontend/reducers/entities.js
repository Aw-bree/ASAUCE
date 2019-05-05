import { combineReducers } from 'redux';
import productsReducer from './products';
import productItemsReducer from './product_items';

export default combineReducers({
  products: productsReducer,
  productItems: productItemsReducer
});