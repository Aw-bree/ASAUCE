import queryString from 'query-string';

export const handleSubCategoryFilter = ({attributeName, filter}) => {
  let parentId = filter.parentId;
  let result;

  if (isSubCategoryAttribute(attributeName)) {
    result = isSubCategoryFilter(parentId);
  } else {
    result = !isSubCategoryFilter(parentId);
  };

  return result;
}

export const isSubCategoryFilter = (parentId) => {
  return parentId != null;
} 

export const isSubCategoryAttribute = (attributeName) => {
  return attributeName == "Style";
}

export const selectCurrentFilters = (props) => {
  let currentFilters = queryString.parse(props.location.search, { arrayFormat: 'comma' });
  let formattedFilters = JSON.parse(JSON.stringify(currentFilters));
  let currentFiltersAttributesArray = Object.keys(formattedFilters);
  currentFiltersAttributesArray.forEach(attributeName => {
    let attributeFiltersArray = formattedFilters[attributeName];
    attributeFiltersArray = Array.isArray(attributeFiltersArray) ? attributeFiltersArray : [attributeFiltersArray];
    attributeFiltersArray.forEach(filter => {
      if (formattedFilters[attributeName].constructor === String || Array.isArray(formattedFilters[attributeName])) {
        formattedFilters[attributeName] = {};
      }

      formattedFilters[attributeName][filter] = true;
    });
  });

  return formattedFilters;
}

export const selectAttributeFilterState = (props) => {
  let currentFilters = JSON.parse(JSON.stringify(props.currentFilters));
  return currentFilters[props.attributeName] && currentFilters[props.attributeName][props.filter.id];
}

export const selectFiltersWithFilterActive = (currentFilters, filterId) => {
  return toggleFilterActive(currentFilters, filterId);
};

export const selectFilterableProductCount = (products, {filter, currentFilters, attributeName}) => {
  let filterId = filter.id;
  let newFilters = JSON.parse(JSON.stringify(currentFilters));
  let newToggledFilters = toggleFilterActive(filter, newFilters, attributeName);
  let filtersByAttributeArray = Object.entries(newToggledFilters);
  let productsArray = Object.values(products);
  let countFilterableProducts = 0;

  productsArray.forEach(product => {
    if (isFilterable(product, filtersByAttributeArray)) {
      if (product.tags[filterId]) {
        countFilterableProducts += 1;
      }
    }
  });

  return countFilterableProducts;
}

const toggleFilterActive = (filter, newFilters, attributeName) => {
  let filterId = filter.id;
  let toggledFilters = JSON.parse(JSON.stringify(newFilters));
  if (!toggledFilters[attributeName]) {
    toggledFilters[attributeName] = {};
    toggledFilters[attributeName][filterId] = true;
  } else if (toggledFilters[attributeName] && !toggledFilters[attributeName][filterId]) {
    toggledFilters[attributeName][filterId] = true;
  }

  return toggledFilters;
}

const isFilterable = (product, filtersByAttributeArray) => {
  return filtersByAttributeArray.every(attribute => 
    isFilterableByAttribute(product, attribute)
  );
}

const isFilterableByAttribute = (product, attribute) => {
  let filterIds = Object.keys(attribute[1]);
  filterIds = Array.isArray(filterIds) ? filterIds : [filterIds]
  return filterIds.some(filterId => product.tags[filterId]);
}

export const getFiltersWithFilterToggled = (currentFilters, filterId, attributeName) => {
  let result = toggleFilter(currentFilters, filterId, attributeName);
  return result;
}

export const toggleFilter = (filters, filterId, attributeName) => {
  let toggledFilters = JSON.parse(JSON.stringify(filters));

  if (toggledFilters[attributeName] && toggledFilters[attributeName][filterId] && Object.keys(toggledFilters[attributeName]).length == 1) {
    delete toggledFilters[attributeName]
  } else if (toggledFilters[attributeName] && toggledFilters[attributeName][filterId]) {
    delete toggledFilters[attributeName][filterId]
  } else if (toggledFilters[attributeName]) {
    toggledFilters[attributeName][filterId] = true;
  } else {
    toggledFilters[attributeName] = {};
    toggledFilters[attributeName][filterId] = true;
  }

  return toggledFilters;
}

export const getFiltersQueryString = (filters) => {
  let attributes = Object.keys(filters);
  let newQueryArray = [];

  attributes.forEach(attributeName => {
    let filterObj = new Object();
    filterObj[attributeName] = Object.keys(filters[attributeName]);
    
    let filtersQueryString = queryString.stringify(filterObj, { arrayFormat: 'comma' });
    newQueryArray.push(filtersQueryString)
  });

  return newQueryArray.join('&');
};
