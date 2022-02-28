import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';

import { LoginButton } from "./elements/LoginButton";

export const HeaderLink = ({ to, children }) => {
    return <li className="mx-3 list-none hover:scale-105 hover:text-slate-300"><Link to={to}>{children}</Link></li>;
}

const HeaderLinkMobile = ({ to, children }) => {
    return <li className="text-2xl font-medium mb-1 list-none hover:scale-105 hover:text-slate-300">
        <Link to={to}>{children}</Link>
    </li>;
}

export const Header = ({ }) => {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();

    function toggleMenu() { setShowMobileMenu(prev => !prev) }

    useEffect(() => {
        setShowMobileMenu(false);
    }, [location]);

    return (
        <header className="flex sticky top-0  w-full h-16 bg-slate-800 justify-center text-slate-400 shadow-xl z-10">
            <div className="container flex items-center justify-between px-5 z-30">
                <HeaderLink to="/">
                    <img src="./assets/logo.png" alt="" className="h-12" />
                </HeaderLink>

                {/* Conputer menu */}
                <nav className="hidden md:block">
                    <ul className="flex">
                        <HeaderLink to="/">Главная</HeaderLink>
                        <HeaderLink to="/auctions">Аукционы</HeaderLink>
                        <HeaderLink to="/find">Найти негра</HeaderLink>
                        <HeaderLink to="/create-auction">Создать аукцион</HeaderLink>
                    </ul>
                </nav>

                <LoginButton />
                {/* hover:text-slate-300 */}

                {/* Mobile menu */}

                <div
                    onClick={toggleMenu}
                    id="mobile-menu-toggle"
                    className="flex md:hidden py-1  bg-gradient-to-r from-cyan-500 to-blue-500 w-8 h-8 rounded-md flex-col items-center justify-evenly hover:bg-sky-700">
                    <div className="w-4/6 h-1 rounded bg-slate-200 hover:bg-slate-300"></div>
                    <div className="w-4/6 h-1 rounded bg-slate-200 hover:bg-slate-300"></div>
                    <div className="w-4/6 h-1 rounded bg-slate-200 hover:bg-slate-300"></div>
                </div>


            </div>

            {/* Mobile menu */}
            <nav
                className={`
                        block md:hidden fixed top-0 ${showMobileMenu ? 'right-0' : '-right-full'} transition-all
                        h-screen w-full sm:w-1/2 bg-slate-800 pt-20 shadow-2xl z-20
                    `}
            >
                <ul className="flex flex-col pl-5 ">
                    <HeaderLinkMobile to="/">Главная</HeaderLinkMobile>
                    <HeaderLinkMobile to="/auctions">Аукционы</HeaderLinkMobile>
                    <HeaderLinkMobile to="/find">Найти негра</HeaderLinkMobile>
                    <HeaderLinkMobile to="/create-auction">Создать аукцион</HeaderLinkMobile>
                </ul>

                <span className="text-center w-full absolute bottom-5">
                    @copyright NiggaNft. <br /> All rights reserved.
                </span>
            </nav>

            <div
                onClick={() => setShowMobileMenu(false)}
                className={`w-screen h-screen absolute ${showMobileMenu ? "pointer-events-auto" : "pointer-events-none"} z-10`}
            ></div>
        </header>
    );
}