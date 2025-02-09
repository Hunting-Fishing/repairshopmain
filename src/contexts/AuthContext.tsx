
import * as React from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  organizationName: string;
  businessPhone: string;
  businessType: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing auth:", error);
        toast.error("Failed to initialize authentication");
        setIsInitialized(true); // Still set initialized to true even on error
      }
    };

    initializeAuth();

    const refreshSession = async () => {
      try {
        const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Error refreshing session:", error);
          setSession(null);
          setUser(null);
          toast.error("Session expired. Please sign in again.");
        } else if (refreshedSession) {
          setSession(refreshedSession);
          setUser(refreshedSession.user);
        }
      } catch (error) {
        console.error("Unexpected error refreshing session:", error);
      }
    };

    const refreshInterval = setInterval(refreshSession, 1000 * 60 * 30);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);
      setUser(session?.user ?? null);

      if (_event === 'SIGNED_IN' && session?.user.email_confirmed_at) {
        toast.success("Welcome back!");
      } else if (_event === 'SIGNED_OUT') {
        toast.info("You have been signed out");
      }
    });

    return () => {
      clearInterval(refreshInterval);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = React.useCallback(async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user.email_confirmed_at) {
        toast.warning("Please verify your email address");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
      throw error;
    }
  }, []);

  const signUp = React.useCallback(async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            organization_name: data.organizationName,
            business_phone: data.businessPhone,
            business_type: data.businessType,
            first_name: data.firstName,
            last_name: data.lastName,
            phone_number: data.phoneNumber,
            street_address: data.streetAddress,
            city: data.city,
            state_province: data.stateProvince,
            postal_code: data.postalCode,
            country: data.country,
          },
        },
      });

      if (error) throw error;

      toast.success("Please check your email to verify your account");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    }
  }, []);

  const signOut = React.useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("You have been successfully signed out");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error(error.message || "Failed to sign out");
      throw error;
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    session,
    user,
    signIn,
    signUp,
    signOut,
  }), [session, user, signIn, signUp, signOut]);

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
