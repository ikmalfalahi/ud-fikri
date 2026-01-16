"use strict";

// ==================== SUPABASE ====================
function getSupabase() {
  if (!window.supabaseClient) return null;
  return window.supabaseClient;
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
async function hapusPesanan(id) {
  if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

  const supabase = getSupabase();
  if (!supabase) return;

  const { data, error } = await supabase
    .from("pesanan_layanan_digital")
    .delete()
    .eq("id", id.toString()) // bigint → string
    .select();

  if (error || !data || data.length === 0) {
    alert("Pesanan tidak dapat dihapus.");
    return;
  }

  const row = document
    .querySelector(`button[data-id="${id}"]`)
    ?.closest("tr");

  if (row) row.remove();

  alert("Pesanan berhasil dihapus!");
}

// ==================== HAPUS PESANAN TERPILIH (BARU) ====================
async function hapusPesananTerpilih() {
  const checked = document.querySelectorAll(".row-check:checked");

  if (checked.length === 0) {
    alert("Pilih minimal satu pesanan.");
    return;
  }

  if (!confirm(`Yakin ingin menghapus ${checked.length} pesanan?`)) return;

  const ids = Array.from(checked).map(cb => cb.dataset.id.toString());
  const supabase = getSupabase();
  if (!supabase) return;

  const { error } = await supabase
    .from("pesanan_layanan_digital")
    .delete()
    .in("id", ids); // 🔥 bulk delete

  if (error) {
    alert("Gagal menghapus pesanan terpilih.");
    return;
  }

  checked.forEach(cb => cb.closest("tr")?.remove());
  document.getElementById("checkAll").checked = false;

  alert("Pesanan terpilih berhasil dihapus!");
}

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

  if (error || !data || data.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="11" class="empty">Belum ada pesanan</td>
      </tr>
    `;
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

    table.innerHTML += `
      <tr>
        <td>
          <input type="checkbox" class="row-check" data-id="${item.id}">
        </td>
        <td>${index + 1}</td>
        <td>${item.nama || "-"}</td>
        <td>${item.layanan || "-"}</td>
        <td>${item.provider || "-"}</td>
        <td>Rp ${Number(item.nominal || 0).toLocaleString("id-ID")}</td>
        <td><strong>Rp ${Number(item.total || 0).toLocaleString("id-ID")}</strong></td>
        <td>${item.status || "Pending"}</td>
        <td>${tanggal}</td>
        <td>${item.bukti_url ? `<a href="${item.bukti_url}" target="_blank">Lihat</a>` : "-"}</td>
        <td>
          <button class="hapus-btn" data-id="${item.id}">Hapus</button>
        </td>
      </tr>
    `;
  });

  // tombol hapus satuan
  document.querySelectorAll(".hapus-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      hapusPesanan(btn.dataset.id);
    });
  });

  // check all
  document.getElementById("checkAll")?.addEventListener("change", e => {
    document.querySelectorAll(".row-check").forEach(cb => {
      cb.checked = e.target.checked;
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
      () => loadOrders()
    )
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
  document.getElementById("hapusTerpilih")?.addEventListener("click", hapusPesananTerpilih);

  loadStoreStatus();
  loadOrders();
  listenOrdersRealtime();
});

// ================= SORT TABLE =================
document.querySelectorAll(".admin-table th[data-sort]").forEach((th, index) => {
  let asc = true;

  th.addEventListener("click", () => {
    const tbody = document.getElementById("orderTable");
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const type = th.dataset.sort;

    // reset icon semua kolom
    document.querySelectorAll(".admin-table th")
      .forEach(h => h.classList.remove("sort-asc", "sort-desc"));

    rows.sort((a, b) => {
      let A = a.children[index].innerText.trim();
      let B = b.children[index].innerText.trim();

      // NUMBER
      if (type === "number") {
        A = parseFloat(A.replace(/\D/g, "")) || 0;
        B = parseFloat(B.replace(/\D/g, "")) || 0;
        return asc ? A - B : B - A;
      }

      // DATE
      if (type === "date") {
        A = new Date(A).getTime() || 0;
        B = new Date(B).getTime() || 0;
        return asc ? A - B : B - A;
      }

      // STRING (default)
      return asc
        ? A.localeCompare(B, "id", { sensitivity: "base" })
        : B.localeCompare(A, "id", { sensitivity: "base" });
    });

    // toggle icon
    th.classList.add(asc ? "sort-asc" : "sort-desc");

    // render ulang
    rows.forEach(row => tbody.appendChild(row));

    // toggle arah sort
    asc = !asc;
  });
});

// ================= SEARCH NAMA =================
document.getElementById("searchNama").addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const rows = document.querySelectorAll("#orderTable tr");

  rows.forEach(row => {
    // kolom NAMA = index ke-2
    const nama = row.children[2]?.innerText.toLowerCase() || "";

    if (nama.includes(keyword)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
});

