<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  let storeSettings = {};
  let products = [];
  let cart = [];

  async function loadData() {
    let { data: productData } = await supabase.from("products").select("*").eq("publish", true);
    let { data: storeData } = await supabase.from("store_settings").select("*").single();

    products = productData || [];
    storeSettings = storeData || {};

    renderCategories();
    renderStoreInfo();
    renderProducts();
    renderCart();
  }

  function renderCategories() {
    // sama seperti sebelumnya
  }

  function renderStoreInfo() {
    document.getElementById("store-desc").textContent = storeSettings.description || "";
    document.getElementById("store-hours").textContent = storeSettings.hours || "";
    document.getElementById("store-contact").textContent = storeSettings.contact || "";
    document.getElementById("store-address").textContent = storeSettings.address || "";
    document.getElementById("store-map").innerHTML = storeSettings.map || "";
  }

  function renderProducts() {
    // sama seperti sebelumnya
  }

  function renderCart() {
    // sama seperti sebelumnya
  }

  loadData();
</script>
