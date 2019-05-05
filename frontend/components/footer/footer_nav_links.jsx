import React from 'react';

export default () => (
  <section className="footer--nav-links" >
    <ul className="footer--nav-links--col">
      <h4 className="footer--nav-links--title">HELP AND INFORMATION</h4>
      <li className="footer--nav-links--item">Help</li>
        <li className="footer--nav-links--item">Track Order</li>
        <li className="footer--nav-links--item">Delivery & Returns</li>
        <li className="footer--nav-links--item">Premier Delivery</li>
        <li className="footer--nav-links--item">10% Student Discount</li>
      </ul>

    <ul className="footer--nav-links--col">
      <h4 className="footer--nav-links--title">ABOUT ASOS</h4>
        <li className="footer--nav-links--item">About Us</li>
        <li className="footer--nav-links--item">Careers at ASOS</li>
        <li className="footer--nav-links--item">Corporate Responsibility</li>
        <li className="footer--nav-links--item">Investors Site</li>
      </ul>

    <ul className="footer--nav-links--col">
      <h4 className="footer--nav-links--title">MORE FROM ASOS</h4>
        <li className="footer--nav-links--item">E-gift cards</li>
        <li className="footer--nav-links--item">Mobile and ASOS Apps</li>
        <li className="footer--nav-links--item">ASOS Marketplace</li>
      </ul>

    <ul className="footer--nav-links--col">
      <h4 className="footer--nav-links--title">SHOPPING FROM:</h4>
        <li className="footer--nav-links--shipping">
        <span className="footer--nav-links--shipping-country">You're in</span>
          <img className="shipping-icon" alt="United States" src="https://assets.asosservices.com/storesa/images/flags/us.png" alt="United States"></img>
        <span className="footer--nav-links--shipping-change">| CHANGE</span>
        </li>
      </ul>
  </section>
);