import React, { createContext, useContext, useState, ReactNode } from 'react';

type Theme = {
    isDark: boolean;
    toggleTheme: () => void;
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeCustom() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeCustom debe usarse dentro de ThemeProvider');
    }
    return context;
}