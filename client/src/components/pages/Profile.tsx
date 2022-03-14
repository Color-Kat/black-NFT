import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import User, { IMyNigga } from "../../classes/User";
import { AuctionContext } from "../../context/AuctionContext";
import { IAuctionContent } from "../../interfaces/IAuction";
import { shortenAddress } from "../../utils/shortenAddress";
import { shortenString } from "../../utils/shortenString";

import Card from "../elements/Card";



export const Profile = ({ }) => {
    const [isLoading_my_niggas, setIsLoading_my_niggas] = useState(false);
    const [isLoading_my_auctions, setIsLoading_my_auctions] = useState(false);
    const { currentAccount, user }: { currentAccount: string, user: User } = useContext(AuctionContext);

    const [myNiggas, setMyNiggas] = useState<IMyNigga[]>();
    const loadMyNiggas = async () => {
        if (!user) return;
        setIsLoading_my_niggas(true);

        const myNiggasTokenURIs: IMyNigga[] = await user.getMyNiggasTokenURIs() || [];
        setMyNiggas(myNiggasTokenURIs);

        setIsLoading_my_niggas(false);
    }

    const [myAuctions, setMyAuctions] = useState<(IAuctionContent | false)[]>();
    const loadMyAuctions = async () => {
        if (!user) return;
        setIsLoading_my_auctions(true);

        const myAuctions = await user.getMyAuctionsContent() as (IAuctionContent | false)[];
        setMyAuctions(myAuctions);

        setIsLoading_my_auctions(false);
    }

    // Redirect to /auction/:auctionId
    let navigate = useNavigate();
    const openAuction = (auctionId: number) => { navigate("/auctions/" + auctionId); }

    useEffect(() => {
        loadMyNiggas();
        loadMyAuctions();
    }, [user]);

    return (
        <section id="profile-page" className="page w-full">
            <h1 className="profile__title text-4xl text-slate-400 font-bold mb-3">Профиль {shortenAddress(currentAccount)}</h1>

            <div className="max-w-full profile__nfts relative bg-slate-700 px-4 rounded-lg p-4 shadow-md flex-1 mt-4 text-left">
                <h3 className="text-2xl font-bold text-slate-500 mb-3">Ваши NFT:</h3>
                <div className="w-full overflow-x-scroll no-scrollbar">
                    <div className="flex">
                        {myNiggas && myNiggas.map((nigga) => {
                            const niggaSvg = nigga.tokenURI; // Get svg code of nigga;
                            const tokenId = nigga.tokenId;

                            return (
                                <Card
                                    key={tokenId}
                                    isActive={false}
                                    niggaSvg={niggaSvg}
                                    title="Nigga"
                                    desctiption="Нигга"
                                    onClickCallback={() => { }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="max-w-full profile__nfts relative bg-slate-700 px-4 rounded-lg p-4 shadow-md flex-1 mt-4 text-left">
                <h3 className="text-2xl font-bold text-slate-500 mb-3">Ваши аукционы:</h3>
                <div className="w-full overflow-x-scroll no-scrollbar">
                    <div className="flex">
                        {myAuctions && myAuctions.map((auction) => {
                            if (!auction) return;

                            return (
                                <Card
                                    key={auction.auctionId}
                                    isActive={false}
                                    niggaSvg={auction.nft} // There is empty, don't cate
                                    title={shortenAddress(auction.owner)}
                                    desctiption={shortenString(auction.message)}
                                    onClickCallback={() => { openAuction(auction.auctionId) }} />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}