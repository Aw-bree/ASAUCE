import * as productItemAPIUtil from '../utils/product_item_util';
export const RECEIVE_PRODUCT_ITEMS = 'RECEIVE_PRODUCT_ITEMS';
export const RECEIVE_PRODUCT_ITEM = 'RECEIVE_PRODUCT_ITEM';


export const receiveAllProductItems = (productItems) => ({
  type: RECEIVE_PRODUCT_ITEMS,
  productItems
});

export const receiveProductItem = (productItem) => ({
  type: RECEIVE_PRODUCT_ITEM,
  productItem
});

export const requestProductItems = () => dispatch => (
  productItemAPIUtil.fetchProductItems()
    .then(productItems => dispatch(receiveAllProductItems(productItems)))
);

export const requestProductItem = (id) => dispatch => (
  productItemAPIUtil.fetchProductItem(id)
    .then(productItem => dispatch(receiveProductItem(productItem)))
);

export const updateProductItem = (productItem) => dispatch => (
  productItemAPIUtil.updateProductItem(productItem)
    .then(response => dispatch(receiveProductItem(response)))
);




