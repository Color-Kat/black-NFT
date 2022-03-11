import { useRef } from "react";

export const Home = ({ scrollElement }) => {
    const sectionRef = useRef();

    const scroll = () => {
        // console.log((sectionRef.current.offsetTop - sectionRef.current.offsetHeight));
        scrollElement.current.scrollBy(0, sectionRef.current.offsetTop);
    }

    return (
        <section id="home-page" className="page w-full">
            <section className=" introducing-section flex justify-evenly flex-col-reverse lg:flex-row pb-10 mb- border-b-0 border-slate-600 lg:my-24 bg-slate-700 px-4 lg:px-0 py-12 rounded-2xl  shadow-lg">
                <div className="introducing-section__left text-slate-400 max-w-xl">
                    <h1 className="text-4xl font-extrabold mb-3">NiggaNFT🤑🤑🤑</h1>
                    <span className="text-xl">
                        Это проект, который позволяет заниматься поиском негров и дальнейшей работорговлей ими.
                        Почувствуй себя настоящим работорговцем 1750-1850гг: ищи негров в джунглях, продавай их на аукционах и зарабатывай!
                    </span>
                </div>
                <div className="introducing-section__right flex justify-center  items-center mb-5 lg:m-0">
                    <img src="/assets/logo.png" alt="NiggaNft" className="h-48" />
                </div>
            </section>

            <div className="more-arrow-domn w-full flex justify-center text-slate-400 animate-bounce z-0" onClick={scroll}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12  cursor-pointer p-2 border-2 rounded-full border-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>

            <h1 className="text-center text-5xl text-slate-400 font-bold my-5" ref={sectionRef}>Как это работает?</h1>

            <section className="login-section flex justify-evenly flex-col lg:flex-row py-10 border-b-2 border-slate-600">
                <div className="login-section__left flex justify-center items-center mb-5 lg:m-0">
                    <img src="/assets/images/connect.png" alt="connect" className="h-36" />
                </div>

                <div className="login-section__right text-slate-400 max-w-xl">
                    <h1 className="text-4xl font-extrabold mb-3">Подключитесь к nigga-system</h1>
                    <span className="text-xl">
                        Для того, чтобы работать с <b>nigga-system</b>, вы должны войти через свой metamask
                        аккаут. Для этого нажмите на кнопку "Войти" вверху страницы.
                    </span>
                </div>
            </section>

            <section className="find-section flex justify-evenly flex-col-reverse lg:flex-row py-10 border-b-2 border-slate-600">
                <div className="find-section__left text-slate-400 max-w-xl">
                    <h1 className="text-4xl font-extrabold mb-3">Отправьте экспедицию!</h1>
                    <span className="text-xl">
                        Во вкладке "Найти негра" соберите свою экспедицию в Африку на поиске негра.
                        В сети ethereum будет сгенерирован уникальный NFT токен, который будет принадлежать вам.
                    </span>
                </div>

                <div className="find-section__right flex justify-center items-center mb-5 lg:m-0">
                    <img src="/assets/images/jungle.png" alt="jungle" className="h-36" />
                </div>
            </section>

            <section className="auction-section flex justify-evenly flex-col lg:flex-row py-10 border-b-0 border-slate-600">
                <div className="auction-section__right flex justify-center items-center mb-5 lg:m-0">
                    <img src="/assets/images/handcuffs.png" alt="jungle" className="h-36" />
                </div>

                <div className="auction-section__left text-slate-400 max-w-xl">
                    <h1 className="text-4xl font-extrabold mb-3">Занимайтесь работорговлей!</h1>
                    <span className="text-xl">
                        Во вкладке "Создать аукцион" продавайте всех найденных вами негров другим пользователям.
                        Или покупайте негров других пользователей и перепродавайте их!
                    </span>
                </div>


            </section>

        </section>
    );
}