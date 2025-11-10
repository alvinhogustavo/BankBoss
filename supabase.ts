// FIX: Resolved TypeScript errors related to Vite's `import.meta.env`.
// The non-functional `vite/client` reference was removed, and type assertion `(import.meta as any)`
// is now used to access environment variables without type errors, preserving the intended runtime behavior.

// FIX: This file was using import.meta.env directly, which is not supported in this environment.
// It is now configured to use fallback keys for local development, making it work here and on Vercel.
import { createClient } from '@supabase/supabase-js'

// Default fallback keys for the local development environment
const FALLBACK_SUPABASE_URL = "https://loiqaruratfsntmmwmgs.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaXFhcnVyYXRmc250bW13bWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3Mzg0NzYsImV4cCI6MjA3ODMxNDQ3Nn0.2JWLid2krq9PbQFw-yKW2PnJV7v2P84BAkzKjXWIRvU";

// Safely access environment variables, providing fallbacks for local dev
const supabaseUrl = ((import.meta as any).env?.VITE_PUBLIC_SUPABASE_URL) || FALLBACK_SUPABASE_URL;
const supabaseAnonKey = ((import.meta as any).env?.VITE_PUBLIC_SUPABASE_ANON_KEY) || FALLBACK_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key could not be determined.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);