import React from 'react';

class ProductFilterList extends React.Component {
  constructor(props) {
    super(props);

    this.getNewFilters = this.getNewFilters.bind(this);
    this.getFilterItemCount = this.getFilterItemCount.bind(this);
    this.passesFilters = this.passesFilters.bind(this);
  }

  getNewFilters(filter, filterType) {
    let newFilters = JSON.parse(JSON.stringify(this.props.filters));

    if (!newFilters[filterType]) {
      newFilters[filterType] = {};
      newFilters[filterType][filter] = true;
    } else if (newFilters[filterType] && !newFilters[filterType][filter]) {
      newFilters[filterType][filter] = true;
    }

    return newFilters;
  }

  getFilterItemCount(items, filters, filter) {
    let count = 0;
    let filtersArray = Object.entries(filters);
    let itemsArray = Object.values(items);
      
    itemsArray.forEach(item => {
      if (this.passesFilters(item, filtersArray)) {
        if (item.tags[filter]) {
          count += 1;
        }
      }
    });

    return count;
  }

  passesFilters(item, filters) {
    return filters.every(
      filter => Object.keys(filter[1]).some(f => item.tags[f])
    )
  }

  render() {

    return (
      <section className="ProductFilters">
        {this.props.attributes.map(attribute => {

          let attributeName = attribute.name;
          let attributeStatus = this.props.filters[attributeName];
          let subCategoryStatus = this.props.filters["Style"];

          return (
            <>
              <section className="ProductFilters__Group" key={attribute.id}>
                <li className={attributeStatus ? "ProductFilters__Text_type_activeTitle" : "ProductFilters__Text_type_title"}>
                  <h3>{attribute.name}</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" height='7' width='10'>
                    <path d='M5.057 3.566L7.974.649l1.414 1.414-4.243 4.243-.088-.089-.084.085L.73 2.06 2.141.65l2.916 2.916z' fillRule='evenodd' fill='23666' />
                  </svg>
                </li>
                <ul className="ProductFilters__List">
                  <section className="ProductFilters__Header">
                    <p>{ attributeStatus ? Object.keys(attributeStatus).length : 0 } selected</p>
                  </section>
                  {attribute.filters.map(filter => {
                    if (filter.parentId != null) {
                      return null
                    }
                    let status = this.props.filters[attribute.name] && this.props.filters[attribute.name][filter.id];
                    let newFilters = this.getNewFilters(filter.id, attribute.name);
                    let filterItemCount = this.getFilterItemCount(this.props.items, newFilters, filter.id);

                    let dropdownFilter = (
                      <button
                        className = { status ? "ProductFilters__Item_state_active": "ProductFilters__Item" }
                        key = { filter.id }
                        value = { filter.id }
                        onClick = { this.props.onFilter }
                      >
                        {filter.name} ({filterItemCount})
                      </button>
                    );

                    return ( (filterItemCount > 0 || status ) ? dropdownFilter : null);
                  })}
                </ul>
              </section>

            { attribute.name == "Category" ?
                <section className="ProductFilters__Group" key={attribute.id}>
                  <li className={subCategoryStatus ? "ProductFilters__Text_type_activeTitle" : "ProductFilters__Text_type_title"}>
                    <h3>Style</h3>
                    <svg xmlns="http://www.w3.org/2000/svg" height='7' width='10'>
                      <path d='M5.057 3.566L7.974.649l1.414 1.414-4.243 4.243-.088-.089-.084.085L.73 2.06 2.141.65l2.916 2.916z' fillRule='evenodd' fill='23666' />
                    </svg>
                  </li>
                  <ul className="ProductFilters__List">
                    <section className="ProductFilters__Header">
                      <p>{subCategoryStatus ? Object.keys(subCategoryStatus).length : 0} selected</p>
                    </section>
                    {attribute.filters.map(filter => {
                      if (filter.parentId == null) {
                        return null
                      }
                      let status = this.props.filters["Style"] && this.props.filters["Style"][filter.id];
                      let newFilters = this.getNewFilters(filter.id, "Style");
                      let filterItemCount = this.getFilterItemCount(this.props.items, newFilters, filter.id);

                      let dropdownFilter = (
                        <button
                          className={status ? "ProductFilters__Item_state_active" : "ProductFilters__Item"}
                          key={filter.id}
                          value={filter.id}
                          onClick={this.props.onFilter}
                        >
                          {filter.name} ({filterItemCount})
                      </button>
                      );

                      return ((filterItemCount > 0 || status) ? dropdownFilter : null);
                    })}
                  </ul>
                </section>
              : null
            }
            </>
          )  
        })}
      </section>
    )
  }
}

export default ProductFilterList;