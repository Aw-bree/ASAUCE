import React from 'react';
import { Link } from 'react-router-dom';



const ProductIndexItem = ({ product }) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })

  return (
    <Link to={`/products/${product.id}`}>
      <li className="listings--product">
        <img className="listings--product-img" src={product.photoUrls[0]} alt=""></img>
        {/* https://flaviocopes.com/how-to-format-number-as-currency-javascript/ */}
        <p className="listings--product-title">{product.title}</p>
        <p className="listings--product-price">{formatter.format(product.price)}</p>
      </li>
    </Link>
  )
}

export default ProductIndexItem;