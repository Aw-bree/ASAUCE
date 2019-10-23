import HomeBanner from './HomeBanner';
import HomeFeature from './HomeFeature';
import HomeFeedCarousel from './HomeFeedCarousel';
import React from 'react';
import HomeFeatureSeasonal from './HomeFeatureSeasonal';
import HomeCategoryCarousel from './HomeCategoryCarousel';

export default class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: false
    })
  }

  render() {
    const homeElements = (
      <div className="home">
        <HomeBanner />
        <HomeFeature />
        <HomeFeedCarousel />
        <HomeFeatureSeasonal />
        <HomeCategoryCarousel />
      </div>
    );

    return this.state.isLoading ? null : homeElements
  }
};