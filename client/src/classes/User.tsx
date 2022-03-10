import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { auctionContract, nftContract } from "../utils/smartContracts";
import { toEth, toWei } from "../utils/ethFunctions";
import { AuctionState, IAuctionContent, IAuctionContentRaw } from "../interfaces/IAuction";
import { auctionFromRaw } from "../utils/AuctionFromRaw";
const { ethereum } = window as any;

/**
 * User class interact with User smart contract.
 */

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
     * Call collectNigga in User contact and return nft tokenURI.
     * @returns 
     */

    public collectNigga = async (): Promise<string> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            await this.userContract.collectNigga({
                // gasLimit: 40000
            }); // Call method in smart contract

            // And wait for the NiggaCollect event to fire
            return await new Promise<string>((resolve, reject) => {
                this.userContract.on("NiggaCollect", (niggaTokenURI: string) => {
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

    /** 
     * Return list of nigga ids of user (Not tokenIds).
     */

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

    /** 
    * Return list of tokenURIs of user.
    * Variant 1
    */

    public getMyNiggasTokenURIs = async () => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let myNiggasTokenURIs = await this.userContract.getMyNiggasTokenURI();


            const tokenIds = await this.getMyNiggasTokenIds();
            console.log(tokenIds);

            const niggas = (tokenIds || []).map(async (tokenId, index) => {
                return await new Promise(async (resolve) => {
                    resolve({
                        tokenId,
                        tokenURI: await this.getNiggaURIById(tokenId)
                    });
                })
            });

            console.log(niggas);

            this.setIsLoading(false); // Turn off the loader

            return niggas;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших негров");
            return false;
        }
    }

    /**
     * Return myNiggas indexes
     * CRUTCH!
     */
    public getMyNiggasIndexes = async () => {
        try {
            this.setIsLoading(true); // Turn on the loader
            // Because in smart conract we can't get my nigga indexes
            // conver sorted tokenIDs list to indexes
            let myNiggasTokenIDs = (await this.getMyNiggasTokenIds() || []).sort();
            const niggasIndexes = myNiggasTokenIDs.map((tokenId, index) => index);
            this.setIsLoading(false); // Turn off the loader

            return niggasIndexes;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших негров");
            return false;
        }
    }

    /** 
     * Return list of tokenURIs of user.
     * Variant 2
     */

    public getMyNiggasTokenURI2 = async () => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let myNiggasTokenURIs = await this.userContract.getMyNiggasTokenURI();
            this.setIsLoading(false); // Turn off the loader

            return myNiggasTokenURIs;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших негров");
            return false;
        }
    }

    /**
     * Return tokenURI of niggaNFT by niggaId.
     * 
     * @param niggaId - id of user's nigger, not tokenId
     */

    public getNiggaURIById = async (niggaIndex: number): Promise<string> => {
        try {
            const niggasIds = await this.getMyNiggasTokenIds(); // Get tokenIDs of user
            // Convert niggaIndex to nigga TokenId
            const niggaTokenIdFromIndex =
                (await this.userContract.getNiggaTokenIdById(niggaIndex)).toNumber();

            // Check if user has this nigger
            if (niggasIds && niggasIds.includes(niggaTokenIdFromIndex)) {

                this.setIsLoading(true); // Turn on the loader
                let niggaTokenURI = await this.userContract.getNiggaById(niggaIndex);
                this.setIsLoading(false); // Turn off the loader

                return niggaTokenURI;
            }

            this.setError("Вам не принадлежит ниггер№" + niggaIndex);
            return '';
        } catch (error) {
            console.log(error);
            this.setError("Не удалось найти негра №" + niggaIndex);
            this.setIsLoading(false); // Turn off the loader
            return '';
        }
    }

    /**
     * Create new auction of niggaId.
     * 
     * @param niggaId id of user's nigga. Not tokenId
     * @param message description of this auction and nigga
     * @param startPrice start price of niggaNFT
     * @returns 
     */

    public createAuction = async (niggaId: number, message: string, startPrice: number): Promise<boolean> => {
        try {
            if (!niggaId || !message || !startPrice) return false;

            // Convert niggaIndex to nigga TokenId
            const niggaTokenIdFromIndex =
                (await this.userContract.getNiggaTokenIdById(niggaId)).toNumber();
            const niggasIds = await this.getMyNiggasTokenIds();
            // Check if user has this nigga
            if (niggasIds && niggasIds.includes(niggaTokenIdFromIndex)) {
                this.setIsLoading(true); // Turn on the loader

                await this.userContract.sellNigga(niggaId, message, toWei(startPrice));

                // When auction is created, load auctions list
                return await new Promise(resolve => {
                    this.userContract.on("AuctionCreated", async (auctionId: BigNumber) => {
                        console.log(auctionId);

                        // To approve trasfer NFT we need to approve auction, so
                        // Get approving data
                        const [nftAddress, auctionAddress] = await this.userContract.getAuctionApprovingData(auctionId);
                        // in NFT contract approve transfering nft for auction contract
                        await nftContract(nftAddress).setApprovalForAll(auctionAddress, true);

                        this.setIsLoading(false); // Turn off the loader
                        resolve(true);
                    });

                });
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

    /**
     * Return list of user's auctionIds.
     */

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

    public getAuctionContentById = async (auctionId: number): Promise<IAuctionContent | false> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let auctionContent: IAuctionContentRaw = await this.userContract.getAuctionContentById(auctionId);
            this.setIsLoading(false); // Turn off the loader

            return auctionFromRaw(auctionId, auctionContent);
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших аукционов");
            this.setIsLoading(false); // Turn off the loader
            return false;
        }
    }

    /**
     * Return list of user's auctions content.
     */

    public getMyAuctionsContent = async (): Promise<IAuctionContent[] | false> => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let auctionsIdsList: number[] | false = await this.getMyAuctionsIds();

            if (auctionsIdsList) {
                // For every id get auction content
                return await Promise.all(auctionsIdsList.map(async (auctionId: number) => {
                    const auctionContentRaw: IAuctionContentRaw = await this.getAuctionContentById(auctionId) as unknown as IAuctionContentRaw;
                    return auctionFromRaw(auctionId, auctionContentRaw);
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

    /**
     * 
     * @param auctionId id of the auction to place bid.
     * @param valueEth value of bid in eth
     */

    public placeBid = async (auctionId: number, valueEth: number) => {
        try {
            this.setIsLoading(true); // Turn on the loader

            // Get auction content for checks
            const auctionContent = await this.userContract.getAuctionContentById(auctionId);

            // Check if auction exists and is not finalized
            if (auctionContent && AuctionState.Finallized == auctionContent.auctionState) {
                this.setError("Такого аукциона не существует");
                this.setIsLoading(false);
                return false;
            }

            // Check if current user is not owner
            if (await this.userContract.userAddress() == auctionContent.owner) {
                this.setError("Владелец не может сделать ставку");
                this.setIsLoading(false);
                return false;
            }

            // Get starting price and highest bid
            const startPrice = toEth(auctionContent.startPrice);
            const highestPrice = toEth(auctionContent.highestPrice);

            // Choose the highest price
            // const maxPrice = highestPrice > startPrice ? highestPrice : startPrice;
            const maxPrice = Math.max(+startPrice, +highestPrice);

            // User must pay more than the current max price
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

    /**
     * Finalize auction by id.
     * @param auctionId id of auction to be finalized
     */

    public finalizeAuction = async (auctionId: number) => {
        try {
            this.setIsLoading(true); // Turn on the loader

            // Check if auction exists and is not finalized
            const auction = await this.getAuctionContentById(auctionId);
            if (auction && AuctionState.Finallized == auction.auctionState) {
                this.setError("Такого аукциона не существует");
                this.setIsLoading(false);
                return false;
            }

            await this.userContract.finalizeAuction(auctionId); // Call method in smart contract

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