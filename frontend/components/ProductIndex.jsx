import React from 'react';
import ProductIndexItem from './ProductIndexItem';
import FilterIndexContainer from './FilterIndexContainer';

class ProductIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: 12,
      products: {}
    }

    this.onLoadMore = this.onLoadMore.bind(this);
    this.filterProducts = this.filterProducts.bind(this);
    this.isFilterable = this.isFilterable.bind(this);
    this.isFilterableByAttribute = this.isFilterableByAttribute.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
  }

  componentDidMount() {
    this.props.requestAttributes()
      .then(this.props.requestProducts()
        .then(response => this.setState({
          products: response.payload.products
        }))
      );
  }

  onLoadMore() {
    this.setState(prev => {
      return { visible: prev.visible + 12};
    });
  }

  filterProducts() {
    let products = this.state.products;
    let currentFilters = this.props.currentFilters;
    let productsArray = Object.values(products);
    let filtersByAttributeArray = Object.entries(currentFilters);

    return productsArray.filter(product => {
      return this.isFilterable(product, filtersByAttributeArray)
    });
  };

  isFilterable(product, filtersByAttributeArray) {
    return filtersByAttributeArray.every(attribute => {
      return this.isFilterableByAttribute(product, attribute);
    });
  }

  isFilterableByAttribute(product, attribute) {
    let filterIds = Object.keys(attribute[1]);
    filterIds = Array.isArray(filterIds) ? filterIds : [filterIds];

    return filterIds.some(filterId => product.tags[filterId]);
  }

  handleScrollUp() {
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: 0
    });
  }

  render() {
    let filteredProducts = this.state.products[1] ? this.filterProducts() : [];
    let seenCount = this.state.visible;
    let filteredProductsCount = filteredProducts.length;
    let visibleFilteredProducts = filteredProducts.slice(0, seenCount).map(product => {
      return <ProductIndexItem key={product.id} product={product} handleScrollUp={this.handleScrollUp}/>
    })

    return (
      <section className="listings">
        <section className="listings--category-banner">
          <h2 className="listings--category-banner--text">{'Women\'s Clothing'}</h2>
        </section>

        <FilterIndexContainer currentFilters={this.props.currentFilters} />

        <section className="listings--wrapper">
          <section className="listings--wrapper--grid-wrapper">
            <section className="listings--count">
              <h3>{filteredProductsCount} styles found</h3>
            </section>
            <ul className="listings--products">
              {visibleFilteredProducts}
            </ul>
            <section className="listings--viewed">
              <h3>You've viewed {seenCount <= filteredProductsCount ? seenCount : filteredProductsCount} of {filteredProductsCount} products</h3>
            </section>
            {seenCount < filteredProductsCount &&
              <section className="listings--load-more">
                <button onClick={this.onLoadMore}><h3 className="listings--load-more-text">Load More</h3></button>
              </section>
            }
          </section>
        </section>
      </section>
    );
  }
}

export default ProductIndex;
