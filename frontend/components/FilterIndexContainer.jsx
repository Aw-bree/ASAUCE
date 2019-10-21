import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import FilterIndex from './FilterIndex';

const mapStateToProps = (state, ownProps) => {
  return {
    attributesArray: Object.values(state.entities.attributes),
    currentFilters: ownProps.currentFilters
  };
};

export default withRouter(connect(mapStateToProps, null)(FilterIndex));