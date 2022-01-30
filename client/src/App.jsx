import { useContext, useEffect, useState } from 'react';
import { AuctionContext } from './context/AuctionContext';

function App() {
  const { getAuctions } = useContext(AuctionContext);

  // console.log(test);

  useEffect(getAuctions, []);

  return (
    <div className="App">
      <h2>Hello, nigger</h2>
    </div>
  )
}

export default App;
