// ================= STORAGE KEY =================
const STORAGE = {
  products: 'products',
  storeSettings: 'storeSettings'
};

let products = [];
let storeSettings = {};
let editIndex = null;

// ================= DOM =================
const storeStatus = document.getElementById('store-status');
const storeDescription = document.getElementById('store-description');
const storeHours = document.getElementById('store-hours');
const storeContact = document.getElementById('store-contact');
const storeAddress = document.getElementById('store-address');
const storeMap = document.getElementById('store-map');
const storeBank = document.getElementById('store-bank');
const storeQris = document.getElementById('store-qris');
const saveStoreInfoBtn = document.getElementById('save-store-info');

const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const productCategory = document.getElementById('product-category');
const newCategory = document.getElementById('new-category');
const addCategoryBtn = document.getElementById('add-category-btn');
const productDesc = document.getElementById('product-description');
const productImage = document.getElementById('product-image');
const productPublish = document.getElementById('product-publish');
const discountPrice = document.getElementById('discount-price');
const discountQtyMin = document.getElementById('discount-qty-min');
const discountQtyPrice = document.getElementById('discount-qty-price');
const addProductBtn = document.getElementById('add-product');
const productList = document.getElementById('product-list');

// ================= API =================
async function saveData() {
  try {
    await fetch('/api/saveData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products,
        storeSettings
      })
    });
  } catch (err) {
    console.error("❌ Gagal simpan ke server", err);
  }
}

async function loadData() {
  try {
    const res = await fetch('/api/saveData');
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
      storeSettings = data.storeSettings || {};
      localStorage.setItem(STORAGE.products, JSON.stringify(products));
      localStorage.setItem(STORAGE.storeSettings, JSON.stringify(storeSettings));
    }
  } catch (err) {
    console.warn("⚠️ Gagal ambil data dari server, fallback localStorage");
    products = JSON.parse(localStorage.getItem(STORAGE.products)) || [];
    storeSettings = JSON.parse(localStorage.getItem(STORAGE.storeSettings)) || {};
  }

  renderStoreSettings();
  renderProducts();
  renderCategories();
}

// ================= STORE =================
function renderStoreSettings() {
  storeStatus.value = storeSettings.status || 'open';
  storeDescription.value = storeSettings.description || '';
  storeHours.value = storeSettings.hours || '';
  storeContact.value = storeSettings.contact || '';
  storeAddress.value = storeSettings.address || '';
  storeMap.value = storeSettings.map || '';
  storeBank.value = storeSettings.bankAccount || '';
  storeQris.value = storeSettings.qrisImage || '';
}

saveStoreInfoBtn.addEventListener('click', async () => {
  storeSettings = {
    status: storeStatus.value,
    description: storeDescription.value,
    hours: storeHours.value,
    contact: storeContact.value,
    address: storeAddress.value,
    map: storeMap.value,
    bankAccount: storeBank.value,
    qrisImage: storeQris.value
  };

  localStorage.setItem(STORAGE.storeSettings, JSON.stringify(storeSettings));

  await saveData();
  alert('✅ Info toko berhasil disimpan!');
});

// ================= PRODUCT =================
function renderCategories() {
  productCategory.innerHTML = '<option value="">Pilih Kategori</option>';
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  categories.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    productCategory.appendChild(opt);
  });
}

addCategoryBtn.addEventListener('click', () => {
  const cat = newCategory.value.trim();
  if (cat) {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    productCategory.appendChild(opt);
    productCategory.value = cat;
    newCategory.value = '';
  }
});

function renderProducts() {
  productList.innerHTML = '';
  products.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <strong>${p.name}</strong> - Rp ${p.price} | Stok: ${p.stock} | Kategori: ${p.category || '-'}
        ${p.publish ? '<span style="color:green">[Publish]</span>' : '<span style="color:red">[Draft]</span>'}
        <br>Diskon: ${p.discountPrice || 0}% 
        | Paket: ${p.discountQty?.min || '-'} → Rp ${p.discountQty?.price || '-'}
      </div>
      <div>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Hapus</button>
      </div>
    `;
    productList.appendChild(li);
  });
}

addProductBtn.addEventListener('click', async () => {
  const imgFile = productImage.value.trim();
  const product = {
    id: editIndex !== null ? products[editIndex].id : Date.now().toString(),
    name: productName.value,
    price: parseInt(productPrice.value) || 0,
    stock: parseInt(productStock.value) || 0,
    category: productCategory.value,
    description: productDesc.value,
    image: imgFile ? "images/" + imgFile : "",
    publish: productPublish.checked,
    discountPrice: parseInt(discountPrice.value) || 0,
    discountQty: {
      min: parseInt(discountQtyMin.value) || 0,
      price: parseInt(discountQtyPrice.value) || 0
    }
  };

  if (editIndex !== null) {
    products[editIndex] = product;
    editIndex = null;
  } else {
    products.push(product);
  }

  localStorage.setItem(STORAGE.products, JSON.stringify(products));
  await saveData();

  renderProducts();
  renderCategories();

  // reset form
  productName.value = '';
  productPrice.value = '';
  productStock.value = '';
  productCategory.value = '';
  productDesc.value = '';
  productImage.value = '';
  productPublish.checked = false;
  discountPrice.value = '';
  discountQtyMin.value = '';
  discountQtyPrice.value = '';
});

function editProduct(index) {
  const p = products[index];
  productName.value = p.name;
  productPrice.value = p.price;
  productStock.value = p.stock;
  productCategory.value = p.category;
  productDesc.value = p.description;
  productImage.value = p.image.replace("images/", "");
  productPublish.checked = p.publish;
  discountPrice.value = p.discountPrice || '';
  discountQtyMin.value = p.discountQty?.min || '';
  discountQtyPrice.value = p.discountQty?.price || '';
  editIndex = index;
}

async function deleteProduct(index) {
  if (confirm('Hapus produk ini?')) {
    products.splice(index, 1);
    localStorage.setItem(STORAGE.products, JSON.stringify(products));
    await saveData();
    renderProducts();
    renderCategories();
  }
}

// ================= INIT =================
loadData();
