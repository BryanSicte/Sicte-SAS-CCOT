import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { getUsuariosCedulaNombre as usuariosCedulaNombre } from "../servicios/Api";

type ParqueAutomotor = Awaited<ReturnType<typeof usuariosCedulaNombre>>;

type ParqueAutomotorContextType = {
    parqueAutomotor: ParqueAutomotor | null;
    setParqueAutomotor: (parqueAutomotor: ParqueAutomotor | null) => Promise<void>;
    getParqueAutomotor: () => Promise<void>;
    clearParqueAutomotor: () => Promise<void>;
};

const ParqueAutomotorContext = createContext<ParqueAutomotorContextType | undefined>(undefined);

export const ParqueAutomotorDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [parqueAutomotor, setParqueAutomotorState] = useState<ParqueAutomotor | null>(null);

    const getParqueAutomotor = async () => {
        const storedParqueAutomotor = await Storage.getItem("dataParqueAutomotor");
        if (storedParqueAutomotor) {
            const parsed = JSON.parse(storedParqueAutomotor);
            setParqueAutomotorState(parsed);
            return parsed;
        } else {
            setParqueAutomotorState(null);
            return null;
        }
    };

    const setParqueAutomotor = async (parqueAutomotor: ParqueAutomotor | null) => {
        if (parqueAutomotor) {
            await Storage.setItem("dataParqueAutomotor", parqueAutomotor);
        } else {
            await Storage.removeItem("dataParqueAutomotor");
        }
        setParqueAutomotorState(parqueAutomotor);
    };

    const clearParqueAutomotor = async () => {
        await Storage.removeItem("dataParqueAutomotor");
        setParqueAutomotorState(null);
    };

    useEffect(() => {
        getParqueAutomotor();
    }, []);

    return (
        <ParqueAutomotorContext.Provider value={{ parqueAutomotor, setParqueAutomotor, getParqueAutomotor, clearParqueAutomotor }}>
            {children}
        </ParqueAutomotorContext.Provider>
    );
};

export const useParqueAutomotorData = () => {
    const ctx = useContext(ParqueAutomotorContext);
    if (!ctx) {
        throw new Error("useParqueAutomotor debe usarse dentro de ParqueAutomotorProvider");
    }
    return ctx;
};
