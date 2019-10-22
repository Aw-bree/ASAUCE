import { connect } from 'react-redux';
import NavToolbar from './NavToolbar';
import { logout } from '../actions/session_actions';
import { fetchOrder } from '../actions/order_actions'; 

const mapStateToProps = state => ({
  currentUser: state.session.currentUser,
  orderItemsCount: state.entities.orderItems ? Object.keys(state.entities.orderItems).length : 0
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  fetchOrder: (id) => dispatch(fetchOrder(id))
});


export default connect(mapStateToProps, mapDispatchToProps)(NavToolbar);
