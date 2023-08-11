import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';
import { CustomRouter } from './components/CustomRouter';

import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TestPage } from './pages';

render(
  <Provider store={store}>
    <CustomRouter />
  </Provider>,
  document.getElementById('root')
);
<CustomRouter />