// === SUPABASE CONFIG (GLOBAL) ===
const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub2h0bnl3bWh1enVlYW1zYXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjM4NDksImV4cCI6MjA3NDYzOTg0OX0.S8FeDIdXQ32WH9QPVlSsYGRjxYbLMg6HXQicZ35A1pg";

// supaya bisa dipakai di semua file
window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// opsional: bisa cek apakah berhasil
console.log("Supabase client siap:", supabase);
