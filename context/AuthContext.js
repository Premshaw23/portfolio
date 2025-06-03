"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        const refreshedUser = auth.currentUser;

        setUser(refreshedUser);
        setEmailVerified(refreshedUser?.emailVerified || false);
      } else {
        setUser(null);
        setEmailVerified(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // No confirm here — confirmation is done via your modal in UI
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Failed to logout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, emailVerified, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
