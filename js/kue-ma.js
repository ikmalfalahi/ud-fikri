document.addEventListener("DOMContentLoaded", () => {
  const supabase = window.supabaseClient;
  let storeOpen = true; // kue-ma selalu buka (opsional pakai store_status)

  /* ================= PRODUK ================= */
  const products = [
    {
      name: "Kue Basah Campur",
      type: "kue",
      price_per_item: 500,
      img: "images/kue.jpg",
      category: "KUE",
      deskripsi: "Kue basah aneka rasa. Harga 500 / pcs"
    },
    {
      name: "Telur Ayam 1 Kg",
      type: "produk",
      price: 31000,
      img: "images/telur.jpg",
      category: "TELUR"
    }
  ];

  /* ================= CART ================= */
  let cart = JSON.parse(localStorage.getItem("cart_kue_ma") || "[]");

  function saveCart() {
    localStorage.setItem("cart_kue_ma", JSON.stringify(cart));
  }

  /* ================= RENDER PRODUK ================= */
  function renderProducts() {
    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "product-card";

      if (p.type === "kue") {
        div.innerHTML = `
          <img src="${p.img}">
          <h3>${p.name}</h3>
          <p>Rp 500 / pcs</p>
          <input type="number" placeholder="Masukkan nominal (Rp)" 
            id="nominal-${i}" style="width:100%;margin-bottom:6px;">
          <button onclick="addKue(${i})">Pesan</button>
        `;
      } else {
        div.innerHTML = `
          <img src="${p.img}">
          <h3>${p.name}</h3>
          <p>Rp ${p.price.toLocaleString()}</p>
          <button onclick="addProduk(${i})">Tambah</button>
        `;
      }

      container.appendChild(div);
    });
  }

  /* ================= TAMBAH KUE ================= */
  window.addKue = function(index) {
    const nominal = Number(document.getElementById(`nominal-${index}`).value);
    if (!nominal || nominal < 500) {
      alert("Minimal Rp 500");
      return;
    }

    const qty = nominal / 500;
    cart.push({
      name: products[index].name,
      qty,
      price: nominal,
      type: "kue"
    });

    saveCart();
    renderCart();
  };

  /* ================= TAMBAH PRODUK ================= */
  window.addProduk = function(index) {
    const p = products[index];
    let item = cart.find(i => i.name === p.name);

    if (item) item.qty++;
    else cart.push({ name: p.name, qty: 1, price: p.price, type: "produk" });

    saveCart();
    renderCart();
  };

  /* ================= RENDER CART ================= */
  function renderCart() {
    const el = document.getElementById("cart-items");
    el.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
      total += item.price;
      el.innerHTML += `
        <li>${item.name} (${item.qty}) - Rp ${item.price.toLocaleString()}</li>
      `;
    });

    document.getElementById("cart-total").innerText =
      "Total: Rp " + total.toLocaleString();
  }

  /* ================= CHECKOUT ================= */
  document.getElementById("checkout").addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong");
      return;
    }

    const nama = document.getElementById("customer-name").value;
    const alamat = document.getElementById("customer-address").value;

    if (!nama || !alamat) {
      alert("Lengkapi data");
      return;
    }

    const total = cart.reduce((s, i) => s + i.price, 0);

    await supabase.from("pesanan_kue_ma").insert([{
      nama,
      alamat,
      items: cart,
      total,
      status: "pending"
    }]);

    let msg = `🍰 *PESANAN KUE-MA*\n`;
    msg += `Nama: ${nama}\nAlamat: ${alamat}\n\n`;
    cart.forEach(i => {
      msg += `- ${i.name} (${i.qty}) Rp ${i.price}\n`;
    });
    msg += `\nTotal: Rp ${total}`;

    cart = [];
    saveCart();
    window.open(`https://wa.me/62812xxxxxxx?text=${encodeURIComponent(msg)}`);
  });

  renderProducts();
  renderCart();
});
