import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { CustomRouter } from './components/CustomRouter';

import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './_helpers';

render(
  <Provider store={store}>
    <CustomRouter />
  </Provider>,
  document.getElementById('root')
);