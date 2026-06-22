import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let cachedClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
    if (!cachedClient) {
        cachedClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
    return cachedClient;
}
