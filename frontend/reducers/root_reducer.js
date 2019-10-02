import { combineReducers } from 'redux';

import sessionReducer from './session_reducer';
import entityReducer from './entity_reducer';
import errorReducer from './error_reducer';

export default combineReducers({
  entities: entityReducer,
  session: sessionReducer,
  errors: errorReducer
});