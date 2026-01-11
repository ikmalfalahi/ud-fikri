 // ================= SUPABASE =================
const supabase = window.supabaseClient;

// ==== Toggle Password ====
function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleText = document.querySelector(".toggle-pass");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleText.textContent = "Sembunyikan";
  } else {
    passwordInput.type = "password";
    toggleText.textContent = "Tampilkan";
  }
}

window.togglePassword = togglePassword;

// ==== Login dengan Supabase ====
document.addEventListener("DOMContentLoaded", async () => {
  // Tunggu sampai Supabase siap
  const checkSupabase = setInterval(() => {
    if (window.supabase) {
      clearInterval(checkSupabase);
      initLogin();
    }
  }, 100);

  function initLogin() {
    // Pakai Supabase global yang sudah dibuat di supabase.js
    const supabaseClient = window.supabase;

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
        const { data, error } = await supabaseClient
          .from("admin_users")
          .select("*")
          .eq("email", email)
          .single();

        if (error || !data) {
          alert("Email tidak ditemukan!");
          return;
        }

        if (data.password !== password) {
          alert("Password salah!");
          return;
        }

        // Simpan sesi login
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
  }
});
