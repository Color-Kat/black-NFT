import React, { useEffect, useState } from "react";
import Web3 from "web3/dist/web3.min.js";
import {
    auctionBox_contract_ABI,
    auction_contract_ABI,
    contractAddress,
    NFT_contract_ABI,
} from "../utils/constants";

export const AuctionContext = React.createContext();

/**
 * check if metamask(ethereum) or web3 already exist
 * if don't, create web3
 * or show "install metamask" message
 *
 * @returns boolean
 */
const initWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        return true;
        // try {
        // request user access to account
        // ethereum.enable();
        // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // return true;
        // } catch (error) {
        //     console.log("We don't have permission!", error);
        //     return false;
        // }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        return true;
    } else {
        if (confirm('You need to instal metamask. Click "ok" to do that')) {
            window.open(
                "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
            );
        }

        return false;
    }
};

const auctionBox = () => {
    return new web3.eth.Contract(auctionBox_contract_ABI, contractAddress);
};

const auction = (address) => {
    return new web3.eth.Contract(auction_contract_ABI, address);
};

const nft = (address) => {
    return new web3.eth.Contract(NFT_contract_ABI, address);
};

export const AuctionProvider = ({ children }) => {
    // current eth account
    const [currentAccount, setCurrentAccount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // auctions data
    const [auctions, setAuctions] = useState([]);

    initWeb3();

    // get auctions list (getAuTCions - a typo)
    const getAuctions = () => {
        auctionBox().methods.getAutcions().call().then(auctions => {
            console.log(auctions);
            setAuctions(auctions);
        });
    }

    // if (auctionBox.methods)
    //     auctionBox.methods.getAutcions().call().then(res => console.log(res));

    return (
        <AuctionContext.Provider value={{
            getAuctions
        }}>{children}</AuctionContext.Provider>
    );
};
