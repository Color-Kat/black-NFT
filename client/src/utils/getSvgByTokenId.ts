/**
* By nft contract get niggaNFT data by tokenId
* @param tokenId 
*/

import { nftContract, usersContract } from "./smartContracts";
import { dataURI2string } from "./dataURI2string";

export const getSvgByTokenId = async (tokenId: number): Promise<string> => {
   const nftAddress = await usersContract().nftInstance();
   const nftContr = nftContract(nftAddress);

   // Conver tokenURI to svg string
   const svgURI: string = JSON.parse(dataURI2string(await nftContr.tokenURI(tokenId))).image;
   const svg: string = dataURI2string(svgURI, 'data:image/svg+xml;base64,'.length);

   return svg;
}