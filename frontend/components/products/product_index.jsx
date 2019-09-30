import React from 'react';
import ProductIndexItem from './product_index_item';
import { Link } from 'react-router-dom';

class ProductsIndex extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.requestProducts();
  }

  render() {
    let products = this.props.products.map(product => {
      return <ProductIndexItem key={product.id} product={product} />
    })

    let productCount = products.length;

    return (
      <section className="listings">
        <section className="listings--category-banner">
          <h2 className="listings--category-banner--text">{'breadcrumb last item'}</h2>
        </section>

        <section className="listings--wrapper">
          <section className="listings--filters-wrapper">
            <ul className="listings--filters">
              <ul className="listings--filter--item">
                <li className="listings--filters--item--options"></li>
              </ul>
            </ul>
          </section>

          <section className="listings--wrapper--grid-wrapper">
            <section className="listings--count">
              <h3>{productCount} styles found</h3>
            </section>
            <ul className="listings--products">
              {products}
            </ul>
            <section className="listings--viewed">
              <h3>{'this is a viewed count holder'}</h3>
            </section>
            <section className="listings--load-more">
              <h3>{'load more'}</h3>
            </section>
          </section>
        </section>
      </section>
    );
  }
}

export default ProductsIndex;
