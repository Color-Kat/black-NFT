import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { auctionContract, nftContract } from "../utils/smartContracts";
const { ethereum } = window as any;

interface AuctionContentI {
    owner: string;
    nftTokenId: number;
    message: string;
    startPrice: number;
    highestPrice: number;
}

export default class User {
    public address: string = '';

    public constructor(
        public userContract: ethers.Contract,
        private setError: Function,
        private setIsLoading: Function
    ) {
        this.address = userContract.address;
    }

    /**
     * Call collectNigga in User contact and return nft tokenURI
     * @returns 
     */
    public collectNigga = async (): Promise<string> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            await this.userContract.collectNigga();

            let result: string = '';
            this.userContract.on("NiggaCollect", (niggaTokenURI: string) => {
                console.log(niggaTokenURI);
                this.setIsLoading(false); // Turn off the loader
                result = niggaTokenURI;
            });

            return result;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось найти ниггера");
            return "";
        }
    }

    public getMyNiggasTokenIds = async (): Promise<number[] | false> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let myNiggasIDs = (await this.userContract.getMyNiggaTokenIds()).map((id: BigNumber) => id.toNumber());

            this.setIsLoading(false); // Turn off the loader

            return myNiggasIDs;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших негров");
            return [];
        }
    }

    // public getMyNiggasTokenURIs = async () => {
    //     try {
    //         this.setIsLoading(true); // Turn on the loader
    //         console.log(
    //             this.userContract
    //         );

    //         let myNiggasTokenURIs = await this.userContract.getMyNiggasTokenURI();

    //         this.setIsLoading(false); // Turn off the loader

    //         return myNiggasTokenURIs;
    //     } catch (error) {
    //         console.log(error);
    //         this.setError("Не удалось загрузить список ваших негров");
    //         return false;
    //     }
    // }

    /**
     * Return tokenURI of niggaNFT by niggaId
     * 
     * @param niggaId - id of nigger, not tokenId
     * @returns 
     */
    public getNiggaURIById = async (niggaId: number): Promise<number[] | false> => {
        try {
            // Check if user has this nigger
            const niggasIds = await this.getMyNiggasTokenIds();
            if (niggasIds && niggasIds.includes(niggaId)) {
                this.setIsLoading(true); // Turn on the loader
                let niggaTokenURI = await this.userContract.getNiggaById(niggaId);
                this.setIsLoading(false); // Turn off the loader

                return niggaTokenURI;
            }

            this.setError("Вам не принадлежит ниггер№" + niggaId);
            return [];
        } catch (error) {
            console.log(error);
            this.setError("Не удалось найти негра №" + niggaId);
            return [];
        }
    }

    public createAuction = async (niggaId: number, message: string, startPrice: number): Promise<boolean> => {
        try {
            // Check if user has this nigga
            const niggasIds = await this.getMyNiggasTokenIds();
            if (niggasIds && niggasIds.includes(niggaId)) {
                this.setIsLoading(true); // Turn on the loader
                await this.userContract.sellNigga(niggaId, message, startPrice);

                // When auction is created, load auctions list
                this.userContract.on("AuctionCreated", async (auctionId: BigNumber) => {
                    // To approve trasfer NFT we need to approve auction, so
                    // Get approving data
                    const [nftAddress, auctionAddress] = await this.userContract.getAuctionApprovingData(auctionId);
                    // in NFT contract approve transfering nft for auction contract
                    nftContract(nftAddress).setApprovalForAll(auctionAddress, true);

                    // this.getMyAuctionsContent();

                    this.setIsLoading(false); // Turn off the loader
                });

                return true;
            }

            this.setError("Вам не принадлежит ниггер№" + niggaId);
            return false;

        } catch (error) {
            console.log(error);
            this.setError("Не удалось создать новый аукцион");
            return false;
        }
    }

    public getMyAuctionsIds = async (): Promise<number[]> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let auctionsIdsList = await this.userContract.getMyAuctionIds();
            this.setIsLoading(false); // Turn off the loader

            return auctionsIdsList.map((auctionId: BigNumber) => auctionId.toNumber());
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших аукционов");
            return [];
        }
    }

    /**
     * Return list of user's auctions content
     * @returns 
     */
    public getMyAuctionsContent = async (): Promise<AuctionContentI[] | false> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let auctionsIdsList: number[] | false = await this.getMyAuctionsIds();

            if (auctionsIdsList) {
                // For every id get auction content
                return await Promise.all(auctionsIdsList.map(async (auctionId: number) => {
                    return await this.userContract.getAuctionContentById(auctionId) as AuctionContentI;
                }));
            }

            this.setIsLoading(false); // Turn off the loader
            return [];
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших аукционов");
            return [];
        }
    }

    public placeBid = async (auctionId: number, value: number) => {
        const auctionContent = await this.userContract.getAuctionContentById(auctionId);
    }
}