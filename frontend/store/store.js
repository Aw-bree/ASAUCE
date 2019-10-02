import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';

import rootReducer from '../reducers/root_reducer';
import thunk from '../thunk/thunk';

export default (preloadedState = {}) => createStore(
  rootReducer, preloadedState, applyMiddleware(thunk, logger)
);