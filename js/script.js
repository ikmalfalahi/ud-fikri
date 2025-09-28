// ================== STORAGE KEY ==================
const STORAGE = {
  products: 'products',
  storeSettings: 'storeSettings'
};

// ================== STATE ==================
let products = [];
let storeSettings = {
  status: 'open',
  description: '',
  hours: '',
  contact: '',
  address: '',
  map: ''
};
let cart = [];

// ================== DOM ==================
const productsContainer = document.getElementById('products-container');
const storeStatusMsg = document.getElementById('store-status-msg');
const storeContactDiv = document.getElementById('store-contact');
const storeAddressDiv = document.getElementById('store-address');
const storeMapDiv = document.getElementById('store-map');
const filterCategory = document.getElementById('filter-category');
const searchInput = document.getElementById('search-input');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');
const paymentMethod = document.getElementById('payment-method');
const paymentInfo = document.getElementById('payment-info');

// ================== FETCH DATA ==================
async function loadData() {
  try {
    const prodRes = await fetch('/products.json');
    const storeRes = await fetch('/store.json');

    if (prodRes.ok) {
      products = await prodRes.json();
      localStorage.setItem(STORAGE.products, JSON.stringify(products));
    } else {
      products = JSON.parse(localStorage.getItem(STORAGE.products)) || [];
    }

    if (storeRes.ok) {
      storeSettings = await storeRes.json();
      localStorage.setItem(STORAGE.storeSettings, JSON.stringify(storeSettings));
    } else {
      storeSettings = JSON.parse(localStorage.getItem(STORAGE.storeSettings)) || storeSettings;
    }
  } catch (e) {
    console.warn('⚠️ Gagal ambil data server, pakai localStorage', e);
    products = JSON.parse(localStorage.getItem(STORAGE.products)) || [];
    storeSettings = JSON.parse(localStorage.getItem(STORAGE.storeSettings)) || storeSettings;
  }

  renderCategories();
  renderStoreInfo();
  renderProducts();
  renderCart();
}

// ================== RENDER STORE ==================
function renderStoreInfo() {
  if (storeSettings.status === 'closed') {
    storeStatusMsg.textContent = "⚠️ Maaf, toko sedang tutup.";
    storeStatusMsg.className = "store-closed";
    productsContainer.innerHTML = "";
    return;
  }

  storeStatusMsg.textContent = "✅ Toko sedang buka.";
  storeStatusMsg.className = "store-open";

  document.getElementById('store-desc-text').textContent = storeSettings.description || "Belum ada deskripsi toko.";
  document.getElementById('store-desc-img').src = storeSettings.image || "images/deskripsi.jpg";
  document.getElementById('store-hours').textContent = storeSettings.hours 
    ? `Jam Operasional: ${storeSettings.hours}` 
    : "";

  storeContactDiv.textContent = storeSettings.contact ? `Kontak: ${storeSettings.contact}` : "";
  storeAddressDiv.textContent = storeSettings.address ? `Alamat: ${storeSettings.address}` : "";
  storeMapDiv.innerHTML = storeSettings.map || "";
}

// ================== RENDER KATEGORI ==================
function renderCategories() {
  const cats = [...new Set(products.filter(p => p.publish).map(p => p.category))];
  filterCategory.innerHTML = `<option value="">Semua Kategori</option>`;
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    filterCategory.appendChild(opt);
  });
}

// ================== RENDER PRODUK ==================
function renderProducts() {
  if (storeSettings.status === 'closed') return;

  productsContainer.innerHTML = '';
  let searchText = searchInput.value.toLowerCase();
  let selectedCat = filterCategory.value;

  let filtered = products
    .filter(p => p.publish)
    .filter(p => selectedCat ? p.category === selectedCat : true)
    .filter(p => p.name.toLowerCase().includes(searchText));

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Hitung diskon
    let hargaAsli = p.price;
    let hargaDiskon = p.discountPrice && p.discountPrice > 0
      ? Math.round(p.price - (p.price * p.discountPrice / 100))
      : null;

    let diskonQtyInfo = "";
    if (p.discountQty && p.discountQty.min > 0 && p.discountQty.price > 0) {
      diskonQtyInfo = `
        <div class="product-discount-qty">
          Beli ${p.discountQty.min}+ pcs → Rp ${p.discountQty.price} /paket
        </div>`;
    }

    card.innerHTML = `
      <div class="product-image" style="background-image:url('${p.image}')"></div>
      <h3>${p.name}</h3>
      <div class="product-desc">${p.description}</div>
      <div class="product-price">
        ${hargaDiskon
          ? `<span class="price-original">Rp ${hargaAsli}</span> 
             <span class="price-discount">Rp ${hargaDiskon}</span>`
          : `Rp ${hargaAsli}`}
      </div>
      <div class="product-stock">Stok: ${p.stock}</div>
      ${diskonQtyInfo}
      ${p.deliveryFee ? '<div class="delivery-info">+ Rp 1.000 permintaan antar</div>' : ''}
      <button data-id="${p.id}"><i class="fas fa-cart-plus"></i> Tambah</button>
    `;

    productsContainer.appendChild(card);
    card.querySelector('button').addEventListener('click', () => addToCart(p.id));
  });
}

// ================== KERANJANG ==================
// (fungsi addToCart, renderCart, increaseQty, decreaseQty, removeItem, checkout ... tetap lanjut di bawah)

// ================== EVENT ==================
searchInput.addEventListener('input', renderProducts);
filterCategory.addEventListener('change', renderProducts);

// ================== INIT ==================
loadData();
