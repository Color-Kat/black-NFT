import { useContext, useEffect, useState } from 'react';
import { AuctionContext } from './context/AuctionContext';

function App() {
  const {
    error, isLoading, connectWallet, installMetamask,
    currentAccount,
    currentUserContract, connectUser, user,
    getAuctions, createAuction
  } = useContext(AuctionContext);

  // console.log(test);

  useEffect(() => {
    getAuctions();
  }, []);


  return (
    <div className="App">
      {error &&
        <>
          <h1>Возникла ошибка, НИГГА!</h1>
          <h3>{error}</h3>
        </>
      }

      {installMetamask && <h1>Установи метамаск, Ниггер!</h1>}

      {!currentAccount && <button onClick={connectWallet}>Подключить метамаск</button>}
      {currentAccount && <>
        {!currentUserContract && <button onClick={connectUser}>Подключиться к nigga-system</button>}
        {user && <button onClick={user.collectNigga}>Найти негра</button>}
        {/* <button onClick={createAuction}>Создать аукцион</button> */}
      </>}



      {isLoading && <><hr /> <span>Загрузка...</span></>}
    </div>
  )
}

export default App;
