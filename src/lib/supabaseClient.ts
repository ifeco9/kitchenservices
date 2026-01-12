// Legacy export for backward compatibility
// Use createClient from @/lib/supabase/client for new code
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env. variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env. variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    lock: async (name: string, acquireTimeout: number, callback: () => any) => {
      // Bypass navigator.locks in environments where it causes AbortError
      return await callback();
    },
  },
});
