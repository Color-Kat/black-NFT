import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
    auctionBox_contract_ABI,
    auction_contract_ABI,
    contractAddress,
    NFT_contract_ABI,
} from "../utils/constants";

export const AuctionContext = React.createContext<any>(null);

const { ethereum } = window as any;

const getEthereumContract = (abi: string, address: string) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ethereumContract = new ethers.Contract(address, abi, signer);

    return ethereumContract;
};

const auctionBoxContract = () => {
    return getEthereumContract(auctionBox_contract_ABI, contractAddress);
};

const auctionContract = (address: string) => {
    return getEthereumContract(auction_contract_ABI, address);
};

const nftContract = (address: string) => {
    return getEthereumContract(NFT_contract_ABI, address);
};

export const AuctionProvider: React.FC = ({ children }: any) => {
    const [installMetamask, setInstallMetamask] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    // current eth account
    const [currentAccount, setCurrentAccount] = useState<string>("");

    // auctions data
    const [auctions, setAuctions] = useState([]);

    /**
     * check if is window.ethereum set
     * @returns boolean
     */
    const checkInstallMetamask = () => {
        if (!ethereum) {
            setInstallMetamask(true);
            return false;
        }
        return true;
    };

    const connectWallet = async () => {
        try {
            if (!checkInstallMetamask()) return;

            const accounts = await ethereum.request({ method: "eth_requestAccounts" });

            if (accounts[0]) setCurrentAccount(accounts[0]);
        } catch (error) {
            setInstallMetamask(true);
        }
    }

    /**
     * try to metamask account and save it, if metamask is connected
     */
    const checkIfWalletConnected = async () => {
        try {
            if (!checkInstallMetamask()) return;

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts[0]) setCurrentAccount(accounts[0]);
            else setError("Подключите, пожалуйста, кошелёк metamask");
        } catch (error) {
            console.log("Some error happened", error);
            setError("Произошла какая-то ошибка");
        }
    };

    /**
     * get auctions list from blockchain
     */
    const getAuctions = async () => {
        if (!checkInstallMetamask()) return;

        // (getAuTCions - a typo)
        // let auctionsList = await auctionBoxContract().getAutcions();

        // setAuctions(auctionsList);
    };

    const createAuction = async () => {
        // createAuction
    };

    // if (auctionBox.methods)
    //     auctionBox.methods.getAutcions().call().then(res => console.log(res));

    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    return (
        <AuctionContext.Provider
            value={{
                error,
                isLoading,
                installMetamask,
                connectWallet,
                getAuctions,
            }}
        >
            {children}
        </AuctionContext.Provider>
    );
};
