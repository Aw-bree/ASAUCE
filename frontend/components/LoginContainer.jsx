import { connect } from 'react-redux';
import Login from './Login';
import { login } from '../actions/session_actions';

const mapStateToProps = state => {
  return {
    errors: state.errors.session,
    formType: 'login',
  };
};

const mapDispatchToProps = dispatch => ({
  login: formUser => dispatch(login(formUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

