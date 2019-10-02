import { connect } from 'react-redux';
import Signup from './signup';
import { createNewUser } from '../../actions/user_actions';

const mapStateToProps = state => {
  return {
    formType: 'signup',
    errors: state.errors.signup
  };
};

const mapDispatchToProps = dispatch => ({
  createNewUser: formUser => dispatch(createNewUser(formUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
