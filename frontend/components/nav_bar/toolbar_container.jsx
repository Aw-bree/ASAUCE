import { connect } from 'react-redux';
import Toolbar from './toolbar';
import { logout, requestUser } from '../../actions/session_actions';

const mapStateToProps = state => ({
  currentUser: state.session.currentUser,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  requestUser: (id) => dispatch(requestUser(id))
});


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
