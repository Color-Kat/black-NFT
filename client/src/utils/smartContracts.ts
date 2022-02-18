import { ethers } from "ethers";
import {
    contractAddress,
    users_contract_ABI,
    user_contract_ABI,
    NFT_contract_ABI,
    auctions_contract_ABI,
    auction_contract_ABI
} from "../utils/constants";

const { ethereum } = window as any;

export const getEthereumContract = (abi: string, address: string): ethers.Contract => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ethereumContract = new ethers.Contract(address, abi, signer);

    return ethereumContract;
};

export const usersContract = (): ethers.Contract => {
    return getEthereumContract(users_contract_ABI, contractAddress);
};

export const userContract = (address: string): ethers.Contract => {
    return getEthereumContract(user_contract_ABI, address);
};

export const nftContract = (address: string): ethers.Contract => {
    return getEthereumContract(NFT_contract_ABI, address);
};

export const auctionContract = (address: string): ethers.Contract => {
    return getEthereumContract(auction_contract_ABI, address);
};

export const auctionsContract = (address: string): ethers.Contract => {
    return getEthereumContract(auctions_contract_ABI, address);
};