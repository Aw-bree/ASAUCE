import React from 'react';

export default () => (
  <div className="footer-nav-links" >
    <ul className="col">
        <li><h4>HELP AND INFORMATION</h4></li>
        <li>Help</li>
        <li>Track Order</li>
        <li>Delivery & Returns</li>
        <li>Premier Delivery</li>
        <li>10% Student Discount</li>
      </ul>

    <ul className="col">
        <li ><h4>ABOUT ASOS</h4></li>
        <li>About Us</li>
        <li>Careers at ASOS</li>
        <li>Corporate Responsibility</li>
        <li>Investors Site</li>
      </ul>

      <ul className="col">
        <li><h4>MORE FROM ASOS</h4></li>
        <li>E-gift cards</li>
        <li>Mobile and ASOS Apps</li>
        <li>ASOS Marketplace</li>
      </ul>

      <ul class="col">
        <li><h4>SHOPPING FROM:</h4></li>
        <li>
          <ul className="shopping-from">
            <span className="shipping-country">You're in</span>
            <img alt="United States" src="https://assets.asosservices.com/storesa/images/flags/us.png" alt="United States"></img>
            <span>| CHANGE</span>
          </ul>
        </li>
      </ul>
  </div>
);