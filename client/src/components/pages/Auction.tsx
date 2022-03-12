import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { AuctionContext } from "../../context/AuctionContext";
import { IAuctionContent } from "../../interfaces/IAuction";
import { shortenAddress } from "../../utils/shortenAddress";
import { useParams } from "react-router-dom";

export const Auction = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [auction, setAuction] = useState<IAuctionContent>();

    const { getAuction, getSvgByTokenId } = useContext(AuctionContext);

    let params = useParams();
    const loadAuction = async () => {
        setIsLoading(true);
        if (!params.auctionId) return;

        const auctionId = +params.auctionId;
        const acutionContent = await getAuction(auctionId); // Only content
        // Content with image svg
        const auction = {
            ...acutionContent,
            nft: await getSvgByTokenId(acutionContent.nftTokenId)
        }
        console.log(auction);


        setAuction(auction);
        setIsLoading(false);
    }



    useEffect(() => {
        loadAuction();
    }, []);

    return (
        <section id="auction-page" className="page w-full">
            {(isLoading || !auction)
                ? <div className="text-3xl text-slate-500 font-bold mt-5">Загрузка...</div>
                : <div className="flex flex-col md:flex-row justify-between">
                    <div className="auction-page__left md:border-r-2 pr-8 border-slate-700">
                        <h1 className="auctions-page__title text-4xl text-slate-400 font-bold mb-3">Аукцион №{auction.auctionId}</h1>

                        <div
                            className="nigga-card__image bg-slate-900 no-scrollbar overflow-hidden my-2" // scroll
                            dangerouslySetInnerHTML={{ __html: auction.nft || '' }}
                            style={{ width: '300px', height: '300px' }}
                        ></div>

                        <span className="text-slate-500 text-lg font-mono">{auction.message}</span>


                        <div className="auctions-page__list flex flex-wrap mt-5">

                        </div>
                    </div>

                    <div className="auction-page__right">

                    </div>
                </div>
            }

        </section>
    );
}