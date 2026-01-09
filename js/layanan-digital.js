/* ================= CONFIG ================= */
const nomorAdmin = "6281287505090";

/* ================= DATA LAYANAN ================= */
const services = {
  pulsa: {
    title: "Pulsa Prabayar",
    placeholder: "Nomor HP",
    providers: {
      Telkomsel: ["5.000", "10.000", "20.000", "50.000"],
      XL: ["5.000", "10.000", "25.000"],
      Indosat: ["5.000", "10.000", "20.000"],
      Tri: ["5.000", "10.000", "30.000"]
    }
  },

  data: {
    title: "Paket Data",
    placeholder: "Nomor HP",
    providers: {
      Telkomsel: ["5GB / 30 Hari", "10GB / 30 Hari", "20GB / 30 Hari"],
      XL: ["6GB / 30 Hari", "12GB / 30 Hari"],
      Indosat: ["8GB / 30 Hari", "16GB / 30 Hari"],
      Tri: ["10GB / 30 Hari", "25GB / 30 Hari"],
      Smartfren: ["Unlimited 1 Hari", "Unlimited 30 Hari"]
    }
  },

  token: {
    title: "Token Listrik PLN",
    placeholder: "ID Pelanggan",
    providers: {
      PLN: ["20.000", "50.000", "100.000", "200.000", "500.000", "1.000.000"]
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
    providers: { BCA: [], BRI: [], BNI: [], Mandiri: [] }
  },

  tarik: {
    title: "Tarik Tunai",
    placeholder: "Nomor Akun",
    isNominalText: true,
    providers: { "Via E-Wallet": [] }
  },

  setor: {
    title: "Setor Tunai",
    placeholder: "Nomor Akun",
    isNominalText: true,
    providers: { "Via E-Wallet": [] }
  },

  ecommerce: {
    title: "Pembayaran E-Commerce",
    placeholder: "No Pesanan",
    isNominalText: true,
    providers: { Shopee: [], Tokopedia: [], Lazada: [] }
  }
};

let activeService = null;

/* ================= OPEN MODAL ================= */
function openService(key) {
  activeService = services[key];
  if (!activeService) return;

  document.getElementById("modalTitle").innerText = activeService.title;
  document.getElementById("inputData").placeholder = activeService.placeholder;

  const provider = document.getElementById("provider");
  const nominal = document.getElementById("nominal");
  const nominalText = document.getElementById("nominalText");

  provider.innerHTML = `<option value="">Pilih Provider</option>`;
  nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;

  // reset visibility
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

  provider.onchange = () => {
    if (activeService.isNominalText) return;

    nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;
    activeService.providers[provider.value].forEach(n => {
      nominal.innerHTML += `<option value="${n}">${n}</option>`;
    });
  };

  document.getElementById("modal").classList.remove("hidden");
}

/* ================= CLOSE MODAL ================= */
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

/* ================= SEND WHATSAPP ================= */
function sendWA() {
  const nama = document.getElementById("inputNama").value;
  const provider = document.getElementById("provider").value;
  const nominalDropdown = document.getElementById("nominal").value;
  const nominalText = document.getElementById("nominalText").value;
  const input = document.getElementById("inputData").value;

  const nominal = activeService.isNominalText
    ? nominalText
    : nominalDropdown;

  if (!nama || !provider || !nominal || !input) {
    alert("Lengkapi data terlebih dahulu!");
    return;
  }

  const pesan = `*PESANAN LAYANAN DIGITAL UD FIKRI*
━━━━━━━━━━━━━━
👤 Nama: ${nama}
📌 Layanan: ${activeService.title}
🏷 Provider: ${provider}
📦 Nominal/Paket: ${nominal}
🧾 Data: ${input}
━━━━━━━━━━━━━━`;

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}
