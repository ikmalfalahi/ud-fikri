async function loadData() {
  try {
    const res = await fetch('/data.json');
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
      storeSettings = data.storeSettings || {};
    }
  } catch (e) {
    console.warn("⚠️ Gagal ambil data.json", e);
  }

  renderCategories();
  renderStoreInfo();
  renderProducts();
  renderCart();
}
