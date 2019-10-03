import {
  RECEIVE_CURRENT_USER,
  RECEIVE_SIGNUP_ERRORS
} from '../actions/user_actions';

export default (oldState = [], action) => {
  Object.freeze(oldState);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return [];
    case RECEIVE_SIGNUP_ERRORS:
      return action.errors;
    default:
      return oldState;
  }
};