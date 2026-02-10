document.addEventListener("DOMContentLoaded", () => {
  let storeOpen = false;
  const supabase = window.supabaseClient;

  const statusEl = document.getElementById("store-status-msg");
  const nominalInput = document.getElementById("nominal");
  const jumlahKueEl = document.getElementById("jumlah-kue");
  const totalHargaEl = document.getElementById("total-harga");

  const HARGA_KUE = 500;

  /* ================= STATUS TOKO ================= */
  async function fetchStoreStatus() {
    const { data } = await supabase
      .from("store_status")
      .select("is_open")
      .eq("id", 1)
      .maybeSingle();

    if (data) {
      storeOpen = data.is_open;
      updateStoreStatus();
    }
  }

  function updateStoreStatus() {
    if (storeOpen) {
      statusEl.innerHTML = `<i class="fas fa-check-circle"></i> <strong>Toko Sedang Buka</strong>`;
      statusEl.className = "store-open";
    } else {
      statusEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <strong>Toko Tutup</strong>`;
      statusEl.className = "store-closed";
    }
  }

  fetchStoreStatus();

  supabase
    .channel("status-channel")
    .on("postgres_changes",
      { event: "*", schema: "public", table: "store_status" },
      payload => {
        storeOpen = payload.new.is_open;
        updateStoreStatus();
      }
    ).subscribe();

  /* ================= HITUNG KUE ================= */
  function hitung(nominal) {
    const jumlah = Math.floor(nominal / HARGA_KUE);
    jumlahKueEl.textContent = jumlah;
    totalHargaEl.textContent = "Rp " + nominal.toLocaleString("id-ID");
  }

  document.querySelectorAll(".btn-nominal").forEach(btn => {
    btn.addEventListener("click", () => {
      const nominal = parseInt(btn.dataset.nominal);
      nominalInput.value = nominal;
      hitung(nominal);
    });
  });

  nominalInput.addEventListener("input", () => {
    const val = parseInt(nominalInput.value || 0);
    hitung(val);
  });

  /* ================= PESAN ================= */
  document.getElementById("pesan-kue").addEventListener("click", () => {
    if (!storeOpen) {
      alert("Toko sedang tutup 🙏");
      return;
    }

    const nama = document.getElementById("nama").value.trim();
    const alamat = document.getElementById("alamat").value.trim();
    const nominal = parseInt(nominalInput.value || 0);

    if (!nama || !alamat || nominal < 5000) {
      alert("Lengkapi data & minimal Rp 5.000");
      return;
    }

    const jumlah = Math.floor(nominal / HARGA_KUE);

    const pesan = `Pesanan Kue MA
Nama: ${nama}
Alamat: ${alamat}
Jumlah: ${jumlah} pcs
Total: Rp ${nominal.toLocaleString("id-ID")}`;

    const wa = "6288803060094";
    window.open(`https://wa.me/${wa}?text=${encodeURIComponent(pesan)}`);
  });
});
