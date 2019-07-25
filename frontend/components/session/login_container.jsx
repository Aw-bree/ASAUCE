import { connect } from 'react-redux';
import Login from './login';
import { login, clearErrors } from '../../actions/session';

const mapStateToProps = state => {
  return {
    errors: state.errors.session,
    formType: 'login',
  };
};

const mapDispatchToProps = dispatch => ({
  login: formUser => dispatch(login(formUser)),
  clearErrors: () => dispatch(clearErrors)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

