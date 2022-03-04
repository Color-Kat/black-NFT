import { useEffect } from "react";
import { useContext, useState } from "react";
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import { AuctionContext } from "../../context/AuctionContext";

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
            console.log(123);
            setIsLoading(true);
            const niggasIndexes = await user.getMyNiggasIndexes();
            console.log(niggasIndexes);
            const niggas = await Promise.all(niggasIndexes.map(async (niggaIndex) => {
                console.log(niggaIndex);
                return await user.getNiggaURIById(niggaIndex);
            }));
            console.log(niggas);

            // const niggas = await Promise.all(niggasIndexes.map(async (niggaIndex) => {
            //     return await new Promise(async resolve => resolve(await user.getNiggaURIById(niggaIndex)));
            // }));

            // console.log(niggas);
            // setMyNiggasIndexes(niggas);
            setIsLoading(false);
        }
    }, [user]);


    return (
        <section id="create-auction-page" className="page">
            <h1 className="create-auction__title text-4xl text-slate-400 font-bold mb-8">Создать аукцион</h1>

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
                        <div className="create-auction__form bg-slate-700 px-4 rounded-2xl p-5 shadow-md flex-1 mt-5 md:mt-0 text-left">
                            <h3 className="text-2xl font-bold text-slate-500 mb-3">Выберите негра:</h3>
                            <div>
                                {isLoading
                                    ? <ALoader />
                                    : <div>
                                        {myNiggasIndexes.map(async niggaURI => {
                                            // const niggaURI = await user.getNiggaURIById(niggaIndex);
                                            console.log(niggaURI);
                                            return (123);
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