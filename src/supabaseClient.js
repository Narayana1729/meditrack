import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This setup ensures compilation won't crash dramatically if keys aren't added yet
export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_PROJECT_URL_HERE'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
