export const Home = ({ }) => {
    return (
        <section id="home-page" className="page">
            <section className="introducing flex justify-evenly flex-col-reverse lg:flex-row pb-10 border-b-2 border-slate-600">
                <div className="introducing__left text-slate-400 max-w-xl">
                    <h1 className="text-4xl font-extrabold mb-3">NiggaNFT🤑🤑🤑</h1>
                    <span className="text-xl">
                        Это проект, который позволяет заниматься поиском негров и дальнейшей работорговлей ими.
                        Почувствуй себя настоящим работорговцем 1750-1850гг: ищи негров в джунглях, продавай их на аукционах и зарабатывай!
                    </span>
                </div>
                <div className="introducing__right flex justify-center  items-center mb-5 lg:m-0">
                    <img src="./assets/logo.png" alt="NiggaNft" className="h-48" />
                </div>
            </section>

            <section className="login flex justify-evenly flex-col-reverse lg:flex-row py-10 border-b-2 border-slate-600">
                <div className="login__right flex justify-center items-center mb-5 lg:m-0">
                    <img src="./assets/images/connect.png" alt="connect" className="h-36" />
                </div>

                <div className="login__left text-slate-400 max-w-xl">
                    <h1 className="text-4xl font-extrabold mb-3">Подключитесь к nigga-system</h1>
                    <span className="text-xl">
                        Для того, чтобы работать с <b>nigga-system</b>, вы должны войти через свой metamask
                        аккаут. Для этого нажмите на кнопку "Войти" вверху страницы.
                    </span>
                </div>

            </section>

        </section>
    );
}