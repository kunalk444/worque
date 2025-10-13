import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import store from './redux/store.js'
import {BrowserRouter, HashRouter} from "react-router";
import {GoogleOAuthProvider} from '@react-oauth/google';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='649754656263-r637r8j8itqbl1arphq2odjdcll2450s.apps.googleusercontent.com'>
    <Provider store={store}>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>
  </StrictMode>,
)
