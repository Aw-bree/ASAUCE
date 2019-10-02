import { connect } from 'react-redux';

import ProductShow from './product_show';

import { requestProduct } from '../../actions/product_actions';
import { createOrderItem } from '../../actions/order_item_actions';
import { updateProductItem } from '../../actions/product_item_actions';

import { selectSizeAvailability } from '../../reducers/selectors';

const mapStateToProps = (state, ownParams) => {
  let productId = ownParams.match.params.productId;
  return {
    product: state.entities.products[productId],
    currentUser: state.session.currentUser,
    orders: state.entities.orders,
    productItems: state.entities.productItems,
    selectedSizes: Object.entries(selectSizeAvailability(state))
  }
}

const mapDispatchToProps = dispatch => {
  return {
    requestProduct: (id) => dispatch(requestProduct(id)),
    createOrderItem: (user, orderItem, order) => dispatch(createOrderItem(user, orderItem, order)),
    updateProductItem: (productItem) => dispatch(updateProductItem(productItem))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductShow);