import React from 'react';

class OrderIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      orderId: 0,
      subTotal: 0,
      listings: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    let orderId = parseInt(this.props.match.params.orderId);
    debugger
    this.props.fetchOrder(orderId);
    // debugger
    this.setState({orderId: orderId})
  }

  handleSubmit(e) {
    e.preventDefault();

    let orderItemId = e.target.attributes["orderitemid"].value;
    let id = this.props.orderItems[orderItemId].product_item_id;
    let productId = [this.props.productItems[id].product_item_id].product_id;
    let productItem = {
      id: id,
      product_id: productId,
      size: this.props.productItems[id].size,
      state: 'Available'
    };

    this.props.deleteOrderItem(orderItemId, this.props.currentUser.id, this.state.orderId);
    this.props.updateProductItem(productItem);
  }

  render () {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })

    let orderItems;   

    if (this.props.orderListItems.length > 0) {
      orderItems = this.props.orderListItems.map((listing, idx) => (
        <section className="listing--item--wrapper" key={idx}>
          <section className="listing--item--photos">
            <img src={listing.photosUrl} className="listing--item--img"></img>
          </section>

          <section className="listing--details--wrapper">
            <ul className="listing--details">
              <h3 className="listing--details--header">{formatter.format(listing.price)}</h3>
              <p className="listing--details--brand">{listing.brand}</p>
              <p className="listing--title">{listing.shortTitle}</p>
              <ul className="listing--details--specs--wrapper">
                <li className="listing--details--specs--color">Color</li>
                <li className="listing--details--specs--size">{listing.size}</li>
                <p className="listing--details--specs--qty">Qty</p>
              </ul>
            </ul>
          </section>
          <button className="listing--remove--btn" orderitemid={listing.id} onClick={this.handleSubmit}>x</button>
        </section>
      ))
    } else {
      <div>
      </div>
    }
    
    const order = (
      <section className="order--container">
        <ul className="order--wrapper">
          <ul className="order--main">
            <section className="order--listings--wrapper">
              <h3 className="order--listings--header">My Cart</h3>
              <ul className="order--listings">
                {orderItems}
              </ul>
              <ul className="order--listings--subtotal">
                <h3 className="order--listings--subtotal--title">SUB-TOTAL</h3>
                <h3 className="order--listings--subtotal--price">{formatter.format(this.props.subTotal)}</h3>
              </ul>
            </section>
            <ul className="order--delivery--wrapper">
            </ul>
          </ul>
          <section className="order--aside">
          </section>
        </ul>
      </section>
    )

    return (
      <div className="order">{order}</div>
    )
  }
}

export default OrderIndex;