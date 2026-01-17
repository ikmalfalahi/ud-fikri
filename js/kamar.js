"use strict";

// ==================== SUPABASE ====================
function getSupabase() {
  return window.supabaseClient || null;
}

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
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("store_status")
    .update({
      is_open: open,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);

  if (!error) updateAdminStatus(open);
}

// ==================== HAPUS PESANAN (SINGLE) ====================
async function hapusPesanan(id, tableName = "pesanan_layanan_digital") {
  if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .eq("id", id.toString())
    .select();

  if (error || !data || data.length === 0) {
    alert("Pesanan tidak dapat dihapus.");
    return;
  }

  const row = document.querySelector(`button[data-id="${id}"]`)?.closest("tr");
  if (row) row.remove();
  alert("Pesanan berhasil dihapus!");
}

// ==================== HAPUS PESANAN TERPILIH ====================
document.getElementById("hapusTerpilih")?.addEventListener("click", async () => {
  const activeTab = document.querySelector(".tab.active")?.id;
  let tbodySelector, tableName;

  if (activeTab === "tab-digital") {
    tbodySelector = "#orderTable";
    tableName = "pesanan_layanan_digital";
  } else if (activeTab === "tab-sembako") {
    tbodySelector = "#tbody-sembako";
    tableName = "pesanan_sembako";
  } else return alert("Tidak ada tab aktif.");

  const checked = document.querySelectorAll(`${tbodySelector} .row-check:checked`);
  if (checked.length === 0) return alert("Pilih minimal satu pesanan.");
  if (!confirm(`Yakin ingin menghapus ${checked.length} pesanan?`)) return;

  const ids = Array.from(checked).map(cb => cb.dataset.id.toString());
  const supabase = getSupabase();
  const { error } = await supabase.from(tableName).delete().in("id", ids);

  if (error) return alert("Gagal menghapus pesanan.");

  checked.forEach(cb => cb.closest("tr")?.remove());

  // reset checkAll
  const checkAllId = activeTab === "tab-digital" ? "checkAllDigital" : "checkAllSembako";
  const checkAll = document.getElementById(checkAllId);
  if (checkAll) checkAll.checked = false;

  alert("Pesanan terpilih berhasil dihapus!");
});

// ==================== LOAD STATUS ====================
async function loadStoreStatus() {
  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("store_status")
    .select("is_open")
    .eq("id", 1)
    .maybeSingle();

  if (!error && data) updateAdminStatus(data.is_open);
}

// ==================== LOAD PESANAN DIGITAL ====================
async function loadOrders() {
  const supabase = getSupabase();
  if (!supabase) return;

  const tbody = document.getElementById("orderTable");
  if (!tbody) return;

  const { data, error } = await supabase
    .from("pesanan_layanan_digital")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="empty">Belum ada pesanan</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  data.forEach((item, i) => {
    const tanggal = item.created_at ? new Date(item.created_at).toLocaleString("id-ID", {
      day: "2-digit", month: "long", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    }) : "-";

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td><input type="checkbox" class="row-check" data-id="${item.id}"></td>
        <td>${i+1}</td>
        <td>${item.nama || "-"}</td>
        <td>${item.layanan || "-"}</td>
        <td>${item.provider || "-"}</td>
        <td>Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
        <td>Rp ${Number(item.total || 0).toLocaleString("id-ID")}</td>
        <td>
          <select class="status-select" data-id="${item.id}" data-old="${item.status || "pending"}">
            <option value="pending" ${item.status === "pending" ? "selected": ""}>Pending</option>
            <option value="sukses" ${item.status === "sukses" ? "selected": ""}>Sukses</option>
            <option value="ditolak" ${item.status === "ditolak" ? "selected": ""}>Ditolak</option>
          </select>
        </td>
        <td>${tanggal}</td>
        <td>${item.bukti_url ? `<a href="${item.bukti_url}" target="_blank">Lihat</a>` : "-"}</td>
        <td><button class="hapus-btn" data-id="${item.id}">Hapus</button></td>
      </tr>
    `);
  });

  // hapus satuan
  tbody.querySelectorAll(".hapus-btn").forEach(btn => {
    btn.addEventListener("click", () => hapusPesanan(btn.dataset.id));
  });

  // checkAll digital
  document.getElementById("checkAllDigital")?.addEventListener("change", e => {
    tbody.querySelectorAll(".row-check").forEach(cb => cb.checked = e.target.checked);
  });
}

// ==================== LOAD PESANAN SEMBAKO ====================
async function loadPesananSembako() {
  const supabase = getSupabase();
  const tbody = document.getElementById("tbody-sembako");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="9">Loading...</td></tr>`;

  const { data, error } = await supabase
    .from("pesanan_sembako")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    tbody.innerHTML = `<tr><td colspan="9">Gagal load data</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9">Belum ada pesanan</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  data.forEach((row, i) => {
    const itemsHtml = (row.items || []).map(it => {
      const price = Number(it.harga ?? it.price) || 0;
      const qty = Number(it.qty) || 0;
      const subtotal = price * qty;
      return `${it.name} x${qty} = Rp ${subtotal.toLocaleString("id-ID")}`;
    }).join("<br>");

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td><input type="checkbox" class="row-check" data-id="${row.id}"></td>
        <td>${i+1}</td>
        <td>${row.nama}</td>
        <td>${row.alamat}</td>
        <td>${row.lokasi_map || "-"}</td>
        <td>${itemsHtml}</td>
        <td>Rp ${Number(row.total).toLocaleString("id-ID")}</td>
        <td>${row.metode_pembayaran}</td>
        <td>
          <select class="status-sembako" data-id="${row.id}" data-old="${row.status}">
            <option value="pending" ${row.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="sukses" ${row.status === "sukses" ? "selected" : ""}>Sukses</option>
            <option value="ditolak" ${row.status === "ditolak" ? "selected" : ""}>Ditolak</option>
          </select>
        </td>
        <td>${new Date(row.created_at).toLocaleString("id-ID")}</td>
      </tr>
    `);
  });

  // checkAll sembako
  document.getElementById("checkAllSembako")?.addEventListener("change", e => {
    tbody.querySelectorAll(".row-check").forEach(cb => cb.checked = e.target.checked);
  });
}

// ==================== REALTIME PESANAN ====================
function listenOrdersRealtime() {
  const supabase = getSupabase();
  if (!supabase) return;

  supabase
    .channel("admin-pesanan")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "pesanan_layanan_digital" }, () => loadOrders())
    .subscribe();
}

// ==================== LOGOUT ADMIN ====================
function logoutAdmin() {
  localStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("admin_logged_in");
  window.location.replace("https://ud-fikri.vercel.app");
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoutBtn")?.addEventListener("click", logoutAdmin);
  document.getElementById("btnOpen")?.addEventListener("click", () => setStore(true));
  document.getElementById("btnClose")?.addEventListener("click", () => setStore(false));

  loadStoreStatus();
  loadOrders();
  listenOrdersRealtime();
});

// ==================== UPDATE STATUS SELECT ====================
document.addEventListener("change", async (e) => {
  const supabase = getSupabase();
  if (!supabase) return;

  // Digital
  if (e.target.classList.contains("status-select")) {
    const select = e.target;
    const id = select.dataset.id;
    const statusBaru = select.value;
    const statusLama = select.dataset.old || "pending";

    if (!confirm(`Ubah status pesanan menjadi ${statusBaru.toUpperCase()}?`)) {
      select.value = statusLama;
      return;
    }

    const { error } = await supabase
      .from("pesanan_layanan_digital")
      .update({ status: statusBaru })
      .eq("id", id);

    if (error) {
      alert("❌ Gagal update status");
      select.value = statusLama;
      return;
    }

    select.dataset.old = statusBaru;
  }

  // Sembako
  if (e.target.classList.contains("status-sembako")) {
    const select = e.target;
    const id = select.dataset.id;
    const statusBaru = select.value;
    const statusLama = select.dataset.old;

    if (!confirm(`Ubah status pesanan menjadi ${statusBaru.toUpperCase()}?`)) {
      select.value = statusLama;
      return;
    }

    const { error } = await supabase
      .from("pesanan_sembako")
      .update({ status: statusBaru })
      .eq("id", id);

    if (error) {
      alert("❌ Gagal update status");
      select.value = statusLama;
      return;
    }

    select.dataset.old = statusBaru;
  }
});

// ==================== SWITCH TAB ====================
const tabDigital = document.getElementById("tab-digital");
const tabSembako = document.getElementById("tab-sembako");
const layerDigital = document.getElementById("layer-digital");
const layerSembako = document.getElementById("layer-sembako");

tabDigital.onclick = () => {
  tabDigital.classList.add("active");
  tabSembako.classList.remove("active");
  layerDigital.classList.add("active");
  layerSembako.classList.remove("active");
};

tabSembako.onclick = () => {
  tabSembako.classList.add("active");
  tabDigital.classList.remove("active");
  layerSembako.classList.add("active");
  layerDigital.classList.remove("active");
  loadPesananSembako();
});
