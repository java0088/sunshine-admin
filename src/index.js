import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './assets/css/base.css'
import 'nprogress/nprogress.css'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import store from './redux/store'
ReactDOM.render(
  /* 使用Provider把App包裹起来并把store传过去 */
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  ,
  document.getElementById('root')
);


