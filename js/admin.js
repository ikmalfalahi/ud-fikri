<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // ================== SUPABASE ==================
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
      let { data: storeData } = await supabase.from("store_settings").select("*").single();
      let { data: productData } = await supabase.from("products").select("*");

      storeSettings = storeData || {};
      products = productData || [];
      renderStoreForm();
      renderProductList();
    } catch (e) {
      console.error("⚠️ Gagal ambil data admin", e);
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

  saveStoreInfoBtn.addEventListener("click", async () => {
    storeSettings = {
      description: storeDescInput.value,
      hours: storeHoursInput.value,
      contact: storeContactInput.value,
      address: storeAddressInput.value,
      map: storeMapInput.value,
    };

    await supabase.from("store_settings").upsert([storeSettings]);
    alert("✅ Info toko berhasil disimpan!");
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

  saveProductBtn.addEventListener("click", async () => {
    const newProduct = {
      name: productNameInput.value,
      category: productCategoryInput.value,
      price: parseInt(productPriceInput.value) || 0,
      stock: parseInt(productStockInput.value) || 0,
      image: productImageInput.value,
      publish: true,
    };

    let { data, error } = await supabase.from("products").insert([newProduct]);
    if (!error) {
      products.push(data[0]);
      renderProductList();
      alert("✅ Produk berhasil ditambahkan!");
    }

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

    // hapus dari DB & array, nanti disave ulang
    deleteProduct(p.id);
  };

  async function deleteProduct(id) {
    await supabase.from("products").delete().eq("id", id);
    products = products.filter(p => p.id !== id);
    renderProductList();
  }

  window.deleteProduct = function (i) {
    if (confirm("Yakin hapus produk ini?")) {
      deleteProduct(products[i].id);
    }
  };

  // ================== INIT ==================
  loadAdminData();
</script>
