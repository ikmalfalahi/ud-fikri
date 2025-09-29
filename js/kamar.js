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

function setStore(open) {
  localStorage.setItem("storeOpen", open);
  updateAdminStatus();
}

// update saat pertama kali load
updateAdminStatus();

// opsional: auto sinkron kalau dibuka di beberapa tab
window.addEventListener("storage", updateAdminStatus);
