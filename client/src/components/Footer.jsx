import { Link } from "react-router-dom";
import { HeaderLink } from "./Header";

export const Footer = ({ }) => {
    return (
        <footer className="flex justify-center bg-slate-800 text-slate-400 shadow-xl py-4">
            <div className="container px-5 flex-col md:flex-row flex justify-between">
                <div className="footer__left-side flex flex-col items-center">
                    <div className="w-max flex bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-3 mb-2 text-slate-800">
                        <Link to="/">
                            <span className="text-3xl font-bold flex"><img src="./assets/logo.png" alt="NiggaNft" className="h-8" /> NiggaNFT</span>
                        </Link>
                    </div>

                    <div className="flex bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-4">
                        <a href="https://blacklivesmatter.com/" target="_blank">
                            <img src="./assets/images/black-lives-matter.png" alt="Black lives matter" className="max-h-24" />
                        </a>
                    </div>
                </div>

                <div className="footer__middle-side my-4 md:my-0 mx-10 text-center md:text-left">
                    <h3 className="text-lg font-bold">Навигация:</h3>
                    <nav className="">
                        <ul className="whitespace-nowrap">
                            <HeaderLink to="/">Главная</HeaderLink>
                            <HeaderLink to="/auctions">Аукционы</HeaderLink>
                            <HeaderLink to="/find">Найти негра</HeaderLink>
                            <HeaderLink to="/create-auction">Создать аукцион</HeaderLink>
                        </ul>
                    </nav>

                </div>

                <div className="footer__middle-side md:text-center">
                    <h3 className="text-lg font-bold text-center">ДИСКЛЕЙМЕР</h3>
                    <span>
                        Данный сайт создан исключительно в развлекательных целях и не пытается никого оскорбить или унизить. <br />
                        Содержание сайта не направлено на унижение или геноцид других расс.
                        <br /><b>Темнокожие люди - тоже люди!</b>
                    </span>
                </div>

            </div>
        </footer >
    );
}