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

class EthConnection extends React.Component {
    constructor(props: any) {
        super(props);

        this.state = {
            currentAccount: '',
            installMetamask: false
        }
    }

    /**
        * check if is window.ethereum set
        * @returns boolean
        */
    checkInstallMetamask = () => {
        if (!ethereum) {
            this.setState({ installMetamask: true });
            return false;
        }
        this.setState({ installMetamask: false });
        return true;
    };

    /**
     * connect metamask to app and get current account
     */
    connectWallet = async () => {
        try {
            if (!this.checkInstallMetamask()) return;

            // request metamask to get current account
            // it will connect metamask to our app
            const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });

            // safe wallet address
            if (accounts[0]) this.setState({ currentAccount: accounts[0] });
        } catch (error) {
            this.setState({ installMetamask: true });
        }
    }

    /**
     * try to metamask account and save it, if metamask is connected
     */
    checkIfWalletConnected = async () => {
        try {
            if (!this.checkInstallMetamask()) return;

            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts[0]) this.setState({ currentAccount: accounts[0] });
            // else setError("Подключите, пожалуйста, кошелёк metamask");
        } catch (error) {
            console.log("Some error happened", error);
            // setError("Произошла какая-то ошибка");
        }
    };
}



export class AuctionProvider extends EthConnection {
    constructor(props: any) {
        super(props);

        this.state = {
            error: '',
            isLoading: false,
            installMetamask: false,
        }

        this.connectWallet();
    }

    render(): React.ReactNode {
        return (
            <AuctionContext.Provider
                value={{
                    // error, // errors messages
                    // isLoading, // loading state
                    // installMetamask, // is metamask installed
                    // connectWallet, // function to connect metamask
                    // currentAccount, // get current connected account
                    // getAuctions,
                }}
            >
                {this.props.children}
            </AuctionContext.Provider>
        );
    }
}

export const AuctionProvider2: React.FC = ({ children }: any) => {
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
        setInstallMetamask(false);
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
        let auctionsList = await auctionBoxContract().getAutcions();

        setAuctions(auctionsList);
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
