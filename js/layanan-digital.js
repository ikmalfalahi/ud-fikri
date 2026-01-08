const nomorAdmin = "628XXXXXXXXXX"; // GANTI

let layananPPOB = "";

function hubungiAgenBank() {
  const pesan = `
🏦 *LAYANAN AGEN BANK – UD FIKRI*
Saya ingin melakukan layanan Agen Bank.
Mohon info lebih lanjut 🙏
`;
  bukaWA(pesan);
}

function pilihPPOB(layanan) {
  layananPPOB = layanan;
  alert(layanan + " dipilih");
}

function kirimPPOB() {
  if (!layananPPOB) {
    alert("Silakan pilih layanan terlebih dahulu");
    return;
  }

  const pesan = `
📱 *PESANAN PPOB – UD FIKRI*
Layanan: ${layananPPOB}
Mohon info nominal & data 🙏
`;
  bukaWA(pesan);
}

function bukaWA(pesan) {
  const url = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}
