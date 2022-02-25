import { Link } from "react-router-dom";
import { shortenAddress } from "../../utils/shortenAddress";
import { AuctionContext } from "../../context/AuctionContext";
import { useContext } from "react";

export const LoginButton = ({ }) => {
    const {
        error,
        isLoading,
        connectWallet,
        installMetamask,
        currentAccount,
        currentUserContract,
        connectUser,
        user,
        getAuctions,
        createAuction,
    } = useContext(AuctionContext);

    if (currentUserContract) return (
        <button
            onClick={connectUser}
            className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
        >
            <Link to="/profile">Профиль {shortenAddress(currentAccount)}</Link>
        </button>
    );
    else return (
        <button
            onClick={connectUser}
            className="text-base text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:ring-cyan-300 dark:focus:ring-cyan-800 font-bold rounded-lg px-3 py-1 text-center"
        >Войти</button>
    );
}