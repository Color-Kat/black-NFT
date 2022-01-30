import { useContext, useEffect, useState } from 'react';
import { AuctionContext } from './context/AuctionContext';

function App() {
  const { installMetamask, getAuctions } = useContext(AuctionContext);

  // console.log(test);

  useEffect(getAuctions, []);


  return (
    <div className="App">
      {installMetamask
        ? <h1>Install metamask, nigger!</h1>
        : <h2>Hello, nigger</h2>
      }

    </div>
  )
}

export default App;
