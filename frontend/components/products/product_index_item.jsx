import React from 'react';

const ProductIndexItem = ({ product }) => (
  <li>
    <img className="product-img" src="smiley.gif" alt="" height="42" width="42"></img>
    <p className="product-title">{product.title}</p>
    <p className="product-price">{product.price}</p>
  </li>
)

export default ProductIndexItem;