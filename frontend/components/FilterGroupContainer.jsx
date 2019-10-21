import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import FilterGroup from './FilterGroup';

const mapStateToProps = ({entities}, ownProps) => {
  return {
    allAttributeFilters: Object.values(entities.attributes[ownProps.attributeId].filters),
    attributeName: ownProps.attributeName,
    currentFilters: ownProps.currentFilters
  }
}

export default withRouter(connect(mapStateToProps, null)(FilterGroup));