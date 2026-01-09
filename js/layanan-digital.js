/* ================= ACCORDION ================= */
document.querySelectorAll(".accordion").forEach(acc => {
  acc.addEventListener("click", function () {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;

    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
      panel.classList.remove("open");
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
      panel.classList.add("open");
    }
  });
});

/* ================= CONFIG ================= */
const nomorAdmin = "6281287505090"; // GANTI NOMOR ADMIN

const layanan = {
  pulsa: {
    title: "Pulsa",
    provider: ["Telkomsel", "Indosat", "XL", "Tri", "Axis"],
    nominal: ["5.000", "10.000", "20.000", "50.000"]
  },
  data: {
    title: "Paket Data",
    provider: ["Telkomsel", "Indosat", "XL"],
    nominal: ["5GB", "10GB", "20GB"]
  },
  token: {
    title: "Token PLN",
    provider: ["PLN"],
    nominal: ["20.000", "50.000", "100.000", "200.000"]
  },
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
  ewallet: {
    title: "E-Wallet",
    provider: ["Dana", "OVO", "GoPay", "ShopeePay"],
    nominal: ["10.000", "25.000", "50.000"]
  },
  multi: {
    title: "Multifinance",
    provider: ["Adira", "FIF", "WOM", "BAF"],
    nominal: ["Cek Tagihan"]
  }
};

let currentService = "";

/* ================= OPEN MODAL ================= */
function openService(key) {
  currentService = key;
  const data = layanan[key];

  document.getElementById("modalTitle").innerText = data.title;

  const provider = document.getElementById("provider");
  const nominal = document.getElementById("nominal");
  const input = document.getElementById("inputData");

  provider.innerHTML =
    `<option value="">-- Pilih Provider --</option>` +
    data.provider.map(p => `<option value="${p}">${p}</option>`).join("");

  nominal.innerHTML =
    `<option value="">-- Pilih Nominal --</option>` +
    data.nominal.map(n => `<option value="${n}">${n}</option>`).join("");

  input.value = "";

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
  const input = document.getElementById("inputData").value.trim();

  if (!provider || !nominal || !input) {
    alert("Mohon lengkapi semua data terlebih dahulu.");
    return;
  }

  const pesan = `
*PESANAN LAYANAN DIGITAL – UD FIKRI*
----------------------------------
Layanan : ${layanan[currentService].title}
Provider: ${provider}
Nominal : ${nominal}
Data    : ${input}
`;

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}
