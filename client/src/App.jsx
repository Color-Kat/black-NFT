import { useContext, useState } from 'react';
import { AuctionContext } from './context/AuctionContext';

function App() {
  const { test } = useContext(AuctionContext);

  console.log(test);

  return (
    <div className="App">
      <h2>Hello, nigger</h2>
      <h3>{test}</h3>
    </div>
  )
}

export default App;
