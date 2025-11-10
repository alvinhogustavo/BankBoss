import { createClient } from '@supabase/supabase-js'

// Prioritize environment variables for production (Vercel)
const supabaseUrl = (import.meta as any).env?.VITE_PUBLIC_SUPABASE_URL || "https://loiqaruratfsntmmwmgs.supabase.co";
const supabaseAnonKey = (import.meta as any).env?.VITE_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaXFhcnVyYXRmc250bW13bWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Mzg0NzYsImV4cCI6MjA3ODMxNDQ3Nn0.2JWLid2krq9PbQFw-yKW2PnJV7v2P84BAkzKjXWIRvU";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or Anon Key. Check your environment variables or fallback values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)