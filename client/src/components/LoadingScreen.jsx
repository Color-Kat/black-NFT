import { useState } from "react";
import { useEffect } from "react";

export const LoadingScreen = ({ show }) => {
    const [visible, setVisible] = useState(true);

    // For smoothly close loader after connect metamask screen closes
    useEffect(() => {
        setTimeout(() => {
            setVisible(show);
        }, 81);
    }, [show]);

    return (
        <div id="loadre-screen" className={
            `fixed top-0 left-0 h-screen w-screen p-5 
            bg-stone-900 flex justify-center items-center z-50
            ${visible ? 'opacity-100' : 'opacity-0'} transition-all`
        }>
            <div className="flex flex-col items-center  text-center">

                <div className=" animate-spin loader ease-linear rounded-full border-8 border-t-8 h-28 w-28 border-gray-600 border-t-blue-600"></div>

                <span className="text-slate-600 mt-10 text-2xl">Подключение...</span>
            </div>
        </div>
    );
}