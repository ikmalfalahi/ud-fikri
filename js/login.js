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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const remember = document.getElementById("remember").checked;

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    try {
      const { data, error } = await db
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

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("admin_logged_in", "true");

      window.location.href = "kamar.html";
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan. Coba lagi.");
    }
  });
}

document.addEventListener("DOMContentLoaded", initLogin);
