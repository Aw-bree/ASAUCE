import React from 'react';
import { selectOrderProductItemId } from '../selectors/selectors';

class ProductShow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      productId: this.props.match.params.productId,
      size: 'Select a size',
      currentUserError: false,
      sizeError: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleScrollUp = this.handleScrollUp.bind(this);
  }

  componentDidMount() {
    const productId = this.props.match.params.productId;
    this.props.requestProduct(productId);
  }

  componentDidUpdate(prevProps) {
    const productId = this.props.match.params.productId;
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.requestProduct(productId);
    }
  }

  handleInput(type) {
    return (e) => {
      this.setState({
        [type]: e.target.value,
        sizeError: false
      })
    };
  }

  handleSizeError() {
    return this.setState({ sizeError: false })
  }

  handleSubmit(e) {
    e.preventDefault();
    let user = this.props.currentUser;

    if (!user) {
      this.setState({ currentUserError: true })
    }

    if (this.state.size === 'Select a size') {
      this.setState({ sizeError: true })
    }

    if (user && !this.state.sizeError) {
      let product_item_id = selectOrderProductItemId(this.props.productItems, this.state.size);
      let productItem = {
        id: product_item_id,
        product_id: this.state.productId,
        size: this.state.size,
        state: 'pending_order'
      };
      let orderItem = { product_item_id: product_item_id, order_id: this.props.orders.currentOrderId };
      this.props.createOrderItem(user, orderItem).then(
        () => this.props.updateProductItem(productItem)
      );
    }
  }

  handleScrollUp() {
    window.scroll({
      behavior: 'smooth',
      left: 0,
      top: 0
    });
  }

  render () {
    const { product } = this.props;
    if (product === undefined) {return null}
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })

    const sizeOptions = (
      this.props.selectedSizes.map((el) => {
      if (el[1] > 0)  {
          return <option key={el} className="size--available">{el[0]}</option>
        } else {
          return <option key={el} className="size--not-available" disabled>{el[0]}</option>
        }
      })
    )

    const photoArea = (
      <section className="product-show--photos-wrapper"> 
        <section className="product-show--photos-aside-wrapper">
          <ul className="product-show--aside--photos">
            <li className="product-show--photos--item">
              <img className="listings--product--show--img" src={product.photoUrls[0]} alt=""></img>
            </li >
            <li className="product-show--photos--item">
              <img className="listings--product--show--img" src={product.photoUrls[1]} alt=""></img>
            </li >
          </ul>
          <img className="product-show--photos--social"></img>
        </section>

        <section className="product-show--photo-carousel-wrapper">
          <img className="product-show--photo-carousel--product-img" src={product.photoUrls[0]} alt=""></img>
          <button className="prev-btn"></button>
          <button className="prev-btn"></button>
        </section>
      </section>
    )

    const currentUserError = (
      (this.state.currentUserError) ? 
        (
          <section className="basic-error-box">
            <p>Please sign in to add to your cart</p>
          </section>
        ) : null
    )

    const sizeError = (
      (this.state.sizeError) ?
        (
          <section className="basic-error-box">
            <p>Please select a size to add to your cart</p>
          </section>
        ) : null
    )

    const asideArea = (
      <section className="product--show--cart-aside-wrapper">
        <section className="product-show--cart-aside">
          <ul className="product-show--cart-aside-items">
            <h3 className="product-show--cart-aside-items--title">{product.title}</h3>

            <ul className="product-show--cart-aside-items--price-wrapper">
              <li className="product-show--cart-aside-items--price">{formatter.format(product.price)}</li>
              <p className="product-show--cart-aside-items--shipping">Free Shipping & Returns</p>
            </ul>

            <ul className="product-show--cart-aside-items--color-wrapper">
              <li className="product-show--cart-aside-items--color-title">Color: </li>
              <li className="product-show--cart-aside-items--color">{product.color}</li>
            </ul>       

            <section className="product-show--cart-aside--form">
              <label className="product-show--cart-aside--form--sizing--label">
                <select className="product-show--cart-aside--form--sizing" value={this.state.size} name="size" onChange={this.handleInput("size")}>
                  {sizeOptions}
                </select>
              </label>
              {this.state.size === 'Select a size' ? sizeError : null}
              {currentUserError}
              <button className="product-show--cart-aside--form--add-to-cart" onClick={(e)=> {this.handleSubmit(e); this.handleScrollUp() }}>ADD TO CART</button>
            </section>
          </ul>
        </section>
      </section>
    )
    
    const deatilArea = (
      <section className="product-show--deatil-wrapper">
        <ul className="product-show--deatil--items">
          <ul className="product-show--detail--item">
            <h3 className="product-show--detail--item--title">PRODUCT DETAILS</h3>
            <p className="product-show--detail--item--subtitle">{product.category} by {product.brand}</p>
            <ul className="product-show--detail--item--details">
              <li className="product-show--detail--item--details--item">
                {product.subCategory}
              </li>
            </ul>
          </ul>

          <ul className="product-show--detail--item">
            <ul className="product-show--detail--area">
              <h3 className="product-show--detail--item--title">PRODUCT CODE</h3>
              <p>{product.product_code}</p>
              <ul className="product-show--detail--area">
                <h3 className="product-show--detail--item--title">BRAND</h3>
                <p>{product.brand}</p>
              </ul>
            </ul >    
          </ul>

          <ul className="product-show--detail--item">
            <ul className="product-show--detail--area">
              <h3 className="product-show--detail--item--title">SIZE & FIT</h3>
              <ul className="product-show--detail--item--design-specs">
                <li className="product-show--detail--item--design-specs--item">{product.model_size}</li>
                <li className="product-show--detail--item--design-specs--item">{product.model_height}</li>
              </ul>
            </ul>

            <ul className="product-show--detail--area">
              <h3 className="product-show--detail--item--title">LOOK AFTER ME</h3>
              <ul className="product-show--detail--item--design-specs">
                <li className="product-show--detail--item--design-specs--item">{product.care_instructions}</li>
                <li className="product-show--detail--item--design-specs--item">{product.care_advice}</li>
              </ul>
            </ul>

            <ul className="product-show--detail--area">
              <h3 className="product-show--detail--item--title">ABOUT ME</h3>
              <ul className="product-show--detail--item--design-specs">
                <li className="product-show--detail--item--design-specs--item">{product.fabric_stretch}</li>
                <li className="product-show--detail--item--design-specs--item">{product.fabric_material}</li>
                <li className="product-show--detail--item--design-specs--item">{product.main_fiber_content}</li>
              </ul>
            </ul>
          </ul>

        </ul>
      </section>
    )

    return (
      <section className = "product-show" >
        <section className="product-show--wrapper">
          {photoArea}
          {asideArea}
        </section>
        <section className="product-show--detail-wrapper">
          {deatilArea}
        </section>
      </section >
    )
  }
}

export default ProductShow;