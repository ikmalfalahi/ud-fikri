async function loadData() {
  try {
    const res = await fetch('/api/saveData');
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
      storeSettings = data.storeSettings || {};
    }
  } catch (e) {
    console.warn("⚠️ Gagal ambil data.json", e);
  }
  renderProducts();
  renderCategories();
  renderStoreSettings();
}

async function saveData() {
  const data = { products, storeSettings };
  await fetch('/api/saveData', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

// --- ketika simpan store info
saveStoreInfoBtn.addEventListener("click", async () => {
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
  await saveData();
  alert("✅ Info toko berhasil disimpan!");
});

// --- ketika tambah produk
addProductBtn.addEventListener("click", async () => {
  const product = {
    id: editIndex !== null ? products[editIndex].id : Date.now().toString(),
    name: productName.value,
    price: parseInt(productPrice.value) || 0,
    stock: parseInt(productStock.value) || 0,
    category: productCategory.value,
    description: productDesc.value,
    image: productImage.value ? "images/" + productImage.value : "",
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

  await saveData();
  renderProducts();
  renderCategories();

  // reset form
  productName.value = "";
  productPrice.value = "";
  productStock.value = "";
  productCategory.value = "";
  productDesc.value = "";
  productImage.value = "";
  productPublish.checked = false;
  discountPrice.value = "";
  discountQtyMin.value = "";
  discountQtyPrice.value = "";
});

// --- hapus produk
async function deleteProduct(index) {
  if (confirm("Hapus produk ini?")) {
    products.splice(index, 1);
    await saveData();
    renderProducts();
    renderCategories();
  }
}

// init
loadData();
