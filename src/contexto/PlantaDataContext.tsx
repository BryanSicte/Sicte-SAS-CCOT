import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { getUsuariosCedulaNombre as usuariosCedulaNombre } from "../servicios/Api";

type Planta = Awaited<ReturnType<typeof usuariosCedulaNombre>>;

type PlantaContextType = {
    planta: Planta | null;
    setPlanta: (planta: Planta | null) => Promise<void>;
    getPlanta: () => Promise<void>;
    clearPlanta: () => Promise<void>;
};

const PlantaContext = createContext<PlantaContextType | undefined>(undefined);

export const PlantaDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [planta, setPlantaState] = useState<Planta | null>(null);

    const getPlanta = async () => {
        const storedPlanta = await Storage.getItem("dataPlanta");
        if (storedPlanta) {
            const parsed = JSON.parse(storedPlanta);
            setPlantaState(parsed);
            return parsed;
        } else {
            setPlantaState(null);
            return null;
        }
    };

    const setPlanta = async (planta: Planta | null) => {
        if (planta) {
            await Storage.setItem("dataPlanta", planta);
        } else {
            await Storage.removeItem("dataPlanta");
        }
        setPlantaState(planta);
    };

    const clearPlanta = async () => {
        await Storage.removeItem("dataPlanta");
        setPlantaState(null);
    };

    useEffect(() => {
        getPlanta();
    }, []);

    return (
        <PlantaContext.Provider value={{ planta, setPlanta, getPlanta, clearPlanta }}>
            {children}
        </PlantaContext.Provider>
    );
};

export const usePlantaData = () => {
    const ctx = useContext(PlantaContext);
    if (!ctx) {
        throw new Error("usePlanta debe usarse dentro de PlantaProvider");
    }
    return ctx;
};
