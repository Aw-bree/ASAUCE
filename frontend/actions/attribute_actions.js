import * as attributeApiUtil from '../utils/attribute_util';

export const RECEIVE_ATTRIBUTES = 'RECEIVE_ATTRIBUTES';

export const receiveAttributes = (payload) => ({
  type: RECEIVE_ATTRIBUTES,
  payload
});

export const requestAttributes = () => dispatch => (
  attributeApiUtil.fetchAttributes()
    .then(attributes => dispatch(receiveAttributes(attributes)))
);