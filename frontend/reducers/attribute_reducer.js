import { RECEIVE_ATTRIBUTES } from '../actions/attribute_actions';

import { merge } from 'lodash';

export default (oldState = {}, action) => {
  Object.freeze(oldState);
  let newState;

  switch (action.type) {
    case RECEIVE_ATTRIBUTES:
      newState = merge({}, newState, action.payload.attributes);
      return newState;
    default:
      return oldState;
  }
}