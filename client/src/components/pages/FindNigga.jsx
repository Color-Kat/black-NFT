import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { AuctionContext } from "../../context/AuctionContext";
import { dataURI2string } from "../../utils/dataURI2string";

// Modal
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

export const FindNigga = ({ }) => {
    const [jungleSlide, setJungleSlide] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [resultNigga, setResultNigga] = useState('');

    // Show next slide image
    const nextSlide = () => {
        if (!resultNigga) setJungleSlide(prev => {
            return prev < 8 ? prev + 1 : 1;
        });
    }

    const { user } = useContext(AuctionContext);

    const findNigga = async () => {
        if (!user) return;

        setIsLoading(true); // Turn on the loading

        // Show animation of nigga searching
        const animationTimer = setInterval(nextSlide, 500);

        let niggaTokenBase64 = await user.collectNigga(); // Get data base64 tokenURI

        // console.log(niggaTokenBase64);
        if (!niggaTokenBase64) {
            clearInterval(animationTimer);
            setIsLoading(false);
        }

        // const niggaTokenURI = JSON.parse(dataURI2string('data:application/json;base64,eyJuYW1lIjoibmlnZ2EiLCJkZXNjcmlwdGlvbiI6Ik5pZ2dhIGRlc2NyaXB0aW9uIiwiYXR0cmlidXRlcyI6IiIsImltYWdlIjoiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUdobGFXZG9kRDBpTlRBd01qRXdJaUIzYVdSMGFEMGlOVEF3SWo0OGNHRjBhQ0JrUFNKTk5UUWdOellnSWlCbWFXeHNQU0owY21GdWMzQmhjbVZ1ZENJZ2MzUnliMnRsUFNJalptTmlZVEF6SWk4K1BIQmhkR2dnWkQwaVREWXdJRFEyTnlCTU5DQXlPRGNnVERNek5DQXhPVGtnVERZeElETXdOeUFpSUdacGJHdzlJblJ5WVc1emNHRnlaVzUwSWlCemRISnZhMlU5SWlNME56azVNREFpTHo0OGNHRjBhQ0JrUFNKTk16VXdJRE0zTUNBaUlHWnBiR3c5SW5SeVlXNXpjR0Z5Wlc1MElpQnpkSEp2YTJVOUlpTXpNVFl6WldJaUx6NDhjR0YwYUNCa1BTSk5NVEU1SURJd01pQk5Namc1SURRd01pQk1OREV6SURFME1pQk1NelkwSURRek5TQWlJR1pwYkd3OUluUnlZVzV6Y0dGeVpXNTBJaUJ6ZEhKdmEyVTlJaU0wTnprNU1EQWlMejQ4Y0dGMGFDQmtQU0pNTVNBeE1UVWdURE00TUNBek1ESWdUVEV5SURFMk1pQWlJR1pwYkd3OUluUnlZVzV6Y0dGeVpXNTBJaUJ6ZEhKdmEyVTlJaU0wTnprNU1EQWlMejQ4Y0dGMGFDQmtQU0pOTVRReUlESTFJRXcwTWlBeU5EVWdUVEl5TkNBNE5TQWlJR1pwYkd3OUluUnlZVzV6Y0dGeVpXNTBJaUJ6ZEhKdmEyVTlJaU0wTnprNU1EQWlMejQ4TDNOMlp6ND0ifQ=='));
        const niggaTokenURI = JSON.parse(dataURI2string(niggaTokenBase64)); // Get tokenURI in json format
        const niggaSvg = dataURI2string(
            niggaTokenURI.image, 'data:image/svg+xml;base64,'.length
        );  // Get svg code of image from json

        setResultNigga(niggaSvg);
        // data:application/json;base64,eyJuYW1lIjoibmlnZ2EiLCJkZXNjcmlwdGlvbiI6Ik5pZ2dhIGRlc2NyaXB0aW9uIiwiYXR0cmlidXRlcyI6IiIsImltYWdlIjoiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUdobGFXZG9kRDBpTlRBd01qRXdJaUIzYVdSMGFEMGlOVEF3SWo0OGNHRjBhQ0JrUFNKTk5UUWdOellnSWlCbWFXeHNQU0owY21GdWMzQmhjbVZ1ZENJZ2MzUnliMnRsUFNJalptTmlZVEF6SWk4K1BIQmhkR2dnWkQwaVREWXdJRFEyTnlCTU5DQXlPRGNnVERNek5DQXhPVGtnVERZeElETXdOeUFpSUdacGJHdzlJblJ5WVc1emNHRnlaVzUwSWlCemRISnZhMlU5SWlNME56azVNREFpTHo0OGNHRjBhQ0JrUFNKTk16VXdJRE0zTUNBaUlHWnBiR3c5SW5SeVlXNXpjR0Z5Wlc1MElpQnpkSEp2YTJVOUlpTXpNVFl6WldJaUx6NDhjR0YwYUNCa1BTSk5NVEU1SURJd01pQk5Namc1SURRd01pQk1OREV6SURFME1pQk1NelkwSURRek5TQWlJR1pwYkd3OUluUnlZVzV6Y0dGeVpXNTBJaUJ6ZEhKdmEyVTlJaU0wTnprNU1EQWlMejQ4Y0dGMGFDQmtQU0pNTVNBeE1UVWdURE00TUNBek1ESWdUVEV5SURFMk1pQWlJR1pwYkd3OUluUnlZVzV6Y0dGeVpXNTBJaUJ6ZEhKdmEyVTlJaU0wTnprNU1EQWlMejQ4Y0dGMGFDQmtQU0pOTVRReUlESTFJRXcwTWlBeU5EVWdUVEl5TkNBNE5TQWlJR1pwYkd3OUluUnlZVzV6Y0dGeVpXNTBJaUJ6ZEhKdmEyVTlJaU0wTnprNU1EQWlMejQ4TDNOMlp6ND0ifQ==

        // Stop animation and turn off the loading
        clearInterval(animationTimer);
        setIsLoading(false);
    }

    function renderSVG(svg) {
        // let svgContainer = document.createElement('div');
        // svgContainer.innerHTML = svg;
        // if (svgContainer.firstChild) {
        //     svgContainer.firstChild.classList.add("w-32 h-32");
        // }
        // console.log(svgContainer.firstChild);
        // return svgContainer.firstChild;
        // TODO right ration and display of migga image
        return svg;
    }

    return (
        <section id="find-nigga-page" className="page">
            <h1 className="find-nigga__title text-4xl text-slate-400 font-bold mb-8">Отправить экспедицию</h1>

            {/* Modal */}
            <Rodal
                visible={!!resultNigga} animation="door"
                onClose={() => { setResultNigga('') }}
                customStyles={{ borderRadius: '20px', height: 'max-content', background: 'rgb(203 213 225 / var(--tw-bg-opacity))' }}
            >
                <div className="">
                    <h3 className="font-bold font-mono text-3xl text-slate-700">Негр нашёлся!</h3>
                    <span className="font-mono text-xl text-slate-600">Экспедиция привела нового негра.</span>
                    <div className="niggaImage h-96 overflow-scroll" dangerouslySetInnerHTML={{ __html: renderSVG(resultNigga) }}></div>
                </div>
            </Rodal>

            <div className="find-nigga__container flex flex-col md:flex-row">
                <div className="find-nigga__left bg-slate-700 px-4 pt-12 pb-6 rounded-2xl shadow-md md:mr-5 flex flex-col items-center">
                    <div className="flex justify-center items-center mb-5 lg:m-0">
                        <img src={`./assets/images/jungles/jungle_${jungleSlide}.png`} alt="jungle" className="h-36" />
                    </div>

                    {!isLoading
                        ? (<button className="w-max px-5 py-2 text-lg font-semibold text-slate-800 rounded-xl mt-5 bg-gradient-to-r from-green-200 to-green-500 hover:from-red-800 hover:via-yellow-600 hover:to-yellow-500 shadow-xl" onClick={findNigga}>
                            Отправить экспедицию
                        </button>)
                        : (
                            <span className="w-max px-5 py-2 text-lg font-semibold text-slate-800 rounded-xl mt-5  bg-gradient-to-l from-red-800 via-yellow-600 to-yellow-500 shadow-xl">
                                Экспедиция отправлена
                            </span>
                        )
                    }
                </div>
                <div className="find-nigga__right bg-slate-700 px-4 py-12 rounded-2xl p-5 shadow-md flex-1 mt-5 md:mt-0 text-left">
                    <h2 className="text-3xl font-bold text-slate-500 mb-3">Миссия: Африка</h2>
                    <span className="text-slate-400 text-lg font-mono ">
                        Отправьте экспедицию в Африку на поиски новых негров, новых рабов. <br /> В системе ethereum будет сгенерирован NFT токен, который будет принадлежать вам. Затем негра можно будет продать на аукционе. <br /><br />
                        Данная операция занимает какое-то время. Найденный негр появится в вашем профиле!
                    </span>
                </div>
            </div>
        </section>
    );
}