"use strict";
window.supabase = window.supabase || window.supabaseClient;
const supabase = window.supabase;
let buktiURL = "";

/* ================= CONFIG ================= */
const nomorAdmin = "6288803060094";
let activeService = null;

/* ================= ELEMENT ================= */
const priceBox = document.getElementById("priceBox");
const priceText = document.getElementById("priceText");
const adminText = document.getElementById("adminText");
const nominalText = document.getElementById("nominalText");

/* ================= DATA LAYANAN ================= */
const services = {
  pulsa: {
    title: "Pulsa Prabayar",
    placeholder: "Nomor HP",
    autoDetect: true,
    providers: {
      Axis: [
        { label: "5.000 / Masa Aktif 7 Hari", harga: 7000 },
        { label: "10.000 / Masa Aktif 15 Hari", harga: 12000 },
        { label: "DC Axis 15.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 17000 },
        { label: "DC Axis 25.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 27000 },
        { label: "DC Axis 30.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 32000 },
        { label: "DC Axis 50.000 / Bonus Isi Pulsa 2Gb 2hr di aplikasi AXISnet", harga: 53000 },
        { label: "DC Axis 100.000 / Bonus Isi Pulsa 2Gb 2hr di aplikasi AXISnet", harga: 102500 },
      ],
      ByU: [
        { label: "ByU 5.000", harga: 7000 },
        { label: "ByU 10.000", harga: 12000 },
        { label: "ByU 15.000", harga: 17500 },
        { label: "ByU 20.000", harga: 22500 },
        { label: "ByU 25.000", harga: 27500 },
        { label: "ByU 30.000", harga: 32500 },
        { label: "ByU 35.000", harga: 37500 },
        { label: "ByU 40.000", harga: 42500 },
        { label: "ByU 45.000", harga: 47500 },
        { label: "ByU 50.000", harga: 52500 },
        { label: "ByU 55.000", harga: 57500 },
        { label: "ByU 60.000", harga: 62500 },
        { label: "ByU 65.000", harga: 67500 },
        { label: "ByU 70.000", harga: 72500 },
        { label: "ByU 75.000", harga: 77500 },
        { label: "ByU 80.000", harga: 82500 },
        { label: "ByU 85.000", harga: 87500 },
        { label: "ByU 90.000", harga: 92500 },
        { label: "ByU 95.000", harga: 97500 },
        { label: "ByU 100.000", harga: 102500 },
        ],
      Telkomsel: [
        { label: "ByU 5.000", harga: 7000 },
        { label: "ByU 10.000", harga: 12000 },
        { label: "ByU 15.000", harga: 17500 },
        { label: "ByU 20.000", harga: 22500 },
        { label: "ByU 25.000", harga: 27500 },
        { label: "ByU 30.000", harga: 32500 },
        { label: "ByU 35.000", harga: 37500 },
        { label: "ByU 40.000", harga: 42500 },
        { label: "ByU 45.000", harga: 47500 },
        { label: "ByU 50.000", harga: 52500 },
        { label: "ByU 55.000", harga: 57500 },
        { label: "ByU 60.000", harga: 62500 },
        { label: "ByU 65.000", harga: 67500 },
        { label: "ByU 70.000", harga: 72500 },
        { label: "ByU 75.000", harga: 77500 },
        { label: "ByU 80.000", harga: 82500 },
        { label: "ByU 85.000", harga: 87500 },
        { label: "ByU 90.000", harga: 92500 },
        { label: "ByU 95.000", harga: 97500 },
        { label: "ByU 100.000", harga: 102500 },
        ],
      XL: ["5.000", "10.000", "20.000", "25.000", "30.000", "50.000", "75.000", "100.000"],
      Indosat: ["5.000", "10.000", "20.000", "25.000", "30.000", "50.000", "75.000", "100.000"],
      Three: ["5.000", "10.000", "20.000", "25.000", "30.000", "50.000", "75.000", "100.000"],
      Smartfren: ["5.000", "10.000", "20.000", "25.000", "30.000", "50.000", "75.000", "100.000"],
    }
  },

data: {
  title: "Paket Data",
  placeholder: "Nomor HP",
  autoDetect: true,
  providers: {
    Axis: ["5GB / 30 Hari", "10GB / 30 Hari", "20GB / 30 Hari"],
    Telkomsel: ["5GB / 30 Hari", "10GB / 30 Hari", "20GB / 30 Hari"],
    XL: ["6GB / 30 Hari", "12GB / 30 Hari"],
    Indosat: ["8GB / 30 Hari", "16GB / 30 Hari"],
    Tri: ["10GB / 30 Hari", "25GB / 30 Hari"],
    Smartfren: ["Unlimited 1 Hari", "Unlimited 30 Hari"]
  }
}, // ← INI YANG HILANG ❗

  token: {
    title: "Token Listrik PLN",
    placeholder: "ID Pelanggan",
    providers: {
      PLN: [
        {label: "PLN 20.000", harga: 23000},
        {label: "PLN 50.000", harga: 53000},
        {label: "PLN 100.000", harga: 103000},
        {label: "PLN 200.000", harga: 204000},
        ]
    }
  },

  game: {
    title: "Voucher Game",
    placeholder: "User ID / Server",
    providers: {
      "Mobile Legends": ["86 Diamond", "172 Diamond", "257 Diamond"],
      "Free Fire": ["70 Diamond", "140 Diamond"],
      PUBG: ["60 UC", "325 UC"]
    }
  },

  ewallet: {
    title: "Top Up E-Wallet",
    placeholder: "Nomor Akun",
    providers: {
      DANA: ["10.000", "20.000", "50.000"],
      OVO: ["10.000", "25.000", "50.000"],
      GoPay: ["20.000", "50.000"],
      ShopeePay: ["20.000", "50.000"]
    }
  },

  pln: {
    title: "Tagihan PLN Pascabayar",
    placeholder: "ID Pelanggan",
    providers: { PLN: ["Cek Tagihan"] }
  },

  bpjs: {
    title: "BPJS Kesehatan",
    placeholder: "Nomor VA",
    providers: { BPJS: ["Cek Tagihan"] }
  },

  telkom: {
    title: "Telkom / IndiHome",
    placeholder: "Nomor Pelanggan",
    providers: { Telkom: ["Cek Tagihan"] }
  },

  multi: {
    title: "Multifinance",
    placeholder: "Nomor Kontrak",
    providers: {
      Adira: ["Cek Tagihan"],
      FIF: ["Cek Tagihan"],
      WOM: ["Cek Tagihan"],
      BAF: ["Cek Tagihan"]
    }
  },

  /* ===== KEUANGAN ===== */
 transfer: {
  title: "Transfer Antar Bank",
  placeholder: "Nomor Rekening Tujuan",
  isNominalText: true,
  adminFee: 7000,
  providers: { BCA: [], BRI: [], BNI: [], Mandiri: [] }
},

tarik: {
  title: "Tarik Tunai",
  placeholder: "Nomor Akun",
  isNominalText: true,
  adminFee: 5000,
  providers: { "Via E-Wallet": [] }
},

setor: {
  title: "Setor Tunai",
  placeholder: "Nomor Akun",
  isNominalText: true,
  adminFee: 5000,
  providers: { "Via E-Wallet": [] }
},

ecommerce: {
  title: "Pembayaran E-Commerce",
  placeholder: "No Pesanan",
  isNominalText: true,
  adminFee: 3000,
  providers: { Shopee: [], Tokopedia: [], Lazada: [] }
}
}; // ⬅️ INI WAJIB

/* ================= PREFIX OPERATOR ================= */
const prefixOperator = {
  Telkomsel: ["0811","0812","0813","0821","0822","0823","0851","0852","0853"],
  Indosat: ["0814","0815","0816","0855","0856","0857","0858"],
  XL: ["0817","0818","0819","0859","0877","0878"],
  Tri: ["0895","0896","0897","0898","0899"],
  Axis: ["0831","0832","0833","0838"],
  Smartfren: ["0881","0882","0883","0884","0887","0888","0889"] 
};

function detectOperator(nomor) {
  if (nomor.length < 4) return null;
  const prefix = nomor.substring(0, 4);
  for (const op in prefixOperator) {
    if (prefixOperator[op].includes(prefix)) return op;
  }
  return null;
}

/* ================= OPEN MODAL ================= */
function openService(key) {
  activeService = services[key];
  if (!activeService) return;

  const provider = document.getElementById("provider");
  const nominal = document.getElementById("nominal");
  const inputData = document.getElementById("inputData");

  // reset harga
  priceBox.classList.add("hidden");
  priceText.innerText = "Rp 0";
  adminText.innerText = "";

  document.getElementById("modalTitle").innerText = activeService.title;
  inputData.placeholder = activeService.placeholder;
  inputData.value = "";

  provider.innerHTML = `<option value="">Pilih Provider</option>`;
  nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;

  nominal.classList.remove("hidden");
  nominalText.classList.add("hidden");
  nominalText.value = "";

  if (activeService.isNominalText) {
    nominal.classList.add("hidden");
    nominalText.classList.remove("hidden");
  }

  Object.keys(activeService.providers).forEach(p => {
    provider.innerHTML += `<option value="${p}">${p}</option>`;
  });

  // PROVIDER CHANGE
 provider.onchange = () => {
  if (activeService.isNominalText) return;

  nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;
  priceBox.classList.add("hidden");

  const list = activeService.providers[provider.value];
  if (!Array.isArray(list)) return;

  list.forEach(item => {
    if (typeof item === "string") {
      nominal.innerHTML += `<option value="${item}">${item}</option>`;
    } else {
      nominal.innerHTML += `
        <option value="${item.label}" data-harga="${item.harga}">
          ${item.label} - Rp ${item.harga.toLocaleString("id-ID")}
        </option>`;
    }
  });
};

  // NOMINAL DROPDOWN
  nominal.onchange = () => {
    const opt = nominal.selectedOptions[0];
    if (!opt || !opt.dataset.harga) return;

    priceText.innerText =
      "Rp " + Number(opt.dataset.harga).toLocaleString("id-ID");
    adminText.innerText = "";
    priceBox.classList.remove("hidden");
  };

  // AUTO DETEKSI OPERATOR
  inputData.oninput = () => {
    if (!activeService.autoDetect) return;
    const op = detectOperator(inputData.value);
    if (op && activeService.providers[op]) {
      provider.value = op;
      provider.onchange();
    }
  };

  document.getElementById("modal").classList.remove("hidden");
}

/* ================= CLOSE MODAL ================= */
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

/* ================= HITUNG TOTAL NOMINAL MANUAL ================= */
nominalText.oninput = () => {
  if (!activeService || !activeService.isNominalText) return;

  const nominal = Number(nominalText.value.replace(/\D/g, ""));
  if (!nominal) {
    priceBox.classList.add("hidden");
    return;
  }

  const admin = activeService.adminFee || 0;
  const total = nominal + admin;

  priceText.innerText = "Rp " + total.toLocaleString("id-ID");
  adminText.innerText = `Biaya admin Rp ${admin.toLocaleString("id-ID")}`;

  priceBox.classList.remove("hidden");
};

/* ================= SEND WHATSAPP ================= */
function sendWA() {
  const nama = document.getElementById("inputNama").value.trim();
  const provider = document.getElementById("provider").value;
  const data = document.getElementById("inputData").value.trim();
  const admin = activeService.adminFee || 0;

  const nominalValue = activeService.isNominalText
    ? nominalText.value.trim()
    : document.getElementById("nominal").value;

  const hargaEl = document.getElementById("nominal")
    .selectedOptions[0]?.dataset.harga;

if (!nama || !provider || !nominalValue || !data) {
  alert("Lengkapi semua data pesanan!");
  return;
}

if (!bukti.files || bukti.files.length === 0) {
  alert("Silakan upload bukti pembayaran terlebih dahulu!");
  return;
}

if (!buktiURL) {
  alert("Upload bukti pembayaran terlebih dahulu!");
  return;
}

if (activeService.isNominalText && isNaN(Number(nominalValue.replace(/\D/g,"")))) {
  alert("Nominal tidak valid");
  return;
}

  const totalHarga = activeService.isNominalText
    ? Number(nominalValue.replace(/\D/g, "")) + admin
    : Number(hargaEl || 0);

  const pesan = `*PESANAN LAYANAN DIGITAL – UD FIKRI*
━━━━━━━━━━━━━━
👤 Nama: ${nama}
📌 Layanan: ${activeService.title}
🏷 Provider: ${provider}
📦 Nominal/Paket: ${nominalValue}
💰 Total Harga: Rp ${totalHarga.toLocaleString("id-ID")}
${admin > 0 ? `🧾 Biaya Admin: Rp ${admin.toLocaleString("id-ID")}` : ""}
📎 Bukti Pembayaran:
${buktiURL}
🧾 Data: ${data}
━━━━━━━━━━━━━━`;

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}

// UD-Fikri Style Accordion Behavior
document.querySelectorAll(".accordion-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const body = btn.nextElementSibling;
    const isOpen = body.style.maxHeight && body.style.maxHeight !== "0px";

    // toggle current
    if (isOpen) {
      body.style.maxHeight = null;
      btn.classList.remove("active");
      body.classList.remove("open");
    } else {
      body.style.maxHeight = body.scrollHeight + "px";
      btn.classList.add("active");
      body.classList.add("open");
    }
  });
});

/* ===================== Preview Foto =====================*/
const bukti = document.getElementById("bukti");
const preview = document.getElementById("previewBukti");
const previewWrapper = document.getElementById("previewWrapper");
const removeBtn = document.getElementById("removeBukti");

const imgModal = document.getElementById("imgModal");
const imgModalContent = document.getElementById("imgModalContent");

/* Preview foto */
bukti.onchange = async () => {
  const file = bukti.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File harus berupa gambar!");
    bukti.value = "";
    return;
  }

  // preview
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    previewWrapper.classList.remove("hidden");
  };
  reader.readAsDataURL(file);

  // upload ke supabase
  const ext = file.name.split(".").pop();
  const fileName = `bukti-${Date.now()}.${ext}`;
  const path = `layanan-digital/${fileName}`;

  const { error } = await supabase.storage
    .from("bukti-pembayaran")
    .upload(path, file);

  if (error) {
    alert("Gagal upload bukti pembayaran!");
    console.error(error);
    return;
  }

  const { data } = supabase.storage
    .from("bukti-pembayaran")
    .getPublicUrl(path);

  buktiURL = data.publicUrl;
};

/* Hapus bukti */
removeBtn.onclick = () => {
  bukti.value = "";
  preview.src = "";
  previewWrapper.classList.add("hidden");
};

/* Klik foto → fullscreen */
preview.onclick = () => {
  imgModalContent.src = preview.src;
  imgModal.classList.remove("hidden");
};

/* Tutup fullscreen */
imgModal.onclick = () => {
  imgModal.classList.add("hidden");
};
