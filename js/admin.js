// ================== Supabase ==================
const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
    const { data: store } = await supabase
      .from("store_settings")
      .select("*")
      .single();

    const { data: prods } = await supabase
      .from("products")
      .select("*");

    if (store) storeSettings = store;
    if (prods) products = prods;

    renderStoreForm();
    renderProductList();
  } catch (e) {
    console.error("⚠️ Gagal ambil data admin", e);
  }
}

// ================== SIMPAN DATA KE SUPABASE ==================
async function saveData() {
  try {
    // Simpan info toko (id = 1 supaya hanya 1 baris)
    await supabase
      .from("store_settings")
      .upsert({ id: 1, ...storeSettings }, { onConflict: "id" });

    // Hapus semua produk dulu, lalu insert ulang
    await supabase.from("products").delete().neq("id", 0);
    if (products.length > 0) {
      await supabase.from("products").insert(products);
    }

    alert("✅ Data berhasil disimpan!");
  } catch (e) {
    console.error("⚠️ Error simpan data", e);
    alert("⚠️ Gagal menyimpan data!");
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
