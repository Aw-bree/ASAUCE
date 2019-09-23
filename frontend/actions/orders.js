import * as orderApiUtil from '../utils/order_util';

export const RECEIVE_ORDER = "RECEIVE_ORDER";

export const receiveOrder = payload => ({
  type: RECEIVE_ORDER,
  order: payload.order,
  orderItems: payload.orderItems,
  products: payload.products,
  productItems: payload.productItems,
  users: payload.users
})

export const createOrder = user => dispatch => {
  return orderApiUtil.createOrder(user)
    .then(payload => dispatch(receiveOrder(payload)))
}

export const fetchOrder = (id) => dispatch => {
  return orderApiUtil.fetchOrder(id)
    .then(payload => dispatch(receiveOrder(payload)))
}




window.fetchOrder = fetchOrder
