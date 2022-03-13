import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import useEth from "../hooks/useEth";
import User from "../classes/User";
import { auctionsContract, nftContract, userContract, usersContract } from "../utils/smartContracts";
import { toEth } from "../utils/ethFunctions";
import { IAuctionContent, IAuctionContentRaw } from "../interfaces/IAuction";
import { auctionFromRaw } from "../utils/AuctionFromRaw";
import { dataURI2string } from "../utils/dataURI2string";
import { getSvgByTokenId } from "../utils/getSvgByTokenId";

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
        connectUser();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setError("");
        }, 7000);
    }, [error]);

    /**
     * Get auctions list from blockchain
     */

    const getAuctions = async (): Promise<IAuctionContent[]> => {
        // Get Auctions contract
        const auctionsAddress = await usersContract().auctionInstance();
        const auctionsContr = auctionsContract(auctionsAddress);

        let auctions: IAuctionContent[] = await Promise.all((await auctionsContr.getAuctions()).map(async (auctionAddress: string, auctionId: number) => {
            // Get raw auction content and format it
            const auctionContentRaw: IAuctionContentRaw = await auctionsContr.getContent(auctionId);
            return auctionFromRaw(auctionId, auctionContentRaw);
        }));

        return auctions;
    };

    /**
     * Get auction content from blockchain by auctionId
     */

    const getAuction = async (auctionId: number): Promise<IAuctionContent> => {
        // Get Auctions contract
        const auctionsAddress = await usersContract().auctionInstance();
        const auctionsContr = auctionsContract(auctionsAddress);

        let auction: IAuctionContent = auctionFromRaw(auctionId,
            await auctionsContr.getContent(auctionId)
        );
        return auction;
    };

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

                getAuctions,
                getSvgByTokenId,
                getAuction
            }}
        >
            {children}
        </AuctionContext.Provider>
    );
};
