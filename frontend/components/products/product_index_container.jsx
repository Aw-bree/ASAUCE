import { connect } from 'react-redux';
import React from 'react';
import { requestProducts } from '../../actions/products';
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