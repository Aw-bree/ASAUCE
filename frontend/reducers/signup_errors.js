import { RECEIVE_CURRENT_USER, RECEIVE_SIGNUP_ERRORS, CLEAR_SIGNUP_ERRORS } from '../actions/signup';

export default (state = [], action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      return [];
    case RECEIVE_SIGNUP_ERRORS:
      return action.errors;
    case CLEAR_SIGNUP_ERRORS:
      return [];
    default:
      return state;
  }
};