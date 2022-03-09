import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { AuctionContext } from "../../context/AuctionContext";

interface IAuction {

}

export const Auctions = ({ }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [auctions, setAuctions] = useState<IAuction[]>([]);

    const { getAuctions } = useContext(AuctionContext);

    const loadAuctions = () => {
        getAuctions();
    }

    useEffect(() => {
        loadAuctions();
    }, [getAuctions]);

    return (
        <section id="auctions-page" className="page">
            auctions
        </section>
    );
}