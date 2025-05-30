import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Simple flag to prevent flooding - use a simple boolean check
  let hasCreatedUserRecord = false;

  const createUserRecord = async (supabaseUser: User) => {
    if (hasCreatedUserRecord) return; // Prevent multiple calls
    
    try {
      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || supabaseUser.user_metadata?.name?.split(' ')[0] || null,
        lastName: supabaseUser.user_metadata?.full_name?.split(' ').slice(1).join(' ') || supabaseUser.user_metadata?.name?.split(' ').slice(1).join(' ') || null,
        profileImageUrl: supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null,
      };

      await fetch('/api/auth/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify(userData),
      });
      
      hasCreatedUserRecord = true; // Mark as created
    } catch (error) {
      console.log('User record creation handled by server');
    }
  };

  useEffect(() => {
    // Get initial session - simplified without user creation for now
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    // Listen for auth changes - simplified
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
