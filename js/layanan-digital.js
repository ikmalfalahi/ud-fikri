/* ================= CONFIG ================= */
const nomorAdmin = "6281287505090"; // NOMOR ADMIN

const layanan = {
  /* ===== PRABAYAR ===== */
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
  }
};

  /* ===== PASCABAYAR ===== */
  pln: {
    title: "Tagihan PLN",
    provider: ["PLN Pascabayar"],
    nominal: ["Cek Tagihan"]
  },
  bpjs: {
    title: "BPJS Kesehatan",
    provider: ["BPJS"],
    nominal: ["Cek Tagihan"]
  },
  telkom: {
    title: "Telkom / Indihome",
    provider: ["Telkom"],
    nominal: ["Cek Tagihan"]
  },
  multi: {
    title: "Multifinance",
    provider: ["Adira", "FIF", "WOM", "BAF"],
    nominal: ["Cek Tagihan"]
  },

  /* ===== KEUANGAN ===== */
  transfer: {
    title: "Transfer Antar Bank",
    provider: ["BCA", "BRI", "BNI", "Mandiri", "Bank Lainnya"],
    nominal: ["Isi di Keterangan"]
  },
  tarik: {
    title: "Tarik Tunai",
    provider: ["BCA", "BRI", "BNI", "Mandiri"],
    nominal: ["Nominal Bebas"]
  },
  setor: {
    title: "Setor Tunai",
    provider: ["BCA", "BRI", "BNI", "Mandiri"],
    nominal: ["Nominal Bebas"]
  },
  ecommerce: {
    title: "Pembayaran E-Commerce",
    provider: ["Shopee", "Tokopedia", "Lazada", "Bukalapak"],
    nominal: ["Total Tagihan"]
  }
};

let currentService = "";

/* ================= OPEN MODAL ================= */
let activeService = null;

function openService(type) {
  activeService = services[type];
  if (!activeService) return;

  document.getElementById("modalTitle").innerText = activeService.title;
  document.getElementById("inputData").placeholder = activeService.placeholder;

  const providerSelect = document.getElementById("provider");
  const nominalSelect = document.getElementById("nominal");

  providerSelect.innerHTML = `<option value="">Pilih Provider</option>`;
  nominalSelect.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;

  Object.keys(activeService.providers).forEach(p => {
    providerSelect.innerHTML += `<option value="${p}">${p}</option>`;
  });

  providerSelect.onchange = () => {
    const selected = providerSelect.value;
    nominalSelect.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;
    if (!selected) return;

    activeService.providers[selected].forEach(n => {
      nominalSelect.innerHTML += `<option value="${n}">${n}</option>`;
    });
  };

  document.getElementById("modal").classList.remove("hidden");
}

/* ================= CLOSE MODAL ================= */
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("provider").innerHTML = "";
  document.getElementById("nominal").innerHTML = "";
  document.getElementById("inputData").value = "";
}

/* ================= SEND WHATSAPP ================= */
function sendWA() {
  const provider = document.getElementById("provider").value;
  const nominal = document.getElementById("nominal").value;
  const input = document.getElementById("inputData").value;

  if (!provider || !nominal || !input) {
    alert("Lengkapi data terlebih dahulu!");
    return;
  }

  const text = `*PESANAN LAYANAN DIGITAL UD FIKRI*
━━━━━━━━━━━━━━
📌 Layanan: ${activeService.title}
🏷 Provider: ${provider}
📦 Paket/Nominal: ${nominal}
🧾 Data: ${input}
━━━━━━━━━━━━━━`;

  const wa = "628xxxxxxxxxx"; // ganti nomor WA
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, "_blank");
}
