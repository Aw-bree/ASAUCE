import React from 'react';

const ProductIndexItem = ({ product }) => (
  <li className="listings--product">
    <img className="listings--product-img" src="smiley.gif" alt="" height="42" width="42"></img>
    <p className="listings--product-title">{product.title}</p>
    <p className="listings--product-price">{product.price}</p>
  </li>
)

export default ProductIndexItem;