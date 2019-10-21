import * as productAPIUtil from '../utils/product_util';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';


export const receiveAllProducts = (payload) => ({
  type: RECEIVE_PRODUCTS,
  payload
});

export const receiveProduct = (payload) => ({
  type: RECEIVE_PRODUCT,
  payload
});

export const requestProducts = () => dispatch => (
  productAPIUtil.fetchProducts()
    .then(products => dispatch(receiveAllProducts(products)))
);

export const requestProduct = (id) => dispatch => (
  productAPIUtil.fetchProduct(id)
  .then(product => dispatch(receiveProduct(product)))
);

