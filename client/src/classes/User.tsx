import React, { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
const { ethereum } = window as any;

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
    public collectNigga = async () => {
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
            return false;
        }
    }

    public getMyNiggasTokenIds = async () => {
        try {
            this.setIsLoading(true); // Turn on the loader
            let myNiggasIDs = (await this.userContract.getMyNiggaTokenIds()).map((id: BigNumber) => id.toNumber());

            this.setIsLoading(false); // Turn off the loader

            return myNiggasIDs;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось загрузить список ваших негров");
            return false;
        }
    }

    public getMyNiggasTokenURIs = async () => {
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
}