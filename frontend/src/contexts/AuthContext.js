import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const login = async ({ email, password }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (email === 'admin@powergrid.com' && password === 'password123') {
            setUser({ email });
            return;
        }
        throw new Error('Invalid email or password');
    };
    const logout = () => setUser(null);
    return _jsx(AuthContext.Provider, { value: { user, login, logout }, children: children });
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
