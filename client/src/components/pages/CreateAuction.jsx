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

export const CreateAuction = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Toggle steps of creating auction
    const [step, setStep] = useState(1);
    const stepNext = () => {
        setStep(prev => prev + 1);
    }


    const { user } = useContext(AuctionContext);
    const [myNiggasIndexes, setMyNiggasIndexes] = useState([]);

    useEffect(async () => {
        if (user) {
            setIsLoading(true);
            const niggasIndexes = await user.getMyNiggasIndexes();

            // Wait for get nigga tokenURI for every niggaIndex
            const niggas = await Promise.all(niggasIndexes.map(async (niggaIndex) => {
                return await user.getNiggaURIById(niggaIndex);
            }));

            // const niggas = await Promise.all(niggasIndexes.map(async (niggaIndex) => {
            //     return await new Promise(async resolve => resolve(await user.getNiggaURIById(niggaIndex)));
            // }));

            setMyNiggasIndexes(niggas);
            setIsLoading(false);
        }
    }, [user]);


    return (
        <section id="create-auction-page" className="page ">
            <h1 className="create-auction__title text-4xl text-slate-400 font-bold mb-8">Создать аукцион</h1>

            <span>Здесь вы можете продать негра другому человеку в формате аукциона.</span>


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

            <div className="create-auction__container flex flex-col md:flex-row">

                {step === 1 &&
                    <>
                        <div className="create-auction__form relative bg-slate-700 px-4 rounded-2xl p-5 shadow-md flex-1 mt-5 md:mt-0 text-left">
                            <h3 className="text-2xl font-bold text-slate-500 mb-3">Выберите негра:</h3>
                            <div className="w-full overflow-x-scroll no-scrollbar">
                                {isLoading
                                    ? <ALoader />
                                    : <div className="flex">
                                        {myNiggasIndexes.map(tokenURIBase64 => {
                                            // Get tokenURI in json format
                                            const niggaTokenURI = JSON.parse(dataURI2string(tokenURIBase64));
                                            const niggaSvg = dataURI2string(
                                                niggaTokenURI.image, 'data:image/svg+xml;base64,'.length
                                            );  // Get svg code of image from json

                                            console.log(niggaTokenURI);
                                            return (
                                                <div className="nigga-card rounded-xl bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
                                                    <div className="nigga-card__image bg-slate-400 no-scrollbar max-h-96 max-w-xl overflow-auto" dangerouslySetInnerHTML={{ __html: niggaSvg }}></div>
                                                    <div className="bg-slate-800">
                                                        <h4>{niggaTokenURI.name}</h4>
                                                        <h5>{niggaTokenURI.description}</h5>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
            </div>
        </section>
    );
}