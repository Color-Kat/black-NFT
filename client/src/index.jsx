import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuctionProvider } from './context/AuctionContext';

ReactDOM.render(
  <React.StrictMode>
    <AuctionProvider>
      <App />
    </AuctionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
