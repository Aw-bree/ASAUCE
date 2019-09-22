import { connect } from 'react-redux';
import { requestProduct } from '../../actions/products';
import { createOrderItem } from '../../actions/order_items';
import { updateProductItem } from '../../actions/product_items';
import ProductShow from './product_show';
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