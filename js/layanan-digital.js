let layanan = "";

function pilihLayanan(nama) {
  layanan = nama;
  document.getElementById("judulLayanan").innerText = nama;
  document.getElementById("formLayanan").classList.remove("hidden");
}

function kirimWA() {
  const nomor = document.getElementById("inputNomor").value;
  const nominal = document.getElementById("inputNominal").value;
  const catatan = document.getElementById("inputCatatan").value;

  if (!nomor || !nominal) {
    alert("Nomor dan nominal wajib diisi!");
    return;
  }

  const pesan = `
*🧾 PESANAN LAYANAN DIGITAL – UD FIKRI*
========================
*Layanan:* ${layanan}
*Nomor / ID:* ${nomor}
*Nominal:* ${nominal}
*Catatan:* ${catatan || "-"}
========================
Mohon diproses 🙏
`;

  const nomorAdmin = "628XXXXXXXXXX"; // GANTI NOMOR ADMIN
  const linkWA = `https://wa.me/${nomorAdmin}?text=${encodeURIComponent(pesan)}`;

  window.open(linkWA, "_blank");
}
