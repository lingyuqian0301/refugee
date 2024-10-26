// supabase/client.ts
import { createClient as createServerClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Factory function to create the Supabase client based on environment
export const createClient = () => {
  if (typeof window === "undefined") {
    // Use Supabase client for server environments (API routes, SSR, etc.)
    return createServerClient(supabaseUrl, supabaseAnonKey);
  } else {
    // Use Supabase client for client environments (browser only)
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }
};
