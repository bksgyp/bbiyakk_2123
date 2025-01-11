"use client"

import { createContext, useContext, useState, useEffect } from 'react';

const PledgeContext = createContext();

export function PledgeProvider({ children }) {
    const [globalPledge, setGlobalPledge] = useState(() => {
        // localStorage에서 저장된 다짐을 불러옴
        if (typeof window !== 'undefined') {
            const savedPledge = localStorage.getItem('pledge');
            return savedPledge || "갓생을 목표로 살자";
        }
        return "갓생을 목표로 살자";
    });

    // globalPledge가 변경될 때마다 localStorage에 저장
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('pledge', globalPledge);
        }
    }, [globalPledge]);

    return (
        <PledgeContext.Provider value={{ globalPledge, setGlobalPledge }}>
            {children}
        </PledgeContext.Provider>
    );
}

export function usePledge() {
    return useContext(PledgeContext);
}