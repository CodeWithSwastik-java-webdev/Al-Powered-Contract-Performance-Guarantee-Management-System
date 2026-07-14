import { jsx as _jsx } from "react/jsx-runtime";
// =============================================================================
// Auth Context — Real Firebase Authentication
// Handles login, registration, logout, token management, and backend sync.
// =============================================================================
import { createContext, useContext, useState, useEffect, useCallback, } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, } from 'firebase/auth';
import { auth } from '../lib/firebase';
import api from '../lib/api';
const AuthContext = createContext(undefined);
// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [firebaseUser, setFirebaseUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Sync the Firebase user with the backend and store the AppUser
    const syncWithBackend = useCallback(async (fbUser) => {
        try {
            const token = await fbUser.getIdToken();
            const res = await api.post('/auth/login', {}, { headers: { Authorization: `Bearer ${token}` } });
            return res.data?.data?.user ?? null;
        }
        catch (err) {
            console.warn('[Auth] Backend sync failed — user may not exist in DB yet:', err);
            return null;
        }
    }, []);
    // Listen for Firebase auth state changes (initial load + tab focus)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);
            if (fbUser) {
                const appUser = await syncWithBackend(fbUser);
                setUser(appUser);
            }
            else {
                setUser(null);
            }
            setLoading(false);
        });
        return unsubscribe;
    }, [syncWithBackend]);
    // ── Login ──────────────────────────────────────────────────────────────
    const login = useCallback(async ({ email, password }) => {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const appUser = await syncWithBackend(credential.user);
        setUser(appUser);
        setFirebaseUser(credential.user);
    }, [syncWithBackend]);
    // ── Register ───────────────────────────────────────────────────────────
    const register = useCallback(async ({ email, password, name, department, }) => {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await credential.user.getIdToken();
        // Create the user in the backend DB
        const res = await api.post('/auth/register', { name, email, department }, { headers: { Authorization: `Bearer ${token}` } });
        setUser(res.data?.data?.user ?? null);
        setFirebaseUser(credential.user);
    }, []);
    // ── Logout ─────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        await signOut(auth);
        setUser(null);
        setFirebaseUser(null);
    }, []);
    return (_jsx(AuthContext.Provider, { value: { user, firebaseUser, loading, login, register, logout }, children: children }));
}
// ── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
