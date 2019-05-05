import React from 'react';
import HomeBanner from './home_banner';
import HomeFeature from './home_feature';
import StyleFeedCarousel from './style_feed_carousel';
import SeasonalFeature from './seasonal_feature';
import CategoryCarousel from './category_carousel';



export default () => (
  <div className="home">
    <HomeBanner />
    <HomeFeature />
    <StyleFeedCarousel />
    <SeasonalFeature />
    <CategoryCarousel />
  </div>
);