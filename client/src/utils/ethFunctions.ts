import { ethers } from "ethers";

export const toWei = (value: number) => {
    return ethers.utils.parseEther(value.toString());
}

export const toEth = (value: number) => {
    return ethers.utils.formatEther(value);
}