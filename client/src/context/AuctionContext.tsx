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

        console.log(auctionsList);
        setAuctions(auctionsList);
    };

    const createAuction = async () => {
        try {
            if (!checkInstallMetamask) return;

            const data = {}; // transfer data
            const addressTo = "0xDef2E169f0d3116c0C09717CE7B12DA98e39ABA9"; // to my wallet
            const gas = "0x5208"; // 21000 GWEI
            const commission_amount = ethers.utils.parseEther("0.0005")._hex;

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: gas,
                    value: commission_amount
                }]
            });

            // string memory _title,
            // string memory _description,
            // string memory _tokenURI,
            // uint256 _startPrice,
            // uint256 _duration
            const transactionHash = await auctionBoxContract().createAuction(
                'Продаётся первый нигга',
                "Он стал первым ниггером, которого выставили на этом аукционе",
                "https://poorbirds.tk",
                ethers.utils.parseEther("0.1"),
                3600000
            );

            setIsLoading(true);
            await transactionHash.wait();
            setIsLoading(false);

            getAuctions();
        } catch (error) {
            console.log(error);

            setError("Не удалось создать транзакцию");
        }
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
                createAuction
            }}
        >
            {children}
        </AuctionContext.Provider>
    );
};
