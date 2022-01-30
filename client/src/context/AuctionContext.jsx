import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import {
    auctionBox_contract_ABI,
    auction_contract_ABI,
    contractAddress,
    NFT_contract_ABI,
} from "../utils/constants";

export const AuctionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = (abi, address) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ethereumContract = new ethers.Contract(address, abi, signer);

    return ethereumContract;
}

const auctionBoxContract = () => {
    return getEthereumContract(auctionBox_contract_ABI, contractAddress);
};

const auctionContract = (address) => {
    return getEthereumContract(auction_contract_ABI, address);
};

const nftContract = (address) => {
    return getEthereumContract(NFT_contract_ABI, address);
};

export const AuctionProvider = ({ children }) => {
    // current eth account
    const [installMetamask, setInstallMetamask] = useState(false);
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    // auctions data
    const [auctions, setAuctions] = useState([]);

    const checkInstallMetamask = () => {
        if (!ethereum) {
            setInstallMetamask(true);
            return false;
        }
        return true;
    }

    // const initWeb3 = () => {
    //     if (checkInstallMetamask())
    //         window.web3 = new Web3(ethereum);
    // }

    /**
     * try to connect to metamask and set currentAccount
     */
    const connectAccount = async () => {
        try {
            if (!checkInstallMetamask()) return;

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log("Some error happened", error);
            setError(true);
        }
    }

    /**
     * get auctions list from blockchain
     */
    const getAuctions = async () => {
        if (!checkInstallMetamask()) return;

        // (getAuTCions - a typo)
        let auctionsList = await auctionBoxContract().getAutcions();

        setAuctions(auctionsList);
    }

    const createAuction = async () => {
        // createAuction
    }

    // if (auctionBox.methods)
    //     auctionBox.methods.getAutcions().call().then(res => console.log(res));

    useEffect(() => {
        connectAccount();
    }, []);

    return (
        <AuctionContext.Provider value={{
            error,
            isLoading,
            installMetamask,
            getAuctions
        }}>{children}</AuctionContext.Provider>
    );
};
