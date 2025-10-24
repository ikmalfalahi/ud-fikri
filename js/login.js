// === Toggle Password Visibility ===
function togglePassword() {
  const passField = document.getElementById("password");
  passField.type = passField.type === "password" ? "text" : "password";
}

// === Inisialisasi Supabase ===
// Pastikan sudah memuat library Supabase di <head> HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

const supabaseUrl = "https://nnohtnywmhuzueamsats.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub2h0bnl3bWh1enVlYW1zYXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjM4NDksImV4cCI6MjA3NDYzOTg0OX0.S8FeDIdXQ32WH9QPVlSsYGRjxYbLMg6HXQicZ35A1pg";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// === Login Handler ===
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const remember = document.getElementById("remember").checked;

  if (!email || !password) {
    alert("Email dan password wajib diisi!");
    return;
  }

  try {
    // === Cek data di tabel admin_users ===
    const { data, error, status } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();

    if (error) {
      console.error("Supabase error:", error);
      alert("Terjadi kesalahan koneksi ke database.");
      return;
    }

    if (!data) {
      alert("Email atau password salah!");
      return;
    }

    // === Simpan status login ===
    if (remember) {
      localStorage.setItem("admin_logged_in", "true");
    } else {
      sessionStorage.setItem("admin_logged_in", "true");
    }

    alert("Login berhasil! Mengarahkan ke halaman admin...");
    window.location.href = "kamar.html";
  } catch (err) {
    console.error("Login error:", err);
    alert("Terjadi kesalahan. Coba lagi nanti.");
  }
});
