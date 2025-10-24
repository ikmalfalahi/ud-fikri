function togglePassword() {
  const passField = document.getElementById("password");
  passField.type = passField.type === "password" ? "text" : "password";
}

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Nanti dihubungkan ke Supabase di langkah berikut
  console.log("Email:", email, "Password:", password);
  alert("Login berhasil (mockup) — nanti dihubungkan ke Supabase ya!");
});
