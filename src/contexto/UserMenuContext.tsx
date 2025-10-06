import React, { createContext, useContext, useState, ReactNode } from "react";

type UserMenuContextType = {
    menuVisibleUser: boolean;
    setMenuVisibleUser: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserMenuContext = createContext<UserMenuContextType | undefined>(undefined);

export const UserMenuProvider = ({ children }: { children: ReactNode }) => {
    const [menuVisibleUser, setMenuVisibleUser] = useState(false);

    return (
        <UserMenuContext.Provider value={{ menuVisibleUser, setMenuVisibleUser }}>
            {children}
        </UserMenuContext.Provider>
    );
};

export const useUserMenu = () => {
    const context = useContext(UserMenuContext);
    if (!context) {
        throw new Error("useUserMenu debe usarse dentro de un UserMenuProvider");
    }
    return context;
};
