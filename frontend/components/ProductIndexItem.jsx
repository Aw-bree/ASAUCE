import React from 'react';
import { Link } from 'react-router-dom';

export default ({ product, handleScrollUp }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  return (
    <Link to={`/products/${product.id}`} onClick={() => handleScrollUp()}>
      <li className="listings--product">
        <img className="listings--product-img" src={product.photoUrls[0]} alt=""></img>
        <p className="listings--product-title">{product.title}</p>
        <p className="listings--product-price">{formatter.format(product.price)}</p>
      </li>
    </Link>
  );
}