import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import {QueryClientProvider} from "@tanstack/react-query";
import { queryClient } from './utils/queryClient';
import { Provider } from 'react-redux';
import store from '../src/redux/store/index' 
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(

    <BrowserRouter> 
    <Provider store={store}> 
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </Provider>
    </BrowserRouter>
 
);

reportWebVitals();
