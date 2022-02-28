

import { Footer } from "./Footer";
import { Content } from "./Content";
import { Header } from "./Header";
import { useRef } from "react";

export const Main = ({ }) => {
    const mainRef = useRef();

    return (
        <div id="main" ref={mainRef} className="flex flex-col h-screen overflow-auto overflow-x-hidden">
            <Header />

            <Content scrollElement={mainRef} />

            <Footer />
        </div>
    );
}