import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { getBodegaKgprodOperacionesCodigoDescripUnimed as bodegaKgprodOperacionesCodigoDescripUnimed } from "../servicios/Api";

type Material = Awaited<ReturnType<typeof bodegaKgprodOperacionesCodigoDescripUnimed>>;

type MaterialContextType = {
    material: Material | null;
    setMaterial: (material: Material | null) => Promise<void>;
    getMaterial: () => Promise<void>;
    clearMaterial: () => Promise<void>;
};

const MaterialContext = createContext<MaterialContextType | undefined>(undefined);

export const MaterialDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [material, setMaterialState] = useState<Material | null>(null);

    const getMaterial = async () => {
        const storedMaterial = await Storage.getItem("dataMaterial");
        if (storedMaterial) {
            const parsed = JSON.parse(storedMaterial);
            setMaterialState(parsed);
            return parsed;
        } else {
            setMaterialState(null);
            return null;
        }
    };

    const setMaterial = async (material: Material | null) => {
        if (material) {
            await Storage.setItem("dataMaterial", material);
        } else {
            await Storage.removeItem("dataMaterial");
        }
        setMaterialState(material);
    };

    const clearMaterial = async () => {
        await Storage.removeItem("dataMaterial");
        setMaterialState(null);
    };

    useEffect(() => {
        getMaterial();
    }, []);

    return (
        <MaterialContext.Provider value={{ material, setMaterial, getMaterial, clearMaterial }}>
            {children}
        </MaterialContext.Provider>
    );
};

export const useMaterialData = () => {
    const ctx = useContext(MaterialContext);
    if (!ctx) {
        throw new Error("useMaterial debe usarse dentro de MaterialProvider");
    }
    return ctx;
};
