import {
  RECEIVE_CURRENT_USER,
  LOGOUT_CURRENT_USER
} from '../actions/session_actions';

import { merge } from 'lodash';

const _nullSession = {
  currentUser: null
};

export default (oldState = _nullSession, action) => {
  Object.freeze(oldState);
  let newState;

  switch (action.type) {
    case RECEIVE_CURRENT_USER:
      newState = merge({}, oldState, {currentUser: action.user});
      return newState;
    case LOGOUT_CURRENT_USER:
      return _nullSession;
    default:
      return oldState;
  }
};