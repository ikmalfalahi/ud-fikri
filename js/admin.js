// ================== DOM ==================
const saveStoreInfoBtn = document.getElementById("save-store-info");
const saveProductBtn = document.getElementById("save-product");
const productList = document.getElementById("product-list");

// Input toko
const storeDescInput = document.getElementById("store-desc");
const storeHoursInput = document.getElementById("store-hours");
const storeContactInput = document.getElementById("store-contact");
const storeAddressInput = document.getElementById("store-address");
const storeMapInput = document.getElementById("store-map");

// Input produk
const productNameInput = document.getElementById("product-name");
const productCategoryInput = document.getElementById("product-category");
const productPriceInput = document.getElementById("product-price");
const productStockInput = document.getElementById("product-stock");
const productImageInput = document.getElementById("product-image");

let storeSettings = {};
let products = [];

// ================== FETCH DATA ==================
async function loadAdminData() {
  try {
    const res = await fetch("/api/saveData");
    if (res.ok) {
      const data = await res.json();
      storeSettings = data.storeSettings || {};
      products = data.products || [];
      renderStoreForm();
      renderProductList();
    }
  } catch (e) {
    console.error("⚠️ Gagal ambil data admin", e);
  }
}

// ================== SIMPAN DATA KE API ==================
async function saveData() {
  try {
    const res = await fetch("/api/saveData", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeSettings, products }),
    });

    if (res.ok) {
      alert("✅ Data berhasil disimpan!");
    } else {
      alert("⚠️ Gagal menyimpan data!");
    }
  } catch (e) {
    console.error("⚠️ Error POST data", e);
  }
}

// ================== STORE INFO ==================
function renderStoreForm() {
  storeDescInput.value = storeSettings.description || "";
  storeHoursInput.value = storeSettings.hours || "";
  storeContactInput.value = storeSettings.contact || "";
  storeAddressInput.value = storeSettings.address || "";
  storeMapInput.value = storeSettings.map || "";
}

saveStoreInfoBtn.addEventListener("click", () => {
  storeSettings.description = storeDescInput.value;
  storeSettings.hours = storeHoursInput.value;
  storeSettings.contact = storeContactInput.value;
  storeSettings.address = storeAddressInput.value;
  storeSettings.map = storeMapInput.value;
  saveData();
});

// ================== PRODUK ==================
function renderProductList() {
  productList.innerHTML = "";
  products.forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.name} - Rp ${p.price} (Stok: ${p.stock})
      <div>
        <button onclick="editProduct(${i})">Edit</button>
        <button onclick="deleteProduct(${i})">Hapus</button>
      </div>
    `;
    productList.appendChild(li);
  });
}

saveProductBtn.addEventListener("click", () => {
  const newProduct = {
    id: Date.now(),
    name: productNameInput.value,
    category: productCategoryInput.value,
    price: parseInt(productPriceInput.value) || 0,
    stock: parseInt(productStockInput.value) || 0,
    image: productImageInput.value,
    publish: true,
  };

  products.push(newProduct);
  renderProductList();
  saveData();

  productNameInput.value = "";
  productCategoryInput.value = "";
  productPriceInput.value = "";
  productStockInput.value = "";
  productImageInput.value = "";
});

window.editProduct = function (i) {
  const p = products[i];
  productNameInput.value = p.name;
  productCategoryInput.value = p.category;
  productPriceInput.value = p.price;
  productStockInput.value = p.stock;
  productImageInput.value = p.image;

  products.splice(i, 1); // hapus dulu, nanti disimpan ulang
  renderProductList();
};

window.deleteProduct = function (i) {
  if (confirm("Yakin hapus produk ini?")) {
    products.splice(i, 1);
    renderProductList();
    saveData();
  }
};

// ================== INIT ==================
loadAdminData();
