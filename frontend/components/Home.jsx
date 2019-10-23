import React from 'react';
import HomeBanner from './HomeBanner';
import HomeFeature from './HomeFeature';
import HomeFeedCarousel from './HomeFeedCarousel';
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
    debugger
    this.setState({
      isLoading: false
    })
  }

  render() {
    debugger

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