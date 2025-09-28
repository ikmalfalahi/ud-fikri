const STORAGE = { 
  products: 'products', 
  storeSettings: 'storeSettings' 
};

let products = JSON.parse(localStorage.getItem(STORAGE.products)) || [];
let storeSettings = JSON.parse(localStorage.getItem(STORAGE.storeSettings)) || {
  status: 'open',
  description: '',
  contact: '',
  address: '',
  map: ''
};

let discount = JSON.parse(localStorage.getItem('discount')) || {price:0, qty:0};

let cart = [];

const productsContainer = document.getElementById('products-container');
const storeStatusMsg = document.getElementById('store-status-msg');
const storeDescDiv = document.getElementById('store-description');
const storeContactDiv = document.getElementById('store-contact');
const storeAddressDiv = document.getElementById('store-address');
const storeMapDiv = document.getElementById('store-map');
const filterCategory = document.getElementById('filter-category');
const searchInput = document.getElementById('search-input');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout');
const paymentMethod = document.getElementById('payment-method');
const paymentInfo = document.getElementById('payment-info');

// Render info toko
function renderStoreInfo() {
  if (storeSettings.status === 'closed') {
    storeStatusMsg.textContent = "⚠️ Maaf, toko sedang tutup.";
    storeStatusMsg.className = "store-closed";
    productsContainer.innerHTML = "";
  } else {
    storeStatusMsg.textContent = "✅ Toko sedang buka.";
    storeStatusMsg.className = "store-open";
    renderProducts();
  }

  // auto render deskripsi
  document.getElementById('store-desc-text').textContent = storeSettings.description || "Belum ada deskripsi toko.";
  document.getElementById('store-desc-img').src = storeSettings.image || "images/deskripsi.jpg";
  document.getElementById('store-hours').textContent = storeSettings.hours 
  ? `Jam Operasional: ${storeSettings.hours}` 
  : "";

  storeContactDiv.textContent = storeSettings.contact ? `Kontak Opsional WhatsApp: ${storeSettings.contact}` : "";
  storeAddressDiv.textContent = storeSettings.address ? `Alamat Toko: ${storeSettings.address}` : "";
  storeMapDiv.innerHTML = storeSettings.map ? storeSettings.map : "";
}

function renderCategories(){
    const cats = [...new Set(products.filter(p=>p.publish).map(p=>p.category))];
    filterCategory.innerHTML = `<option value="">Semua Kategori</option>`;
    cats.forEach(c=>{
        const opt = document.createElement('option');
        opt.value=c; opt.textContent=c;
        filterCategory.appendChild(opt);
    });
}

function renderProducts() {
    if (storeSettings.status === 'closed') return;
    productsContainer.innerHTML = '';
    let searchText = searchInput.value.toLowerCase();
    let selectedCat = filterCategory.value;
    let filtered = products.filter(p => p.publish)
        .filter(p => selectedCat ? p.category === selectedCat : true)
        .filter(p => p.name.toLowerCase().includes(searchText));

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // --- Hitung harga diskon ---
        let hargaAsli = p.price;
        let hargaDiskon = p.discountPrice && p.discountPrice > 0
            ? Math.round(p.price - (p.price * p.discountPrice / 100))
            : null;

        // --- Info diskon quantity ---
        let diskonQtyInfo = "";
        if (p.discountQty && p.discountQty.min > 0 && p.discountQty.price > 0) {
            diskonQtyInfo = `
                <div class="product-discount-qty">
                    Beli ${p.discountQty.min}+ pcs → Rp ${p.discountQty.price} /paket
                </div>`;
        }

        card.innerHTML = `
            <div class="product-image" style="background-image:url('${p.image}')"></div>
            <h3>${p.name}</h3>
            <div class="product-desc">${p.description}</div>
            <div class="product-price">
                ${hargaDiskon
                    ? `<span class="price-original">Rp ${hargaAsli}</span> 
                       <span class="price-discount">Rp ${hargaDiskon}</span>`
                    : `Rp ${hargaAsli}`}
            </div>
            <div class="product-stock">Stok: ${p.stock}</div>
            ${diskonQtyInfo}
            ${p.deliveryFee ? '<div class="delivery-info">+ Rp 1.000 permintaan antar</div>' : ''}
            <button data-id="${p.id}"><i class="fas fa-cart-plus"></i> Tambah</button>
        `;

        productsContainer.appendChild(card);
        card.querySelector('button').addEventListener('click', () => addToCart(p.id));
    });
}

function addToCart(id){
    const prod = products.find(p=>p.id===id);
    if(prod.stock < 1) return alert('Stok habis!');

    let item = cart.find(c=>c.id===id);
    if(item){
        item.qty++;
        prod.stock--;
    } else {
        cart.push({
            id: prod.id,
            name: prod.name,
            price: prod.price, // harga asli
            discountPrice: prod.discountPrice || 0, // persen
            discountQty: prod.discountQty || {min:0, price:0}, // {min, price}
            qty: 1,
            deliveryFeeSelected: false
        });
        prod.stock--;
    }

    localStorage.setItem(STORAGE.products, JSON.stringify(products));
    renderProducts();
    renderCart();
}

function hitungSubtotal(item){
    let subtotal = 0;

    // Kalau ada diskon quantity
    if(item.discountQty && item.discountQty.min > 0 && item.qty >= item.discountQty.min){
        const paket = Math.floor(item.qty / item.discountQty.min);
        const sisa = item.qty % item.discountQty.min;

        subtotal = paket * item.discountQty.price + sisa * item.price;
    }
    // Kalau ada diskon persen
    else if(item.discountPrice && item.discountPrice > 0){
        const hargaDiskon = Math.round(item.price - (item.price * item.discountPrice / 100));
        subtotal = hargaDiskon * item.qty;
    }
    // Harga normal
    else {
        subtotal = item.price * item.qty;
    }

    // Tambah biaya antar kalau dipilih
    if(item.deliveryFeeSelected){
        subtotal += 1000 * item.qty;
    }

    return subtotal;
}

function renderCart(){
    cartItems.innerHTML = '';

    cart.forEach(i=>{
        const subtotal = hitungSubtotal(i);

        const li=document.createElement('li');
        li.innerHTML=`
            ${i.name} x${i.qty} - Rp ${subtotal}
            <div class="cart-item-controls">
                <button class="minus" data-id="${i.id}">-</button>
                <button class="plus" data-id="${i.id}">+</button>
                <button class="remove" data-id="${i.id}">Hapus</button>
                <label>
                    <input type="checkbox" class="delivery-checkbox" data-id="${i.id}" ${i.deliveryFeeSelected?'checked':''}>
                    Permintaan Antar Rp 1.000
                </label>
            </div>
        `;
        cartItems.appendChild(li);
    });

    let total = cart.reduce((a,i)=>a + hitungSubtotal(i), 0);
    cartTotal.textContent = `Total: Rp ${total}`;

    // Event listener
    document.querySelectorAll('.plus').forEach(btn=>btn.addEventListener('click',()=>increaseQty(btn.dataset.id)));
    document.querySelectorAll('.minus').forEach(btn=>btn.addEventListener('click',()=>decreaseQty(btn.dataset.id)));
    document.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click',()=>removeItem(btn.dataset.id)));
    document.querySelectorAll('.delivery-checkbox').forEach(cb=>{
        cb.addEventListener('change',()=>{
            const item = cart.find(c=>c.id===cb.dataset.id);
            item.deliveryFeeSelected = cb.checked;
            renderCart();
        });
    });
}

function increaseQty(id){
    const prod = products.find(p=>p.id===id);
    const item = cart.find(c=>c.id===id);
    if(prod.stock<1) return alert('Stok habis!');
    item.qty++; prod.stock--;
    localStorage.setItem(STORAGE.products,JSON.stringify(products));
    renderProducts(); renderCart();
}
function decreaseQty(id){
    const prod = products.find(p=>p.id===id);
    const item = cart.find(c=>c.id===id);
    item.qty--; prod.stock++;
    if(item.qty===0) cart = cart.filter(c=>c.id!==id);
    localStorage.setItem(STORAGE.products,JSON.stringify(products));
    renderProducts(); renderCart();
}
function removeItem(id){
    const item = cart.find(c=>c.id===id);
    const prod = products.find(c=>c.id===id);
    prod.stock+=item.qty;
    cart = cart.filter(c=>c.id!==id);
    localStorage.setItem(STORAGE.products,JSON.stringify(products));
    renderProducts(); renderCart();
}

checkoutBtn.addEventListener('click',()=>{
    if(cart.length===0) return alert('Keranjang kosong!');

    const customerName = document.getElementById('customer-name').value.trim();
    const customerAddress = document.getElementById('customer-address').value.trim();

    if(!customerName) return alert('Masukkan nama pemesan dulu!');
    if(!customerAddress) return alert('Masukkan alamat (jalan/nomor rumah) dulu!');

    let total = cart.reduce((a,b)=>a + (b.price*b.qty+(b.deliveryFeeSelected?1000*b.qty:0)),0);
    let payment = paymentMethod.value;

    let message = `Hello UD Fikri ini pesanan saya:%0A`;
    message += `Nama Pemesan: ${customerName}%0A`;
    message += `Alamat: ${customerAddress}%0A%0A`;

    cart.forEach(i=>{
        const subtotal = i.price*i.qty + (i.deliveryFeeSelected?1000*i.qty:0);
        message += `${i.name} x${i.qty} - Rp ${subtotal}${i.deliveryFeeSelected?'+ Rp 1.000 (antar)':''}%0A`;
    });
    
    message += `%0ATotal: Rp ${total}%0A`;
    message += `Metode pembayaran: ${payment}%0A`;

    if(payment==='transfer' && storeSettings.bankAccount){
        message += `Nomor Rekening: ${storeSettings.bankAccount}`;
    }
    if(payment==='qris'){
        message += `QRIS: Silakan scan QR code yang tersedia.`;
    }
    if(payment==='tunai'){
        message += `Bayar tunai saat diantar.`;
    }

    let phone = storeSettings.contact || '628123456789'; // default WA
    window.open(`https://wa.me/${+6281287505090}?text=${message}`,'_blank');
});

paymentMethod.addEventListener('change',()=>{
    const val = paymentMethod.value;
    if(val==='transfer' && storeSettings.bankAccount){
        paymentInfo.textContent = `Nomor Rekening: ${storeSettings.bankAccount}`;
    } 
    else if(val==='qris' && storeSettings.qrisImage){
        paymentInfo.innerHTML = `
          <p>Scan QRIS di bawah:</p>
          <img src="images/${storeSettings.qrisImage}" alt="QRIS" style="max-width:200px;">
        `;
    } 
    else if(val==='tunai'){
        paymentInfo.textContent = 'Bayar tunai saat diantar';
    } 
    else {
        paymentInfo.textContent = '';
    }
});


searchInput.addEventListener('input',renderProducts);
filterCategory.addEventListener('change',renderProducts);

renderCategories(); renderStoreInfo(); renderCart();
