import React, { ChangeEvent, useContext } from "react";
import { useEffect, useState } from "react";
import { AuctionContext } from "../../context/AuctionContext";
import { IAuctionContent } from "../../interfaces/IAuction";
import { shortenAddress } from "../../utils/shortenAddress";
import { useParams } from "react-router-dom";

import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

export const Auction = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState<boolean>();
    const [auction, setAuction] = useState<IAuctionContent>();

    const { getAuction, getSvgByTokenId, user, currentAccount } = useContext(AuctionContext);

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

    const getMinPrice = (): number => {
        return auction ? Math.max(+auction.highestPrice, +auction?.startPrice) : 0;
    }

    useEffect(() => {
        loadAuction();
    }, []);

    const [bid, setBid] = useState<number>(getMinPrice());
    const [placeBidLoading, setPlaceBidLoading] = useState(false);
    const placeBidHandler = async () => {
        if (!bid || bid <= getMinPrice() || !auction) return;
        setPlaceBidLoading(true);
        const result = await user.placeBid(auction.auctionId, bid);
        setIsSuccess(result);
        setPlaceBidLoading(false);
    }

    const [finalizeLoading, setFinalizeLoading] = useState(false);
    const finalizeAuctionHandler = async () => {
        if (!auction) return;
        setFinalizeLoading(true);
        const result = await user.finalizeAuction(auction.auctionId);
        console.log(result);
        
        setFinalizeLoading(false);
    }

    return (
        <section id="auction-page" className="page w-full">
            {/* RESULT Modal */}
            <Rodal
                visible={isSuccess !== undefined} animation="door"
                onClose={() => { setIsSuccess(undefined) }}
                customStyles={{ borderRadius: '20px', height: 'max-content', background: `rgb(${isSuccess ? '22 163 74' : '220 38 38'})` }}
            >
                <div className={`${isSuccess ? 'bg-green-600' : 'bg-red-600'} p-3`}>
                    <h3 className="font-bold font-mono text-3xl text-slate-200 mb-2">{isSuccess ? 'Ставка размещена' : 'Не удалось разместить ставку'}</h3>
                    <span className="font-mono text-xl text-slate-300">{isSuccess ? 'Ваша ставка принята. Когда аукцион завершится, лот будет отдан человеку с максимальной ставкой. Если ваша ставка не будет максимальной, мы вернём вам деньги.' : 'Транзакция не обработана. Попробуйте повторить попытку позже.'}</span>
                </div>
            </Rodal>

            {(isLoading || !auction)
                ? <div className="text-3xl text-slate-500 font-bold mt-5">Загрузка...</div>
                : <div className="flex flex-col md:flex-row justify-between">
                    <div className="auction-page__left md:border-r-2 pr-8 border-slate-700 mb-5">
                        <h1 className="auctions-page__title text-4xl text-slate-400 font-bold mb-3">Аукцион №{auction.auctionId}</h1>

                        <div
                            className="nigga-card__image shadow-md bg-slate-900 no-scrollbar overflow-hidden my-2" // scroll
                            dangerouslySetInnerHTML={{ __html: auction.nft || '' }}
                            style={{ width: '300px', height: '300px' }}
                        ></div>

                        <span className="text-slate-500 text-lg font-mono">{auction.message}</span>
                    </div>

                    <div className="auction-page__right flex-grow text-slate-500 font-mono md:pl-5 ">
                        <div className="auction-page__table border-b-2 border-slate-600 pb-2">
                            <div className="auction-page__table-row flex justify-between w-full flex-wrap">
                                <div className="auction-page__table-row-title text-2xl font-semibold">Владелец: </div>
                                <div className="auction-page__table-row-value text-xl leading-8">{shortenAddress(auction.owner)}</div>
                            </div>

                            <div className="auction-page__table-row flex justify-between w-full flex-wrap">
                                <div className="auction-page__table-row-title text-2xl font-semibold">Состояние: </div>
                                <div className="auction-page__table-row-value text-xl leading-8">{['Открыт', 'Завершен'][auction.auctionState - 1]}</div>
                            </div>

                            <div className="auction-page__table-row flex justify-between w-full flex-wrap">
                                <div className="auction-page__table-row-title text-2xl font-semibold">№NFT: </div>
                                <div className="auction-page__table-row-value text-xl leading-8">{auction.nftTokenId}</div>
                            </div>

                            <div className="auction-page__table-row flex justify-between w-full flex-wrap">
                                <div className="auction-page__table-row-title text-2xl font-semibold">Стартовая цена: </div>
                                <div className="auction-page__table-row-value text-xl leading-8">{auction.startPrice} ETH</div>
                            </div>

                            <div className="auction-page__table-row flex justify-between w-full flex-wrap">
                                <div className="auction-page__table-row-title text-2xl font-semibold">Наибольшая ставка: </div>
                                <div className="auction-page__table-row-value text-xl leading-8">{auction.highestPrice} ETH</div>
                            </div>

                            <div className="auction-page__table-row flex justify-between w-full flex-wrap">
                                <div className="auction-page__table-row-title text-2xl font-semibold">Владелец наиб.ств.: </div>
                                <div className="auction-page__table-row-value text-xl leading-8">{shortenAddress(auction.highestBidder)}</div>
                            </div>
                        </div>

                        {
                            auction.owner.toUpperCase() !== currentAccount.toUpperCase()
                                ? // It's for user, not owner
                                < div className="auction-page__bid max-w-xs flex flex-col">
                                    <h2 className="text-slate-500 font-bold text-3xl my-3">Сделать ставку</h2>
                                    <input
                                        type="number"
                                        min={getMinPrice()}
                                        step="0.0001"
                                        value={bid}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) => setBid(+e.target.value)}
                                        placeholder={getMinPrice() + ' ETH'}
                                        className="w-full bg-slate-900 p-3 rounded-lg my-3 border-2 border-slate-700"
                                    />

                                    {!placeBidLoading
                                        ? <button
                                            onClick={placeBidHandler}
                                            className="self-end w-full py-1.5 px-4 bg-white rounded-lg font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-green-500 to-green-700 text-slate-100  font-bold text-lg"
                                        >Отправить</button>
                                        : <div className="self-end text-center cursor-default w-full py-1.5 px-4 bg-white rounded-lg font-mono bg-gradient-to-r from-green-500 to-green-700 text-slate-100  font-bold text-lg">Ожидайте</div>
                                    }
                                </div>

                                : // For owner
                                < div className="auction-page__finalize max-w-xs flex flex-col">
                                    <h2 className="text-slate-500 font-bold text-3xl my-3">Завершить аукцион</h2>

                                    {!finalizeLoading
                                        ? <button
                                            onClick={finalizeAuctionHandler}
                                            className="self-end w-full py-1.5 px-4 bg-white rounded-lg font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-pink-500 to-red-500 text-slate-100   font-bold text-lg"
                                        >Завершить</button>
                                        : <div className="self-end text-center cursor-default w-full py-1.5 px-4 bg-white rounded-lg font-mono bg-gradient-to-r from-pink-500 to-red-500 text-slate-100   font-bold text-lg">Ожидайте</div>
                                    }
                                </div>
                        }
                    </div>
                </div>
            }

        </section>
    );
}