import React from 'react';
import FilterContainer from './FilterContainer';

export default function FilterGroup(props) {
  return (
    props.allAttributeFilters.map(attributeFilter => {
      return (
        <FilterContainer
          filter={attributeFilter}
          attributeName={props.attributeName}
          currentFilters={props.currentFilters}
        />
      );
    })
  );
}