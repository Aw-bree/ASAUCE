import { connect } from 'react-redux';
import Signup from './signup';
import { createNewUser } from '../../actions/session';


const mapStateToProps = state => {
  return {
    formType: 'signup',
    errors: state.errors.session
  };
};

const mapDispatchToProps = dispatch => ({
  createNewUser: formUser => dispatch(createNewUser(formUser))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
