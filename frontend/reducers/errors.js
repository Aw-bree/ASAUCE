import { combineReducers } from 'redux';

import sessionErrorsReducer from './session_errors';
import signupErrorsReducer from './signup_errors';

export default combineReducers({
  session: sessionErrorsReducer,
  signup: signupErrorsReducer
});