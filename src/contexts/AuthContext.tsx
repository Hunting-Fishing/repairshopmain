
import * as React from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
    });

    // Set up session refresh
    const refreshSession = async () => {
      const { data: { session: refreshedSession }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error("Error refreshing session:", error);
        setSession(null);
        setUser(null);
        toast({
          title: "Session expired",
          description: "Please sign in again.",
          variant: "destructive",
        });
      } else if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);
      }
    };

    // Refresh session every 30 minutes
    const refreshInterval = setInterval(refreshSession, 1000 * 60 * 30);

    // Set up the auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);
      setUser(session?.user ?? null);

      // Handle email verification
      if (_event === 'SIGNED_IN' && session?.user.email_confirmed_at) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      }
    });

    // Cleanup subscriptions
    return () => {
      clearInterval(refreshInterval);
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error signing in",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
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

      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error signing up",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = React.useMemo(
    () => ({
      session,
      user,
      signIn,
      signUp,
      signOut,
    }),
    [session, user]
  );

  return (
    <AuthContext.Provider value={value}>
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
