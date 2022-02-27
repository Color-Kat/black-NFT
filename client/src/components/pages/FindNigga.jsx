import { useEffect } from "react";
import { useState } from "react";

export const FindNigga = ({ }) => {
    const [jungleSlide, setJungleSlide] = useState(1);

    // Show next slide image
    const nextSlide = () => {
        setJungleSlide(prev => {
            return prev < 8 ? prev + 1 : 1;
        });
    }

    const findNigga = () => {
        setInterval(nextSlide, 500);
    }

    return (
        <section id="find-nigga-page" className="page">
            <h1 className="find-nigga__title text-4xl text-slate-400 font-bold mb-5">Отправить экспедицию</h1>

            <div className="find-nigga__container flex flex-col md:flex-row justify-between">
                <div className="find-nigga__left">
                    <div className="flex justify-center items-center mb-5 lg:m-0">
                        <img src={`./assets/images/jungles/jungle_${jungleSlide}.png`} alt="jungle" className="h-36" />
                    </div>

                    <button onClick={findNigga}>Отправить экспедицию</button>
                </div>
                <div className="find-nigga__right"></div>
            </div>
        </section>
    );
}