// contexto/NavigationParamsContext.tsx
import React, { createContext, useContext, useState } from "react";

type NavigationParams = {
    [key: string]: any;
};

type NavigationParamsContextType = {
    params: NavigationParams;
    setParams: (key: string, value: any) => void;
    clearParams: () => void;
};

const NavigationParamsContext = createContext<NavigationParamsContextType | undefined>(undefined);

export const NavigationParamsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [params, setParamsState] = useState<NavigationParams>({});

    const setParams = (key: string, value: any) => {
        setParamsState((prev) => ({ ...prev, [key]: value }));
    };

    const clearParams = () => {
        setParamsState({});
    };

    return (
        <NavigationParamsContext.Provider value={{ params, setParams, clearParams }}>
            {children}
        </NavigationParamsContext.Provider>
    );
};

export const useNavigationParams = () => {
    const context = useContext(NavigationParamsContext);
    if (!context) throw new Error("useNavigationParams debe usarse dentro de NavigationParamsProvider");
    return context;
};
