/* ================= CONFIG ================= */
const nomorAdmin = "6281287505090"; // NOMOR ADMIN

const layanan = {
  /* ===== PRABAYAR ===== */
  pulsa: {
    title: "Pulsa",
    provider: ["Telkomsel", "Indosat", "XL", "Tri", "Axis"],
    nominal: ["5.000", "10.000", "20.000", "50.000"]
  },
  data: {
    title: "Paket Data",
    provider: ["Telkomsel", "Indosat", "XL"],
    nominal: ["5GB", "10GB", "20GB", "Unlimited"]
  },
  token: {
    title: "Token PLN",
    provider: ["PLN"],
    nominal: ["20.000", "50.000", "100.000", "200.000"]
  },
  voucher: {
    title: "Voucher Game",
    provider: ["Mobile Legends", "Free Fire", "PUBG", "Valorant"],
    nominal: ["50 Diamonds", "100 Diamonds", "200 Diamonds"]
  },
  ewallet: {
    title: "E-Wallet",
    provider: ["Dana", "OVO", "GoPay", "ShopeePay"],
    nominal: ["10.000", "25.000", "50.000", "100.000"]
  },

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

  // Placeholder dinamis
  input.placeholder =
    key === "pln" || key === "bpjs" || key === "telkom" || key === "multi"
      ? "ID Pelanggan"
      : "Nomor / Keterangan";

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
Detail  : ${nominal}
Data    : ${input}
`;

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}
