
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://flptkwcrpfcjrxecnbtc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZscHRrd2NycGZjanJ4ZWNuYnRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDUwODgsImV4cCI6MjA2MzMyMTA4OH0.YC2MmVxq_Y9lxMFzBdT-AqReK5SPUp9iUE2WHRsIsPg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
