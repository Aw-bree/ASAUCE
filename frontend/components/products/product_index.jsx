import React from 'react';
import ProductIndexItem from './product_index_item';
import { Link } from 'react-router-dom';

class ProductsIndex extends React.Component {
  

  componentDidMount() {
    this.props.requestProducts();
  }

  render() {

    let products = this.props.products.map(product => {
      return <ProductIndexItem key={product.id} product={product} />
    })

    return (
      <div>
        <ul>
          {products}
        </ul>
      </div>

    );
  }
}

export default ProductsIndex;
