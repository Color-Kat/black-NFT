import { useContext, useEffect, useState } from 'react';
import { AuctionContext } from './context/AuctionContext';

function App() {
  const { error, connectWallet, installMetamask, getAuctions } = useContext(AuctionContext);

  // console.log(test);

  useEffect(getAuctions, []);


  return (
    <div className="App">
      {error &&
        <>
          <h1>It's ERROR, nigga!</h1>
          <h4>{error}</h4>
        </>
      }

      {installMetamask
        ? <h1>Install metamask, nigger!</h1>
        : <h2>Hello, nigger</h2>
      }

      <button onClick={connectWallet}>Подключить метамаск</button>

    </div>
  )
}

export default App;
