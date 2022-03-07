import React, { ChangeEvent, ChangeEventHandler } from "react";
import { useEffect } from "react";
import { useContext, useState } from "react";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { AuctionContext } from "../../context/AuctionContext";
import { dataURI2string } from "../../utils/dataURI2string";

function ALoader() {
    return (
        <div>Загрузка</div>
    );
}

export interface IAuctionData {
    niggaId: number | null;
    message: string | null;
    startPrice: number | null;
}

export const CreateAuction = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [auctionData, setAuctionData] = useState<IAuctionData>({
        niggaId: null,
        message: null,
        startPrice: null
    });

    // Toggle steps of creating auction
    const [step, setStep] = useState(1);
    const stepNext = () => { if (step !== 3) setStep(prev => prev + 1); }
    const stepPrev = () => { if (step !== 1) setStep(prev => prev - 1); }


    const { user } = useContext(AuctionContext);
    const [myNiggas, setMyNiggas] = useState<{
        niggaId: number,
        tokenURIBase64: string
    }[]>([]);

    const loadNiggas = async () => {
        if (user) {
            setIsLoading(true);
            const niggasIndexes = await user.getMyNiggasIndexes();

            // Wait for get nigga tokenURI for every niggaIndex
            const niggas = await Promise.all(niggasIndexes.map(async (niggaIndex: number) => {
                return {
                    niggaId: niggaIndex, // Save niggaId (niggaIndex)
                    tokenURIBase64: await user.getNiggaURIById(niggaIndex) // Ans save tokenURI in base64
                }
            }));

            niggas.reverse(); // New ones first

            setMyNiggas(niggas);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadNiggas();
    }, [user]);

    const selectNiggaId = (niggaId: number) => {
        setAuctionData(prev => ({ ...prev, niggaId }));
    }

    const changeMessage = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setAuctionData(prev => ({ ...prev, message: e.target.value }));
    }

    const changeStartPrice = (e: ChangeEvent<HTMLInputElement>) => {
        setAuctionData(prev => ({ ...prev, startPrice: +e.target.value }));
    }

    const createAuction = () => {
        console.log(auctionData);

        if (!auctionData.niggaId) setError('Вы не выбрали негра');
        else if (!auctionData.message) setError('Вы не написали сообщение');
        else if (!auctionData.startPrice || auctionData.startPrice <= 0) setError('Вы должны указать начальную цену');
        else {

        }
    }

    return (
        <section id="create-auction-page" className="page  max-w-3xl w-full">
            <h1 className="create-auction__title text-4xl text-slate-400 font-bold mb-3">Создать аукцион</h1>

            <span className="text-slate-500 text-lg font-mono">Здесь вы можете продать негра другому человеку в формате аукциона.</span>

            {/* Modal */}
            <Rodal
                visible={isSuccess} animation="door"
                onClose={() => { setIsSuccess(false) }}
                customStyles={{ borderRadius: '20px', height: 'max-content', background: 'rgb(203 213 225 / var(--tw-bg-opacity))' }}
            >
                <div className="">
                    <h3 className="font-bold font-mono text-3xl text-slate-700">Аукцион создан!</h3>
                    <span className="font-mono text-xl text-slate-600">Ваш негр отображатеся в ленте аукционов.</span>
                </div>
            </Rodal>

            <div className="create-auction__container  mt-4">
                <div className="max-w-full create-auction__form relative bg-slate-700 px-4 rounded-lg p-4 shadow-md flex-1 mt-0 md:mt-1 text-left">
                    {/* STEP 1 */}
                    {step === 1 &&
                        <>
                            <h3 className="text-2xl font-bold text-slate-500 mb-3">1. Выберите негра:</h3>
                            <div className="w-full overflow-x-scroll no-scrollbar">
                                {isLoading
                                    ? <ALoader />
                                    : <div className="flex">
                                        {myNiggas.map((niggaData, niggaIndex) => {
                                            const tokenURIBase64 = niggaData.tokenURIBase64;
                                            const niggaId = niggaData.niggaId;

                                            // Get tokenURI in json format
                                            const niggaTokenURI = JSON.parse(dataURI2string(tokenURIBase64));
                                            const niggaSvg = dataURI2string(
                                                niggaTokenURI.image, 'data:image/svg+xml;base64,'.length
                                            );  // Get svg code of image from json

                                            return (
                                                <div
                                                    key={tokenURIBase64}
                                                    className={`
                                                        nigga-card realtive mr-2 overflow-hidden rounded-xl 
                                                         cursor-pointer
                                                        ${auctionData.niggaId === niggaId ? 'hover:bg-gradient-to-b from-gray-700 via-gray-900 to-black bg-gradient-to-bl' : 'bg-gradient-to-tl from-gray-700 via-gray-900 to-black hover:bg-gradient-to-bl'}
                                                        `}
                                                    style={{ minWidth: '300px' }}
                                                    onClick={() => {
                                                        selectNiggaId(niggaId);
                                                    }}
                                                >
                                                    <div
                                                        className="nigga-card__image bg-slate-900 no-scrollbar overflow-hidden" // scroll
                                                        dangerouslySetInnerHTML={{ __html: niggaSvg }}
                                                        style={{ width: '300px', height: '300px' }}
                                                    ></div>
                                                    <div className="text-slate-400 p-2 px-3">
                                                        <h4 className="font-bold text-xl mb-1">{niggaTokenURI.name}</h4>
                                                        <h5>{niggaTokenURI.description}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                        </>
                    }

                    {/* STEP 2 */}
                    {step === 2 && <>
                        <h3 className="text-2xl font-bold text-slate-500 mb-3">2. Напишите сообщение:</h3>
                        <textarea
                            onChange={changeMessage}
                            value={auctionData.message || ''}
                            placeholder="Сообщение, прикреплённое к негру"
                            className="w-full py-4 my-2 h-20 bg-slate-800 rounded-xl outline-none px-6 text-slate-200 text-lg" />
                    </>}

                    {/* STEP 3 */}
                    {step === 3 && <>
                        <h3 className="text-2xl font-bold text-slate-500 mb-3">3. Стартовая цена негра:</h3>
                        <input
                            onChange={changeStartPrice}
                            type="number"
                            step="0.0001"
                            value={auctionData.startPrice || ''}
                            placeholder="Стартовая цена (ETH)"
                            className="w-full my-2 h-14 bg-slate-800 rounded-xl outline-none px-6 text-slate-200 text-lg"
                        />
                    </>}
                </div>

                {/* ERRORS */}
                {error && <div className="h-10 my-2 bg-rose-500 flex items-center justify-center rounded-lg text-lg">
                    {error}
                </div>}

                {/* NAVIGATION */}
                <div className="create-auction__navigation w-full flex justify-between mt-6">
                    {step > 1 ? <button onClick={stepPrev} className="py-1.5 px-4 bg-white rounded-full font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-pink-500 to-red-500 text-slate-100 font-bold text-lg">Назад</button> : <div></div>}

                    {step < 3
                        ? <button onClick={stepNext} className="py-1.5 px-4 bg-white rounded-full font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-green-500 to-green-700 text-slate-100  font-bold text-lg">
                            Далее
                        </button>
                        : <button onClick={createAuction} className="py-1.5 px-4 bg-white rounded-full font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-green-500 to-green-700 text-slate-100  font-bold text-lg">
                            Создать
                        </button>
                    }
                </div>
            </div>
        </section >
    );
}