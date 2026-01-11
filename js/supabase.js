// supabase.js
// === SUPABASE CONFIG (GLOBAL) ===
const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub2h0bnl3bWh1enVlYW1zYXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjM4NDksImV4cCI6MjA3NDYzOTg0OX0.S8FeDIdXQ32WH9QPVlSsYGRjxYbLMg6HXQicZ35A1pg";

// Tunggu sampai CDN supabase.js siap
function initSupabase() {
  if (!window.supabase) {
    console.error("Supabase library belum dimuat! Cek CDN script.");
    return;
  }

  if (!window.supabaseClient) {
    window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Supabase client siap:", window.supabaseClient);
  }
}

// Jalankan langsung kalau sudah ada supabase
if (window.supabase) {
  initSupabase();
} else {
  window.addEventListener("load", initSupabase);
}
