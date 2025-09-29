let cart = [];
let storeOpen = localStorage.getItem("storeOpen") === "true";

// Daftar produk (30 item)
const products = [
  { name: "Gas Elpiji 3kg", price: 22000, img: "images/gas-3kg.jpg", category: "GAS ELPIJI", tambahanBiaya: true },
  { name: "Gas Elpiji 12kg", price: 220000, img: "images/gas-12kg.jpg", category: "GAS ELPIJI", tambahanBiaya: true },
  { name: "Aqua Galon", price: 22000, img: "images/aqua-galon.jpg", category: "AQUA", tambahanBiaya: true },
  { name: "Aqua 600ml", price: 52000, img: "images/aqua-600ml.jpg", category: "AQUA", tambahanBiaya: true },
  { name: "Aqua 330ml", price: 42000, img: "images/aqua-330ml.jpg", category: "AQUA", tambahanBiaya: true },
  { name: "Aqua Cube", price: 40000, img: "images/aqua-cube.jpg", category: "AQUA", tambahanBiaya: true },
  { name: "Aqua Gelas", price: 35000, img: "images/aqua-gelas.jpg", category: "AQUA", tambahanBiaya: true },
  { name: "Le Mineral Galon", price: 20000, img: "images/lemineral-galon.jpg", category: "LEMINERAL", tambahanBiaya: true },
  { name: "Le Mineral 330ml", price: 42000, img: "images/Lemineral-330ml.jpg", category: "LEMINERAL", tambahanBiaya: true },
  { name: "Le Mineral 600ml", price: 52000, img: "images/Lemineral-600ml.jpg", category: "LEMINERAL", tambahanBiaya: true },
  { name: "Beras 14", price: 14000, img: "images/beras-12.jpg", category: "BERAS", tambahanBiaya: true },
  { name: "Beras 13", price: 13000, img: "images/beras-13.jpg", category: "BERAS", tambahanBiaya: true },
  { name: "Beras 12", price: 12500, img: "images/beras-14.jpg", category: "BERAS", tambahanBiaya: true },
  { name: "Telur 1kg", price: 29000, img: "images/telur.jpg", category: "TELUR", tambahanBiaya: true },
  { name: "Prima 600ml", price: 40000, img: "images/prima-600ml.jpg", category: "PRIMA", tambahanBiaya: true },
  { name: "Teh Botol Sosro", price: 60000, img: "images/teh-botol.jpg", category: "TEH BOTOL", tambahanBiaya: true },
  { name: "S-Tee", price: 60000, img: "images/s-tee.jpg", category: "TEH BOTOL", tambahanBiaya: true },
  { name: "Vit Gelas", price: 24000, img: "images/vit-gelas.jpg", category: "VIT", tambahanBiaya: true },
  { name: "Vit Mini", price: 21000, img: "images/vit-mini.jpg", category: "VIT", tambahanBiaya: true },
  { name: "Minyak Kita 1L", price: 18000, img: "images/minyak-1ltr.jpg", category: "MINYAK", tambahanBiaya: true },
  { name: "Minyak Kita 2L", price: 35000, img: "images/minyak-2ltr.jpg", category: "MINYAK", tambahanBiaya: true },
  { name: "Tissue Paseo", price: 12000, img: "images/paseo.jpg", category: "TISSUE", tambahanBiaya: true },
  { name: "Tissue Jolly", price: 9000, img: "images/jolly.jpg", category: "TISSUE", tambahanBiaya: true },
  { name: "Tissue Nice", price: 7000, img: "images/nice.jpg", category: "TISSUE", tambahanBiaya: true },
];

// Render produk
function renderProducts(list = products) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  list.forEach((p, idx) => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Rp ${p.price.toLocaleString()}</p>
      <button onclick="addToCart(${idx})">Tambah</button>
    `;
    container.appendChild(div);
  });
}
renderProducts();

// Tambah ke keranjang
function addToCart(index) {
  const product = products[index];
  let item = cart.find(p => p.name === product.name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1, antarDalamRumah: false });
  }
  renderCart();
}

// Render keranjang
function renderCart() {
  const list = document.getElementById("cart-items");
  list.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    let discount = item.qty >= 10 ? 0.9 : 1;
    let subtotal = item.price * item.qty * discount;

    // tambahan biaya Rp1.000 per item tertentu
    if (item.tambahanBiaya && item.antarDalamRumah) {
      subtotal += 1000 * item.qty;
    }

     // === DISKON KHUSUS PRODUK TERTENTU ===
    if (item.name === "Tissue Nice") {
      if (item.qty >= 3) {
        subtotal -= 1000; // potong Rp 1000 total
        discountInfo = `<div class="discount-info">Diskon Rp 1000 diterapkan 🎉</div>`;
      }
    }
    // === END DISKON KHUSUS ===

     // === DISKON KHUSUS PRODUK TERTENTU ===
    if (item.name === "Tissue Paseo") {
      if (item.qty >= 3) {
        subtotal -= 1000; // potong Rp 1000 total
        discountInfo = `<div class="discount-info">Diskon Rp 1000 diterapkan 🎉</div>`;
      }
    }
    // === END DISKON KHUSUS ===

    // === DISKON KHUSUS PRODUK TERTENTU ===
    if (item.name === "Tissue Jolly") {
      if (item.qty >= 3) {
        subtotal -= 1000; // potong Rp 1000 total
        discountInfo = `<div class="discount-info">Diskon Rp 1000 diterapkan 🎉</div>`;
      }
    }
    // === END DISKON KHUSUS ===

    total += subtotal;

    let li = document.createElement("li");
    li.innerHTML = `
      ${item.name} x${item.qty} - Rp ${subtotal.toLocaleString()}
      <button class="btn-qty plus" onclick="increaseQty(${index})"><i class="fas fa-plus"></i></button>
    <button class="btn-qty minus" onclick="decreaseQty(${index})"><i class="fas fa-minus"></i></button>
    <button class="btn-remove" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
      ${item.tambahanBiaya ? `
        <label style="margin-left:5px;font-size:12px;">
          <input type="checkbox" ${item.antarDalamRumah ? "checked" : ""}
            onchange="toggleExtra(${index}, this.checked)">
          Antar ke Dalam (+Rp1.000/item)
        </label>
      ` : ""}
    `;
    list.appendChild(li);
  });

  document.getElementById("cart-total").innerText = "Total: Rp " + total.toLocaleString();
}

function toggleExtra(i, checked) {
  cart[i].antarDalamRumah = checked;
  renderCart();
}

function increaseQty(i) { cart[i].qty++; renderCart(); }
function decreaseQty(i) { if (cart[i].qty > 1) cart[i].qty--; renderCart(); }
function removeItem(i) { cart.splice(i, 1); renderCart(); }

// === METODE PEMBAYARAN ===
const paymentSelect = document.getElementById("payment-method");
const paymentInfo = document.getElementById("payment-info");

paymentSelect.addEventListener("change", () => {
  let method = paymentSelect.value;
  paymentInfo.innerHTML = ""; // reset isi

  if (method === "QRIS") {
    paymentInfo.innerHTML = `
      <h3>QRIS</h3>
      <p>Silakan scan QR Code berikut untuk pembayaran:</p>
      <img src="images/qris.png" alt="QRIS" style="max-width:200px;display:block;margin:10px auto;">
    `;
  } else if (method === "TRANSFER") {
    paymentInfo.innerHTML = `
      <h3>Transfer Bank</h3>
      <p>Silakan transfer ke rekening berikut:</p>
      <strong>Bank Mandiri</strong><br>
      No. Rekening: <span style="font-size:18px;color:#2a9d8f;">1270012190490</span><br>
      a.n <em>Fikriatur Rizky</em>
    `;
  }
});

// === CHECKOUT (KIRIM WA) ===
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

  if (!name || !addr || !pay) {
    alert("Mohon isi nama, alamat, dan metode pembayaran.");
    return;
  }

  // === FORMAT PESAN WA ===
  let msg = `Hello UD Fikri, saya ingin pesan:\n\n`;
  msg += `Nama: ${name}\nAlamat: ${addr}\n\n`;
  msg += `Pesanan:\n`;
  cart.forEach(item => {
    let extra = (item.tambahanBiaya && item.antarDalamRumah) ? " + antar dalam rumah" : "";
    msg += `- ${item.name} x${item.qty}${extra}\n`;
  });
  msg += `\n${document.getElementById("cart-total").innerText}\n`;
  msg += `Metode Pembayaran: ${pay}`;

  // buka WhatsApp
  window.open(`https://wa.me/6281287505090?text=${encodeURIComponent(msg)}`, "_blank");

  cart = [];
  renderCart();
});

// Search & filter
document.getElementById("search-input").addEventListener("input", (e) => {
  let keyword = e.target.value.toLowerCase();
  let filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
  renderProducts(filtered);
});

// Isi filter kategori
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

function updateStoreStatus() {
  const statusEl = document.getElementById("store-status-msg");
  const productsContainer = document.getElementById("products-container");

  if (storeOpen) {
    statusEl.innerHTML = `
      <i class="fas fa-check-circle"></i> 
      <span><strong>Toko Sedang Buka</strong>. <br>Silakan belanja 😊</span>
    `;
    statusEl.className = "store-open";
    productsContainer.style.display = "grid"; // tampilkan produk
  } else {
    statusEl.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i> 
      <span><strong>Toko Tutup</strong>.<br>Silahkan kembali lagi nanti 🙏</span>
    `;
    statusEl.className = "store-closed";
    productsContainer.style.display = "none"; // sembunyikan produk
  }
}
updateStoreStatus();

// panggil sekali saat load halaman
updateLandingStoreStatus();

// Render produk
function renderProducts(list = products) {
  const container = document.getElementById("products-container");
  container.innerHTML = "";
  list.forEach((p, idx) => {
    const div = document.createElement("div");
    div.className = "product-card";

    // catatan promo khusus
    let promoNote = "";
    if (p.name === "Tissue Paseo") {
      promoNote = `<p class="promo-note">Beli 3 Rp 35,000</p>`;
    }
    if (p.name === "Tissue Jolly") {
      promoNote = `<p class="promo-note">Beli 3 Rp 25,000</p>`;
    }
    if (p.name === "Tissue Nice") {
      promoNote = `<p class="promo-note">Beli 3 Rp 20,000</p>`;
    }

    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Rp ${p.price.toLocaleString()}</p>
      ${promoNote}
      <button onclick="addToCart(${idx})">Tambah</button>
    `;
    container.appendChild(div);
  });
}
