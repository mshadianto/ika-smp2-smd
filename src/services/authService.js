// ============================================================
// Auth Service — Supabase auth with fallback
// ============================================================

import { supabase, USE_SUPABASE } from "../config/supabase";
import { isAdminEmail } from "../config/auth";
import { storage } from "../utils/storage";

const LOCAL_SESSION_KEY = "ika_session_v1";

export const authService = {
  async getSession() {
    if (USE_SUPABASE) {
      try {
        const { data } = await supabase.auth.getSession();
        return data?.session || null;
      } catch (e) {
        console.warn("[auth] getSession failed:", e.message);
      }
    }
    return await storage.getJSON(LOCAL_SESSION_KEY);
  },

  async getUser() {
    const session = await this.getSession();
    return session?.user || null;
  },

  /**
   * Send magic link (OTP) to email. User clicks link and returns authenticated.
   * Uses Supabase magic-link flow. No password required.
   */
  async signInWithOtp(email) {
    if (!USE_SUPABASE) {
      // Dev fallback: if email is in admin whitelist, auto-auth
      if (isAdminEmail(email)) {
        const session = {
          user: { email: email.toLowerCase().trim(), id: "local-" + email },
          access_token: "local",
        };
        await storage.setJSON(LOCAL_SESSION_KEY, session);
        return { ok: true, session, mode: "local" };
      }
      return { ok: false, error: "Supabase belum terkonfigurasi. Hubungi admin." };
    }
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) throw error;
      return { ok: true, mode: "magic-link" };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  /**
   * Sign in with email + password (alternative flow if preferred)
   */
  async signInWithPassword(email, password) {
    if (!USE_SUPABASE) {
      if (isAdminEmail(email)) {
        const session = {
          user: { email: email.toLowerCase().trim(), id: "local-" + email },
          access_token: "local",
        };
        await storage.setJSON(LOCAL_SESSION_KEY, session);
        return { ok: true, session };
      }
      return { ok: false, error: "Supabase belum terkonfigurasi" };
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });
      if (error) throw error;
      return { ok: true, session: data.session };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  async signOut() {
    if (USE_SUPABASE) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("[auth] signOut failed:", e.message);
      }
    }
    await storage.delete(LOCAL_SESSION_KEY);
    return true;
  },

  onAuthStateChange(callback) {
    if (USE_SUPABASE) {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        callback(session?.user || null, event);
      });
      return () => data.subscription.unsubscribe();
    }
    // Local mode: no-op
    return () => {};
  },
};
