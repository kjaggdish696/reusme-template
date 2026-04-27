import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  firebaseAuth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "../lib/firebase";
import type { User as FirebaseUser } from "firebase/auth";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
  avatarColor: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PALETTE = ["#4f46e5", "#0ea5e9", "#16a34a", "#f59e0b", "#ec4899", "#6366f1", "#10b981"];

function pickColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function toAuthUser(fbUser: FirebaseUser): AuthUser {
  const email = fbUser.email ?? "";
  const name = fbUser.displayName ?? email.split("@")[0] ?? "User";
  const provider = fbUser.providerData[0]?.providerId === "google.com" ? "google" : "email";
  return {
    id: fbUser.uid,
    name,
    email,
    provider,
    avatarColor: pickColor(email),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state changes — this is the source of truth.
  useEffect(() => {
    const unsub = firebaseAuth.onAuthStateChanged((fbUser) => {
      setUser(fbUser ? toAuthUser(fbUser) : null);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,

      async login(email, password) {
        const cred = await signInWithEmailAndPassword(firebaseAuth, email, password);
        return toAuthUser(cred.user);
      },

      async loginWithGoogle() {
        const cred = await signInWithPopup(firebaseAuth, googleProvider);
        return toAuthUser(cred.user);
      },

      async register(name, email, password) {
        const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateProfile(cred.user, { displayName: name });
        return toAuthUser(cred.user);
      },

      async logout() {
        await signOut(firebaseAuth);
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
