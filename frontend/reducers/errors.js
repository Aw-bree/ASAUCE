import { combineReducers } from 'redux';
import sessionErrorsReducer from './session_errors';

export default combineReducers({
  session: sessionErrorsReducer
});