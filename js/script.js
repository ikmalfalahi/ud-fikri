document.addEventListener("DOMContentLoaded", () => {
  let storeOpen = false; // default

 // ================= SUPABASE =================
const supabase = window.supabaseClient;

// === FETCH STATUS TOKO dari Supabase ===
async function fetchStoreStatus() {
  const { data, error } = await supabase
    .from("store_status")
    .select("is_open")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Gagal ambil status toko:", error);
    return;
  }

  if (data) {
    storeOpen = data.is_open;
    updateStoreStatus();
  } else {
    console.warn("Row dengan id=1 tidak ditemukan.");
  }
}

// cek pertama kali
fetchStoreStatus();

// subscribe realtime
supabase
  .channel("status-channel")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "store_status" },
    payload => {
      console.log("Status toko berubah:", payload.new);
      storeOpen = payload.new.is_open;
      updateStoreStatus();
    }
  )
  .subscribe();

  // === UPDATE STATUS TOKO DI UI ===
function updateStoreStatus() {
const statusEl = document.getElementById("store-status-msg");
const productsContainer = document.getElementById("products-container");

if (storeOpen) {
  statusEl.innerHTML = `
    <i class="fas fa-check-circle"></i> 
    <span><strong>Toko Sedang Buka</strong>. <br>Silakan belanja 😊</span>
  `;
  statusEl.className = "store-open";
  productsContainer.style.display = "grid";
} else {
  statusEl.innerHTML = `
    <i class="fas fa-exclamation-triangle"></i> 
    <span><strong>Toko Tutup</strong>.<br>Silahkan kembali lagi nanti 🙏</span>
  `;
  statusEl.className = "store-closed";
  productsContainer.style.display = "none";
}
}

  // === DAFTAR PRODUK ===
  const products = [
{
  name: "Gas Elpiji 3kg",
  price: 22000,
  img: "images/gas-3kg.jpg",
  category: "GAS ELPIJI",
  tambahanBiaya: true,
  deskripsi: `
  🔥 Gas Elpiji 3 Kg resmi Pertamina asli - aman & berkualitas.
  Jaminan Kualitas:
  ✔ Segel resmi Pertamina utuh  
  ✔ Berat & tekanan gas sesuai standar  
  ✔ Tidak diisi ulang ilegal  
  ✔ Tabung lolos pengecekan keamanan
  `
},
{ 
  name: "Gas Elpiji 12kg", 
  price: 220000, 
  img: "images/gas-12kg.jpg", 
  category: "GAS ELPIJI", 
  tambahanBiaya: true, 
  deskripsi: `
  🔥 Gas Elpiji 12 Kg resmi pertamina asli, segel resmi, dan tanpa pengurangan isi.
  Jaminan Kualitas:
  ✔ Segel asli Pertamina masih utuh
  ✔ Bukan isi ulang ilegal
  ✔ Berat sesuai standar 12 Kg
  ✔ Tekanan gas stabil dan optimal
  ✔ Tabung sudah lulus uji keamanan
  `
},
{ 
  name: "Aqua Galon", 
  price: 22000, 
  img: "images/aqua-galon.jpg", 
  category: "AQUA", 
  tambahanBiaya: true,
  deskripsi: `
  💧 AQUA Galon Asli – Segar, Bersih, dan Terpercaya!
  Di luar sana banyak beredar galon yang diisi ulang manual tanpa standar kebersihan. 
  Tapi di sini, Anda mendapatkan AQUA yang langsung dari pabrik, dengan kualitas air pegunungan yang terjaga.
  Jaminan Kualitas:
  ✔ Segel resmi AQUA masih utuh
  ✔ Bukan galon isi ulang atau oplosan
  ✔ Rasa tetap segar, murni, dan standar pabrik
  ✔ Galon higienis dan terawat
  `
},
{ 
  name: "Aqua 600ml", 
  price: 52000, 
  img: "images/aqua-600ml.jpg", 
  category: "AQUA", 
  tambahanBiaya: true, 
  deskripsi: `
  💧 AQUA 600 ml Original – Segar, Murni, dan Terpercaya!
  AQUA 600 ml yang kami jual 100% asli pabrik, dengan segel utuh, label resmi, dan bukan air isi ulang atau repacking.
  Jadi Anda tidak perlu khawatir soal kualitas atau kebersihan.
  Jaminan Keaslian & Kebersihan:
  ✔ Botol original AQUA, bukan tiruan
  ✔ Segel tutup rapat dan tidak pernah dibuka
  ✔ Air murni dari sumber pegunungan
  ✔ Standar pabrik terjaga — aman dan higienis
  ✔ 1 Karton isi 24 Botol
  `
},
{ 
  name: "Aqua 330ml",
  price: 42000, 
  img: "images/aqua-330ml.jpg", 
  category: "AQUA", 
  tambahanBiaya: true,
  deskripsi: `
  💧 AQUA 330 ml Original – Segar, Murni, dan Terpercaya!
  AQUA 330 ml yang kami jual 100% asli pabrik, dengan segel utuh, label resmi, dan bukan air isi ulang atau repacking.
  Jadi Anda tidak perlu khawatir soal kualitas atau kebersihan.
  Jaminan Keaslian & Kebersihan:
  ✔ Botol original AQUA, bukan tiruan
  ✔ Segel tutup rapat dan tidak pernah dibuka
  ✔ Air murni dari sumber pegunungan
  ✔ Standar pabrik terjaga — aman dan higienis
  ✔ 1 Karton isi 24 Botol
  `
},
{ 
  name: "Aqua Cube", 
  price: 40000, 
  img: "images/aqua-cube.jpg", 
  category: "AQUA", 
  tambahanBiaya: true,
  deskripsi: `
  💧 AQUA Cube Original – Praktis, Segar, dan Higienis!
  Produk ini 100% original dari AQUA, dengan segel utuh, kemasan Food Grade, dan bukan repacking atau isi ulang
  Jaminan Keaslian & Kualitas:
  ✔ Segel pabrik masih utuh
  ✔ Bukan isi ulang atau kemasan ulang
  ✔ Air murni dari sumber pegunungan AQUA
  ✔ Dijamin aman, higienis, dan fresh
  ✔ 1 Karton isi 24 Botol
    `
  },
  { 
    name: "Aqua Gelas", 
    price: 35000, 
    img: "images/aqua-gelas.jpg", 
    category: "AQUA", 
    tambahanBiaya: true,
    deskripsi: `
    💧 AQUA Gelas Original – Segar, Higienis, dan Terpercaya!
    AQUA Gelas adalah pilihan terbaik untuk kebutuhan minuman praktis di rumah, kantor, sekolah, acara, hingga usaha kuliner.
    Produk yang kami jual 100% asli pabrik, dengan segel plastik utuh dan bukan isi ulang atau kemasan ulang.
    Jaminan Keaslian Produk:
    ✔ Segel plastik pabrik masih utuh
    ✔ Tidak pernah dibuka atau dipindah isi
    ✔ Logo dan label asli AQUA
    ✔ Diproduksi dengan standar kualitas nasional & internasional
    ✔ 1 Karton isi 48 Cup/Gelas
    `
  },
    { 
    name: "Aqua 1,5 Liter", 
    price: 55000, 
    img: "images/aqua-1,5ltr.jpg", 
    category: "AQUA", 
    tambahanBiaya: true,
    deskripsi: `
    💧 AQUA Gelas Original – Segar, Higienis, dan Terpercaya!
    AQUA Gelas adalah pilihan terbaik untuk kebutuhan minuman praktis di rumah, kantor, sekolah, acara, hingga usaha kuliner.
    Produk yang kami jual 100% asli pabrik, dengan segel plastik utuh dan bukan isi ulang atau kemasan ulang.
    Jaminan Keaslian Produk:
    ✔ Segel plastik pabrik masih utuh
    ✔ Tidak pernah dibuka atau dipindah isi
    ✔ Logo dan label asli AQUA
    ✔ Diproduksi dengan standar kualitas nasional & internasional
    ✔ 1 Karton isi 12 Botol
    `
  },
  { 
    name: "leMineral Galon", 
    price: 20000, 
    img: "images/lemineral-galon.jpg", 
    category: "LEMINERAL", 
    tambahanBiaya: true,
    deskripsi: `
    💧 Le Minerale – Air Mineral dari Mayora Group
    Air mineral Le Minerale berasal dari sumber mata air pegunungan yang kaya mineral alami.
    Untuk menjaga kualitasnya, Le Minerale menggunakan kemasan segel khusus yang melindungi kesegaran dan kandungan mineral tetap utuh sampai ke tangan konsumen.
    Kenapa Le Minerale?
    ✔ Sumber air pegunungan asli
    ✔ Mengandung mineral alami penting
    ✔ Rasa lebih segar dan tidak hambar
    ✔ Dikemas menggunakan teknologi modern
    ✔ Diproduksi oleh perusahaan besar dan terpercaya
    `
  },
  { 
    name: "leMineral 330ml", 
    price: 42000, 
    img: "images/lemineral-330ml.jpg", 
    category: "LEMINERAL", 
    tambahanBiaya: true,
    deskripsi: `
    💧 Le Minerale 330 ml Original – Segar, Praktis, dan Kaya Mineral Alami!
    Setiap botol Le Minerale 330 ml yang kami jual 100% original, Dibuat oleh PT Tirta Fresindo Jaya (Mayora Group).
    Segel pabrik masih utuh, dan bukan isi ulang atau repacking.
    sehingga kualitas rasa dan mineralnya tetap terjaga.
    aminan Keaslian Produk:
    ✔ Botol original Le Minerale, bukan tiruan
    ✔ Tutup segel pabrik masih rapat
    ✔ Tidak pernah dibuka atau diisi ulang
    ✔ Diproduksi dengan standar higienis modern
    ✔ 1 Karton isi 24 Botol
    `
  },
    { 
    name: "leMineral 600ml", 
    price: 52000, 
    img: "images/lemineral-600ml.jpg", 
    category: "LEMINERAL", 
    tambahanBiaya: true,
    deskripsi: `
    💧 Le Minerale 600 ml – Segar, Murni, dan Kaya Mineral Alami!
    Dibuat oleh PT Tirta Fresindo Jaya (Mayora Group), Le Minerale berasal dari sumber mata air pegunungan yang mengandung mineral alami penting bagi tubuh.
    Produk ini 100% asli, segel botol masih utuh, dan bukan isi ulang, sehingga rasa, kebersihan, dan kandungan mineralnya tetap terjaga.
    Jaminan Keaslian & Kebersihan:
    ✔ Segel tutup rapat dan original
    ✔ Botol bukan repacking atau isi ulang
    ✔ Diproduksi dengan standar higienis modern
    ✔ Kualitas terkontrol langsung dari pabrik
    ✔ 1 Karton isi 24 Botol
    `
  },
  { 
    name: "Beras 14 Petruk", 
    price: 14000, 
    img: "images/beras-14.jpg", 
    category: "BERAS", 
    tambahanBiaya: true,
    deskripsi:`
    🌾 Beras Petruk Premium — Pulen, Wangi, dan Berkualitas Tinggi!
    Beras Petruk dikenal sebagai salah satu beras terbaik pilihan keluarga Indonesia.
    Beras Petruk yang kami jual 100% murni, bukan oplosan, dan bukan dicampur beras lain.
    Jaminan Kualitas Produk:
    ✔ Bersih dan sudah diseleksi
    ✔ Bukan beras oplosan atau campuran
    ✔ Tidak mengandung bahan pengawet atau pemutih
    ✔ Hasil nasi pulen, lembut, dan wangi
    `
  },
  { 
    name: "Beras 13 Cap Kelapa 3", 
    price: 13000, 
    img: "images/beras-13.jpg", 
    category: "BERAS", 
    tambahanBiaya: true,
    deskripsi: `
    🌾 Beras Cap 3 Kelapa Solo – Pulen, Bersih, dan Rasa Lebih Nikmat!
    Beras Cap 3 Kelapa Solo dikenal sebagai beras pilihan keluarga yang memiliki kualitas premium dengan rasa yang khas.
    Produk yang kami jual 100% asli, fresh dari karung asli pabrik, dan bukan oplosan atau campuran jenis beras lain.
    Jaminan Kualitas & Keaslian:
    ✔ Beras murni Cap 3 Kelapa Solo
    ✔ Bukan beras oplosan atau dicampur
    ✔ Bersih, alami tanpa pengawet & pemutih
    ✔ Hasil nasi pulen, fluffy, dan konsisten
    `
  },
  { 
    name: "Beras 12 Batik Solo", 
    price: 12000, 
    img: "images/beras-12.jpg", 
    category: "BERAS", 
    tambahanBiaya: true,
    deskripsi: `
    🌾 Beras Batik Solo – Pulen, Bersih, dan Kualitas Premium Untuk Keluarga!
    Beras Batik Solo adalah pilihan tepat bagi Anda yang menginginkan nasi dengan kualitas terbaik.
    Produk ini 100% asli, bukan oplosan, dan diproses dengan standar kebersihan tinggi, sehingga kualitas beras tetap terjaga mulai dari petani.
    Jaminan Kualitas & Keaslian:
    ✔ Beras murni Batik Solo, bukan campuran
    ✔ Bersih, tanpa batu & kotoran
    ✔ Tidak memakai pemutih, pewangi, atau bahan kimia
    ✔ Dipilih dari butiran beras premium
    `
  },
    { 
    name: "Tepung Terigu (Lencana Merah)", 
    price: 10000, 
    img: "images/tepung-terigu.jpg", 
    category: "TEPUNG", 
    tambahanBiaya: true,
    deskripsi: `
    🌾 Tepung Terigu Lencana Merah – Hasil Adonan Lebih Lembut & Mengembang Sempurna!
    Tepung Terigu Lencana Merah dari Bogasari adalah pilihan tepat untuk kebutuhan dapur dan usaha Anda.
    Terbuat dari gandum pilihan berkualitas tinggi, tepung ini menghasilkan adonan yang lembut, elastis, dan mudah diolah untuk berbagai jenis makanan.
    Jaminan Kualitas & Keaslian:
    ✔ Produk asli Bogasari
    ✔ Terbuat dari gandum pilihan berkualitas
    ✔ Tekstur halus & bersih
    ✔ Aman & higienis, diproses dengan standar pabrik modern
    `
  },
    { 
    name: "Tepung Terigu (Segitiga Biru)", 
    price: 13000, 
    img: "images/segitiga-biru.jpg", 
    category: "TEPUNG", 
    tambahanBiaya: true,
    deskripsi: `
    🌾 Tepung Terigu Segitiga Biru Bogasari 1 kg – Serbaguna & Berkualitas!
    Tepung serbaguna yang cocok untuk berbagai olahan masakan dan kue.
    Terbuat dari gandum pilihan dengan kualitas terjaga, menghasilkan adonan yang halus, lembut, dan mudah diolah.
    Jaminan Kualitas & Keaslian:
    ✔ Produk asli Bogasari
    ✔ Tekstur halus & bersih
    ✔ Hasil adonan lembut & tidak mudah keras
    ✔ Dikemas rapi & higienis 1 kg
    `
  },
     { 
    name: "Gula Pasir (Kristal) GMP", 
    price: 19000, 
    img: "images/gula-pasir.jpg", 
    category: "GULA", 
    tambahanBiaya: true,
    deskripsi: `
    🍬 Gula Pasir Kristal GMP – Manis Alami, Bersih, dan Berkualitas!
    Gula Pasir Kristal GMP merupakan pilihan tepat untuk kebutuhan rumah tangga maupun usaha.
    Dihasilkan dari tebu pilihan dan diproses dengan teknologi modern, menghasilkan kristal gula yang putih, bersih, dan manis alami.
    Jaminan Kualitas & Keaslian:
    ✔ Gula pasir kristal GMP asli
    ✔ Manis alami, mudah larut
    ✔ Tanpa campuran & aman dikonsumsi
    ✔ Diproses sesuai standar mutu pangan
    `
  },
  { 
    name: "Telur 1kg", 
    price: 32000, 
    img: "images/telur.jpg", 
    category: "TELUR", 
    tambahanBiaya: true,
    deskripsi: `
    🥚 Telur Ayam Segar – Besar, Bersih, & Kualitas Terjamin!
    Telur ayam adalah bahan pangan serbaguna yang cocok untuk kebutuhan dapur harian, usaha kuliner, bakery, warung makan, hingga stok rumah tangga.
    Telur yang kami jual 100% fresh, kami hanya menyediakan telur pilihan dari peternak terpercaya, sehingga kualitas, ukuran, dan kesegarannya lebih terjamin.
    Jaminan Mutu & Keamanan:
    ✔ Telur selalu fresh, bukan stok lama
    ✔ Kualitas terjaga dari peternak sampai ke pelanggan
    `
  },
  { 
    name: "Minyak Kita 1ltr", 
    price: 20000, 
    img: "images/minyak-1ltr.jpg", 
    category: "MINYAK", 
    tambahanBiaya: true, 
    promo: { qty: 12, price: 217000 },
    deskripsi: `
    🛢️ Minyak Kita Original – Minyak Goreng Higienis & Lebih Terjamin!
    Minyak Kita merupakan minyak goreng pilihan masyarakat yang diproduksi dengan standar pemerintah dan proses yang higienis.
    Dibuat dari minyak sawit berkualitas dan telah melalui proses penyaringan sehingga menghasilkan minyak yang jernih, tidak mudah hitam, dan hemat digunakan.
    Produk yang kami jual 100% resmi dan original.
    Jaminan Keaslian & Kualitas:
    ✔ Produk resmi Minyak Kita
    ✔ Aman, bersih, dan siap pakai
    ✔ 1 Karton ini 12 pcs = 12 Liter
    `
  },
  { 
    name: "Minyak Kita 2ltr", 
    price: 40000, 
    img: "images/minyak-1ltr.jpg", 
    category: "MINYAK", 
    tambahanBiaya: true, 
    promo: { qty: 6, price: 217000 },
    deskripsi: `
    🛢️ Minyak Kita Original – Minyak Goreng Higienis & Lebih Terjamin!
    Minyak Kita merupakan minyak goreng pilihan masyarakat yang diproduksi dengan standar pemerintah dan proses yang higienis.
    Dibuat dari minyak sawit berkualitas dan telah melalui proses penyaringan sehingga menghasilkan minyak yang jernih, tidak mudah hitam, dan hemat digunakan.
    Produk yang kami jual 100% resmi dan original.
    Jaminan Keaslian & Kualitas:
    ✔ Produk resmi Minyak Kita
    ✔ Aman, bersih, dan siap pakai
    ✔ 1 Karton ini 6 pcs = 12 Liter
    `
  },
    { 
    name: "Minyak Goreng Rizki", 
    price: 18000, 
    img: "images/minyak-rizki.jpg", 
    category: "MINYAK", 
    tambahanBiaya: true,
    deskripsi: `
   🛢️ Minyak Goreng Rizki 800 ml – Jernih, Hemat, dan Berkualitas!
   Minyak Goreng Rizki 800 ml adalah pilihan tepat untuk kebutuhan memasak sehari-hari.
   Dihasilkan dari bahan baku pilihan dan diproses dengan standar mutu yang baik, membantu menghasilkan masakan yang lebih renyah dan lezat.
    Jaminan Keaslian & Kualitas:
    ✔ Minyak goreng jernih & bersih
    ✔ Tidak berbau tengik
    ✔ Stabil saat digunakan untuk menggoreng
    ✔ Dikemas higienis & praktis 800 ml
    ✔ Aman digunakan untuk kebutuhan dapur sehari-hari
    `
  },
    { 
    name: "Teh Pucuk Harum 350ML", 
    price: 65000, 
    img: "images/teh-pucuk.jpg", 
    category: "TEH", 
    tambahanBiaya: true,
    deskripsi: `
    🍃 Teh Pucuk Harum 350 ml – Segarnya Teh dari Pucuk Daun Pilihan!
    Teh Pucuk Harum dibuat dari pucuk daun teh terpilih yang menghasilkan rasa teh alami, harum, dan menyegarkan.
    Diproses dengan teknologi modern untuk menjaga aroma dan kesegaran teh dalam setiap botol.
    Jaminan Keaslian & Kebersihan:
    ✔ Terbuat dari pucuk daun teh pilihan
    ✔ Rasa teh alami & tidak pahit
    ✔ Aroma harum khas teh
    ✔ Kemasan praktis 350 ml
    ✔ Higienis & siap minum
    `
  },
    { 
    name: "Teh Sosro Celup", 
    price: 8000, 
    img: "images/teh-sosro.jpg", 
    category: "TEH", 
    tambahanBiaya: true,
    deskripsi: `
    🍵 Teh Celup Sosro Isi 30 – Teh Asli Indonesia, Harum & Berkualitas!
    Teh Celup Sosro dibuat dari daun teh pilihan terbaik yang dipetik dan diolah dengan standar mutu tinggi, menghasilkan rasa teh yang khas, harum, dan menyegarkan.
    🔒 Jaminan Kualitas & Keaslian:
    ✔ Produk asli Sosro
    ✔ Daun teh pilihan berkualitas
    ✔ Aroma harum & rasa teh khas
    ✔ Praktis dengan kemasan isi 30 celup
    ✔ Higienis & aman dikonsumsi
    `
  },
  { 
    name: "S-TEE", 
    price: 60000, 
    img: "images/s-tee.jpg", 
    category: "TEH", 
    tambahanBiaya: true,
    deskripsi: `
    🍹S-TEE Teh Manis – Segar, Nikmat, dan Pas di Kantong!
    S-TEE adalah minuman teh siap minum yang terkenal dengan rasa manisnya yang pas dan kesegarannya yang bikin nagih. 
    Dibuat dari ekstrak teh berkualitas dan diproses dengan standar higienis modern, S-TEE menjadi pilihan favorit untuk menemani aktivitas harian.
    Produk yang kami jual 100% original, segel pabrik masih rapat.
    Jaminan Keaslian:
    ✔ Segel utuh & resmi pabrik
    ✔ Bukan oplosan / repack
    ✔ Tanggal kedaluwarsa jelas & aman dikonsumsi
    ✔ Dikemas langsung dengan standar food grade
    `
  },
  { 
    name: "Teh Botol Sosro", 
    price: 60000, 
    img: "images/teh-botol.jpg", 
    category: "TEH", 
    tambahanBiaya: true,
    deskripsi: `
    "Ahlinya Teh Sejak 1940"
    Teh Botol Sosro adalah minuman teh siap minum yang dibuat dari daun teh berkualitas tinggi dan gula asli tanpa pemanis buatan. 
    Dengan cita rasa khas teh Jawa yang segar dan harum, Teh Botol Sosro menjadi pilihan favorit banyak orang sebagai minuman pendamping makan atau pelepas dahaga kapan saja.
    Teh Botol Sosro tetap menjadi minuman teh nomor satu yang menjaga rasa dan kualitasnya sejak dulu.
    `
  },
  { 
    name: "Tissue Paseo", 
    price: 12000, 
    img: "images/paseo.jpg", 
    category: "TISSUE", 
    tambahanBiaya: true, 
    promo: { qty: 3, price: 35000 },
    deskripsi: `
    "Lembut, Higienis, dan Aman untuk Semua Jenis Kulit"
    Paseo merupakan tisu premium yang dibuat dari 100% serat alami, tanpa bahan pemutih berbahaya.
    Teksturnya lembut, tidak mudah sobek, dan memiliki daya serap tinggi sehingga nyaman digunakan untuk keperluan wajah, tangan, dan area sensitif lainya.
    Passeo 500 Extra 40 sheet adalah pilihan tepat untuk Anda yang menginginkan tisu berkualitas premium dengan isi lebih banyak dan daya tahan lebih kuat.
    Dengan 3 lapisan (3 Ply), tisu ini terasa lebih tebal namun tetap lembut di kulit.
    `
  },
  { 
    name: "Tissue Jolly", 
    price: 9000, 
    img: "images/jolly.jpg", 
    category: "TISSUE", 
    tambahanBiaya: true, 
    promo: { qty: 3, price: 25000 },
    deskripsi: `
    "Lembut, Hemat, dan Serbaguna untuk Kebutuhan Harian"
    Tissue Jolly 250 Sheet hadir sebagai pilihan tisu yang praktis, lembut, dan ekonomis untuk penggunaan sehari-hari.
    Dibuat dari bahan yang higienis dan memiliki daya serap baik.
    Dengan jumlah 250 lembar, tisu ini menawarkan penggunaan lebih lama dan tetap terjangkau. 
    Teksturnya tidak mudah robek, halus di kulit, dan aman digunakan oleh seluruh anggota keluarga.
    `
  },
  { 
    name: "Tissue Nice", 
    price: 7000, 
    img: "images/nice.jpg", 
    category: "TISSUE", 
    tambahanBiaya: true, 
    promo: { qty: 3, price: 20000 },
    deskripsi: `
    "Lembut, Kuat, dan Hemat untuk Penggunaan Sehari-hari"
    Tissue Nice 360 helai dengan ketebalan 2 ply hadir dengan kualitas lembut dan daya serap yang baik.
    Dengan teknologi higienis dan bahan pilihan berkualitas, Nice aman digunakan untuk seluruh anggota keluarga.
    Isi 360 helai membuatnya lebih awet dan ekonomis, cocok untuk digunakan di rumah, kantor, mobil, atau dibawa bepergian. 
    Tisu ini tidak mudah sobek saat digunakan, namun tetap menjaga kelembutan sehingga nyaman dan aman untuk kulit sensitif sekalipun.
    `
  },
  { 
    name: "Prima", 
    price: 40000, 
    img: "images/prima-600ml.jpg", 
    category: "PRIMA", 
    tambahanBiaya: true,
    deskripsi: `
    "Segar, Terjangkau, dan Aman Dikonsumsi Setiap Hari"
    Air Mineral Prima 600 ml merupakan pilihan air minum praktis untuk menemani aktivitas harian Anda.
    Diproses melalui sistem penyaringan modern hingga menghasilkan air yang jernih.
    Jaminan Keaslian & Kualitas Produk:
    ✔ Segel botol resmi dan utuh
    ✔ Tanggal kedaluwarsa jelas & terbaru
    ✔ Dikemas langsung oleh pabrik dengan standar food grade & higienis
    ✔ 1 Karton isi 24 Botol
    `
  },
  //{ 
    //name: "VIT Mini", 
    //price: 21000, 
    //img: "images/vit-mini.jpg", 
    //category: "VIT", 
    //tambahanBiaya: true,
    //deskripsi: `
    //"Segar, Praktis, dan Terjamin Keasliannya"
    //VIT Mini 220 ml adalah air mineral murni yang berasal dari sumber mata air pegunungan dan diproses menggunakan teknologi penyaringan modern berstandar tinggi.
    //Ukuran mini ini sangat praktis untuk kebutuhan sekali minum, cocok untuk anak sekolah, acara hajatan, meeting, perjalanan, ataupun stok di rumah.
    //Jaminan Keaslian & Keamanan Produk:
    //✔ Segel botol utuh dan resmi pabrik
    //✔ Tanggal kedaluwarsa jelas & terbaru
    //✔ Dikemas langsung dengan standar food grade dan higienis
    //✔ 1 Karton isi 24 Botol
    //`
  //},
  { 
    name: "VIT Gelas", 
    price: 24000, 
    img: "images/vit-gelas.jpg", 
    category: "VIT", 
    tambahanBiaya: true,
    deskripsi: `
    "Praktis, Higienis, dan Siap Saji"
    VIT Gelas 200 ml adalah air mineral murni yang diproses dengan standar kualitas tinggi untuk memastikan rasa yang segar serta aman dikonsumsi.
    Dikemas menggunakan plastik food grade dan penutup pelindung segel, VIT gelas menawarkan kenyamanan minum tanpa repot membuka botol—tinggal buka segel dan minum.
    Jaminan Keaslian & Kualitas Produk:
    ✔ Segel cup utuh & resmi pabrik
    ✔ Tanggal kedaluwarsa jelas & terbaru
    ✔ Diproduksi dengan standar higienis dan food grade
    ✔ 1 Karton isi 48 Cup/Gelas
    `
  },
  { 
    name: "Air Isi Ulang", 
    price: 7000, 
    img: "images/isiulang.jpg", 
    category: "REFIL", 
    tambahanBiaya: true,
    deskripsi: `
    "Harga Terjangkau, Kualitas Tetap Terjamin"
    Air isi ulang kami diproses menggunakan sistem filtrasi modern yang terdiri dari penyaringan berlapis, reverse osmosis (RO).
    Proses ini memastikan air yang dihasilkan jernih, bebas bau, bebas bakteri, dan aman untuk dikonsumsi setiap hari.
    Dengan harga ekonomis namun tetap mengutamakan kualitas dan standar kebersihan.
    Jaminan Kebersihan & Kualitas:
    ✔ Galon dicuci & disterilkan sebelum diisi
    ✔ Higienis, aman, dan terjaga dari kontaminasi
    ✔ Diambil langsung saat pesanan, bukan stok lama
    `
  },
  ];

  // === RENDER PRODUK ===
  function renderProducts(list = products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";
    list.forEach((p, idx) => {
      const realIndex = products.indexOf(p);
      const div = document.createElement("div");
      div.className = "product-card";

      // catatan promo
      let promoNote = "";
      if (p.promo) {
        promoNote = `<p class="promo-note">Promo: Beli ${p.promo.qty} Rp ${p.promo.price.toLocaleString()}</p>`;
      }

      div.innerHTML = `
        <img src="${p.img}" alt="${p.name}" class="product-image" onclick="showProductDetail(${realIndex})">
        <h3>${p.name}</h3>
        <p>Rp ${p.price.toLocaleString()}</p>
        ${promoNote}
        <button onclick="addToCart(${idx})"><i class="fas fa-shopping-cart"></i> Tambah </button>
      `;
      container.appendChild(div);
    });
  }
  renderProducts();

// === MODAL PRODUK =========
let currentProductIndex = null;

function showProductDetail(index) {
  const p = products[index];
  if (!p) return;

  currentProductIndex = index;

  document.getElementById("modal-product-img").src = p.img || "";
  document.getElementById("modal-product-img").alt = p.name || "Produk";
  document.getElementById("modal-product-name").textContent = p.name || "";
  document.getElementById("modal-product-price").textContent =
    "Rp " + ((p.price || 0).toLocaleString("id-ID"));
  document.getElementById("modal-product-desc").innerHTML =
    (p.deskripsi || "Tidak ada deskripsi.").replace(/\n/g, "<br>");

    // === RESET DESKRIPSI DAN TOMBOL ===
  modalDesc.style.maxHeight = "150px";
  toggleDescBtn.textContent = "Selengkapnya";
  
  document.getElementById("product-modal").classList.remove("hidden");
}

window.showProductDetail = showProductDetail;

// === MODAL ELEMENTS ===
const modal = document.getElementById("product-modal");
const modalContent = modal.querySelector(".modal-content");
const closeBtn = document.getElementById("close-product-modal");
const addCartBtn = document.getElementById("modal-add-cart");
const toggleDescBtn = document.getElementById("modal-toggle-desc");
const modalDesc = document.getElementById("modal-product-desc");

function hideModal() {
  modal.classList.add("fadeOut");
  modal.addEventListener("animationend", () => {
    modal.classList.add("hidden");
    modal.classList.remove("fadeOut");
  }, { once: true });
}

// Close modal dengan tombol ×
closeBtn.addEventListener("click", hideModal);

// Close modal dengan klik di luar konten
modal.addEventListener("click", e => {
  if (!modalContent.contains(e.target)) hideModal();
});

// Tombol Tambah ke Keranjang
addCartBtn.addEventListener("click", () => {
  if (currentProductIndex !== null && typeof addToCart === "function") {
    const imgEl = document.getElementById("modal-product-img"); // elemen gambar
    flyToCartFancy(imgEl); // animasi fancy

    addToCart(currentProductIndex); // tambahkan ke keranjang
    hideModal();
  }
});

  // Selengkapnya //
toggleDescBtn.addEventListener("click", () => {
  if (modalDesc.style.maxHeight === "none") {
    modalDesc.style.maxHeight = "150px";
    toggleDescBtn.textContent = "Selengkapnya";
  } else {
    modalDesc.style.maxHeight = "none";
    toggleDescBtn.textContent = "Sembunyikan";
  }
});

// Animasi Terbang ke Keranjang //
  function flyToCartFancy(imgEl) {
  const cartIcon = document.getElementById("cart-icon");
  if (!cartIcon || !imgEl) return;

  const rect = imgEl.getBoundingClientRect();
  const cartRect = cartIcon.getBoundingClientRect();

  // Buat elemen gambar terbang
  const flyImg = imgEl.cloneNode(true);
  flyImg.className = "fly-img blur";
  document.body.appendChild(flyImg);

  // Posisi awal
  flyImg.style.left = rect.left + "px";
  flyImg.style.top = rect.top + "px";
  flyImg.style.width = rect.width + "px";
  flyImg.style.height = rect.height + "px";

  // Trigger animasi
  requestAnimationFrame(() => {
    flyImg.style.transform = `translate(${cartRect.left - rect.left}px, ${cartRect.top - rect.top}px) scale(0.2) rotate(720deg)`;
    flyImg.style.opacity = 0;
    flyImg.style.filter = "blur(0px)";
  });

  // Hapus elemen setelah animasi selesai
  flyImg.addEventListener("transitionend", () => {
    flyImg.remove();

    // Efek “pop” badge keranjang
    const badge = document.getElementById("cart-badge");
    if (badge) {
      badge.style.transform = "scale(1.4)";
      badge.style.transition = "transform 0.2s";
      setTimeout(() => {
        badge.style.transform = "scale(1)";
      }, 200);
    }
  });
}

 /* =========================
      FIXED CART SYSTEM
========================= */

// Load cart dari localStorage (dipastikan array!)
// ====== CART GLOBAL (load + sanitasi) ======
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
if (!Array.isArray(cart)) cart = [];

// buang item rusak / qty <= 0
cart = cart.filter(it => {
  if (!it || typeof it.qty === "undefined") return false;
  return Number(it.qty) > 0;
});
localStorage.setItem("cart", JSON.stringify(cart));

// fungsi simpan
function saveCart() {
  if (!Array.isArray(cart)) cart = [];
  // pastikan qty adalah number dan >0
  cart = cart.map(it => ({ ...it, qty: Number(it.qty) || 0 }))
             .filter(it => it.qty > 0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ========= TAMBAH KE KERANJANG ========= */

window.addToCart = function (index) {
  // Pastikan cart array
  if (!Array.isArray(cart)) cart = [];

  const product = products[index];
  let item = cart.find(p => p.name === product.name);

  if (item) {
    item.qty++;
  } else {
    cart.push({ ...product, qty: 1, antarDalamRumah: false });
  }

  saveCart();
  renderCart();
  updateCartBadge();
  showToast(`${product.name} ditambahkan ke keranjang`);
};

/* ========= TOAST NOTIFIKASI ========= */

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.classList.add("toast");

  toast.innerHTML = `
    <div class="toast-icon">✔</div>
    <span>${message}</span>
  `;

  // Klik toast → langsung masuk ke keranjang
  toast.addEventListener("click", goToCart);

  container.appendChild(toast);

  // Auto hide
  setTimeout(() => {
    toast.style.animation = "slide-out 0.35s forwards";
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

/* ========= BADGE KERANJANG ========= */

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;

  // Pastikan cart array
  if (!Array.isArray(cart)) cart = [];

  const totalQty = cart.reduce((sum, item) => sum + (item.qty || 0), 0);

  badge.textContent = totalQty;
  badge.style.display = totalQty > 0 ? "flex" : "none";
}

/* ========= SCROLL KE KERANJANG ========= */

// pastikan ini berada di scope global (bisa di bawah semua kode atau di luar DOMContentLoaded)
window.goToCart = function () {
  const cartEl = document.getElementById("cart") || document.getElementById("cart-section");
  if (!cartEl) {
    // kalau keranjang ada di halaman lain, ubah ke window.location.href = "cart.html";
    console.warn("Elemen keranjang tidak ditemukan (id='cart' atau id='cart-section').");
    return;
  }

  // scroll dengan offset 20px supaya tidak nempel ke header
  const y = cartEl.getBoundingClientRect().top + window.pageYOffset - 20;
  window.scrollTo({ top: y, behavior: "smooth" });
};

 // === RENDER KERANJANG ===
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  let totalBelanja = 0;
  let totalItem = 0;

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:6px;">
        <span>${item.name} x${item.qty} - Rp ${(hitungSubtotal(item)).toLocaleString()}</span>
        <div style="display:flex; gap:6px;">
          <button style="padding:4px 10px; border:none; background:#f0f0f0; border-radius:6px; font-size:12px;" onclick="decreaseQty(${index})">−</button>
          <button style="padding:4px 10px; border:none; background:#4caf50; color:white; border-radius:6px; font-size:12px;" onclick="increaseQty(${index})">+</button>
          <button style="padding:4px 10px; border:none; background:#f44336; color:white; border-radius:6px; font-size:16px;" onclick="removeItem(${index})">🗑</button>
        </div>
      </div>
      <label style="display:block; margin-top:4px; font-size:0.9em;">
        <input type="checkbox" onchange="toggleAntarDalamRumah(${index})" ${item.antarDalamRumah ? "checked" : ""}>
        Antar dalam rumah (+Rp 1.000)
      </label>
    `;
    cartItems.appendChild(li);

    totalBelanja += hitungSubtotal(item);
    totalItem += item.qty;
  });

  let biayaOngkir = hitungOngkir(totalItem);
  let grandTotal = totalBelanja + biayaOngkir;

  const cartTotal = document.getElementById("cart-total");
  const statusPesananElem = document.getElementById("status-pesanan");

  // 🔹 Update tampilan total
  if (jarak > 0) {
    cartTotal.innerHTML = `
      Belanja: Rp ${totalBelanja.toLocaleString()}<br>
      Ongkir (${jarak.toFixed(1)} km): Rp ${biayaOngkir.toLocaleString()}<br>
      <b>Total Bayar: Rp ${grandTotal.toLocaleString()}</b>
    `;
  } else {
    cartTotal.innerHTML = `
      Belanja: Rp ${totalBelanja.toLocaleString()}<br>
      Ongkir: Belum dihitung<br>
      <b>Total Bayar: Rp ${grandTotal.toLocaleString()}</b>
    `;
  }

  // 🔹 Status otomatis tampil di elemen terpisah (berdasarkan jarak)
  let minimalAntar = jarak <= 1 ? 40000 : 60000;

  if (totalBelanja === 0) {
    statusPesananElem.textContent = "Keranjang kosong 🛒";
    statusPesananElem.style.cssText = "color: gray; font-weight: bold; font-size: 0.9em;";
  } else if (totalBelanja < minimalAntar) {
    statusPesananElem.textContent = `Pesanan ambil di toko 🏪 (minimal antar Rp ${minimalAntar.toLocaleString()})`;
    statusPesananElem.style.cssText = "color: orange; font-weight: bold; font-size: 0.9em;";
  } else {
    statusPesananElem.textContent = "Pesanan siap diantar 🚚";
    statusPesananElem.style.cssText = "color: green; font-weight: bold; font-size: 0.9em;";
  }
}

// === FUNGSI PENDUKUNG KERANJANG (di luar renderCart)
function hitungSubtotal(item) {
  let subtotal = item.price * item.qty;
  if (item.promo && item.qty >= item.promo.qty) {
    let paket = Math.floor(item.qty / item.promo.qty);
    let sisa = item.qty % item.promo.qty;
    subtotal = paket * item.promo.price + sisa * item.price;
  }
  if (item.tambahanBiaya && item.antarDalamRumah) {
    subtotal += 1000 * item.qty;
  }
  return subtotal;
}

window.toggleAntarDalamRumah = function(index) {
  cart[index].antarDalamRumah = !cart[index].antarDalamRumah;
  renderCart();
};

window.increaseQty = function(i) { 
  if (!Array.isArray(cart)) cart = [];
  if (!cart[i]) return;
  cart[i].qty = Number(cart[i].qty || 0) + 1;
  saveCart();
  renderCart();
  updateCartBadge();
};

window.decreaseQty = function(i) { 
  if (!Array.isArray(cart)) cart = [];
  if (!cart[i]) return;

  cart[i].qty = Number(cart[i].qty || 0) - 1;
  if (cart[i].qty <= 0) {
    // remove item if qty zero or below
    cart.splice(i, 1);
  }
  saveCart();
  renderCart();
  updateCartBadge();
};

window.removeItem = function(i) { 
  if (!Array.isArray(cart)) cart = [];
  if (!cart[i]) return;
  cart.splice(i, 1);
  saveCart();
  renderCart();
  updateCartBadge();
};

document.getElementById("clear-cart").addEventListener("click", () => {
  if (!Array.isArray(cart)) cart = [];
  if (cart.length === 0) {
    alert("Keranjang sudah kosong.");
    return;
  }
  if (confirm("Yakin ingin menghapus semua isi keranjang?")) {
    cart = [];
    saveCart();
    renderCart();
    updateCartBadge();
  }
});

   // === HITUNG SUBTOTAL DENGAN PROMO & ANTAR DALAM RUMAH ===
  function hitungSubtotal(item) {
    let subtotal = item.price * item.qty;

    // cek promo
    if (item.promo && item.qty >= item.promo.qty) {
      let paket = Math.floor(item.qty / item.promo.qty);
      let sisa = item.qty % item.promo.qty;
      subtotal = paket * item.promo.price + sisa * item.price;
    }

    // tambahan biaya antar dalam rumah (per item)
    if (item.tambahanBiaya && item.antarDalamRumah) {
      subtotal += 1000 * item.qty;
    }

    return subtotal;
  }

 window.toggleAntarDalamRumah = function(index) {
  cart[index].antarDalamRumah = !cart[index].antarDalamRumah;
  renderCart();
};

// === METODE PEMBAYARAN ===
const paymentSelect = document.getElementById("payment-method");
const paymentInfo = document.getElementById("payment-info");

// === PAYMENT TOAST (kanan atas, auto hilang) ===
function showPaymentToast(text) {
  const t = document.getElementById("payment-toast");

  t.classList.remove("show");
  t.innerText = text;
  void t.offsetWidth; // restart animasi fade
  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2500);
}

// === COPY REKENING ===
function copyRekening(num) {
  navigator.clipboard.writeText(num)
    .then(() => showPaymentToast("Nomor rekening disalin"))
    .catch(() => showPaymentToast("Gagal menyalin"));
}

// === DOWNLOAD QRIS ===
function downloadQRIS() {
  const imgSrc = "images/qris.png";
  const link = document.createElement("a");
  link.href = imgSrc;
  link.download = "QRIS-UD-Fikri.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showPaymentToast("QRIS berhasil di-download");
}

window.copyRekening = copyRekening;
window.downloadQRIS = downloadQRIS;

// === EVENT PEMILIHAN METODE PEMBAYARAN ===
paymentSelect.addEventListener("change", () => {
  const method = paymentSelect.value;
  paymentInfo.innerHTML = ""; // clear dulu

  if (method === "QRIS") {
    paymentInfo.innerHTML = `
      <h3>QRIS</h3>
      <p>Silakan scan atau download QR Code berikut:</p>

      <div style="text-align:center;">
        <img src="images/qris.png" alt="QRIS" 
          style="max-width:200px;display:block;margin:10px auto;">

        <button onclick="downloadQRIS()" 
          style="margin-top:10px;padding:8px 12px;border:none;background:#f0f0f0;color:#000;border-radius:6px;cursor:pointer;">
          Download
        </button>
      </div>
    `;
  }

  else if (method === "Transfer") {
    const rekening = "1270012190490";

    paymentInfo.innerHTML = `
      <h3>Transfer Bank</h3>
      <p>Silakan transfer ke rekening berikut:</p>

      <strong>Bank Mandiri</strong><br>

      No. Rekening: 
      <span style="font-size:16px;color:#000;font-weight:bold;">
        ${rekening}
      </span>

      <button onclick="copyRekening('${rekening}')" 
        style="margin-left:10px;padding:5px 10px;border:none;background:#f0f0f0;color:#000;border-radius:6px;cursor:pointer;">
        Salin
      </button>

      <br>a.n <em>Fikriatur Rizky</em>
    `;
  }

  else if (method === "Tunai/Cash") {
    paymentInfo.innerHTML = `
      <h3>Tunai/Cash</h3>
      <p>Bayar setelah diantar (Tunai/Cash)</p>
    `;
  }
});

  // === CHECKOUT ===
document.getElementById("checkout").addEventListener("click", () => {
  if (!storeOpen) {
    alert("Toko sedang tutup, checkout tidak bisa dilakukan.");
    return;
  }
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let name = document.getElementById("customer-name").value.trim();
  let addr = document.getElementById("customer-address").value.trim();
  let pay = paymentSelect.value;
  let lokasi = document.getElementById("lokasi").value.trim();

  // 🔹 Validasi wajib
  if (!name || !addr || !pay || !lokasi) {
    alert("Mohon isi nama, alamat, metode pembayaran, dan titik lokasi (share lokasi).");
    return;
  }

  let msg = `*🛒 PESANAN UD FIKRI 🛒*\n`;
  msg += `=====================\n`;
  msg += `*Nama:* ${name}\n`;
  msg += `*Alamat:* ${addr}\n`;
  msg += `📍 *Lokasi:* ${lokasi}\n`;
  msg += `=====================\n`;
  msg += `*Pesanan:*\n`;

  let totalItem = 0;
  let totalBelanja = 0;
  cart.forEach(item => {
    let extra = (item.tambahanBiaya && item.antarDalamRumah) ? " + antar dalam rumah" : "";
    let subtotal = hitungSubtotal(item);
    totalItem += item.qty;
    totalBelanja += subtotal;

    msg += `- ${item.name} x${item.qty}${extra}\n   = Rp ${subtotal.toLocaleString()}\n`;
  });
  
  // 🔹 Hitung ongkir & total bayar
  let biayaOngkir = hitungOngkir(totalItem);
  let grandTotal = totalBelanja + biayaOngkir;

  // Tambahkan ongkir detail
  msg += `---------------------\n`;
  msg += `*Ongkir:*\n${detailOngkir(totalItem)}\n`;
  msg += `*Total Bayar:* Rp ${grandTotal.toLocaleString()}\n`;

  msg += `=====================\n`;
  msg += `*Total Item:* ${totalItem}\n`;
  // 🔹 Logika status pesanan sesuai jarak
  let minimalAntar = jarak <= 1 ? 40000 : 60000;
  
  if (totalBelanja < minimalAntar) {
  msg += `*Status Pesanan:* Ambil di toko 🏪 (belum mencapai minimal antar Rp ${minimalAntar.toLocaleString()})\n`;
  } else {
  msg += `*Status Pesanan:* Siap diantar 🚚\n`;
  }
  if (jarak > 0) {
    msg += `*Ongkir:* Rp ${biayaOngkir.toLocaleString()} (jarak ${jarak.toFixed(1)} km)\n`;
  } else {
    msg += `*Ongkir:* Belum dihitung\n`;
  }
  msg += `*Metode Pembayaran:* ${pay}\n`;
  msg += `=====================\n`;

  // 🔹 Saran produk opsional
  const saran = document.getElementById("saran-produk").value.trim();
  if (saran) {
    msg += `\n💡 Saran/Masukan: ${saran}\n`;
  }

  msg += `=====================\n`;
  msg += `_Terima kasih sudah berbelanja 🙏_`;
  msg += `*https://ud-fikri.vercel.app*`;

  // Kirim ke WA
  window.open(`https://wa.me/6281287505090?text=${encodeURIComponent(msg)}`, "_blank");

  // reset keranjang
  cart = [];
  renderCart();
  updateCartBadge();

});

  // === SEARCH & FILTER ===
  document.getElementById("search-input").addEventListener("input", (e) => {
    let keyword = e.target.value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(keyword));
    renderProducts(filtered);
  });

  let categories = [...new Set(products.map(p => p.category))];
  let select = document.getElementById("filter-category");
  categories.forEach(cat => {
    let opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  select.addEventListener("change", (e) => {
    let cat = e.target.value;
    if (cat === "") renderProducts();
    else renderProducts(products.filter(p => p.category === cat));
  });

  // === UPDATE STATUS TOKO DI HALAMAN ===
  function updateStoreStatus() {
  const statusEl = document.getElementById("store-status-msg");
  const productsContainer = document.getElementById("products-container");

  if (storeOpen) {
    statusEl.innerHTML = `
      <i class="fas fa-check-circle"></i> 
      <span><strong>Toko Sedang Buka</strong>. <br>Silakan belanja 😊</span>
    `;
    statusEl.className = "store-open";
    productsContainer.style.display = "grid";
  } else {
    statusEl.innerHTML = `
      <i class="fas fa-exclamation-triangle"></i> 
      <span><strong>Toko Tutup</strong>.<br>Silahkan kembali lagi nanti 🙏</span>
    `;
    statusEl.className = "store-closed";
    productsContainer.style.display = "none";
  }
}
updateStoreStatus();

// Accordion toggle with animation
document.querySelectorAll(".accordion").forEach(acc => {
  acc.addEventListener("click", function() {
    this.classList.toggle("active");
    let panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
    }
  });
});
  
// === KONFIGURASI LOKASI TOKO ===
if (typeof window.tokoLat === "undefined") window.tokoLat = -6.288418;
if (typeof window.tokoLng === "undefined") window.tokoLng = 106.818342;

// === VARIABEL GLOBAL UNTUK LOKASI USER & ONGKIR ===
if (typeof window.jarak === "undefined") window.jarak = 0;
window.jarakUser = 0;
window.ongkirUser = 0;

// === Fungsi Haversine untuk hitung jarak (km) ===
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// === Fungsi Hitung Ongkir ===
function hitungOngkir(totalItem = 0) {
  const jarak = window.jarak || 0;
  if (jarak > 1) {
    const kmLebih = Math.ceil(jarak - 1);
    const biayaKm = kmLebih * 3000;
    const biayaPerItem = totalItem * 500;
    return biayaKm + biayaPerItem;
  }
  return 0;
}

// === Detail Ongkir ===
function detailOngkir(totalItem = 0) {
  const jarak = window.jarak || 0;
  if (jarak <= 0) return "Belum dihitung";
  if (jarak <= 1) return "Gratis (≤ 1 km)";

  const kmLebih = Math.ceil(jarak - 1);
  const biayaKm = kmLebih * 3000;
  const biayaPerItem = totalItem * 500;
  const total = biayaKm + biayaPerItem;

  return `Jarak: ${jarak.toFixed(1)} km\n` +
         `• Rp 3.000 x ${kmLebih} km = Rp ${biayaKm.toLocaleString()}\n` +
         `• Rp 500 x ${totalItem} item = Rp ${biayaPerItem.toLocaleString()}\n` +
         `Total Ongkir = Rp ${total.toLocaleString()}`;
}

// === PETA & AMBIL LOKASI USER ===
const ambilBtn = document.getElementById("ambil-lokasi");
const lokasiInput = document.getElementById("lokasi");
const koordinatEl = document.getElementById("koordinat");

let map = null;
let marker = null;

function ensureMap(lat = tokoLat, lng = tokoLng) {
  if (!map) {
    map = L.map("user-map").setView([lat, lng], 15);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19
    }).addTo(map);
  }

  if (!marker) {
    marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    marker.on("dragend", (e) => {
      const pos = e.target.getLatLng();
      updateLokasiDanJarak(pos.lat, pos.lng);
    });
  } else {
    marker.setLatLng([lat, lng]);
    map.flyTo([lat, lng], 15, { animate: true, duration: 1.2 }); // smooth animation
  }
}

function updateLokasiDanJarak(lat, lng) {
  if (lokasiInput) lokasiInput.value = `https://www.google.com/maps?q=${lat},${lng}`;
  if (koordinatEl) koordinatEl.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

  window.jarak = haversine(lat, lng, tokoLat, tokoLng);
  window.jarakUser = window.jarak;
  window.ongkirUser = hitungOngkir();

  if (typeof renderCart === "function") renderCart();
}

if (ambilBtn) {
  ambilBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung fitur lokasi.");
      return;
    }

    const prevHtml = ambilBtn.innerHTML;
    ambilBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengambil lokasi...';
    ambilBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        ensureMap(lat, lng);          // pindahkan marker ke lokasi user
        updateLokasiDanJarak(lat, lng); // isi input dan koordinat

        ambilBtn.innerHTML = prevHtml;
        ambilBtn.disabled = false;
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Gagal mengambil lokasi. Pastikan izin lokasi aktif.");
        ambilBtn.innerHTML = prevHtml;
        ambilBtn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

// === Saat halaman pertama kali dimuat ===
if (document.getElementById("user-map")) {
  // Tampilkan peta langsung, dengan marker default (misal di lokasi toko)
  ensureMap(tokoLat, tokoLng);

  // Tapi teks lokasi & koordinat dikosongkan dulu
  if (lokasiInput) lokasiInput.value = "";
  if (koordinatEl) koordinatEl.textContent = "";
}

});



