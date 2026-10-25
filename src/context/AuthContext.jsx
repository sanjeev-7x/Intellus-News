import { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("intellus_user"));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Helper to construct normalized user object from Supabase session + profile
  const buildUserObject = (sbUser, profile = null) => {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    const fallbackId = `CONT-${sbUser.id.replace(/-/g, "").slice(0, 5).toUpperCase()}`;
    return {
      id: sbUser.id,
      email: sbUser.email,
      name: profile?.name || meta.name || sbUser.email?.split("@")[0] || "User",
      role: profile?.role || meta.role || "CONTRIBUTOR",
      contributorId: profile?.contributor_id || meta.contributor_id || fallbackId,
      avatarUrl: profile?.avatar_url || meta.avatar_url || null,
      isSupabase: true,
    };
  };

  const fetchProfile = async (userId) => {
    if (!isSupabaseConfigured || !userId) return null;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Could not fetch user profile from Supabase:", error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.warn("Profile fetch error:", err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 1. Check active session on load
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;
      if (initialSession?.user) {
        setSession(initialSession);
        const profile = await fetchProfile(initialSession.user.id);
        const userObj = buildUserObject(initialSession.user, profile);
        setUser(userObj);
        localStorage.setItem("intellus_user", JSON.stringify(userObj));
      } else {
        // If no supabase session, keep local demo user if it exists and wasn't marked isSupabase
        const local = localStorage.getItem("intellus_user");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (parsed?.isSupabase) {
              setUser(null);
              localStorage.removeItem("intellus_user");
            }
          } catch {
            setUser(null);
          }
        }
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (newSession?.user) {
        const profile = await fetchProfile(newSession.user.id);
        const userObj = buildUserObject(newSession.user, profile);
        setUser(userObj);
        localStorage.setItem("intellus_user", JSON.stringify(userObj));
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        localStorage.removeItem("intellus_user");
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Supabase Sign In with email & password
  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured yet. Please configure your .env file or use Demo Mode.");
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data.user) {
      const profile = await fetchProfile(data.user.id);
      const userObj = buildUserObject(data.user, profile);
      setUser(userObj);
      localStorage.setItem("intellus_user", JSON.stringify(userObj));
    }
    return data;
  };

  // Supabase Sign Up with email, password, and custom metadata
  const signUp = async (email, password, { name, role } = {}) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured yet. Please configure your .env file or use Demo Mode.");
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
          role: role || "CONTRIBUTOR",
        },
      },
    });
    if (error) throw error;

    if (data?.user) {
      // Also attempt to upsert profile record directly in case trigger hasn't run yet
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email,
          name: name || email.split("@")[0],
          role: role || "CONTRIBUTOR",
          contributor_id: `CONT-${data.user.id.replace(/-/g, "").slice(0, 5).toUpperCase()}`,
        });
      } catch (e) {
        console.warn("Could not upsert profile:", e);
      }
      const profile = await fetchProfile(data.user.id);
      const userObj = buildUserObject(data.user, profile);
      setUser(userObj);
      localStorage.setItem("intellus_user", JSON.stringify(userObj));
    }
    return data;
  };

  // Supabase Sign Out
  const signOut = async () => {
    if (isSupabaseConfigured && session) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Sign out error:", err);
      }
    }
    setSession(null);
    setUser(null);
    localStorage.removeItem("intellus_user");
  };

  // Password reset
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error("Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login?reset=true`,
    });
    if (error) throw error;
    return data;
  };

  // Backward-compatible mock / demo login function
  const login = (u) => {
    setUser(u);
    localStorage.setItem("intellus_user", JSON.stringify(u));
  };

  // Backward-compatible logout function
  const logout = () => {
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signIn,
        signUp,
        signOut,
        resetPassword,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
