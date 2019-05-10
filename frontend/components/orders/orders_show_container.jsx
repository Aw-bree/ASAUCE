import React from 'react';
import { connect } from 'react-redux';
import { fetchOrder } from '../../actions/orders';
import OrderShow from './orders_show';
import { updateProductItem } from '../../actions/product_items';
import { deleteOrderItem } from '../../actions/order_items';
import { selectOrderItemListings } from '../../reducers/selectors';
import { selectSubTotal } from '../../reducers/selectors';

const mapStateToProps = (state, ownParams) => {
  let orderId = ownParams.match.params.orderId;
  return {
    orders: state.entities.orders[orderId],
    currentUser: state.session.currentUser,
    products: state.entities.products,
    productItems: state.entities.productItems,
    orderItems: state.entities.orderItems,
    orderListItems: selectOrderItemListings(state.entities.orderItems, state.entities.products, state.entities.productItems),
    subTotal: selectSubTotal(state)
  }

  
}

const mapDispatchToProps = dispatch => {

  return {
    fetchOrder: (id) => dispatch(fetchOrder(id)),
    deleteOrderItem: (id) => dispatch(deleteOrderItem(id)),
    updateProductItem: (productItem) => dispatch(updateProductItem(productItem))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderShow);