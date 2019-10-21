import React from 'react';

export default () => {
  return (
    <section className="category-bar" >
      <ul className="category-bar--options">
        <a href="#/products/search?Category=4036" className="category-bar--option"><p>Clothing</p></a>
        <a href="#/products/search?Range=4023" className="category-bar--option"><p>Petite</p></a>
        <a href="#/products/search?Range=4024" className="category-bar--option"><p>Plus</p></a>
        <a href="#/products/search?Range=4026" className="category-bar--option"><p>Maternity</p></a>
        <a href="#/products/search?Category=4035" className="category-bar--feature"><p>Swim</p></a>
      </ul>
    </section>
  )
};

