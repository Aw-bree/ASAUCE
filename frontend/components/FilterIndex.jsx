import React from 'react';
import AttributeGroup from './AttributeGroup';

export default class FilterIndex extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section className="ProductFilters">
        {this.props.attributesArray.map(attribute => {
          let attributeFilters = this.props.currentFilters[attribute.name];
          let attributeFiltersActiveCount = attributeFilters ? Object.keys(attributeFilters).length : 0;
          
          let subCategoryAttributeFilters = this.props.currentFilters["Style"];
          let subCategoryAttributeFiltersActiveCount = subCategoryAttributeFilters ? Object.keys(subCategoryAttributeFilters).length : 0;

          return (
            <>
              <AttributeGroup
                key={attribute.name}
                attributeName={attribute.name}
                attributeId={attribute.id}
                currentFilters={this.props.currentFilters}
                attributeFilters={attributeFilters}
                attributefiltersActiveCount={attributeFiltersActiveCount}
            />
              {attribute.name == "Category" &&
                <AttributeGroup
                  key={"Style"}
                  attributeName={"Style"}
                  attributeId={attribute.id}
                  currentFilters={this.props.currentFilters} 
                  attributeFilters={subCategoryAttributeFilters}
                  attributefiltersActiveCount={subCategoryAttributeFiltersActiveCount}
                />
              }
            </>
          )
        })}
      </section>
    );
  }
};
