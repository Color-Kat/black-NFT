import { ethers } from "ethers";

export const toWei = (value: number) => {
    return ethers.utils.parseEther(value.toString());
}