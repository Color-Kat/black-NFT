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

    const { } = useContext(AuctionContext);

    let params = useParams();
    const loadAuction = async () => {
        setIsLoading(true);

        console.log(params);

        // Load nft tokenURI for every auction
        // const auctions = await Promise.all(auctionsRaw.map(async (auction: IAuctionContent) => {
        //     return {
        //         ...auction,
        //         nft: await nftByTokenId(auction.nftTokenId)
        //     }
        // }));

        // setAuction();
        setIsLoading(false);
    }



    useEffect(() => {
        loadAuction();
    }, []);

    return (
        <section id="auction-page" className="page">
            <h1 className="auctions-page__title text-4xl text-slate-400 font-bold mb-3">Аукцион</h1>

            <span className="text-slate-500 text-lg font-mono">Выбирайте понравившиеся вам лоты, делайте на них ставки! Если ваша ставка будет самой большой, то вам будут переданы права владения негром, который представлен на аукционе.</span>

            {isLoading
                ? <div className="text-3xl text-slate-500 font-bold mt-5">Загрузка...</div>
                : <div className="auctions-page__list flex flex-wrap mt-5">

                </div>
            }

        </section>
    );
}