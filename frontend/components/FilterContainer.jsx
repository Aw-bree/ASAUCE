import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { 
  handleSubCategoryFilter,
  selectAttributeFilterState,
  selectFilterableProductCount
} from '../selectors/filters';
import Filter from './Filter';

const mapStateToProps = ({entities}, ownProps) => {
  return {
    filter: ownProps.filter,
    currentFilters: ownProps.currentFilters,
    attributeName: ownProps.attributeName,
    handleSubCategoryFilter: handleSubCategoryFilter(ownProps),
    attributeFilterState: selectAttributeFilterState(ownProps),
    filterableProductCount: selectFilterableProductCount(entities.products, ownProps)
  }
};

export default withRouter(connect(mapStateToProps, null)(Filter));