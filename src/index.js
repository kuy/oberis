import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/app';
import configureStore from './store';

ReactDOM.render(
  <Provider store={configureStore()}>
    <div>
      <h2>Oberis</h2>
      <App />
    </div>
  </Provider>,
document.getElementById('container'));
