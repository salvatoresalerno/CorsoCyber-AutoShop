

"use client";

import { FilterParams } from '@/lib/types';
import React, { createContext, useContext, useState, ReactNode  } from 'react';



type FiltriContextType = {
    filtri: FilterParams;
    setFiltri: React.Dispatch<React.SetStateAction<FilterParams>>;
};

const FiltriContext = createContext<FiltriContextType | undefined>(undefined);

export const FiltriProvider = ({ children }: { children: ReactNode }) => {
    const [filtri, setFiltri] = useState<FilterParams>({
        tipo: "",
        brand: "",
        model: "",
        alim: "",
        anno: 0,
        km: { valueA: 0, valueB: 0 },   
        prezzo: { valueA: 0, valueB: 0 },
    });
    return (
        <FiltriContext.Provider value={{ filtri, setFiltri }}>
            {children}
        </FiltriContext.Provider>
    );
};

export const useFiltriContext = () => {
    const context = useContext(FiltriContext);
    if (!context) throw new Error('useFiltri deve essere usato dentro FiltriProvider');
    return context;
};
