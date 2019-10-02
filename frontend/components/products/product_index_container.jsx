import { connect } from 'react-redux';
import { requestProducts } from '../../actions/product_actions';
import ProductsIndex from './product_index';

const mapStateToProps = ({ entities }) => {
  return {
    products: Object.values(entities.products)
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    requestProducts: () => dispatch(requestProducts())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsIndex);