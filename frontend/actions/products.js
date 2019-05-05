import * as productAPIUtil from '../utils/product';
export const RECEIVE_PRODUCTS = 'RECEIVE_PRODUCTS';
export const RECEIVE_PRODUCT = 'RECEIVE_PRODUCT';


const receiveAllProducts = (products) => ({
  type: RECEIVE_PRODUCTS,
  products
});

const receiveProduct = (product) => ({
  type: RECEIVE_PRODUCT,
  product
});

export const requestProducts = () => dispatch => (
  productAPIUtil.fetchProducts()
    .then(products => dispatch(receiveAllProducts(products)))
);

export const requestProduct = (id) => dispatch (
  productAPIUtil.fetchProduct(id)
    .then(product => dispatch(receiveProduct(product)))
);

