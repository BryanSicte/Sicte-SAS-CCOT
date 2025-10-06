import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { login as loginApi } from "../servicios/Api";

type PageUser = Awaited<ReturnType<typeof loginApi>>["page"];

type PageUserContextType = {
    pages: PageUser[] | null;
    setPages: (pages: PageUser[] | null) => Promise<void>;
    getPages: () => Promise<void>;
    clearPages: () => Promise<void>;
};

const PageUserContext = createContext<PageUserContextType | undefined>(undefined);

export const PageUserProvider = ({ children }: { children: React.ReactNode }) => {
    const [pages, setPagesState] = useState<PageUser[] | null>(null);

    const getPages = async () => {
        const storedPages = await Storage.getItem("dataPageUser");
        if (storedPages) {
            setPagesState(JSON.parse(storedPages) as PageUser[]);
        } else {
            setPagesState(null);
        }
    };

    const setPages = async (pages: PageUser[] | null) => {
        if (pages) {
            await Storage.setItem("dataPageUser", pages);
        } else {
            await Storage.removeItem("dataPageUser");
        }
        setPagesState(pages);
    };

    const clearPages = async () => {
        await Storage.removeItem("dataPageUser");
        setPagesState(null);
    };

    useEffect(() => {
        getPages();
    }, []);

    return (
        <PageUserContext.Provider value={{ pages, setPages, getPages, clearPages }}>
            {children}
        </PageUserContext.Provider>
    );
};

export const usePageUserData = () => {
    const ctx = useContext(PageUserContext);
    if (!ctx) {
        throw new Error("usePageUser debe usarse dentro de PageUserProvider");
    }
    return ctx;
};