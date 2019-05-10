import React from 'react';
import { connect } from 'react-redux';
import Toolbar from './toolbar';
import { logout } from '../../actions/session';

const mapStateToProps = state => ({
  currentUser: state.session.currentUser,
  orders: state.entities.orders,
  orderItems: state.entities.orderItems
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});


export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);