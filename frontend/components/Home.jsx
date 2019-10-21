import React from 'react';
import HomeBanner from './HomeBanner';
import HomeFeature from './HomeFeature';
import HomeFeedCarousel from './HomeFeedCarousel';
import HomeFeatureSeasonal from './HomeFeatureSeasonal';
import HomeCategoryCarousel from './HomeCategoryCarousel';



export default () => (
  <div className="home">
    <HomeBanner />
    <HomeFeature />
    <HomeFeedCarousel />
    <HomeFeatureSeasonal />
    <HomeCategoryCarousel />
  </div>
);