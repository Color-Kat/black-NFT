import React, { useContext } from "react";
import { AuctionContext } from "../../context/AuctionContext";
import { shortenAddress } from "../../utils/shortenAddress";

export const Profile = ({ }) => {
    const { currentAccount } = useContext(AuctionContext);

    return (
        <section id="profile-page" className="page w-full">
            <h1 className="profile__title text-4xl text-slate-400 font-bold mb-3">Профиль {shortenAddress(currentAccount)}</h1>

            <div className="max-w-full profile__nfts relative bg-slate-700 px-4 rounded-lg p-4 shadow-md flex-1 mt-4 text-left">
                <h3 className="text-2xl font-bold text-slate-500 mb-3">Ваши NFT:</h3>
                <div className="w-full overflow-x-scroll no-scrollbar">
                    <div className="flex">
                        {/* {myNiggas.map((niggaData, niggaIndex) => {
                                            const tokenURIBase64 = niggaData.tokenURIBase64;
                                            const niggaId = niggaData.niggaId;

                                            // Get tokenURI in json format
                                            const niggaTokenURI = JSON.parse(dataURI2string(tokenURIBase64));
                                            const niggaSvg = dataURI2string(
                                                niggaTokenURI.image, 'data:image/svg+xml;base64,'.length
                                            );  // Get svg code of image from json

                                            return (
                                                <Card
                                                    key={tokenURIBase64}
                                                    isActive={auctionData.niggaId === niggaId}
                                                    niggaSvg={niggaSvg}
                                                    title={niggaTokenURI.name}
                                                    desctiption={niggaTokenURI.description}
                                                    onClickCallback={() => {
                                                        selectNiggaId(niggaId);
                                                    }}
                                                />
                                            );
                                        })} */}
                    </div>
                </div>
            </div>

            <div className="max-w-full profile__nfts relative bg-slate-700 px-4 rounded-lg p-4 shadow-md flex-1 mt-4 text-left">
                <h3 className="text-2xl font-bold text-slate-500 mb-3">Ваши аукционы:</h3>
                <div className="w-full overflow-x-scroll no-scrollbar">
                    <div className="flex">

                    </div>
                </div>
            </div>
        </section>
    );
}