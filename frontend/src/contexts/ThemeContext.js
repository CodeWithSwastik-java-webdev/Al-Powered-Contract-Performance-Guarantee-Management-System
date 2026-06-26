import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    useEffect(() => {
        const stored = window.localStorage.getItem('powergrid-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(stored ?? (prefersDark ? 'dark' : 'light'));
    }, []);
    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        window.localStorage.setItem('powergrid-theme', theme);
    }, [theme]);
    const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    return _jsx(ThemeContext.Provider, { value: { theme, toggleTheme }, children: children });
}
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
