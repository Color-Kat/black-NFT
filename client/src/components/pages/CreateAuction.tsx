import React, { ChangeEvent, ChangeEventHandler } from "react";
import { useEffect } from "react";
import { useContext, useState } from "react";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { AuctionContext } from "../../context/AuctionContext";
import { dataURI2string } from "../../utils/dataURI2string";
import User from "../../classes/User";
import Card from "../elements/Card";

function ALoader() {
    return (
        <div className="text-3xl text-slate-500 font-bold">Загрузка...</div>
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
    const [isSuccess, setIsSuccess] = useState<boolean>();
    const [auctionData, setAuctionData] = useState<IAuctionData>({
        niggaId: null,
        message: null,
        startPrice: null
    });

    // Toggle steps of creating auction
    const [step, setStep] = useState(1);
    const stepNext = () => { if (step < 3) setStep(prev => prev + 1); }
    const stepPrev = () => { if (step > 1) setStep(prev => prev - 1); }

    const { user }: { user: User } = useContext(AuctionContext);
    const [myNiggas, setMyNiggas] = useState<{
        niggaId: number,
        tokenURIBase64: string
    }[]>([]);

    const loadNiggas = async () => {
        if (user) {
            setIsLoading(true);
            const niggasIndexes = await user.getMyNiggasIndexes();

            // Wait for get nigga tokenURI for every niggaIndex
            const niggas = await Promise.all((niggasIndexes || []).map(async (niggaIndex: number) => {
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

    const createAuction = async () => {
        console.log(auctionData);

        // If something is empty
        if (!auctionData.niggaId) setError('Вы не выбрали негра');
        else if (!auctionData.message) setError('Вы не написали сообщение');
        else if (!auctionData.startPrice || auctionData.startPrice <= 0) setError('Вы должны указать начальную цену');
        else {
            // All right, send create auction request
            setIsLoading(true);
            setStep(4);
            setError('');

            const result = await user.createAuction(auctionData.niggaId, auctionData.message, auctionData.startPrice);
            setIsSuccess(result);

            setStep(0);
            setIsLoading(false);
        }

    }

    return (
        <section id="create-auction-page" className="page  max-w-3xl w-full">
            <h1 className="create-auction__title text-4xl text-slate-400 font-bold mb-3">Создать аукцион</h1>

            <span className="text-slate-500 text-lg font-mono">Здесь вы можете продать негра другому человеку в формате аукциона.</span>

            {/* RESULT Modal */}
            <Rodal
                visible={isSuccess !== undefined} animation="door"
                onClose={() => { setIsSuccess(undefined) }}
                customStyles={{ borderRadius: '20px', height: 'max-content', background: `rgb(${isSuccess ? '22 163 74' : '220 38 38'})` }}
            >
                <div className={`${isSuccess ? 'bg-green-600' : 'bg-red-600'} p-3`}>
                    <h3 className="font-bold font-mono text-3xl text-slate-200 mb-2">{isSuccess ? 'Аукцион создан' : 'Не удалось создать аукцион'}</h3>
                    <span className="font-mono text-xl text-slate-300">{isSuccess ? 'Ваш негр отображатеся в ленте аукционов.' : 'Транзакция не обработана. Попробуйте повторить попытку позже.'}</span>
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

                    {/* STEP 4 - WAIT */}
                    {step === 4 && <>
                        <h3 className="text-2xl font-bold text-slate-500 mb-3">4. Лот отправлен:</h3>
                        <span className="text-lg font-semibold text-slate-400 mb-3">Ожидайте завершения транзакции. Созданные аукционы можно посмотреть в профиле. <br /> <br /> Обязательно оплатите транзакцию "setApprovalForAll", иначе вы не сможете корректно завершить аукцион!!!</span>
                    </>}
                </div>

                {/* ERRORS */}
                {error && <div className="h-10 my-2 bg-rose-500 flex items-center justify-center rounded-lg text-lg">
                    {error}
                </div>}

                {/* NAVIGATION */}
                {step !== 4 &&
                    <div className="create-auction__navigation w-full flex justify-between mt-6">
                        {/* BUTTON BACK */}
                        {step > 1 ? <button onClick={stepPrev} className="py-1.5 px-4 bg-white rounded-full font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-pink-500 to-red-500 text-slate-100 font-bold text-lg">Назад</button> : <div></div>}

                        {/* BUTTON NEXT, CREATE, WAIT */}

                        {step < 3
                            ? <button onClick={stepNext} className="py-1.5 px-4 bg-white rounded-full font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-green-500 to-green-700 text-slate-100  font-bold text-lg">
                                Далее
                            </button>
                            : <button onClick={createAuction} className="py-1.5 px-4 bg-white rounded-full font-mono hover:scale-105 hover:bg-gradient-to-l bg-gradient-to-r from-green-500 to-green-700 text-slate-100  font-bold text-lg">
                                {
                                    !isLoading
                                        ? 'Создать'
                                        : <span className="flex items-center">
                                            Ожидайте
                                            <svg role="status" className="mx-2 w-4 h-4 text-gray-100 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                        </span>
                                }
                            </button>
                        }
                    </div>
                }
            </div>
        </section >
    );
}