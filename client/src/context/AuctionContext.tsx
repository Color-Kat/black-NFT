import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
    auctionBox_contract_ABI,
    auction_contract_ABI,
    contractAddress,
    NFT_contract_ABI,
} from "../utils/constants";
import useEth from "../hooks/useEth";

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

    const {
        currentAccount,
        checkInstallMetamask,
        connectWallet,
        checkIfWalletConnected
    } = useEth(setError, setInstallMetamask);

    // auctions data
    const [auctions, setAuctions] = useState([]);

    /**
     * get auctions list from blockchain
     */
    const getAuctions = async () => {
        if (!checkInstallMetamask()) return;

        // (getAuTCions - a typo)
        let auctionsList = await auctionBoxContract().getAutcions();

        setAuctions(auctionsList);
    };

    const createAuction = async () => {
        // createAuction
    };

    // if (auctionBox.methods)
    //     auctionBox.methods.getAutcions().call().then(res => console.log(res));



    return (
        <AuctionContext.Provider
            value={{
                error, // errors messages
                isLoading, // loading state
                installMetamask, // is metamask installed
                connectWallet, // function to connect metamask
                currentAccount, // get current connected account
                getAuctions,
            }}
        >
            {children}
        </AuctionContext.Provider>
    );
};
