import { combineReducers } from 'redux';

import sessionErrorReducer from './session_error_reducer';
import signupErrorReducer from './signup_error_reducer';

export default combineReducers({
  session: sessionErrorReducer,
  signup: signupErrorReducer
});