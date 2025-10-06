import React, { createContext, useContext, useEffect, useState } from "react";
import Storage from "../utilitarios/Storage";
import { login, login as loginApi } from "../servicios/Api";
import { usePageUserData } from "./PageUserDataContext";

type User = Awaited<ReturnType<typeof loginApi>>["usuario"];

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => Promise<void>;
    getUser: () => Promise<void>;
    logout: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);
    const { setPages } = usePageUserData();

    const getUser = async () => {
        const storedUser = await Storage.getItem("dataUser");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUserState(parsed);
            return parsed;
        } else {
            setUserState(null);
            return null;
        }
    };

    const setUser = async (user: User | null) => {
        if (user) {
            await Storage.setItem("dataUser", user);
        } else {
            await Storage.removeItem("dataUser");
        }
        setUserState(user);
    };

    const logout = async () => {
        await Storage.removeItem("dataUser");
        setUserState(null);
        const data = await login("invitado@sicte.com", "Invitado");
        await setPages(data.page);
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, getUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => {
    const ctx = useContext(UserContext);
    if (!ctx) {
        throw new Error("useUser debe usarse dentro de UserProvider");
    }
    return ctx;
};
