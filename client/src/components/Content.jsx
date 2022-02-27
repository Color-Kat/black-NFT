import { Route, Routes } from "react-router-dom";
import { Auctions } from "./pages/Auctions";
import { CreateAuction } from "./pages/CreateAuction";
import { FindNigga } from "./pages/FindNigga";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";

export const Content = ({ scrollElement }) => {
    return (
        <div id="content" className="flex-auto flex-shrink-0 flex justify-center  bg-slate-700">
            <div className="container px-2 sm:px-5">
                <Routes>
                    <Route path="/" element={<Home scrollElement={scrollElement} />} />
                    <Route path="/auctions" element={<Auctions />} />
                    <Route path="/find" element={<FindNigga />} />
                    <Route path="/create-auction" element={<CreateAuction />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </div>
    );
}