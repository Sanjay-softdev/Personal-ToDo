import { createClient } from '@supabase/supabase-js';

// Load credentials from environment variables or fallback to build-time injected placeholders
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '%VITE_SUPABASE_URL%';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '%VITE_SUPABASE_ANON_KEY%';

export const sb = createClient(supabaseUrl, supabaseAnonKey);
export default sb;
