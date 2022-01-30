import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_API_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Invalid environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
