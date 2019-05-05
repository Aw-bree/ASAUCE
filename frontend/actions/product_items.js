import * as productItemAPIUtil from '../utils/product';
export const RECEIVE_PRODUCT_ITEMS = 'RECEIVE_PRODUCT_ITEMS';
export const RECEIVE_PRODUCT_ITEM = 'RECEIVE_PRODUCT_ITEM';


const receiveAllProductItems = (productItems) => ({
  type: RECEIVE_PRODUCT_ITEMS,
  productItems
});

const receiveProduct = (productItem) => ({
  type: RECEIVE_PRODUCT_ITEM,
  productItem
});

export const requestProductItems = () => dispatch => (
  productItemAPIUtil.fetchProductItems()
    .then(productItems => dispatch(receiveAllProductItems(productItems)))
);

export const requestProductItem = (id) => dispatch(
  productItemAPIUtil.fetchProductItem(id)
    .then(productItem => dispatch(receiveProductItem(productItem)))
);

