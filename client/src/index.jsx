import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter
} from "react-router-dom";
import './index.css';
import App from './App';
import { AuctionProvider } from './context/AuctionContext';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuctionProvider>
        <App />
      </AuctionProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
