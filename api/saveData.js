async function loadAdminData() {
  try {
    // ambil storeSettings (hanya 1 record)
    let { data: storeData, error: storeError } = await supabase
      .from("store_settings")
      .select("*")
      .single();

    if (storeData) storeSettings = storeData;

    // ambil products
    let { data: productData, error: prodError } = await supabase
      .from("products")
      .select("*");

    if (productData) products = productData;

    renderStoreForm();
    renderProductList();
  } catch (e) {
    console.error("⚠️ Gagal ambil data dari Supabase", e);
  }
}
