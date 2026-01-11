// supabase.js
// === SUPABASE CONFIG (GLOBAL) ===
const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub2h0bnl3bWh1enVlYW1zYX...";
  
// Buat Supabase client global jika belum ada
if (!window.supabase) {
  window.supabase = createClient(SUPABASE_URL, SUPABASE_KEY); // v2 CDN cara benar
  console.log("Supabase client siap:", window.supabase);
}
