"use strict";

const db = window.supabaseClient;

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

// ==== Login ====
function initLogin() {
  const form = document.getElementById("loginForm");

  if (!form) return;

  document.getElementById("togglePassword")?.addEventListener("click", togglePassword);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const remember = document.getElementById("remember").checked;

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    const msg = document.getElementById("loginMsg");
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      const { data: allowed, error: roleError } = await db.rpc('is_fikri_admin');
      if (roleError || !allowed) {
        await db.auth.signOut();
        throw new Error(roleError ? 'Jalankan setup-produk.sql di Supabase terlebih dahulu.' : 'Email belum terdaftar sebagai pengurus.');
      }
      // Penanda untuk kompatibilitas dengan halaman kamar yang sudah ada.
      localStorage.removeItem('admin_logged_in');
      sessionStorage.removeItem('admin_logged_in');
      (remember ? localStorage : sessionStorage).setItem('admin_logged_in', 'true');
      msg.textContent = 'Berhasil masuk. Mengalihkan halaman...';
      msg.className = 'login-msg success';
      msg.style.display = 'block';
      const next = new URLSearchParams(location.search).get('next');
      location.replace(next === 'produk.html' ? 'produk.html' : 'kamar.html');
    } catch (err) {
      msg.textContent = err.message === 'Invalid login credentials'
        ? 'Email atau kata sandi Supabase Authentication tidak sesuai. Gunakan akun pengurus yang terdaftar di Supabase Authentication.'
        : err.message || 'Gagal masuk. Coba lagi.';
      msg.className = 'login-msg error';
      msg.style.display = 'block';
    } finally { button.disabled = false; }

  });
}

document.addEventListener("DOMContentLoaded", initLogin);
