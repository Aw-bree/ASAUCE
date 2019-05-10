import { postUser, postSession, deleteSession } from '../utils/session_util';
import { receiveErrors, clearErrors } from './error_actions';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';

const receiveCurrentUser = user => ({
  type: RECEIVE_CURRENT_USER,
  user
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

export const receiveSessionErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

export const createNewUser = formUser => dispatch => (postUser(formUser)
  .then(user => { dispatch(receiveCurrentUser(user)); dispatch(clearErrors())},
    errors => dispatch(receiveSessionErrors(errors.responseJSON)))
);

export const login = formUser => dispatch => (postSession(formUser)
  .then(user => { dispatch(receiveCurrentUser(user)); dispatch(clearErrors())},
    errors => dispatch(receiveSessionErrors(errors.responseJSON)))
);

export const logout = () => dispatch => deleteSession()
  .then(() => dispatch(logoutCurrentUser()));


export const fetchCurrentOrderId = (user) => dispatch => {
  return OrderApiUtil.fetchCurrentOrderId(user)
    .then(user => {
      return dispatch(receiveCurrentUser(user))
    })
}