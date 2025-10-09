import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { login as loginApi } from "../servicios/Api";

type TokenUser = Awaited<ReturnType<typeof loginApi>>["tokenUser"];

type TokenUserContextType = {
    tokenUser: TokenUser[] | null;
    setTokenUser: (data: TokenUser[] | null) => Promise<void>;
    getTokenUser: () => Promise<void>;
    clearTokenUser: () => Promise<void>;
};

const TokenUserContext = createContext<TokenUserContextType | undefined>(undefined);

export const TokenUserProvider = ({ children }: { children: React.ReactNode }) => {
    const [tokenUser, setTokenUserState] = useState<TokenUser[] | null>(null);

    const getTokenUser = async () => {
        const storedTokenUser = await Storage.getItem("dataTokenUser");
        if (storedTokenUser) {
            setTokenUserState(JSON.parse(storedTokenUser) as TokenUser[]);
        } else {
            setTokenUserState(null);
        }
    };

    const setTokenUser = async (data: TokenUser[] | null) => {
        if (data) {
            await Storage.setItem("dataTokenUser", data);
        } else {
            await Storage.removeItem("dataTokenUser");
        }
        setTokenUserState(data);
    };

    const clearTokenUser = async () => {
        await Storage.removeItem("dataTokenUser");
        setTokenUserState(null);
    };

    useEffect(() => {
        getTokenUser();
    }, []);

    return (
        <TokenUserContext.Provider
            value={{
                tokenUser,
                setTokenUser,
                getTokenUser,
                clearTokenUser,
            }}
        >
            {children}
        </TokenUserContext.Provider>
    );
};

export const useTokenUserData = () => {
    const ctx = useContext(TokenUserContext);
    if (!ctx) {
        throw new Error("useTokenUserData debe usarse dentro de TokenUserProvider");
    }
    return ctx;
};
