import React, { createContext, useContext, useState, ReactNode } from "react";

type MenuContextType = {
    open: boolean;
    toggleMenu: () => void;
    setOpen: (value: boolean) => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen((prev) => !prev);

    return (
        <MenuContext.Provider value={{ open, toggleMenu, setOpen }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu debe usarse dentro de un MenuProvider");
    }
    return context;
};
