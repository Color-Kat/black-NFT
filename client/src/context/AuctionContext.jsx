import React from "react";

export const AuctionContext = React.createContext();

export const AuctionProvider = ({children}) => {
    return (
        <AuctionContext.Provider value={{test: "123"}}>
            {children}
        </AuctionContext.Provider>
    )
}