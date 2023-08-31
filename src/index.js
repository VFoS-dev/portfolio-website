import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';
import { CustomRouter } from './components';
import { ResumeBuilder } from './pages';

import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const builder = /resume\?(.+)?create=1/.test(window.location.href);

render(
  <Provider store={store}>
    {builder ?
      <ResumeBuilder /> :
      <CustomRouter />
    }
  </Provider>,
  document.getElementById('root')
);