// supabase.js
const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

if (!window.supabaseClient) {
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("Supabase client siap:", window.supabaseClient);
} else {
  console.log("Supabase client sudah ada, skip inisialisasi");
}
