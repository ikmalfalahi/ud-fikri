function updateAdminStatus() {
  const msg = document.getElementById("admin-status"); // ganti ke admin-status
  let storeOpen = localStorage.getItem("storeOpen") === "true";

  if (storeOpen) {
    msg.innerHTML = "✅ Toko Sedang <strong>Buka</strong>";
    msg.className = "store-status open";
  } else {
    msg.innerHTML = "⚠️ Toko Sedang <strong>Tutup</strong>";
    msg.className = "store-status closed";
  }
}

async function setStore(open) {
  const { error } = await supabaseClient
    .from("store_status")
    .update({ is_open: open, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("Gagal update status:", error);
  } else {
    updateAdminStatus();
  }
}
