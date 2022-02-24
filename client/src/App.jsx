import { useContext, useEffect, useState } from "react";
import { ConnectMetamask } from "./components/ConnectMetamask";
import { InstallMetamask } from "./components/InstallMetamask";
import { Main } from "./components/Main";
import { AuctionContext } from "./context/AuctionContext";

function App() {
    const {
        error,
        isLoading,
        connectWallet,
        installMetamask,
        currentAccount,
        currentUserContract,
        connectUser,
        user,
        getAuctions,
        createAuction,
    } = useContext(AuctionContext);

    // console.log(test);

    useEffect(() => {
        getAuctions();
    }, []);

    return (
        <div className="App w-screen h-screen overflow-hidden">
            {error && (
                <>
                    <h1>Возникла ошибка, НИГГА!</h1>
                    <h3>{error}</h3>
                </>
            )}

            {installMetamask && <InstallMetamask />}

            {!currentAccount && <ConnectMetamask connectWallet={connectWallet} />}

            {currentAccount && <Main />}

            {currentAccount && (
                <>
                    {/* // {!currentUserContract && (
                    //     <button onClick={connectUser}>Подключиться к nigga-system</button>
                    // )}
                    // {user && <>
                    //     <button onClick={async () => {
                    //         console.log(await user.collectNigga());
                    //     }}>Найти негра</button>
                    //     <button onClick={() => user.createAuction(0, 'message', 0.0005)}>Создать аукцион</button>
                    // </>}
                    // <button onClick={createAuction}>Создать аукцион</button> */}
                </>
            )}

            {isLoading && (
                <>
                    <hr /> <span>Загрузка...</span>
                </>
            )}
        </div>
    );
}

export default App;
