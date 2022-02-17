import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
const { ethereum } = window as any;

export default class User {
    public address: string = '';

    constructor(
        public userContract: ethers.Contract,
        private setError: Function,
        private setIsLoading: Function
    ) {
        this.address = userContract.address;
    }

    async collectNigga() {
        try {
            await this.userContract.collectNigga();
            this.setIsLoading(true); // turn on the loader

            let result: string = '';
            this.userContract.on("NiggaCollect", (niggaTokenURI: string) => {
                console.log(niggaTokenURI);
                this.setIsLoading(false); // turn off the loader
                result = niggaTokenURI;
            });

            return result;
        } catch (error) {
            console.log(error);
            this.setError("Не удалось найти ниггера");
            return false;
        }
    }
}