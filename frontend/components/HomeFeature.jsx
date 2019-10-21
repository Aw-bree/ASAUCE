import React from 'react';

export default () => (
  <section className="home--feature" >
    <a href="#/products/search?Tag=4299" className="home--feature-img">
      <img
        alt=""
        src="https://content.asos-media.com/-/media/homepages/ww/2019/04/29/gbl-utility-surf-hero.jpg"
      >
      </img>
    </a>

    <section className="home--feature--buttons">
      <a href="#/products/search?Tag=4299" className="home--large-feature-title">Surfer vibes</a>
      <a href="#/products/search?Tag=4299" className="general-btn">SHOP NOW</a>
    </section>

    <ul className="home--double--feature">
      <li className="home--double-feature--item">
        <a href="#/products/search?Tag=4300">
          <img id="home--double-feature--item--img" alt="" src="https://66.media.tumblr.com/8ec52eef708032a1eeefe1c7fa67154e/tumblr_pqt7mrVxZW1wyb2l8o2_1280.jpg"></img>
        </a>
        <h3 className="double-feature--item--title">Festival</h3>
        <p className="double-feature--item--body">Be centre stage</p>
        <a href="#/products/search?Tag=4300" className="general-btn">SHOP NOW</a>
      </li>

      <li className="home--double-feature--item">
        <a href="">
          <img alt="" id="home--double-feature--item--img" src="https://66.media.tumblr.com/bfa10e4c7c2d6d97b0436c732cbb2c00/tumblr_pqt7mrVxZW1wyb2l8o1_540.jpg"></img>
        </a>
        <h3 className="double-feature--item--title">Sandals</h3>
        <p className="double-feature--item--body">Fresh styles for warm climates</p>
        <a href="" className="general-btn">SHOP NOW</a>
      </li>
    </ul>

    <div className="home--feature-banner" >
      <a href="">
        {/* <img alt="" src="https://66.media.tumblr.com/db0a3e539cd45c27b6ef4e0e8127bd0d/tumblr_pqt6uwiL6G1wyb2l8o2_250.gif"></img> */}
      </a>
    </div>
  </section>
)
