import { createClient } from '@supabase/supabase-js';

// Load credentials from environment variables or fallback to default credentials
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseUrl = (envUrl && envUrl !== '%VITE_SUPABASE_URL%') 
  ? envUrl 
  : 'https://rllsskdkkgebubfxisny.supabase.co';

const supabaseAnonKey = (envKey && envKey !== '%VITE_SUPABASE_ANON_KEY%') 
  ? envKey 
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbHNza2Rra2dlYnViZnhpc255Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNTI3NzQsImV4cCI6MjA5NTcyODc3NH0._J9uiHM986mvPzOzmFxLWUH6zXAL5BgMLlHJ-80Xty4';

export const sb = createClient(supabaseUrl, supabaseAnonKey);
export default sb;
