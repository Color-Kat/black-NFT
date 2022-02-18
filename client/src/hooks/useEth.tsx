import { useEffect, useState } from "react";

const { ethereum } = window as any;

const useEth = (setErrorCallback: Function, setInstallMetamaskCallback: Function) => {
    // current eth account
    const [currentAccount, setCurrentAccount] = useState<string>("");

    /**
     * check if is window.ethereum set
     * @returns boolean
     */
    const checkInstallMetamask = () => {
        if (!ethereum) {
            setInstallMetamaskCallback(true);
            return false;
        }
        setInstallMetamaskCallback(false);
        return true;
    };

    /**
     * connect metamask to app and get current account
     */
    const connectWallet = async () => {
        try {
            if (!checkInstallMetamask()) return;

            // request metamask to get current account
            // it will connect metamask to our app
            const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });

            // safe wallet address
            if (accounts[0]) {
                setCurrentAccount(accounts[0]);
                setInstallMetamaskCallback(false);
            }
        } catch (error) {
            setInstallMetamaskCallback(true);
            setErrorCallback("Не удаётся получить доступ к кошельку metamask");
        }
    }

    /**
     * try to metamask account and save it, if metamask is connected
     */
    const checkIfWalletConnected = async () => {
        try {
            if (!checkInstallMetamask()) return;

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts[0]) {
                setCurrentAccount(accounts[0]);
                setErrorCallback("");
            }
            else setErrorCallback("Подключите, пожалуйста, кошелёк metamask");
        } catch (error) {
            console.log("Some error happened", error);
            setErrorCallback("Произошла какая-то ошибка");
        }
    };

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    return {
        currentAccount,
        checkInstallMetamask,
        connectWallet,
        checkIfWalletConnected
    }
}

export default useEth;