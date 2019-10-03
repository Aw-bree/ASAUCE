import { postSession, deleteSession, fetchUser } from '../utils/session_util';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const RECEIVE_SESSION_ERRORS = 'RECEIVE_SESSION_ERRORS';

const receiveCurrentUser = payload => ({
  type: RECEIVE_CURRENT_USER,
  user: payload
});

const logoutCurrentUser = () => ({
  type: LOGOUT_CURRENT_USER
});

const receiveSessionErrors = errors => ({
  type: RECEIVE_SESSION_ERRORS,
  errors
});

export const login = formUser => dispatch => (postSession(formUser)
  .then(user => dispatch(receiveCurrentUser(user)),
    errors => dispatch(receiveSessionErrors(errors.responseJSON)))
);

export const logout = () => dispatch => deleteSession()
  .then(() => dispatch(logoutCurrentUser())
);

export const requestUser = id => dispatch => fetchUser(id)
  .then(user => dispatch(receiveCurrentUser(user)),
    errors => dispatch(receiveSessionErrors(errors.responseJSON))
);