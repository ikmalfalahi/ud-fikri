// === Konfigurasi Supabase ===
const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"; // ganti
const SUPABASE_KEY = "YOUR_ANON_KEY"; // ganti
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === Toggle Lihat Password ===
document.getElementById("togglePassword").addEventListener("click", () => {
  const passField = document.getElementById("password");
  passField.type = passField.type === "password" ? "text" : "password";
});

// === Login Handler ===
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = "";

  // Cek user dari Supabase
  const { data, error } = await supabaseClient
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) {
    errorMsg.textContent = "Email tidak ditemukan.";
    return;
  }

  // Bandingkan password (sementara plain, nanti bisa bcrypt)
  if (data.password === password) {
    localStorage.setItem("admin_logged_in", "true");
    window.location.href = "kamar.html";
  } else {
    errorMsg.textContent = "Password salah.";
  }
});
