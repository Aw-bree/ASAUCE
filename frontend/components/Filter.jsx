import React from 'react';
import {
  getFiltersWithFilterToggled,
  getFiltersQueryString
} from '../selectors/filters';

export default class Filter extends React.Component{
  constructor(props) {
    super(props);

    this.updateCurrentFilters = this.updateCurrentFilters.bind(this);
  }

  updateCurrentFilters(e) {
    e.preventDefault();
    let filterId = e.currentTarget.value;

    let filtersWithFilterToggled = getFiltersWithFilterToggled(this.props.currentFilters, filterId, this.props.attributeName);
    let updatedQueryString = getFiltersQueryString(filtersWithFilterToggled);

    this.props.history.push(`/products/search?${updatedQueryString}`);
  }

  render() {
    const {
      filter,
      handleSubCategoryFilter,
      attributeFilterState,
      filterableProductCount
    } = this.props;

    const filterElement = (
      <button
        className={attributeFilterState ? "ProductFilters__Item_state_active" : "ProductFilters__Item"}
        key={filter.id}
        value={filter.id}
        onClick={this.updateCurrentFilters}
      >
        {filter.name} ({filterableProductCount})
      </button>
    )

    return (
      handleSubCategoryFilter &&
      (filterableProductCount > 0 || attributeFilterState) ?
        filterElement : null
    );
  };
};