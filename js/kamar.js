// pastikan window.supabaseClient sudah ada (misal dari supabase.js global)
const supabase = window.supabaseClient;

// ==================== UPDATE STATUS ====================
function updateAdminStatus(open) {
  const msg = document.getElementById("admin-status");
  if (!msg) return; // safety check

  if (open) {
    msg.innerHTML = "✅ Toko Sedang <strong>Buka</strong>";
    msg.className = "store-status open";
  } else {
    msg.innerHTML = "⚠️ Toko Sedang <strong>Tutup</strong>";
    msg.className = "store-status closed";
  }
}

// ==================== SET STATUS ====================
async function setStore(open) {
  const { error } = await supabase
    .from("store_status")
    .update({
      is_open: open,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (error) {
    console.error("Gagal update status:", error);
  } else {
    updateAdminStatus(open);
  }
}

// ==================== LOAD STATUS SAAT PAGE LOAD ====================
(async () => {
  const { data, error } = await supabase
    .from("store_status")
    .select("is_open")
    .eq("id", 1)
    .maybeSingle();

  if (!error && data) {
    updateAdminStatus(data.is_open);
  } else {
    console.warn("Belum ada data, silakan klik Buka/Tutup dulu.");
  }
})();

// ==================== LOGOUT ADMIN ====================
function logoutAdmin() {
  localStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("admin_logged_in");
  alert("Anda telah keluar.");
  window.location.replace("https://ud-fikri.vercel.app");
}

// ==================== PASANG EVENT LISTENER ====================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutAdmin);

  const btnOpen = document.getElementById("btnOpen");
  if (btnOpen) btnOpen.addEventListener("click", () => setStore(true));

  const btnClose = document.getElementById("btnClose");
  if (btnClose) btnClose.addEventListener("click", () => setStore(false));
});
