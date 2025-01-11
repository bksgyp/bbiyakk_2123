"use client"

import { createContext, useContext, useState } from 'react';

const PledgeContext = createContext();

export function PledgeProvider({ children }) {
    const [globalPledge, setGlobalPledge] = useState("갓생을 목표로 살자");

    return (
        <PledgeContext.Provider value={{ globalPledge, setGlobalPledge }}>
            {children}
        </PledgeContext.Provider>
    );
}

export function usePledge() {
    return useContext(PledgeContext);
}