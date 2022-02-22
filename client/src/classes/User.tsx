import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { auctionContract, nftContract } from "../utils/smartContracts";
import { toEth, toWei } from "../utils/ethFunctions";
const { ethereum } = window as any;

interface AuctionContentI {
    owner: string;
    nftTokenId: BigNumber;
    message: string;
    startPrice: BigNumber;
    highestPrice: BigNumber;
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
            await this.userContract.collectNigga(); // Call method in smart contract

            // And wait for the NiggaCollect event to fire
            return await new Promise<string>((resolve, reject) => {
                this.userContract.on("NiggaCollect", (niggaTokenURI: string) => {
                    console.log(niggaTokenURI);
                    this.setIsLoading(false); // Turn off the loader
                    resolve(niggaTokenURI);
                });
            });
        } catch (error) {
            console.log(error);
            this.setError("Не удалось найти ниггера");
            this.setIsLoading(false); // Turn off the loader 
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
            this.setIsLoading(false); // Turn off the loader
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
            this.setIsLoading(false); // Turn off the loader
            return [];
        }
    }

    public createAuction = async (niggaId: number, message: string, startPrice: number): Promise<boolean> => {
        try {
            // Check if user has this nigga
            const niggasIds = await this.getMyNiggasTokenIds();
            if (niggasIds && niggasIds.includes(niggaId)) {
                this.setIsLoading(true); // Turn on the loader

                await this.userContract.sellNigga(niggaId, message, toWei(startPrice));

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
            this.setIsLoading(false); // Turn off the loader
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
            this.setIsLoading(false); // Turn off the loader
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
            this.setIsLoading(false); // Turn off the loader
            return [];
        }
    }

    public placeBid = async (auctionId: number, valueEth: number) => {
        try {
            this.setIsLoading(true); // Turn on the loader

            // Convert eth value to wei
            // const valueWei = toWei(valueEth);

            // Check if value is higher than highest bid
            const auctionContent: AuctionContentI = await this.userContract.getAuctionContentById(auctionId);
            // console.log(valueWei.toNumber(), auctionContent.highestPrice.toNumber());

            console.log(auctionContent.highestPrice, auctionContent.startPrice);


            const highestPrice = toEth(auctionContent.highestPrice);
            const startPrice = toEth(auctionContent.startPrice);

            const maxPrice = highestPrice > startPrice ? highestPrice : startPrice;

            if (+valueEth > +maxPrice) {
                const overrides = {
                    value: toWei(valueEth)
                }
                // Call placeBid method with override (send some ETH)
                await this.userContract.placeBid(auctionId, overrides);

                // And wait for PlaceBid event
                return await new Promise<boolean>((resolve, reject) => {
                    this.userContract.on("PlaceBid", async (result: boolean) => {
                        console.log(result);
                        resolve(result);
                    })
                });
            }

            this.setError("Ваша ставка должна быть больше " + maxPrice + "ETH");
            this.setIsLoading(false); // Turn off the loader
            return false;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось сделать ставку на этого негра");
            this.setIsLoading(false); // Turn off the loader
            return false;
        }
    }

    public finalizeAuction = async () => {
        try {
            this.setIsLoading(true); // Turn on the loader
            await this.userContract.finalizeAuction(); // Call method in smart contract

            // And wait for the AuctionFinalazed event to fire
            return await new Promise<boolean>((resolve, reject) => {
                this.userContract.on("AuctionFinalazed", (result: boolean) => {
                    console.log(result);
                    this.setIsLoading(false); // Turn off the loader
                    resolve(result);
                });
            });
        } catch (error) {
            console.log(error);
            this.setError("Не удалось завершить аукцион");
            this.setIsLoading(false); // Turn off the loader 
            return "";
        }
    }
}