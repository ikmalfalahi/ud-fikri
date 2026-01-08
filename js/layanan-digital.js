const nomorAdmin = "628XXXXXXXXXX"; // GANTI NOMOR WA

let layananDipilih = "";

function hubungiBank() {
  const pesan = `
*🏦 LAYANAN AGEN BANK – UD FIKRI*
Saya ingin melakukan:
- Tarik / Setor Tunai
- Transfer Bank
- Cek Saldo
Mohon info 🙏
`;
  bukaWA(pesan);
}

function pilihPPOB(layanan) {
  layananDipilih = layanan;
  alert(layanan + " dipilih");
}

function kirimPPOB() {
  if (!layananDipilih) {
    alert("Pilih layanan PPOB dulu");
    return;
  }

  const pesan = `
*📱 PESANAN PPOB – UD FIKRI*
Layanan: ${layananDipilih}
Mohon info nominal & data 🙏
`;
  bukaWA(pesan);
}

function bukaWA(pesan) {
  const url = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}
