document.addEventListener("DOMContentLoaded", () => {
  let storeOpen = false; // default

 // ================= SUPABASE =================
const supabase = window.supabaseClient;

// === FETCH STATUS TOKO dari Supabase ===
async function fetchStoreStatus() {
  const { data, error } = await supabase
    .from("store_status")
    .select("is_open")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Gagal ambil status toko:", error);
    return;
  }

  if (data) {
    storeOpen = data.is_open;
    updateStoreStatus();
  } else {
    console.warn("Row dengan id=1 tidak ditemukan.");
  }
}

// cek pertama kali
fetchStoreStatus();

// subscribe realtime
supabase
  .channel("status-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "store_status" },
    payload => {
      console.log("Status toko berubah:", payload.new);
      storeOpen = payload.new.is_open;
      updateStoreStatus();
    }
  )
  .subscribe();

  // === UPDATE STATUS TOKO DI UI ===
function updateStoreStatus() {
const statusEl = document.getElementById("store-status-msg");
const productsContainer = document.getElementById("products-container");

if (storeOpen) {
  statusEl.innerHTML = `
    <i class="fas fa-check-circle"></i> 
    <span><strong>Toko Sedang Buka</strong>. <br>Silakan belanja 😊</span>
  `;
  statusEl.className = "store-open";
  productsContainer.style.display = "grid";
} else {
  statusEl.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i> 
    <span><strong>Toko Tutup</strong>.<br>Silahkan kembali lagi nanti 🙏</span>
  `;
  statusEl.className = "store-closed";
  productsContainer.style.display = "none";
}
}

  // === DAFTAR PRODUK ===
  let products = [];


  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[char]);

  // === RENDER PRODUK ===
  function renderProducts(list = products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    list.forEach((p, idx) => {
      const realIndex = products.indexOf(p);
      const div = document.createElement("div");
      div.className = "product-card";

      // catatan promo
      let promoNote = "";
      if (p.promo) {
        promoNote = `<p class="promo-note">Promo: Beli ${p.promo.qty} Rp ${p.promo.price.toLocaleString()}</p>`;
      }

      div.innerHTML = `
        <img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.name)}" class="product-image" onclick="showProductDetail(${realIndex})">
        <h3>${escapeHtml(p.name)}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        ${promoNote}
        <button onclick="addToCart(${realIndex})"><i class="fas fa-shopping-cart"></i> Tambah </button>
      `;
      container.appendChild(div);
    });
  }
  async function loadProducts() {
    const { data, error } = await supabase.from("catalog_products").select("*").eq("is_active", true).order("sort_order").order("id");
    if (error) {
      console.error("Gagal memuat katalog:", error);
      document.getElementById("products-container").textContent = "Produk belum dapat dimuat. Silakan coba lagi nanti.";
      return;
    }
    products = data.map(row => ({ ...row, img: row.image_url || "images/logo.png", tambahanBiaya: row.tambahan_biaya,
      deskripsi: row.description || "", promo: row.promo_qty && row.promo_price ? { qty: row.promo_qty, price: row.promo_price } : null }));
    const select = document.getElementById("filter-category");
    select.querySelectorAll("option:not(:first-child)").forEach(option => option.remove());
    [...new Set(products.map(item => item.category))].sort().forEach(cat => select.add(new Option(cat, cat)));
    filterProducts();
  }
  function filterProducts() {
    const keyword = document.getElementById("search-input").value.trim().toLocaleLowerCase("id-ID");
    const category = document.getElementById("filter-category").value;
    renderProducts(products.filter(p => (!category || p.category === category) && p.name.toLocaleLowerCase("id-ID").includes(keyword)));
  }
  loadProducts();

// === MODAL PRODUK =========
let currentProductIndex = null;

function showProductDetail(index) {
  const p = products[index];
  if (!p) return;

  currentProductIndex = index;

  document.getElementById("modal-product-img").src = p.img || "";
  document.getElementById("modal-product-img").alt = p.name || "Produk";
  document.getElementById("modal-product-name").textContent = p.name || "";
  document.getElementById("modal-product-price").textContent =
    "Rp " + ((p.price || 0).toLocaleString("id-ID"));
  document.getElementById("modal-product-desc").innerHTML =
    escapeHtml(p.deskripsi || "Tidak ada deskripsi.").replace(/\n/g, "<br>");

    // === RESET DESKRIPSI DAN TOMBOL ===
modalDesc.classList.remove("expanded");
toggleDescBtn.textContent = "Selengkapnya";
  
  document.getElementById("product-modal").classList.remove("hidden");
}

window.showProductDetail = showProductDetail;

// === MODAL ELEMENTS ===
const modal = document.getElementById("product-modal");
const modalContent = modal.querySelector(".modal-content");
const closeBtn = document.getElementById("close-product-modal");
const addCartBtn = document.getElementById("modal-add-cart");
const toggleDescBtn = document.getElementById("modal-toggle-desc");
const modalDesc = document.getElementById("modal-product-desc");

// ⛔ CEGAH KLIK DALAM MODAL MENUTUP MODAL
modalContent.addEventListener("click", e => {
  e.stopPropagation();
});

function hideModal() {
  modal.classList.add("fadeOut");
  modal.addEventListener("animationend", () => {
    modal.classList.add("hidden");
    modal.classList.remove("fadeOut");
  }, { once: true });
}

// Close modal dengan tombol ×
closeBtn.addEventListener("click", hideModal);

// Close modal dengan klik di luar konten
modal.addEventListener("click", e => {
  if (!modalContent.contains(e.target)) hideModal();
});

// Tombol Tambah ke Keranjang
addCartBtn.addEventListener("click", () => {
  if (currentProductIndex !== null && typeof addToCart === "function") {
    const imgEl = document.getElementById("modal-product-img"); // elemen gambar
    flyToCartFancy(imgEl); // animasi fancy

    addToCart(currentProductIndex); // tambahkan ke keranjang
    hideModal();
  }
});

  // Selengkapnya //
toggleDescBtn.addEventListener("click", e => {
  e.preventDefault();

  modalDesc.classList.toggle("expanded");
  toggleDescBtn.textContent =
    modalDesc.classList.contains("expanded")
      ? "Sembunyikan"
      : "Selengkapnya";
});

// Animasi Terbang ke Keranjang //
  function flyToCartFancy(imgEl) {
  const cartIcon = document.getElementById("cart-icon");
  if (!cartIcon || !imgEl) return;

  const rect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Buat elemen gambar terbang
  const flyImg = imgEl.cloneNode(true);
  flyImg.className = "fly-img blur";
  document.body.appendChild(flyImg);

  // Posisi awal
  flyImg.style.left = rect.left + "px";
  flyImg.style.top = rect.top + "px";
  flyImg.style.width = rect.width + "px";
  flyImg.style.height = rect.height + "px";

  // Trigger animasi
  requestAnimationFrame(() => {
    flyImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2) rotate(720deg)`;
    flyImg.style.opacity = 0;
    flyImg.style.filter = "blur(0px)";
  });

  // Hapus elemen setelah animasi selesai
  flyImg.addEventListener("transitionend", () => {
    flyImg.remove();

    // Efek “pop” badge keranjang
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.style.transform = "scale(1.4)";
      badge.style.transition = "transform 0.2s";
      setTimeout(() => {
        badge.style.transform = "scale(1)";
      }, 200);
    }
  });
}

 /* =========================
      FIXED CART SYSTEM
========================= */

// Load cart dari localStorage (dipastikan array!)
// ====== CART GLOBAL (load + sanitasi) ======
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
if (!Array.isArray(cart)) cart = [];

// buang item rusak / qty <= 0
cart = cart.filter(it => {
  if (!it || typeof it.qty === "undefined") return false;
  return Number(it.qty) > 0;
});
localStorage.setItem("cart", JSON.stringify(cart));

// fungsi simpan
function saveCart() {
  if (!Array.isArray(cart)) cart = [];
  // pastikan qty adalah number dan >0
  cart = cart.map(it => ({ ...it, qty: Number(it.qty) || 0 }))
             .filter(it => it.qty > 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ========= TAMBAH KE KERANJANG ========= */

window.addToCart = function (index) {
  // Pastikan cart array
  if (!Array.isArray(cart)) cart = [];

  const product = products[index];
  let item = cart.find(p => p.name === product.name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1, antarDalamRumah: false });
  }

  saveCart();
  renderCart();
  updateCartBadge();
  showToast(`${product.name} ditambahkan ke keranjang`);
};

/* ========= TOAST NOTIFIKASI ========= */

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast");

  toast.innerHTML = `
    <div class="toast-icon">✔</div>
    <span>${message}</span>
  `;

  // Klik toast → langsung masuk ke keranjang
  toast.addEventListener("click", goToCart);

  container.appendChild(toast);

  // Auto hide
  setTimeout(() => {
    toast.style.animation = "slide-out 0.35s forwards";
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

/* ========= BADGE KERANJANG ========= */

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  // Pastikan cart array
  if (!Array.isArray(cart)) cart = [];

  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "flex" : "none";
}

/* ========= SCROLL KE KERANJANG ========= */

// pastikan ini berada di scope global (bisa di bawah semua kode atau di luar DOMContentLoaded)
window.goToCart = function () {
  const cartEl = document.getElementById("cart") || document.getElementById("cart-section");
  if (!cartEl) {
    // kalau keranjang ada di halaman lain, ubah ke window.location.href = "cart.html";
    console.warn("Elemen keranjang tidak ditemukan (id='cart' atau id='cart-section').");
    return;
  }

  // scroll dengan offset 20px supaya tidak nempel ke header
  const y = cartEl.getBoundingClientRect().top + window.pageYOffset - 20;
  window.scrollTo({ top: y, behavior: "smooth" });
};

 // === RENDER KERANJANG ===
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let totalBelanja = 0;
  let totalItem = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
        <span>${item.name} x${item.qty} - Rp ${(hitungSubtotal(item)).toLocaleString()}</span>
        <div style="display:flex; gap:6px;">
          <button style="padding:4px 10px; border:none; background:#f0f0f0; border-radius:6px; font-size:12px;" onclick="decreaseQty(${index})">−</button>
          <button style="padding:4px 10px; border:none; background:#4caf50; color:white; border-radius:6px; font-size:12px;" onclick="increaseQty(${index})">+</button>
          <button style="padding:4px 10px; border:none; background:#f44336; color:white; border-radius:6px; font-size:16px;" onclick="removeItem(${index})">🗑</button>
        </div>
      </div>
      <label style="display:block; margin-top:4px; font-size:0.9em;">
        <input type="checkbox" onchange="toggleAntarDalamRumah(${index})" ${item.antarDalamRumah ? "checked" : ""}>
        Antar dalam rumah (+Rp 1.000)
      </label>
    `;
    cartItems.appendChild(li);

    totalBelanja += hitungSubtotal(item);
    totalItem += item.qty;
  });

  let biayaOngkir = hitungOngkir(totalItem);
  let grandTotal = totalBelanja + biayaOngkir;

  const cartTotal = document.getElementById("cart-total");
  const statusPesananElem = document.getElementById("status-pesanan");

  // 🔹 Update tampilan total
  if (jarak > 0) {
    cartTotal.innerHTML = `
      Belanja: Rp ${totalBelanja.toLocaleString()}<br>
      Ongkir (${jarak.toFixed(1)} km): Rp ${biayaOngkir.toLocaleString()}<br>
      <b>Total Bayar: Rp ${grandTotal.toLocaleString()}</b>
    `;
  } else {
    cartTotal.innerHTML = `
      Belanja: Rp ${totalBelanja.toLocaleString()}<br>
      Ongkir: Belum dihitung<br>
      <b>Total Bayar: Rp ${grandTotal.toLocaleString()}</b>
    `;
  }

  // 🔹 Status otomatis tampil di elemen terpisah (berdasarkan jarak)
  let minimalAntar = jarak <= 1 ? 40000 : 60000;

  if (totalBelanja === 0) {
    statusPesananElem.textContent = "Keranjang kosong 🛒";
    statusPesananElem.style.cssText = "color: gray; font-weight: bold; font-size: 0.9em;";
  } else if (totalBelanja < minimalAntar) {
    statusPesananElem.textContent = `Pesanan ambil di toko 🏪 (minimal antar Rp ${minimalAntar.toLocaleString()})`;
    statusPesananElem.style.cssText = "color: orange; font-weight: bold; font-size: 0.9em;";
  } else {
    statusPesananElem.textContent = "Pesanan siap diantar 🚚";
    statusPesananElem.style.cssText = "color: green; font-weight: bold; font-size: 0.9em;";
  }
}

// === FUNGSI PENDUKUNG KERANJANG (di luar renderCart)
function hitungSubtotal(item) {
  let subtotal = item.price * item.qty;
  if (item.promo && item.qty >= item.promo.qty) {
    let paket = Math.floor(item.qty / item.promo.qty);
    let sisa = item.qty % item.promo.qty;
    subtotal = paket * item.promo.price + sisa * item.price;
  }
  if (item.tambahanBiaya && item.antarDalamRumah) {
    subtotal += 1000 * item.qty;
  }
  return subtotal;
}

window.toggleAntarDalamRumah = function(index) {
  cart[index].antarDalamRumah = !cart[index].antarDalamRumah;
  renderCart();
};

window.increaseQty = function(i) { 
  if (!Array.isArray(cart)) cart = [];
  if (!cart[i]) return;
  cart[i].qty = Number(cart[i].qty || 0) + 1;
  saveCart();
  renderCart();
  updateCartBadge();
};

window.decreaseQty = function(i) { 
  if (!Array.isArray(cart)) cart = [];
  if (!cart[i]) return;

  cart[i].qty = Number(cart[i].qty || 0) - 1;
  if (cart[i].qty <= 0) {
    // remove item if qty zero or below
    cart.splice(i, 1);
  }
  saveCart();
  renderCart();
  updateCartBadge();
};

window.removeItem = function(i) { 
  if (!Array.isArray(cart)) cart = [];
  if (!cart[i]) return;
  cart.splice(i, 1);
  saveCart();
  renderCart();
  updateCartBadge();
};

document.getElementById("clear-cart").addEventListener("click", () => {
  if (!Array.isArray(cart)) cart = [];
  if (cart.length === 0) {
    alert("Keranjang sudah kosong.");
    return;
  }
  if (confirm("Yakin ingin menghapus semua isi keranjang?")) {
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
  }
});

   // === HITUNG SUBTOTAL DENGAN PROMO & ANTAR DALAM RUMAH ===
  function hitungSubtotal(item) {
    let subtotal = item.price * item.qty;

    // cek promo
    if (item.promo && item.qty >= item.promo.qty) {
      let paket = Math.floor(item.qty / item.promo.qty);
      let sisa = item.qty % item.promo.qty;
      subtotal = paket * item.promo.price + sisa * item.price;
    }

    // tambahan biaya antar dalam rumah (per item)
    if (item.tambahanBiaya && item.antarDalamRumah) {
      subtotal += 1000 * item.qty;
    }

    return subtotal;
  }

 window.toggleAntarDalamRumah = function(index) {
  cart[index].antarDalamRumah = !cart[index].antarDalamRumah;
  renderCart();
};

// === METODE PEMBAYARAN ===
const paymentSelect = document.getElementById("payment-method");
const paymentInfo = document.getElementById("payment-info");

// === PAYMENT TOAST (kanan atas, auto hilang) ===
function showPaymentToast(text) {
  const t = document.getElementById("payment-toast");

  t.classList.remove("show");
  t.innerText = text;
  void t.offsetWidth; // restart animasi fade
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2500);
}

// === COPY REKENING ===
function copyRekening(num) {
  navigator.clipboard.writeText(num)
    .then(() => showPaymentToast("Nomor rekening disalin"))
    .catch(() => showPaymentToast("Gagal menyalin"));
}

// === DOWNLOAD QRIS ===
function downloadQRIS() {
  const imgSrc = "images/qris.png";
  const link = document.createElement("a");
  link.href = imgSrc;
  link.download = "QRIS-UD-Fikri.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showPaymentToast("QRIS berhasil di-download");
}

window.copyRekening = copyRekening;
window.downloadQRIS = downloadQRIS;

// === EVENT PEMILIHAN METODE PEMBAYARAN ===
paymentSelect.addEventListener("change", () => {
  const method = paymentSelect.value;
  paymentInfo.innerHTML = ""; // clear dulu

  if (method === "QRIS") {
    paymentInfo.innerHTML = `
      <h3>QRIS</h3>
      <p>Silakan scan atau download QR Code berikut:</p>

      <div style="text-align:center;">
        <img src="images/qris.png" alt="QRIS" 
          style="max-width:200px;display:block;margin:10px auto;">

        <button onclick="downloadQRIS()" 
          style="margin-top:10px;padding:8px 12px;border:none;background:#f0f0f0;color:#000;border-radius:6px;cursor:pointer;">
          Download
        </button>
      </div>
    `;
  }

  else if (method === "Transfer") {
    const rekening = "1270012190490";

    paymentInfo.innerHTML = `
      <h3>Transfer Bank</h3>
      <p>Silakan transfer ke rekening berikut:</p>

      <strong>Bank Mandiri</strong><br>

      No. Rekening: 
      <span style="font-size:16px;color:#000;font-weight:bold;">
        ${rekening}
      </span>

      <button onclick="copyRekening('${rekening}')" 
        style="margin-left:10px;padding:5px 10px;border:none;background:#f0f0f0;color:#000;border-radius:6px;cursor:pointer;">
        Salin
      </button>

      <br>a.n <em>Fikriatur Rizky</em>
    `;
  }

  else if (method === "Tunai/Cash") {
    paymentInfo.innerHTML = `
      <h3>Tunai/Cash</h3>
      <p>Bayar setelah diantar (Tunai/Cash)</p>
    `;
  }
});

  // ================= CHECKOUT & SUBMIT PESANAN SEMBAKO =================
document.getElementById("checkout").addEventListener("click", async () => {
  if (!storeOpen) {
    alert("Toko sedang tutup, checkout tidak bisa dilakukan.");
    return;
  }

  if (!cart || cart.length === 0) {
    alert("Keranjang kosong! Tambahkan barang dulu.");
    return;
  }

  // Ambil input user
  const nama = document.getElementById("customer-name").value.trim();
  const alamat = document.getElementById("customer-address").value.trim();
  const metodePembayaran = document.getElementById("payment-method").value;
  const lokasiMap = document.getElementById("lokasi").value.trim();

  if (!nama || !alamat || !metodePembayaran || !lokasiMap) {
    alert("Mohon lengkapi semua data: nama, alamat, metode pembayaran, lokasi.");
    return;
  }

  // Hitung total
  let totalBelanja = cart.reduce((sum, item) => sum + hitungSubtotal(item), 0);
  let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  let biayaOngkir = hitungOngkir(totalQty);
  let grandTotal = totalBelanja + biayaOngkir;

  // Simpan salinan untuk pesan WhatsApp sebelum keranjang dikosongkan.
  const itemsPesanan = cart.map(item => ({ ...item }));

  // ================= INSERT KE SUPABASE =================
  try {
    const supabase = window.supabaseClient;
    if (!supabase) throw new Error("Supabase client tidak ditemukan!");

    const { error } = await supabase
      .from("pesanan_sembako")
      .insert([{
        nama,
        alamat,
        lokasi_map: lokasiMap,
        items: itemsPesanan, // Supabase jsonb
        total: grandTotal,
        metode_pembayaran: metodePembayaran,
        status: "pending",
        created_at: new Date().toISOString()
      }]);

    if (error) throw error;

    // Reset keranjang setelah berhasil insert
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();

    alert("Pesanan berhasil dikirim dan tercatat di sistem!");

  } catch (err) {
    console.error("Gagal submit pesanan ke Supabase:", err);
    alert("Gagal mengirim pesanan. Silakan coba lagi.");
    return;
  }

  // ================= KIRIM PESAN KE WHATSAPP =================
  let msg = `*🛒 PESANAN UD FIKRI 🛒*\n`;
  msg += `=====================\n`;
  msg += `*Nama:* ${nama}\n`;
  msg += `*Alamat:* ${alamat}\n`;
  msg += `📍 *Lokasi:* ${lokasiMap}\n`;
  msg += `=====================\n`;
  msg += `*Pesanan:*\n`;

  itemsPesanan.forEach(item => {
    let subtotal = hitungSubtotal(item);
    msg += `- ${item.name} x${item.qty} = Rp ${subtotal.toLocaleString()}\n`;
  });

  msg += `---------------------\n`;
  msg += `*Ongkir:* Rp ${biayaOngkir.toLocaleString()}\n`;
  msg += `*Total Bayar:* Rp ${grandTotal.toLocaleString()}\n`;
  msg += `*Metode Pembayaran:* ${metodePembayaran}\n`;
  msg += `=====================\n`;

  const saran = document.getElementById("saran-produk").value.trim();
  if (saran) {
    msg += `💡 Saran/Masukan: ${saran}\n`;
  }

  msg += `_Terima kasih sudah berbelanja 🙏_`;
  msg += `\n*https://ud-fikri.vercel.app*`;

  // Buka WhatsApp
  window.open(`https://wa.me/6281287505090?text=${encodeURIComponent(msg)}`, "_blank");
});


  // === SEARCH & FILTER ===
  document.getElementById("search-input").addEventListener("input", filterProducts);
  document.getElementById("filter-category").addEventListener("change", filterProducts);

  // === UPDATE STATUS TOKO DI HALAMAN ===
  function updateStoreStatus() {
  const statusEl = document.getElementById("store-status-msg");
  const productsContainer = document.getElementById("products-container");

  if (storeOpen) {
    statusEl.innerHTML = `
      <i class="fas fa-check-circle"></i> 
      <span><strong>Toko Sedang Buka</strong>. <br>Silakan belanja 😊</span>
    `;
    statusEl.className = "store-open";
    productsContainer.style.display = "grid";
  } else {
    statusEl.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i> 
      <span><strong>Toko Tutup</strong>.<br>Silahkan kembali lagi nanti 🙏</span>
    `;
    statusEl.className = "store-closed";
    productsContainer.style.display = "none";
  }
}
updateStoreStatus();

// Accordion toggle with animation
document.querySelectorAll(".accordion").forEach(acc => {
  acc.addEventListener("click", function() {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
    }
  });
});
  
// === KONFIGURASI LOKASI TOKO ===
if (typeof window.tokoLat === "undefined") window.tokoLat = -6.288418;
if (typeof window.tokoLng === "undefined") window.tokoLng = 106.818342;

// === VARIABEL GLOBAL UNTUK LOKASI USER & ONGKIR ===
if (typeof window.jarak === "undefined") window.jarak = 0;
window.jarakUser = 0;
window.ongkirUser = 0;

// === Fungsi Haversine untuk hitung jarak (km) ===
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// === Fungsi Hitung Ongkir ===
function hitungOngkir(totalItem = 0) {
  const jarak = window.jarak || 0;
  if (jarak > 1) {
    const kmLebih = Math.ceil(jarak - 1);
    const biayaKm = kmLebih * 3000;
    const biayaPerItem = totalItem * 500;
    return biayaKm + biayaPerItem;
  }
  return 0;
}

// === Detail Ongkir ===
function detailOngkir(totalItem = 0) {
  const jarak = window.jarak || 0;
  if (jarak <= 0) return "Belum dihitung";
  if (jarak <= 1) return "Gratis (≤ 1 km)";

  const kmLebih = Math.ceil(jarak - 1);
  const biayaKm = kmLebih * 3000;
  const biayaPerItem = totalItem * 500;
  const total = biayaKm + biayaPerItem;

  return `Jarak: ${jarak.toFixed(1)} km\n` +
         `• Rp 3.000 x ${kmLebih} km = Rp ${biayaKm.toLocaleString()}\n` +
         `• Rp 500 x ${totalItem} item = Rp ${biayaPerItem.toLocaleString()}\n` +
         `Total Ongkir = Rp ${total.toLocaleString()}`;
}

// === PETA & AMBIL LOKASI USER ===
const ambilBtn = document.getElementById("ambil-lokasi");
const lokasiInput = document.getElementById("lokasi");
const koordinatEl = document.getElementById("koordinat");

let map = null;
let marker = null;

function ensureMap(lat = tokoLat, lng = tokoLng) {
  if (!map) {
    map = L.map("user-map").setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);
  }

  if (!marker) {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", (e) => {
      const pos = e.target.getLatLng();
      updateLokasiDanJarak(pos.lat, pos.lng);
    });
  } else {
    marker.setLatLng([lat, lng]);
    map.flyTo([lat, lng], 15, { animate: true, duration: 1.2 }); // smooth animation
  }
}

function updateLokasiDanJarak(lat, lng) {
  if (lokasiInput) lokasiInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
  if (koordinatEl) koordinatEl.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  window.jarak = haversine(lat, lng, tokoLat, tokoLng);
  window.jarakUser = window.jarak;
  window.ongkirUser = hitungOngkir();

  if (typeof renderCart === "function") renderCart();
}

if (ambilBtn) {
  ambilBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    const prevHtml = ambilBtn.innerHTML;
    ambilBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengambil lokasi...';
    ambilBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        ensureMap(lat, lng);          // pindahkan marker ke lokasi user
        updateLokasiDanJarak(lat, lng); // isi input dan koordinat

        ambilBtn.innerHTML = prevHtml;
        ambilBtn.disabled = false;
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.");
        ambilBtn.innerHTML = prevHtml;
        ambilBtn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// === Saat halaman pertama kali dimuat ===
if (document.getElementById("user-map")) {
  // Tampilkan peta langsung, dengan marker default (misal di lokasi toko)
  ensureMap(tokoLat, tokoLng);

  // Tapi teks lokasi & koordinat dikosongkan dulu
  if (lokasiInput) lokasiInput.value = "";
  if (koordinatEl) koordinatEl.textContent = "";
}

});
