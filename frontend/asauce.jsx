import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './store/store';
import Root from './components/root';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  let preloadedState = undefined;
  let store;

  if (window.currentUser) {
    preloadedState = {
      session: {
        currentUser: window.currentUser,
      }
    };
    store = createStore(preloadedState);
  } else {
    store = createStore();
  }
  
  window.store = store;
  window.getState = store.getState;
  ReactDOM.render(<Root store={store} />, root);
})
