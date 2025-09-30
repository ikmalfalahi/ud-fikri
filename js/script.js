document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
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
    { name: "Gas Elpiji 3kg", price: 22000, img: "images/gas-3kg.jpg", category: "GAS ELPIJI", tambahanBiaya: true },
    { name: "Gas Elpiji 12kg", price: 220000, img: "images/gas-12kg.jpg", category: "GAS ELPIJI", tambahanBiaya: true },
    { name: "Aqua Galon", price: 22000, img: "images/aqua-galon.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "Aqua 600ml", price: 52000, img: "images/aqua-600ml.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "Aqua 330ml", price: 42000, img: "images/aqua-330ml.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "Aqua Cube", price: 40000, img: "images/aqua-cube.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "Aqua Gelas", price: 35000, img: "images/aqua-gelas.jpg", category: "AQUA", tambahanBiaya: true },
    { name: "leMineral Galon", price: 20000, img: "images/lemineral-galon.jpg", category: "LEMINERAL", tambahanBiaya: true },
    { name: "leMineral 330ml", price: 42000, img: "images/lemineral-330ml.jpg", category: "LEMINERAL", tambahanBiaya: true },
    { name: "leMineral 600ml", price: 52000, img: "images/lemineral-600ml.jpg", category: "LEMINERAL", tambahanBiaya: true },
    { name: "Beras 14", price: 14000, img: "images/beras-14.jpg", category: "BERAS", tambahanBiaya: true },
    { name: "Beras 13", price: 13000, img: "images/beras-13.jpg", category: "BERAS", tambahanBiaya: true },
    { name: "Beras 12", price: 12000, img: "images/beras-12.jpg", category: "BERAS", tambahanBiaya: true },
    { name: "Telur 1kg", price: 29000, img: "images/telur.jpg", category: "TELUR", tambahanBiaya: true },
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
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        ${promoNote}
        <button onclick="addToCart(${idx})"><i class="fas fa-shopping-cart"></i> Tambah </button>
      `;
      container.appendChild(div);
    });
  }
  renderProducts();

  // === TAMBAH KE KERANJANG ===
  window.addToCart = function(index) {
    const product = products[index];
    let item = cart.find(p => p.name === product.name);
    if (item) {
      item.qty++;
    } else {
      cart.push({ ...product, qty: 1, antarDalamRumah: false });
    }
    renderCart();
  };

  // === RENDER KERANJANG ===
  function renderCart() {
    const list = document.getElementById("cart-items");
    list.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      let subtotal = hitungSubtotal(item);
      total += subtotal;

      let li = document.createElement("li");
      li.innerHTML = `
        ${item.name} x${item.qty} - Rp ${subtotal.toLocaleString()}
        <div class="cart-actions">
        <button class="btn-qty plus" onclick="increaseQty(${index})"><i class="fas fa-plus"></i></button>
        <button class="btn-qty minus" onclick="decreaseQty(${index})"><i class="fas fa-minus"></i></button>
        <button class="btn-remove" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
        </div>
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

  // === HITUNG SUBTOTAL DENGAN PROMO ===
  function hitungSubtotal(item) {
    let subtotal = item.price * item.qty;

    // cek promo
    if (item.promo && item.qty >= item.promo.qty) {
      let paket = Math.floor(item.qty / item.promo.qty);
      let sisa = item.qty % item.promo.qty;
      subtotal = paket * item.promo.price + sisa * item.price;
    }

    // tambahan biaya
    if (item.tambahanBiaya && item.antarDalamRumah) {
      subtotal += 1000 * item.qty;
    }

    return subtotal;
  }

  window.toggleExtra = function(i, checked) {
    cart[i].antarDalamRumah = checked;
    renderCart();
  };
  window.increaseQty = function(i) { cart[i].qty++; renderCart(); };
  window.decreaseQty = function(i) { if (cart[i].qty > 1) cart[i].qty--; renderCart(); };
  window.removeItem = function(i) { cart.splice(i, 1); renderCart(); };

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

    if (!name || !addr || !pay) {
      alert("Mohon isi nama, alamat, dan metode pembayaran.");
      return;
    }

    let msg = `Hello UD Fikri, saya ingin pesan:\n\n`;
    msg += `Nama: ${name}\nAlamat: ${addr}\n\n`;
    msg += `Pesanan:\n`;
    cart.forEach(item => {
      let extra = (item.tambahanBiaya && item.antarDalamRumah) ? " + antar dalam rumah" : "";
      msg += `- ${item.name} x${item.qty}${extra}\n`;
    });
    msg += `\n${document.getElementById("cart-total").innerText}\n`;
    msg += `Metode Pembayaran: ${pay}`;

    window.open(`https://wa.me/6281287505090?text=${encodeURIComponent(msg)}`, "_blank");

    cart = [];
    renderCart();
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
});






