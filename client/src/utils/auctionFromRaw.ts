import { IAuctionContent, IAuctionContentRaw } from "../interfaces/IAuction";
import { toEth } from "./ethFunctions";

export const auctionFromRaw = (auctionId: number, auctionContentRaw: IAuctionContentRaw): IAuctionContent => {
    return {
        auctionId,
        auctionState: 1,
        highestBidder: auctionContentRaw.highestBidder,
        highestPrice: toEth(auctionContentRaw.highestPrice.toString()), // Convert wei to eht
        message: auctionContentRaw.message,
        nftTokenId: auctionContentRaw.nftTokenId.toNumber(),
        owner: auctionContentRaw.owner,
        startPrice: toEth(auctionContentRaw.startPrice.toString()) // Convert wei to eht
    }
}