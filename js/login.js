// Tunggu halaman & Supabase siap
document.addEventListener("DOMContentLoaded", async () => {

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleText = document.querySelector(".toggle-pass");

  // Simpan posisi kursor sebelum ubah tipe
  const start = passwordInput.selectionStart;
  const end = passwordInput.selectionEnd;

  // Ubah tipe input tanpa menyebabkan perubahan layout
  if (passwordInput.type === "password") {
    passwordInput.setAttribute("type", "text");
    toggleText.textContent = "Sembunyikan";
  } else {
    passwordInput.setAttribute("type", "password");
    toggleText.textContent = "Tampilkan";
  }

  // Kembalikan posisi kursor (mencegah teks ‘melompat’)
  passwordInput.setSelectionRange(start, end);

  // Pastikan lebar tetap (anti loncat)
  passwordInput.style.width = getComputedStyle(passwordInput).width;
}

window.togglePassword = togglePassword;

  // Tunggu sampai Supabase sudah dimuat
  let supabaseClientReady = false;
  const checkSupabase = setInterval(() => {
    if (window.supabase) {
      clearInterval(checkSupabase);
      supabaseClientReady = true;
      initLogin(); // mulai proses login setelah supabase siap
    }
  }, 100);

  function initLogin() {
    // === Inisialisasi Supabase ===
    const supabaseUrl = "https://nnohtnywmhuzueamsats.supabase.co";
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ub2h0bnl3bWh1enVlYW1zYXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNjM4NDksImV4cCI6MjA3NDYzOTg0OX0.S8FeDIdXQ32WH9QPVlSsYGRjxYbLMg6HXQicZ35A1pg";
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

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
        // === Cek di tabel 'admin_users' ===
        const { data, error } = await supabase
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

       // === Simpan sesi login ===
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
