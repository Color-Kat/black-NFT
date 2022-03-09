import { BigNumber } from "ethers";

export enum AuctionState { Running, Finallized };

export interface IAuctionContentRaw {
    owner: string;
    nftTokenId: BigNumber;
    message: string;
    startPrice: BigNumber;
    highestPrice: BigNumber;
    highestBidder: string;
    auctionState: AuctionState;
}

export interface IAuctionContent {
    auctionId: number;
    auctionState: AuctionState;
    highestBidder: string;
    highestPrice: string; // Price in eth
    message: string;
    nftTokenId: number;
    owner: string;
    startPrice: string; // Price in eth
}