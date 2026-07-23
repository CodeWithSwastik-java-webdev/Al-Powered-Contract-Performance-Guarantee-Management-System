import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import api, { setAccessToken } from '../lib/api';
const AuthContext = createContext(undefined);
const USER_KEY = 'cpg_user';
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        try {
            const saved = localStorage.getItem(USER_KEY);
            if (saved)
                setUser(JSON.parse(saved));
        }
        finally {
            setLoading(false);
        }
    }, []);
    const login = async ({ email, password }) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { user: loggedInUser, accessToken } = response.data.data;
            setAccessToken(accessToken);
            localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
            setUser(loggedInUser);
        }
        catch (error) {
            void api.post('/auth/login/failure', { email, failureReason: error instanceof Error ? error.message : 'login_failed' }).catch(() => undefined);
            throw error;
        }
    };
    const submitRegistration = async (data) => {
        const response = await api.post('/registrations', data);
        return response.data.data.id;
    };
    const logout = async () => { setAccessToken(null); localStorage.removeItem(USER_KEY); setUser(null); };
    return _jsx(AuthContext.Provider, { value: { user, loading, login, submitRegistration, logout }, children: children });
}
export function useAuth() { const context = useContext(AuthContext); if (!context)
    throw new Error('useAuth must be used within AuthProvider'); return context; }
