import abiUsers from './contracts/Users.json';
import abiUser from './contracts/User.json';
import abiNFT from './contracts/NFT.json';
import abiAuctions from './contracts/Auctions.json';
import abiAuction from './contracts/Auction.json';

export const users_contract_ABI: any = abiUsers.abi;
export const user_contract_ABI: any = abiUser.abi;
export const NFT_contract_ABI: any = abiNFT.abi;
export const auctions_contract_ABI: any = abiAuctions.abi;
export const auction_contract_ABI: any = abiAuction.abi;

export const contractAddress: string = '0x48f3d417DD77af6F3fE75eB652644a3cC8c7E995';