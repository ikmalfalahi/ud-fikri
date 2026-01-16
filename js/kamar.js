"use strict";

// ==================== SUPABASE ====================
function getSupabase() {
  if (!window.supabaseClient) {
    console.error("Supabase client belum siap");
    return null;
  }
  return window.supabaseClient;
}

console.log("Supabase ready:", !!window.supabaseClient);

// ==================== UPDATE STATUS ====================
function updateAdminStatus(open) {
  const msg = document.getElementById("admin-status");
  if (!msg) return;

  if (open) {
    msg.innerHTML = "🟢 Layanan Sedang <strong>DIBUKA</strong>";
    msg.className = "store-status open";
  } else {
    msg.innerHTML = "🔴 Layanan Sedang <strong>DITUTUP</strong>";
    msg.className = "store-status closed";
  }
}

// ==================== SET STATUS ====================
async function setStore(open) {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from("store_status")
      .update({
        is_open: open,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    if (error) console.error("Gagal update status:", error);
    else updateAdminStatus(open);
  } catch (err) {
    console.error("Error saat setStore:", err);
  }
}

// ==================== HAPUS PESANAN ====================
async function hapusPesanan(id) {
  if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

  const supabase = getSupabase();
  if (!supabase) {
    console.error("Supabase client belum siap!");
    alert("Supabase client belum siap!");
    return;
  }

  const numericId = Number(id);
  console.log("ID akan dihapus:", numericId, typeof numericId);

  try {
       const { data, error } = await supabase
        .from("pesanan_layanan_digital")
        .delete()
        .eq("id", id.toString()) // ID sebagai string
        .select();

    if (error) {
      console.error("Error hapus pesanan:", error);
      alert("Gagal menghapus pesanan! Cek console untuk detail.");
      return;
    }

    if (!data || data.length === 0) {
      console.warn("Tidak ada row yang dihapus. ID mungkin salah atau constraint mencegah delete.");
      alert("Pesanan tidak bisa dihapus! Cek console.");
      return;
    }

    // hapus row langsung di UI
    const row = document.querySelector(`button[data-id='${id}']`)?.closest("tr");
    if (row) row.remove();

    console.log("Pesanan berhasil dihapus:", data);
    alert("Pesanan berhasil dihapus!");
  } catch (err) {
    console.error("Exception hapusPesanan:", err);
    alert("Terjadi error saat menghapus pesanan. Cek console.");
  }
}

// ==================== LOAD STATUS ====================
async function loadStoreStatus() {
  try {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data, error } = await supabase
      .from("store_status")
      .select("is_open")
      .eq("id", 1)
      .maybeSingle();

    if (!error && data) updateAdminStatus(data.is_open);
    else console.warn("Status toko belum tersedia");
  } catch (err) {
    console.error("Error load status:", err);
  }
}

// ==================== LOAD PESANAN ====================
async function loadOrders() {
  const supabase = getSupabase();
  if (!supabase) return;

  const table = document.getElementById("orderTable");
  if (!table) return;

  const { data, error } = await supabase
    .from("pesanan_layanan_digital")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    table.innerHTML = `<tr><td colspan="10" class="empty">Gagal memuat data</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    table.innerHTML = `<tr><td colspan="10" class="empty">Belum ada pesanan</td></tr>`;
    return;
  }

  table.innerHTML = "";

  data.forEach((item, index) => {
    const tanggal = item.created_at
      ? new Date(item.created_at).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

    // 🔹 Debug ID pesanan
    console.log("ID pesanan:", item.id, typeof item.id);

    table.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${item.nama || "-"}</td>
        <td>${item.layanan || "-"}</td>
        <td>${item.provider || "-"}</td>
        <td>Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
        <td><strong>Rp ${Number(item.total || 0).toLocaleString("id-ID")}</strong></td>
        <td>${item.status || "Pending"}</td>
        <td>${tanggal}</td>
        <td>${item.bukti_url ? `<a href="${item.bukti_url}" target="_blank">Lihat</a>` : "-"}</td>
        <td><button class="hapus-btn" data-id="${item.id}">Hapus</button></td>
      </tr>
    `;
  });

  // ⚡ Pasang event listener tombol Hapus
  document.querySelectorAll(".hapus-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      console.log("Klik Hapus ID:", id, typeof id);
      hapusPesanan(id);
    });
  });
}

// ==================== REALTIME PESANAN ====================
function listenOrdersRealtime() {
  const supabase = getSupabase();
  if (!supabase) return;

  supabase
    .channel("admin-pesanan")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "pesanan_layanan_digital",
      },
      () => {
        loadOrders();
      }
    )
    .subscribe();
}

// ==================== LOGOUT ADMIN ====================
function logoutAdmin() {
  localStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("admin_logged_in");
  window.location.replace("https://ud-fikri.vercel.app");
}

// ==================== EVENT LISTENER ====================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoutBtn")?.addEventListener("click", logoutAdmin);
  document.getElementById("btnOpen")?.addEventListener("click", () => setStore(true));
  document.getElementById("btnClose")?.addEventListener("click", () => setStore(false));

  loadStoreStatus();
  loadOrders();
  listenOrdersRealtime();
});


