import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { AuctionContext } from "../../context/AuctionContext";
import { IAuctionContent } from "../../interfaces/IAuction";
import Card from "../elements/Card";
import { shortenAddress } from "../../utils/shortenAddress";
import { shortenString } from "../../utils/shortenString";

export const Auctions = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [auctions, setAuctions] = useState<IAuctionContent[]>([]);

    const { getAuctions, nftByTokenId } = useContext(AuctionContext);

    const loadAuctions = async () => {
        const auctionsRaw = await getAuctions(); // Get auctions list

        // Load nft tokenURI for every auction
        const auctions = await Promise.all(auctionsRaw.map(async (auction: IAuctionContent) => {
            return {
                ...auction,
                nft: await nftByTokenId(auction.nftTokenId)
            }
        }));

        setAuctions(auctions);
    }

    const openAuction = () => {

    }

    useEffect(() => {
        loadAuctions();
    }, [getAuctions]);

    return (
        <section id="auctions-page" className="page">
            <h1 className="auctions-page__title text-4xl text-slate-400 font-bold mb-3">Аукционы</h1>

            <span className="text-slate-500 text-lg font-mono">Выбирайте понравившиеся вам лоты, делайте на них ставки! Если ваша ставка будет самой большой, то вам будут переданы права владения негром, который представлен на аукционе.</span>

            <div className="auctions-page__list flex flex-wrap mt-5">
                {auctions.map((auction: IAuctionContent) => {
                    console.log();


                    return (
                        <div className="auctions-page__card" key={auction.auctionId}>
                            <Card
                                isActive={false}
                                niggaSvg={auction.nft}
                                title={shortenAddress(auction.owner)}
                                desctiption={shortenString(auction.message)}
                                onClickCallback={openAuction} />
                        </div>
                    );
                })}
            </div>

        </section>
    );
}