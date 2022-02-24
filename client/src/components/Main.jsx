import { Content } from "./Content";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Main = ({ }) => {
    return (
        <div id="main" className="flex flex-col h-screen">
            <Header />

            <Content />

            <Footer />
        </div>
    );
}