const nomorAdmin = "628XXXXXXXXXX";

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
    title: "BPJS",
    provider: ["BPJS Kesehatan"],
    nominal: ["Cek Tagihan"]
  },
  telkom: {
    title: "Telkom",
    provider: ["Indihome / Telkom"],
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

function openService(key) {
  currentService = key;
  const data = layanan[key];

  document.getElementById("modalTitle").innerText = data.title;

  const provider = document.getElementById("provider");
  const nominal = document.getElementById("nominal");

  provider.innerHTML = data.provider.map(p => `<option>${p}</option>`).join("");
  nominal.innerHTML = data.nominal.map(n => `<option>${n}</option>`).join("");

  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function sendWA() {
  const provider = document.getElementById("provider").value;
  const nominal = document.getElementById("nominal").value;
  const input = document.getElementById("inputData").value;

  const pesan = `
*PESANAN LAYANAN DIGITAL – UD FIKRI*
Layanan: ${layanan[currentService].title}
Provider: ${provider}
Nominal: ${nominal}
Data: ${input}
`;

  window.open(
    `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
}
