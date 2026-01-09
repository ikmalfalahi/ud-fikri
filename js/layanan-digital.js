/* ================= CONFIG ================= */
const nomorAdmin = "6281287505090";

/* ================= DATA LAYANAN ================= */
const services = {
  /* ===== PRABAYAR ===== */
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

  /* ===== PASCABAYAR ===== */
  pln: {
    title: "Tagihan PLN Pascabayar",
    placeholder: "ID Pelanggan",
    providers: {
      PLN: ["Cek Tagihan"]
    }
  },

  bpjs: {
    title: "BPJS Kesehatan",
    placeholder: "Nomor VA",
    providers: {
      BPJS: ["Cek Tagihan"]
    }
  },

  telkom: {
    title: "Telkom / IndiHome",
    placeholder: "Nomor Pelanggan",
    providers: {
      Telkom: ["Cek Tagihan"]
    }
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
    placeholder: "Keterangan Transfer",
    providers: {
      BCA: ["Nominal Bebas"],
      BRI: ["Nominal Bebas"],
      BNI: ["Nominal Bebas"],
      Mandiri: ["Nominal Bebas"]
    }
  },

  tarik: {
    title: "Tarik Tunai",
    placeholder: "Nomor Akun",
    providers: {
      "Via E-Wallet": ["Nominal Bebas"]
    }
  },

  setor: {
    title: "Setor Tunai",
    placeholder: "Nomor Akun",
    providers: {
      "Via E-Wallet": ["Nominal Bebas"]
    }
  },

  ecommerce: {
    title: "Pembayaran E-Commerce",
    placeholder: "No Pesanan",
    providers: {
      Shopee: ["Total Tagihan"],
      Tokopedia: ["Total Tagihan"],
      Lazada: ["Total Tagihan"]
    }
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

  provider.innerHTML = `<option value="">Pilih Provider</option>`;
  nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;

  Object.keys(activeService.providers).forEach(p => {
    provider.innerHTML += `<option value="${p}">${p}</option>`;
  });

  provider.onchange = () => {
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
  const provider = document.getElementById("provider").value;
  const nominal = document.getElementById("nominal").value;
  const input = document.getElementById("inputData").value;

  if (!provider || !nominal || !input) {
    alert("Lengkapi data terlebih dahulu!");
    return;
  }

  const pesan = `*PESANAN LAYANAN DIGITAL UD FIKRI*
━━━━━━━━━━━━━━
📌 Layanan: ${activeService.title}
🏷 Provider: ${provider}
📦 Paket/Nominal: ${nominal}
🧾 Data: ${input}
━━━━━━━━━━━━━━`;

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}
