import { postUser } from '../utils/signup_util';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const RECEIVE_SIGNUP_ERRORS = 'RECEIVE_SIGNUP_ERRORS';
export const CLEAR_SIGNUP_ERRORS = 'CLEAR_SIGNUP_ERRORS';

const receiveCurrentUser = user => ({
  type: RECEIVE_CURRENT_USER,
  user
});

const receiveSignupErrors = errors => ({
  type: RECEIVE_SIGNUP_ERRORS,
  errors
});

const clearSignupErrors = () => ({
  type: CLEAR_SIGNUP_ERRORS
});

export const createNewUser = formUser => dispatch => (postUser(formUser)
  .then(user => dispatch(receiveCurrentUser(user)),
    errors => dispatch(receiveSignupErrors(errors.responseJSON)))
);