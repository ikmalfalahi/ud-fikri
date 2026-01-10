/* ================= CONFIG ================= */
const nomorAdmin = "6288803060094";
let activeService = null;

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
        { label: "15.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 17000 },
        { label: "25.000", harga: 27000 },
        { label: "30.000", harga: 32000 },
        { label: "50.000", harga: 52000 },
        { label: "75.000", harga: 72000 },
        { label: "100.000", harga: 102000 },
      ],
      ByU: ["5.000", "10.000", "20.000", "25.000", "30.000", "50.000", "75.000", "100.000"],
      Telkomsel: ["5.000", "10.000", "20.000", "25.000", "30.000", "50.000", "75.000", "100.000"],
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
  const nominalText = document.getElementById("nominalText");
  const inputData = document.getElementById("inputData");

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

 provider.onchange = () => {
  if (activeService.isNominalText) return;

  nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;

  activeService.providers[provider.value].forEach(item => {
    nominal.innerHTML += `
      <option 
        value="${item.label}" 
        data-harga="${item.harga}">
        ${item.label} – Rp ${item.harga.toLocaleString("id-ID")}
      </option>
    `;
  });
};

  // AUTO DETEKSI OPERATOR (Pulsa & Data)
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

/* ================= SEND WHATSAPP ================= */
function sendWA() {
  const nama = document.getElementById("inputNama").value.trim();
  const provider = document.getElementById("provider").value;
  const data = document.getElementById("inputData").value.trim();

  const nominalEl = document.getElementById("nominal");
  const nominal = activeService.isNominalText
    ? document.getElementById("nominalText").value.trim()
    : nominalEl.value;

  const harga = activeService.isNominalText
    ? "-"
    : nominalEl.options[nominalEl.selectedIndex].dataset.harga;

  if (!nama || !provider || !nominal || !data) {
    alert("Lengkapi data terlebih dahulu!");
    return;
  }

  const pesan = `*PESANAN LAYANAN DIGITAL – UD FIKRI*
━━━━━━━━━━━━━━
👤 Nama: ${nama}
📌 Layanan: ${activeService.title}
🏷 Provider: ${provider}
📦 Paket: ${nominal}
💰 Harga: Rp ${harga ? Number(harga).toLocaleString("id-ID") : "-"}
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
