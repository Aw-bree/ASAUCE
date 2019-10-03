import { connect } from 'react-redux';

import OrderShow from './orders_show';

import { fetchOrder } from '../../actions/order_actions';
import { updateProductItem } from '../../actions/product_item_actions';
import { deleteOrderItem } from '../../actions/order_item_actions';

import { selectOrderItemListings, selectSubTotal } from '../../selectors/selectors';

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