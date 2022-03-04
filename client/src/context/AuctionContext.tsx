import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useEth from "../hooks/useEth";
import User from "../classes/User";
import { nftContract, userContract, usersContract } from "../utils/smartContracts";

export const AuctionContext = React.createContext<any>(null);

export const AuctionProvider: React.FC = ({ children }: any) => {
    const [installMetamask, setInstallMetamask] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const {
        currentAccount,
        checkInstallMetamask,
        connectWallet,
        checkIfWalletConnected
    } = useEth(setError, setIsLoading, setInstallMetamask);

    // user data
    const [currentUserContract, setCurrentUserContract] = useState<ethers.Contract | null>(null);
    const [user, setUser] = useState<User>();


    // Auctions data
    const [auctions, setAuctions] = useState([]);

    /**
     * Connect user to nigga system
     * Set current user from event "UserConnect"
     */
    const connectUser = async () => {
        try {
            if (!checkInstallMetamask()) return;
            // localStorage.setItem('user_contract_address', '');
            // Try to get user addres from localStorage
            let userContractAddress = localStorage.getItem('user_contract_address') || '';

            const initUser = async (userAddress: string) => {
                let userContractInstance: ethers.Contract = userContract(userAddress); // Create user contract
                setCurrentUserContract(userContractInstance);
                setUser(new User(userContractInstance, setError, setIsLoading));
            }

            setIsLoading(true); // Turn on the loader

            if (!userContractAddress) { // User is not connected to nigga system yet
                // Connect user to nigga system
                await usersContract().connectUser();

                // Listen events to get connected user
                await new Promise<boolean>(resolve => {
                    usersContract().on("UserConnect", (user) => {
                        localStorage.setItem('user_contract_address', user); // Save user contract address to use in future after reload
                        initUser(user);
                        resolve(true);
                    })
                });
            } else initUser(userContractAddress);

            setIsLoading(false); // turn off the loader
        } catch (error) {
            console.log(error);
            setError("Не удалось подключить пользователя к nigga-system");
        }
    }

    useEffect(() => {
        // connectUser();s
        // getAuctions();

        // if (user) getAuctions();
        // if (user) console.log(user.finalizeAuction(0));

    }, [user]);

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 7000);
    }, [error]);

    /**
     * get auctions list from blockchain
     */
    const getAuctions = async () => {
        // console.log(user);

        if (user) {

            // console.log(await user.getMyNiggasTokenIds());
            // console.log(await user.getMyAuctionsContent());
            console.log(await user.getMyNiggasTokenURIs());

            // console.log(await user.createAuction(0, 'some message for text', 0.0061));

        }

        //     if (!checkInstallMetamask()) return;
        //     // console.log(await auctionBoxContract().auctions(1));

        //     let auctionsList = await auctionBoxContract().getAuctions();

        //     // console.log(await auctionBoxContract().getAuctionTokenURIById(1));
        //     console.log(auctionContract(auctionsList[1]));
        //     console.log(await auctionContract(auctionsList[1]).tokenURI(0));


        //     console.log(auctionsList);
        //     setAuctions(auctionsList);
    };

    // const createAuction = async () => {
    //     try {
    //         if (!checkInstallMetamask) return;

    //         const data = {}; // transfer data
    //         const addressTo = "0xDef2E169f0d3116c0C09717CE7B12DA98e39ABA9"; // to my wallet
    //         const gas = "0x5208"; // 21000 GWEI
    //         const commission_amount = ethers.utils.parseEther("0.0005")._hex;

    //         await ethereum.request({
    //             method: 'eth_sendTransaction',
    //             params: [{
    //                 from: currentAccount,
    //                 to: addressTo,
    //                 gas: gas,
    //                 value: commission_amount
    //             }]
    //         });
    //         const transactionHash = await auctionBoxContract().createAuction(
    //             'Белые нигги в чёрных квадратах',
    //             'Искусство',
    //             `<svg xmlns="http://www.w3.org/2000/svg" width="580" height="400"></svg>`,
    //             ethers.utils.parseEther("0.1"),
    //             3600000
    //         );

    //         setIsLoading(true);
    //         await transactionHash.wait();
    //         setIsLoading(false);

    //         getAuctions();
    //     } catch (error) {
    //         console.log(error);

    //         setError("Не удалось создать транзакцию");
    //     }
    // };

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

                currentUserContract,
                connectUser,
                user,

                getAuctions
            }}
        >
            {children}
        </AuctionContext.Provider>
    );
};
