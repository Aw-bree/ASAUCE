import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { selectCurrentFilters } from '../selectors/filters';
import { requestProducts } from '../actions/product_actions';
import { requestAttributes } from '../actions/attribute_actions';
import ProductIndex from './ProductIndex';

const mapStateToProps = (state, ownProps) => {
  return {
    currentFilters: selectCurrentFilters(ownProps)
  }
}

const mapDispatchToProps = dispatch => {
  return { 
    requestProducts: () => dispatch(requestProducts()),
    requestAttributes: () => dispatch(requestAttributes())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductIndex));