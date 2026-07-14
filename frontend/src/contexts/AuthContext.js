import { jsx as _jsx } from "react/jsx-runtime";
// =============================================================================
// Auth Context — Real Firebase Authentication
// Handles login, registration, logout, token management, and backend sync.
// =============================================================================
import { createContext, useContext, useState, useEffect, useCallback, } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser, onAuthStateChanged, } from 'firebase/auth';
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
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const appUser = await syncWithBackend(credential.user);
            setUser(appUser);
            setFirebaseUser(credential.user);
        }
        catch (err) {
            // Record failed attempt server-side so account lockouts can be enforced
            try {
                await api.post('/auth/login/failure', { email, failureReason: err?.message ?? 'signin_failed' });
            }
            catch (e) {
                // ignore
            }
            throw err;
        }
    }, [syncWithBackend]);
    // ── Register ───────────────────────────────────────────────────────────
    const submitRegistration = useCallback(async (data) => {
        const credential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        try {
            const token = await credential.user.getIdToken();
            const { password, ...request } = data;
            void password;
            const res = await api.post('/registrations', request, { headers: { Authorization: `Bearer ${token}` } });
            setUser(null);
            setFirebaseUser(credential.user);
            return res.data.data.id;
        }
        catch (error) {
            await deleteUser(credential.user).catch(() => undefined);
            throw error;
        }
    }, []);
    // ── Logout ─────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        await signOut(auth);
        setUser(null);
        setFirebaseUser(null);
    }, []);
    return (_jsx(AuthContext.Provider, { value: { user, firebaseUser, loading, login, submitRegistration, logout }, children: children }));
}
// ── Hook ──────────────────────────────────────────────────────────────────
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
