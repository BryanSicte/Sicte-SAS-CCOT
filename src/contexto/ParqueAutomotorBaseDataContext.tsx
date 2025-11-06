import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { getUsuariosCedulaNombre as usuariosCedulaNombre } from "../servicios/Api";

type ParqueAutomotorBase = Awaited<ReturnType<typeof usuariosCedulaNombre>>;

type ParqueAutomotorBaseContextType = {
    parqueAutomotorBase: ParqueAutomotorBase | null;
    setParqueAutomotorBase: (parqueAutomotorBase: ParqueAutomotorBase | null) => Promise<void>;
    getParqueAutomotorBase: () => Promise<void>;
    clearParqueAutomotorBase: () => Promise<void>;
};

const ParqueAutomotorBaseContext = createContext<ParqueAutomotorBaseContextType | undefined>(undefined);

export const ParqueAutomotorBaseDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [parqueAutomotorBase, setParqueAutomotorBaseState] = useState<ParqueAutomotorBase | null>(null);

    const getParqueAutomotorBase = async () => {
        const storedParqueAutomotorBase = await Storage.getItem("dataParqueAutomotorBase");
        if (storedParqueAutomotorBase) {
            const parsed = JSON.parse(storedParqueAutomotorBase);
            setParqueAutomotorBaseState(parsed);
            return parsed;
        } else {
            setParqueAutomotorBaseState(null);
            return null;
        }
    };

    const setParqueAutomotorBase = async (parqueAutomotorBase: ParqueAutomotorBase | null) => {
        if (parqueAutomotorBase) {
            await Storage.setItem("dataParqueAutomotorBase", parqueAutomotorBase);
        } else {
            await Storage.removeItem("dataParqueAutomotorBase");
        }
        setParqueAutomotorBaseState(parqueAutomotorBase);
    };

    const clearParqueAutomotorBase = async () => {
        await Storage.removeItem("dataParqueAutomotorBase");
        setParqueAutomotorBaseState(null);
    };

    useEffect(() => {
        getParqueAutomotorBase();
    }, []);

    return (
        <ParqueAutomotorBaseContext.Provider value={{ parqueAutomotorBase, setParqueAutomotorBase, getParqueAutomotorBase, clearParqueAutomotorBase }}>
            {children}
        </ParqueAutomotorBaseContext.Provider>
    );
};

export const useParqueAutomotorBaseData = () => {
    const ctx = useContext(ParqueAutomotorBaseContext);
    if (!ctx) {
        throw new Error("useParqueAutomotorBase debe usarse dentro de ParqueAutomotorBaseProvider");
    }
    return ctx;
};
