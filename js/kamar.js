function updateAdminStatus(open) {
  const msg = document.getElementById("admin-status");

  if (open) {
    msg.innerHTML = "✅ Toko Sedang <strong>Buka</strong>";
    msg.className = "store-status open";
  } else {
    msg.innerHTML = "⚠️ Toko Sedang <strong>Tutup</strong>";
    msg.className = "store-status closed";
  }
}

async function setStore(open) {
  const pass = prompt("Masukkan kode admin:");
  if (!pass) return;

  try {
    const response = await fetch("/api/toggle-store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode: pass, is_open: open }),
    });

    const result = await response.json();

    if (result.success) {
      updateAdminStatus(open);
      alert(`✅ Status toko berhasil diubah ke ${open ? "BUKA" : "TUTUP"}`);
    } else {
      alert(`❌ ${result.error || "Gagal mengubah status toko"}`);
    }
  } catch (err) {
    console.error(err);
    alert("Terjadi kesalahan jaringan. Coba lagi.");
  }
}

// === Saat halaman pertama kali dibuka ===
(async () => {
  try {
    const { data, error } = await supabaseClient
      .from("store_status")
      .select("is_open")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) {
      updateAdminStatus(data.is_open);
    } else {
      console.warn("Belum ada data, silakan klik Buka/Tutup dulu.");
    }
  } catch (err) {
    console.error("Gagal memuat status awal:", err);
  }
})();
