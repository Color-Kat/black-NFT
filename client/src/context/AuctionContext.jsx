import React from "react";
import Web3 from 'web3/dist/web3.min.js'
import { auctionBox_contract_ABI, contractAddress } from "../utils/constants";

export const AuctionContext = React.createContext();

const initWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);

        try {
            // request user access to account
            // ethereum.enable();
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            return true;
        } catch (error) {
            console.log("We don't have permission!", error);
            return false;
        }
    } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        return true;
    } else {
        if (confirm('You need to instal metamask. Click "ok" to do that')) {
            window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn');
        }

        return false;
    }
}

export const AuctionProvider = ({ children }) => {
    initWeb3();

    const auctionBox = new web3.eth.Contract(auctionBox_contract_ABI, contractAddress);

    if (auctionBox.methods)
        auctionBox.methods.getAutcions().call().then(res => console.log(res));

    return (
        <AuctionContext.Provider value={{}}>
            {children}
        </AuctionContext.Provider>
    )
}