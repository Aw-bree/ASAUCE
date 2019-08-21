import React from 'react';

export default () => (
  <section className="home--style-feed" >
    <h2 className="home--style-feed--title">STYLE FEED</h2>
    <p className="home--style-feed--body">Outfit ideas, editor picks, styling inspiration and Face + Body tips</p>

    <section className="home--style-feed-carousel">
      <section className="home--carousel-controls">
        <button className="prev-btn"></button>
        <button className="next-btn"></button>
      </section>

      <ul className="home--carousel-list">
        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/1befbe60f6baf4c2bcdb7b27efb4c720/tumblr_pqt6uwiL6G1wyb2l8o10_400.jpg"></img>
              <div className="style-feed-carousel-content">
              <h3 className="home--style-feed-carousel--title">WHAT TO WEAR TO A DESTINATION WEDDING</h3>
              <p className="home--style-feed-carousel--body">Be best-dressed guest</p>
              <p className="home--style-feed-carousel--date">April 25, 2019</p>  
            </div>
          </a>
        </li>

        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/1b5f04ef58b7367ee5ba92969547e7bc/tumblr_pqt81iVKhd1wyb2l8o1_400.jpg"></img>
              <div className="style-feed-carousel-content">
              <h3 className="home--style-feed-carousel--title">BEST OF NEW IN: PINK & PATCHWORK</h3>
              <p className="home--style-feed-carousel--body">The fashion team have spoken</p>
              <p className="home--style-feed-carousel--date">April 27, 2019</p>  
            </div>
          </a>
        </li>

        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/d3be3c801032ae3f2ff4debfde6900ff/tumblr_pqt84mKP4N1wyb2l8o1_400.jpg"></img>
              <div className="style-feed-carousel-content">
              <h3 className="home--style-feed-carousel--title" >THE ASOS + LIFE IS BEAUTIFUL COLLECTION IS HERE</h3>
              <p className="home--style-feed-carousel--body">Get festival fresh</p>
              <p className="home--style-feed-carousel--date">April 26, 2019</p>  
            </div>
          </a>
        </li>

        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/74df3ad7ab0196f75f21e44c0ade47bd/tumblr_pqt6uwiL6G1wyb2l8o8_400.jpg"></img>
              <div className="style-feed-carousel-content">
              <h3 className="home--style-feed-carousel--title">5 OF THE MOST EXTRA ADD-ONS</h3>
              <p className="home--style-feed-carousel--body">It's all in the details</p>
              <p className="home--style-feed-carousel--date">April 25, 2019</p>  
            </div>
          </a>
        </li>
{/* 
        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/4e197393dee3aa418c7c4a25c8fb2ce3/tumblr_pqt6uwiL6G1wyb2l8o9_400.jpg"></img>
              <div className="style-feed-carousel-content">
                <h3 className="home--style-feed-carousel--title">HOW ASOSERS DO 2019 JEWELRY</h3>
                <p className="home--style-feed-carousel--body">The bling thing</p>
                <p className="home--style-feed-carousel--date">April 24, 2019</p>
            </div>
          </a>
        </li>

        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/86fc1ef413134333eac353aa8e4e9907/tumblr_pqt6uwiL6G1wyb2l8o3_400.gif"></img>
              <div className="style-feed-carousel-content">
                <h3 className="home--style-feed-carousel--title">5 CLASSIC NIGHT-OUT PIECES UNDER $40</h3>
                <p className="home--style-feed-carousel--body">Eat, sleep, wear, LBD, repeat</p>
                <p className="home--style-feed-carousel--date">April 22, 2019</p>
            </div>
          </a>
        </li>

        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/2ccd473f73b5104e987b1e5fa4b1b679/tumblr_pqt6uwiL6G1wyb2l8o4_400.jpg"></img>
              <div className="style-feed-carousel-content">
                <h3 className="home--style-feed-carousel--title">3 WAYS TO TRY TROPICAL</h3>
                <p className="home--style-feed-carousel--body">Feel the heat</p>
                <p className="home--style-feed-carousel--date">April 21, 2019</p>
            </div>
          </a>
        </li>

        <li cclassName="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/62aff65b69e9e0de9e58ae28b2dea10a/tumblr_pqt8ioR7E91wyb2l8o2_400.jpg"></img>
              <div className="style-feed-carousel-content">
                <h3 className="home--style-feed-carousel--title">ASOS INSIDERS IN SS19 SNEAKERS</h3>
                <p className="home--style-feed-carousel--body">Fresh out the box</p>
                <p className="home--style-feed-carousel--date">April 20, 2019</p>
            </div>
          </a>
        </li>

        <li className="home--style-feed-carousel--item">
          <a href="">
            <img className="home--style-feed-carousel--img" alt="" src="https://66.media.tumblr.com/2e8bed1890080d52478317f218716335/tumblr_pqt8ioR7E91wyb2l8o3_400.jpg"></img>
              <div className="style-feed-carousel-content">
                <h3 className="home--style-feed-carousel--title">BEST OF NEW IN:TIE-DYE & ZEBRA</h3>
                <p className="home--style-feed-carousel--body">Fashion filter on</p>
                <p className="home--style-feed-carousel--date">April 18, 2019</p>
            </div>
          </a>
        </li> */}

        <li className="home--style-feed-carousel--item">
          <a href="" className="btn--view-all">
            <span className="home-style-feed-carousel-view-btn">VIEW ALL</span>
          </a>
        </li>
      </ul>
      <a href="" className="general-btn">VIEW ALL</a>
    </section>
  </section>
)