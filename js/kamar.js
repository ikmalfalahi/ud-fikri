"use strict";

/* ==================== SUPABASE ==================== */
function getSupabase() {
  if (!window.supabaseClient) return null;
  return window.supabaseClient;
}

/* ==================== UPDATE ADMIN STATUS ==================== */
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

/* ==================== SET STORE STATUS ==================== */
async function setStore(open) {
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("store_status")
    .update({ is_open: open, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (!error) updateAdminStatus(open);
}

/* ==================== HAPUS PESANAN DIGITAL (SINGLE) ==================== */
async function hapusPesanan(id) {
  if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("pesanan_layanan_digital")
    .delete()
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    alert("Pesanan tidak dapat dihapus.");
    return;
  }

  const row = document.querySelector(`button[data-id="${id}"]`)?.closest("tr");
  if (row) row.remove();

  alert("Pesanan berhasil dihapus!");
}

/* ==================== HAPUS PESANAN SEMBAKO (SINGLE) ==================== */
async function hapusPesananSembako(id) {
  if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("pesanan_sembako")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    alert("Gagal menghapus pesanan. Cek RLS Supabase!");
    return;
  }

  if (!data || data.length === 0) {
    alert("Pesanan tidak ditemukan atau tidak diizinkan (RLS).");
    return;
  }

  const row = document.querySelector(`button[data-id="${id}"]`)?.closest("tr");
  if (row) row.remove();

  alert("Pesanan berhasil dihapus!");
}

/* ==================== HAPUS PESANAN TERPILIH ==================== */
async function hapusPesananTerpilih() {
  const activeTab = document.querySelector(".tab.active")?.id;
  let tbodySelector, tableName;

  if (activeTab === "tab-digital") {
    tbodySelector = "#orderTable";
    tableName = "pesanan_layanan_digital";
  } else if (activeTab === "tab-sembako") {
    tbodySelector = "#tbody-sembako";
    tableName = "pesanan_sembako";
  } else {
    alert("Tidak ada tab aktif.");
    return;
  }

  const checked = document.querySelectorAll(`${tbodySelector} .row-check:checked`);
  if (checked.length === 0) {
    alert("Pilih minimal satu pesanan.");
    return;
  }

  if (!confirm(`Yakin ingin menghapus ${checked.length} pesanan?`)) return;

  const ids = Array.from(checked).map(cb => cb.dataset.id);
  const supabase = getSupabase();
  const { error } = await supabase.from(tableName).delete().in("id", ids).select();

  if (error) {
    console.error("Gagal hapus:", error);
    alert("Gagal menghapus pesanan. Cek RLS!");
    return;
  }

  checked.forEach(cb => cb.closest("tr")?.remove());

  const checkAllId = activeTab === "tab-digital" ? "checkAllDigital" : "checkAllSembako";
  const checkAll = document.getElementById(checkAllId);
  if (checkAll) checkAll.checked = false;

  alert("Pesanan terpilih berhasil dihapus!");
}

document.getElementById("hapusTerpilih")?.addEventListener("click", hapusPesananTerpilih);

/* ==================== LOAD STORE STATUS ==================== */
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

/* ==================== LOAD PESANAN DIGITAL ==================== */
async function loadOrders() {
  const supabase = getSupabase();
  if (!supabase) return;

  const table = document.getElementById("orderTable");
  if (!table) return;

  const { data, error } = await supabase
    .from("pesanan_layanan_digital")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    table.innerHTML = `<tr><td colspan="11" class="empty">Belum ada pesanan</td></tr>`;
    return;
  }

  // 🟢 Kosongkan tabel sebelum render ulang
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

    // 🟢 Render tiap baris pesanan
    table.innerHTML += `
      <tr>
        <td><input type="checkbox" class="row-check" data-id="${item.id}"></td>
        <td>${index + 1}</td>
        <td>${item.nama || "-"}</td>
        <td>${item.layanan || "-"}</td>
        <td>${item.provider || "-"}</td>
        <td>Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
        <td><strong>Rp ${Number(item.total || 0).toLocaleString("id-ID")}</strong></td>
        <td>
          <select 
            class="status-select"
            data-id="${item.id}"
            data-old="${item.status || "pending"}"
          >
            <option value="pending" ${item.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="sukses" ${item.status === "sukses" ? "selected" : ""}>Sukses</option>
            <option value="ditolak" ${item.status === "ditolak" ? "selected" : ""}>Ditolak</option>
          </select>
        </td>
        <td>${tanggal}</td>
        <td>${item.bukti_url ? `<a href="${item.bukti_url}" target="_blank">Lihat</a>` : "-"}</td>
        <td><button class="hapus-btn" data-id="${item.id}">Hapus</button></td>
      </tr>
    `;
  });

  // 🟢 Tambahkan event listener hapus satuan
  document.querySelectorAll(".hapus-btn").forEach(btn => {
    btn.addEventListener("click", () => hapusPesanan(btn.dataset.id));
  });

  // 🟢 Check all digital
  document.getElementById("checkAllDigital")?.addEventListener("change", e => {
    document.querySelectorAll("#orderTable .row-check").forEach(cb => cb.checked = e.target.checked);
  });
}

/* ==================== UPDATE STATUS DIGITAL ==================== */
// 🟢 Event delegation global untuk semua select.status-select
document.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("status-select")) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const select = e.target;
  const id = select.dataset.id;
  const statusBaru = select.value;
  const statusLama = select.dataset.old || "pending";

  // 🟢 Konfirmasi sebelum update
  if (!confirm(`Ubah status pesanan menjadi "${statusBaru.toUpperCase()}"?`)) {
    select.value = statusLama;
    return;
  }

  // 🟢 Update status di Supabase
  const { data, error } = await supabase
    .from("pesanan_layanan_digital")
    .update({ status: statusBaru })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Gagal update status:", error);
    alert("❌ Gagal mengubah status");
    select.value = statusLama;
    return;
  }

  console.log("Data setelah update:", data);
  select.dataset.old = statusBaru; // 🟢 Simpan status lama
});

/* ==================== LOAD PESANAN SEMBAKO ==================== */
async function loadPesananSembako() {
  const supabase = getSupabase();
  const tbody = document.getElementById("tbody-sembako");

  tbody.innerHTML = `<tr><td colspan="10">Loading...</td></tr>`;

  // ⚡ ambil semua row sembako, jangan maybeSingle()
  const { data, error } = await supabase
    .from("pesanan_sembako")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    tbody.innerHTML = `<tr><td colspan="10">Gagal load data</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10">Belum ada pesanan</td></tr>`;
    return;
  }

  tbody.innerHTML = "";

  data.forEach((row, i) => {
    const itemsHtml = row.items
      .map(it => {
        const price = Number(it.harga ?? it.price) || 0;
        const qty = Number(it.qty) || 0;
        const subtotal = price * qty;
        return `${it.name} x${qty} = Rp ${subtotal.toLocaleString("id-ID")}`;
      })
      .join("<br>");

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td><input type="checkbox" class="row-check" data-id="${row.id}"></td>
        <td>${i + 1}</td>
        <td>${row.nama}</td>
        <td>${row.alamat}</td>
        <td>${row.lokasi_map || "-"}</td>
        <td>${itemsHtml}</td>
        <td>Rp ${Number(row.total).toLocaleString("id-ID")}</td>
        <td>${row.metode_pembayaran}</td>
        <td>
          <select class="status-sembako" data-id="${row.id}" data-old="${row.status || "pending"}">
            <option value="pending" ${row.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="sukses" ${row.status === "sukses" ? "selected" : ""}>Sukses</option>
            <option value="ditolak" ${row.status === "ditolak" ? "selected" : ""}>Ditolak</option>
          </select>
        </td>
        <td>${new Date(row.created_at).toLocaleString("id-ID")}</td>
      </tr>
    `);
  });

  // tombol hapus satuan Sembako
  document.querySelectorAll(".hapus-btn.sembako").forEach(btn => {
    btn.addEventListener("click", () => hapusPesananSembako(btn.dataset.id));
  });
}

/* ==================== CHECK ALL SEMBAKO ==================== */
document.getElementById("checkAllSembako")?.addEventListener("change", e => {
  document.querySelectorAll("#tbody-sembako .row-check").forEach(cb => cb.checked = e.target.checked);
});

/* ==================== UPDATE STATUS SEMBAKO ==================== */
document.addEventListener("change", async (e) => {
  if (!e.target.classList.contains("status-sembako")) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const select = e.target;
  const id = select.dataset.id;
  const statusBaru = select.value;
  const statusLama = select.dataset.old;

  if (!confirm(`Ubah status pesanan menjadi ${statusBaru.toUpperCase()}?`)) {
    select.value = statusLama;
    return;
  }

  const { error } = await supabase.from("pesanan_sembako").update({ status: statusBaru }).eq("id", id);

  if (error) {
    alert("Gagal update status");
    console.error(error);
    select.value = statusLama;
    return;
  }

  select.dataset.old = statusBaru;
});

/* ==================== REALTIME PESANAN DIGITAL ==================== */
function listenOrdersRealtime() {
  const supabase = getSupabase();
  if (!supabase) return;

  supabase
    .channel("admin-pesanan")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "pesanan_layanan_digital" },
      () => loadOrders()
    )
    .subscribe();
}

/* ==================== LOGOUT ADMIN ==================== */
function logoutAdmin() {
  localStorage.removeItem("admin_logged_in");
  sessionStorage.removeItem("admin_logged_in");
  window.location.replace("https://ud-fikri.vercel.app");
}

/* ==================== SWITCH TAB SLIDE ==================== */
const tabDigital = document.getElementById("tab-digital");
const tabSembako = document.getElementById("tab-sembako");

const layerDigital = document.getElementById("layer-digital");
const layerSembako = document.getElementById("layer-sembako");

function switchTab(showLayer, hideLayer, tabOn, tabOff, callback) {
  if (!showLayer || !hideLayer) return;

  // tab active
  tabOn.classList.add("active");
  tabOff.classList.remove("active");

  // slide out
  hideLayer.classList.add("slide-left");
  hideLayer.classList.remove("active");

  // slide in
  showLayer.classList.remove("slide-left");
  showLayer.classList.add("active");

  if (callback) callback();
}

/* ==================== EVENT ==================== */
tabDigital?.addEventListener("click", () => {
  switchTab(layerDigital, layerSembako, tabDigital, tabSembako);
});

tabSembako?.addEventListener("click", () => {
  switchTab(layerSembako, layerDigital, tabSembako, tabDigital);
});

/* ==================== INIT ==================== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("logoutBtn")?.addEventListener("click", logoutAdmin);
  document.getElementById("btnOpen")?.addEventListener("click", () => setStore(true));
  document.getElementById("btnClose")?.addEventListener("click", () => setStore(false));

  loadStoreStatus();
  loadOrders();
  listenOrdersRealtime();
});

/* ==================== SEARCH NAMA ==================== */
document.getElementById("searchNama")?.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const activeTab = document.querySelector(".tab.active")?.id;
  let tbodySelector, nameColumnIndex;

  if (activeTab === "tab-digital") {
    tbodySelector = "#orderTable";
    nameColumnIndex = 2; // kolom nama di tabel digital
  } else if (activeTab === "tab-sembako") {
    tbodySelector = "#tbody-sembako";
    nameColumnIndex = 2; // kolom nama di tabel sembako
  } else return;

  const rows = document.querySelectorAll(`${tbodySelector} tr`);
  rows.forEach(row => {
    // skip baris placeholder (misal Belum ada pesanan)
    if (row.querySelector("td[colspan]")) {
      row.style.display = "";
      return;
    }

    const nama = row.children[nameColumnIndex]?.innerText.toLowerCase() || "";
    row.style.display = nama.includes(keyword) ? "" : "none";
  });
});

/* ==================== SORT TABLE (Digital & Sembako) ==================== */
document.querySelectorAll(".admin-table th[data-sort]").forEach((th, index) => {
  let asc = true;

  th.addEventListener("click", () => {
    const activeTab = document.querySelector(".tab.active")?.id;
    let tbody;

    // pilih tbody berdasarkan tab aktif
    if (activeTab === "tab-digital") tbody = document.getElementById("orderTable");
    else if (activeTab === "tab-sembako") tbody = document.getElementById("tbody-sembako");
    else return;

    if (!tbody) return;

    const rows = Array.from(tbody.querySelectorAll("tr"));
    const type = th.dataset.sort;

    // hapus class sort dari semua th
    document.querySelectorAll(".admin-table th").forEach(h => h.classList.remove("sort-asc", "sort-desc"));

    // sort rows
    rows.sort((a, b) => {
      // skip placeholder row (colspan)
      if (a.querySelector("td[colspan]") || b.querySelector("td[colspan]")) return 0;

      let A = a.children[index]?.innerText.trim() || "";
      let B = b.children[index]?.innerText.trim() || "";

      if (type === "number") {
        A = parseFloat(A.replace(/\D/g, "")) || 0;
        B = parseFloat(B.replace(/\D/g, "")) || 0;
        return asc ? A - B : B - A;
      }

      if (type === "date") {
        A = new Date(A).getTime() || 0;
        B = new Date(B).getTime() || 0;
        return asc ? A - B : B - A;
      }

      return asc ? A.localeCompare(B, "id", { sensitivity: "base" }) 
                 : B.localeCompare(A, "id", { sensitivity: "base" });
    });

    // tandai arah sort
    th.classList.add(asc ? "sort-asc" : "sort-desc");

    // append sorted rows kembali ke tbody
    rows.forEach(row => tbody.appendChild(row));

    asc = !asc;
  });
});



