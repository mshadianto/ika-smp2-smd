// ============================================================
// useAuth — React hook for authentication state
// ============================================================

import { useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "../services/authService";
import { getUserRole, hasCapability } from "../config/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Initial load
    authService.getUser().then((u) => {
      if (mounted) {
        setUser(u);
        setLoading(false);
      }
    });

    // Subscribe to changes
    const unsubscribe = authService.onAuthStateChange((u) => {
      if (mounted) setUser(u);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const role = useMemo(() => getUserRole(user), [user]);
  const isAdmin = role === "admin";

  const can = useCallback((capability) => hasCapability(role, capability), [role]);

  const signIn = useCallback(async (email) => {
    return authService.signInWithOtp(email);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
  }, []);

  return { user, role, isAdmin, loading, can, signIn, signOut };
}
