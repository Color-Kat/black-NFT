import { useContext, useEffect, useState } from 'react';
import { AuctionContext } from './context/AuctionContext';

function App() {
  const { error, installMetamask, getAuctions } = useContext(AuctionContext);

  // console.log(test);

  useEffect(getAuctions, []);


  return (
    <div className="App">
      {error &&
        <h1>It's ERROR, nigga!</h1>
      }

      {installMetamask
        ? <h1>Install metamask, nigger!</h1>
        : <h2>Hello, nigger</h2>
      }

    </div>
  )
}

export default App;
