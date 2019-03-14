import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import App from 'app-containers/App';
import reducer from 'app-redux/reducer';
import mockData from 'test-data/redux';

const store = createStore(
  reducer,
  mockData,
  composeWithDevTools(applyMiddleware(thunk)),
);

const Component = (
  <Provider store={store}>
    <App />
  </Provider>
);
const root = document.getElementById('root');
render(Component, root);
