import * as orderItemsApiUtil from '../utils/order_items_util';

export const RECEIVE_ORDER_ITEM = 'RECEIVE_ORDER_ITEM';
export const REMOVE_ORDER_ITEM = "REMOVE_ORDER_ITEM";

export const receiveOrderItem = (response) => {
  return ({
    type: RECEIVE_ORDER_ITEM,
    orderItem: response.orderItems
  })
}

export const removeOrderItem = (response) => {
  return ({
    type: REMOVE_ORDER_ITEM,
    orderItemId: Object.keys(response.orderItems)
  })
}


export const createOrderItem = (user, orderItem) => dispatch => {
  return orderItemsApiUtil.createOrderItem(user, orderItem)
    .then(response => dispatch(receiveOrderItem(response)));
}

export const updateOrderItem = (user, orderItem) => dispatch => {
  return orderItemsApiUtil.updateOrderItem(user, orderItem)
    .then(response => dispatch(receiveOrderItem(response)));
}

export const deleteOrderItem = (orderItem, user, orderId) => dispatch => {
  return orderItemsApiUtil.deleteOrderItem(orderItem, user, orderId)
    .then(response => dispatch(removeOrderItem(response)));
}