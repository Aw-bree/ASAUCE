import React from 'react';

export default () => (
  <section className="FooterNavLinks" >
    <ul className="FooterNavLinks__list">
      <li><h5 className="FooterNavLinks__title">HELP AND INFORMATION</h5></li>
      <li className="FooterNavLinks__listItem">Help</li>
      <li className="FooterNavLinks__listItem">Track Order</li>
      <li className="FooterNavLinks__listItem">Delivery & Returns</li>
      <li className="FooterNavLinks__listItem">Premier Delivery</li>
      <li className="FooterNavLinks__listItem">10% Student Discount</li>
    </ul>
    <ul className="FooterNavLinks__list">
      <li><h5 className="FooterNavLinks__title">ABOUT ASOS</h5></li>
      <li className="FooterNavLinks__listItem">About Us</li>
      <li className="FooterNavLinks__listItem">Careers at ASOS</li>
      <li className="FooterNavLinks__listItem">Corporate Responsibility</li>
      <li className="FooterNavLinks__listItem">Investors Site</li>
    </ul>
    <ul className="FooterNavLinks__list">
      <li><h5 className="FooterNavLinks__title">MORE FROM ASOS</h5></li>
      <li className="FooterNavLinks__listItem">E_gift cards</li>
      <li className="FooterNavLinks__listItem">Mobile and ASOS Apps</li>
      <li className="FooterNavLinks__listItem">ASOS Marketplace</li>
    </ul>
    <ul className="FooterNavLinks__list">
      <li><h5 className="FooterNavLinks__title">SHOPPING FROM:</h5></li>
      <ul className="FooterNavLinks__shipping">
        <span className="FooterNavLinks__shipping_country">You're in</span>
        <img className="FooterNavLinks__shipping_icon" alt="United States" src="https://assets.asosservices.com/storesa/images/flags/us.png" alt="United States"></img>
        <span className="FooterNavLinks__Separator_type_vertical"></span>
        <span className="FooterNavLinks__shipping_change">CHANGE</span>
      </ul>
    </ul>
  </section>
);