import abiAuctionBox from './contracts/AuctionBox.json';
import abiAuction from './contracts/Auction.json';

import abiUsers from './contracts/Users.json';
import abiUser from './contracts/User.json';
import abiNFT from './contracts/NFT.json';

export const auctionBox_contract_ABI: any = abiAuctionBox.abi;
export const auction_contract_ABI: any = abiAuction.abi;

export const users_contract_ABI: any = abiUsers.abi;
export const user_contract_ABI: any = abiUser.abi;
export const NFT_contract_ABI: any = abiNFT.abi;


export const contractAddress: string = '0x25f1799Fe18fE859c69Ac275Bc0Ae0ffCE1Fe804';