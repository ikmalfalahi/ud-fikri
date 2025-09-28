// ================== Supabase ==================
const SUPABASE_URL = "https://nnohtnywmhuzueamsats.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ================== FETCH DATA LANDING PAGE ==================
async function loadData() {
  const { data: store } = await supabase
    .from("store_settings")
    .select("*")
    .single();

  const { data: prods } = await supabase
    .from("products")
    .select("*");

  if (store) {
    document.getElementById("desc").textContent = store.description;
    document.getElementById("hours").textContent = store.hours;
    document.getElementById("contact").textContent = store.contact;
    document.getElementById("address").textContent = store.address;
    // Map bisa di-render sesuai kebutuhan
  }

  if (prods) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    prods.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${p.name} - Rp ${p.price} (stok: ${p.stock})`;
      productList.appendChild(li);
    });
  }
}

// ================== INIT ==================
loadData();
