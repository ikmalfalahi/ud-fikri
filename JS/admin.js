const STORAGE = {
  products: 'products',
  storeSettings: 'storeSettings'
};

let products = JSON.parse(localStorage.getItem(STORAGE.products)) || [];
let storeSettings = JSON.parse(localStorage.getItem(STORAGE.storeSettings)) || {
  status: 'open',
  description: '',
  hours: '',
  contact: '',
  address: '',
  map: ''
};

let editIndex = null;

// ================= DOM ==================
const storeStatus = document.getElementById('store-status');
const storeDescription = document.getElementById('store-description');
const storeHours = document.getElementById('store-hours');
const storeContact = document.getElementById('store-contact');
const storeAddress = document.getElementById('store-address');
const storeMap = document.getElementById('store-map');
const saveStoreInfoBtn = document.getElementById('save-store-info');

const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productStock = document.getElementById('product-stock');
const productCategory = document.getElementById('product-category');
const newCategory = document.getElementById('new-category');
const addCategoryBtn = document.getElementById('add-category-btn');
const productDesc = document.getElementById('product-description'); // ✅ diperbaiki
const productImage = document.getElementById('product-image');
const productPublish = document.getElementById('product-publish');
const discountPrice = document.getElementById('discount-price');
const discountQtyMin = document.getElementById('discount-qty-min');
const discountQtyPrice = document.getElementById('discount-qty-price');
const addProductBtn = document.getElementById('add-product'); // ✅ ganti
const productList = document.getElementById('product-list');

const storeBank = document.getElementById('store-bank');
const storeQris = document.getElementById('store-qris');

// ================= STORE ==================
function renderStoreSettings() {
  storeStatus.value = storeSettings.status;
  storeDescription.value = storeSettings.description;
  storeHours.value = storeSettings.hours || '';
  storeContact.value = storeSettings.contact;
  storeAddress.value = storeSettings.address;
  storeMap.value = storeSettings.map;
  storeBank.value = storeSettings.bankAccount || '';
  storeQris.value = storeSettings.qrisImage || '';
}

saveStoreInfoBtn.addEventListener('click', () => {
  storeSettings.status = storeStatus.value;
  storeSettings.description = storeDescription.value;
  storeSettings.hours = storeHours.value;
  storeSettings.contact = storeContact.value;
  storeSettings.address = storeAddress.value;
  storeSettings.map = storeMap.value;
  storeSettings.bankAccount = storeBank.value;
  storeSettings.qrisImage = storeQris.value;

  localStorage.setItem(STORAGE.storeSettings, JSON.stringify(storeSettings));
  alert('Info toko berhasil disimpan!');
});

// ================= PRODUCT ==================
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
      <strong>${p.name}</strong> - Rp ${p.price} | Stok: ${p.stock} | Kategori: ${p.category || '-'}
      ${p.publish ? '<span style="color:green">[Publish]</span>' : '<span style="color:red">[Draft]</span>'}
      <br>Diskon Harga: ${p.discountPrice || 0}% 
      | Paket: ${p.discountQty?.min || '-'} → Rp ${p.discountQty?.price || '-'}
      <div>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Hapus</button>
      </div>
    `;
    productList.appendChild(li);
  });
}

addProductBtn.addEventListener('click', () => {  // ✅ ganti submit jadi click
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
  renderProducts();
  renderCategories();

  // reset manual
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

function deleteProduct(index) {
  if (confirm('Hapus produk ini?')) {
    products.splice(index, 1);
    localStorage.setItem(STORAGE.products, JSON.stringify(products));
    renderProducts();
    renderCategories();
  }
}

// Init
renderStoreSettings();
renderProducts();
renderCategories();
