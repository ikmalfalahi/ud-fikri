document.addEventListener("DOMContentLoaded", () => {
  let storeOpen = false; // default

  // === FETCH STATUS TOKO dari supabaseClient ===
  async function fetchStoreStatus() {
  const { data, error } = await supabaseClient
    .from("store_status")
    .select("is_open")
    .eq("id", 1)
    .maybeSingle(); // aman kalau kosong

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
  supabaseClient
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
  const products = [
{
  name: "Gas Elpiji 3kg",
  price: 22000,
  img: "images/gas-3kg.jpg",
  category: "GAS ELPIJI",
  tambahanBiaya: true,
  deskripsi: `
Gas Elpiji 3 Kg resmi Pertamina - aman & berkualitas.
Jaminan Kualitas:
✔ Segel resmi Pertamina utuh  
✔ Berat & tekanan gas sesuai standar  
✔ Tidak diisi ulang ilegal  
✔ Tabung lolos pengecekan keamanan
  `
},
{ 
    name: "Gas Elpiji 12kg", 
    price: 220000, 
    img: "images/gas-12kg.jpg", 
    category: "GAS ELPIJI", 
    tambahanBiaya: true, 
    deskripsi: `
Gas Elpiji 12 Kg asli, segel resmi, dan tanpa pengurangan isi.
Jaminan Kualitas:
✔ Segel asli Pertamina masih utuh
✔ Bukan isi ulang ilegal
✔ Berat sesuai standar 12 Kg
✔ Tekanan gas stabil dan optimal
✔ Tabung sudah lulus uji keamanan
  `
},
{ 
    name: "Aqua Galon", 
    price: 22000, 
    img: "images/aqua-galon.jpg", 
    category: "AQUA", 
    tambahanBiaya: true,
    deskripsi: `
💧 AQUA Galon Asli – Segar, Bersih, dan Terpercaya! 💧
Di luar sana banyak beredar galon yang diisi ulang manual tanpa standar kebersihan. 
Tapi di sini, Anda mendapatkan AQUA yang langsung dari pabrik, dengan kualitas air pegunungan yang terjaga.
Jaminan Kualitas:
Jaminan Keaslian Produk:
✔ Segel resmi AQUA masih utuh
✔ Bukan galon isi ulang atau oplosan
✔ Rasa tetap segar, murni, dan standar pabrik
✔ Galon higienis dan terawat
  `
},
{ 
    name: "Aqua 600ml", 
    price: 52000, 
    img: "images/aqua-600ml.jpg", 
    category: "AQUA", 
    tambahanBiaya: true, 
    deskripsi: `
💧 AQUA 600 ml Original – Segar, Murni, dan Terpercaya! 💧
AQUA 600 ml yang kami jual 100% asli pabrik, dengan segel utuh, label resmi, dan bukan air isi ulang atau repacking.
Jadi Anda tidak perlu khawatir soal kualitas atau kebersihan.
Jaminan Keaslian & Kebersihan:
✔ Botol original AQUA, bukan tiruan
✔ Segel tutup rapat dan tidak pernah dibuka
✔ Air murni dari sumber pegunungan
✔ Standar pabrik terjaga — aman dan higienis
✔ 1 Karton isi 24 Botol
  `
},
{ 
  name: "Aqua 330ml",
  price: 42000, 
  img: "images/aqua-330ml.jpg", 
  category: "AQUA", 
  tambahanBiaya: true,
  deskripsi: `
💧 AQUA 330 ml Original – Segar, Murni, dan Terpercaya! 💧
AQUA 330 ml yang kami jual 100% asli pabrik, dengan segel utuh, label resmi, dan bukan air isi ulang atau repacking.
Jadi Anda tidak perlu khawatir soal kualitas atau kebersihan.
Jaminan Keaslian & Kebersihan:
✔ Botol original AQUA, bukan tiruan
✔ Segel tutup rapat dan tidak pernah dibuka
✔ Air murni dari sumber pegunungan
✔ Standar pabrik terjaga — aman dan higienis
✔ 1 Karton isi 24 Botol
  `
},
    { name: "Aqua Cube", price: 40000, img: "images/aqua-cube.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "Aqua Gelas", price: 35000, img: "images/aqua-gelas.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "leMineral Galon", price: 20000, img: "images/lemineral-galon.jpg", category: "LEMINERAL", tambahanBiaya: true },
    { name: "leMineral 330ml", price: 42000, img: "images/lemineral-330ml.jpg", category: "LEMINERAL", tambahanBiaya: true },
    { name: "leMineral 600ml", price: 52000, img: "images/lemineral-600ml.jpg", category: "LEMINERAL", tambahanBiaya: true },
    { name: "Beras 14", price: 14000, img: "images/beras-14.jpg", category: "BERAS", tambahanBiaya: true },
    { name: "Beras 13", price: 13000, img: "images/beras-13.jpg", category: "BERAS", tambahanBiaya: true },
    { name: "Beras 12", price: 12000, img: "images/beras-12.jpg", category: "BERAS", tambahanBiaya: true },
    { name: "Telur 1kg", price: 31000, img: "images/telur.jpg", category: "TELUR", tambahanBiaya: true },
    { name: "Minyak Kita 1ltr", price: 20000, img: "images/minyak-1ltr.jpg", category: "MINYAK", tambahanBiaya: true, promo: { qty: 12, price: 217000 } },
    { name: "Minyak Kita 2ltr", price: 40000, img: "images/minyak-1ltr.jpg", category: "MINYAK", tambahanBiaya: true, promo: { qty: 6, price: 217000 } },
    { name: "S-TEE", price: 60000, img: "images/s-tee.jpg", category: "TEH BOTOL", tambahanBiaya: true },
    { name: "Teh Botol Sosro", price: 60000, img: "images/teh-botol.jpg", category: "TEH BOTOL", tambahanBiaya: true },
    { name: "Tissue Paseo", price: 12000, img: "images/paseo.jpg", category: "TISSUE", tambahanBiaya: true, promo: { qty: 3, price: 35000 } },
    { name: "Tissue Jolly", price: 9000, img: "images/jolly.jpg", category: "TISSUE", tambahanBiaya: true, promo: { qty: 3, price: 25000 } },
    { name: "Tissue Nice", price: 7000, img: "images/nice.jpg", category: "TISSUE", tambahanBiaya: true, promo: { qty: 3, price: 20000 } },
    { name: "Prima", price: 40000, img: "images/prima-600ml.jpg", category: "PRIMA", tambahanBiaya: true },
    { name: "VIT Mini", price: 21000, img: "images/vit-mini.jpg", category: "VIT", tambahanBiaya: true },
    { name: "VIT Gelas", price: 24000, img: "images/vit-gelas.jpg", category: "VIT", tambahanBiaya: true },
    { name: "Aqua Isi Ulang", price: 7000, img: "images/aqua-galon.jpg", category: "REFIL", tambahanBiaya: true },
  ];

  // === RENDER PRODUK ===
  function renderProducts(list = products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    list.forEach((p, idx) => {
      const div = document.createElement("div");
      div.className = "product-card";

      // catatan promo
      let promoNote = "";
      if (p.promo) {
        promoNote = `<p class="promo-note">Promo: Beli ${p.promo.qty} Rp ${p.promo.price.toLocaleString()}</p>`;
      }

      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" class="product-image" onclick="showProductDetail(${idx})">
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        ${promoNote}
        <button onclick="addToCart(${idx})"><i class="fas fa-shopping-cart"></i> Tambah </button>
      `;
      container.appendChild(div);
    });
  }
  renderProducts();

// === MODAL DESKRIPSI PRODUK === //
let currentProductIndex = null;

function showProductDetail(index) {
  const p = products[index];
  currentProductIndex = index;

  document.getElementById("modal-product-img").src = p.img;
  document.getElementById("modal-product-name").textContent = p.name;
  document.getElementById("modal-product-price").textContent =
    "Rp " + p.price.toLocaleString();

  document.getElementById("modal-product-desc").textContent =
    p.deskripsi || "Tidak ada deskripsi produk.";

  document.getElementById("product-modal").classList.remove("hidden");
}

// tombol close
document.getElementById("close-product-modal").onclick = () => {
  document.getElementById("product-modal").classList.add("hidden");
};

// klik luar modal
document.getElementById("product-modal").onclick = (e) => {
  if (e.target.id === "product-modal") {
    document.getElementById("product-modal").classList.add("hidden");
  }
};

// tombol tambah keranjang
document.getElementById("modal-add-cart").onclick = () => {
  if (currentProductIndex !== null) {
    addToCart(currentProductIndex);
  }
  document.getElementById("product-modal").classList.add("hidden");
};

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

  paymentSelect.addEventListener("change", () => {
    let method = paymentSelect.value;
    paymentInfo.innerHTML = "";

    if (method === "QRIS") {
      paymentInfo.innerHTML = `
        <h3>QRIS</h3>
        <p>Silakan scan QR Code berikut:</p>
        <img src="images/qris.png" alt="QRIS" style="max-width:200px;display:block;margin:10px auto;">
      `;
    } else if (method === "Transfer") {
      paymentInfo.innerHTML = `
        <h3>Transfer Bank</h3>
        <p>Silakan transfer ke rekening berikut:</p>
        <strong>Bank Mandiri</strong><br>
        No. Rekening: <span style="font-size:18px;color:#2a9d8f;">1270012190490</span><br>
        a.n <em>Fikriatur Rizky</em>
      `;
    } else if (method === "Tunai/Cash") {
      paymentInfo.innerHTML = `
        <h3>Tunai/Cash</h3>
        <p>Bayar setelah diantar (Tunai/Cash)</p>
      `;
    }
  });

  // === CHECKOUT ===
document.getElementById("checkout").addEventListener("click", () => {
  if (!storeOpen) {
    alert("Toko sedang tutup, checkout tidak bisa dilakukan.");
    return;
  }
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let name = document.getElementById("customer-name").value.trim();
  let addr = document.getElementById("customer-address").value.trim();
  let pay = paymentSelect.value;
  let lokasi = document.getElementById("lokasi").value.trim();

  // 🔹 Validasi wajib
  if (!name || !addr || !pay || !lokasi) {
    alert("Mohon isi nama, alamat, metode pembayaran, dan titik lokasi (share lokasi).");
    return;
  }

  let msg = `*🛒 PESANAN UD FIKRI 🛒*\n`;
  msg += `=====================\n`;
  msg += `*Nama:* ${name}\n`;
  msg += `*Alamat:* ${addr}\n`;
  msg += `📍 *Lokasi:* ${lokasi}\n`;
  msg += `=====================\n`;
  msg += `*Pesanan:*\n`;

  let totalItem = 0;
  let totalBelanja = 0;
  cart.forEach(item => {
    let extra = (item.tambahanBiaya && item.antarDalamRumah) ? " + antar dalam rumah" : "";
    let subtotal = hitungSubtotal(item);
    totalItem += item.qty;
    totalBelanja += subtotal;

    msg += `- ${item.name} x${item.qty}${extra}\n   = Rp ${subtotal.toLocaleString()}\n`;
  });
  
  // 🔹 Hitung ongkir & total bayar
  let biayaOngkir = hitungOngkir(totalItem);
  let grandTotal = totalBelanja + biayaOngkir;

  // Tambahkan ongkir detail
  msg += `---------------------\n`;
  msg += `*Ongkir:*\n${detailOngkir(totalItem)}\n`;
  msg += `*Total Bayar:* Rp ${grandTotal.toLocaleString()}\n`;

  msg += `=====================\n`;
  msg += `*Total Item:* ${totalItem}\n`;
  // 🔹 Logika status pesanan sesuai jarak
  let minimalAntar = jarak <= 1 ? 40000 : 60000;
  
  if (totalBelanja < minimalAntar) {
  msg += `*Status Pesanan:* Ambil di toko 🏪 (belum mencapai minimal antar Rp ${minimalAntar.toLocaleString()})\n`;
  } else {
  msg += `*Status Pesanan:* Siap diantar 🚚\n`;
  }
  if (jarak > 0) {
    msg += `*Ongkir:* Rp ${biayaOngkir.toLocaleString()} (jarak ${jarak.toFixed(1)} km)\n`;
  } else {
    msg += `*Ongkir:* Belum dihitung\n`;
  }
  msg += `*Metode Pembayaran:* ${pay}\n`;
  msg += `=====================\n`;

  // 🔹 Saran produk opsional
  const saran = document.getElementById("saran-produk").value.trim();
  if (saran) {
    msg += `\n💡 Saran/Masukan: ${saran}\n`;
  }

  msg += `=====================\n`;
  msg += `_Terima kasih sudah berbelanja 🙏_`;
  msg += `*https://ud-fikri.vercel.app*`;

  // Kirim ke WA
  window.open(`https://wa.me/6281287505090?text=${encodeURIComponent(msg)}`, "_blank");

  // reset keranjang
  cart = [];
  renderCart();
  updateCartBadge();

});

  // === SEARCH & FILTER ===
  document.getElementById("search-input").addEventListener("input", (e) => {
    let keyword = e.target.value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
  });

  let categories = [...new Set(products.map(p => p.category))];
  let select = document.getElementById("filter-category");
  categories.forEach(cat => {
    let opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  select.addEventListener("change", (e) => {
    let cat = e.target.value;
    if (cat === "") renderProducts();
    else renderProducts(products.filter(p => p.category === cat));
  });

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




