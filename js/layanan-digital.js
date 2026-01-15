"use strict";

const db = window.supabaseClient;

let buktiURL = "";

/* ================= CONFIG ================= */
const nomorAdmin = "6288803060094";
let activeService = null;

/* ================= ELEMENT ================= */
const priceBox = document.getElementById("priceBox");
const priceText = document.getElementById("priceText");
const adminText = document.getElementById("adminText");
const nominalText = document.getElementById("nominalText");

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
        { label: "DC Axis 15.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 17000 },
        { label: "DC Axis 25.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 27000 },
        { label: "DC Axis 30.000 / Bonus Isi Pulsa 1,5Gb 2hr di aplikasi AXISnet", harga: 32000 },
        { label: "DC Axis 50.000 / Bonus Isi Pulsa 2Gb 2hr di aplikasi AXISnet", harga: 53000 },
        { label: "DC Axis 100.000 / Bonus Isi Pulsa 2Gb 2hr di aplikasi AXISnet", harga: 103000 },
      ],
      ByU: [
        { label: "ByU 5.000", harga: 7000 },
        { label: "ByU 10.000", harga: 12000 },
        { label: "ByU 15.000", harga: 17500 },
        { label: "ByU 20.000", harga: 22500 },
        { label: "ByU 25.000", harga: 27500 },
        { label: "ByU 30.000", harga: 32500 },
        { label: "ByU 35.000", harga: 37500 },
        { label: "ByU 40.000", harga: 42500 },
        { label: "ByU 45.000", harga: 47500 },
        { label: "ByU 50.000", harga: 52500 },
        { label: "ByU 55.000", harga: 57500 },
        { label: "ByU 60.000", harga: 62500 },
        { label: "ByU 65.000", harga: 67500 },
        { label: "ByU 70.000", harga: 72500 },
        { label: "ByU 75.000", harga: 77500 },
        { label: "ByU 80.000", harga: 82500 },
        { label: "ByU 85.000", harga: 87500 },
        { label: "ByU 90.000", harga: 92500 },
        { label: "ByU 95.000", harga: 97500 },
        { label: "ByU 100.000", harga: 102500 },
        ],
      Telkomsel: [
        { label: "ByU 5.000", harga: 7000 },
        { label: "ByU 10.000", harga: 12000 },
        { label: "ByU 15.000", harga: 17500 },
        { label: "ByU 20.000", harga: 22500 },
        { label: "ByU 25.000", harga: 27500 },
        { label: "ByU 30.000", harga: 32500 },
        { label: "ByU 35.000", harga: 37500 },
        { label: "ByU 40.000", harga: 42500 },
        { label: "ByU 45.000", harga: 47500 },
        { label: "ByU 50.000", harga: 52500 },
        { label: "ByU 55.000", harga: 57500 },
        { label: "ByU 60.000", harga: 62500 },
        { label: "ByU 65.000", harga: 67500 },
        { label: "ByU 70.000", harga: 72500 },
        { label: "ByU 75.000", harga: 77500 },
        { label: "ByU 80.000", harga: 82500 },
        { label: "ByU 85.000", harga: 87500 },
        { label: "ByU 90.000", harga: 92500 },
        { label: "ByU 95.000", harga: 97500 },
        { label: "ByU 100.000", harga: 102500 },
        ],
      XL: [
        { label: "5.000 / Masa Aktif 7 Hari", harga: 7000 },
        { label: "DC XL 5.000 / Bonus sd 500MB dimyXL (Masa berlaku bonus 1 hari)", harga: 7000 },
        { label: "10.000 / Masa Aktif 15 Hari", harga: 12000 },
        { label: "DC XL 10.000 / Bonus sd 1GB dimyXL (Masa berlaku bonus 1 hari)", harga: 12500 },
        { label: "DC XL 15.000 / Masa aktif 15 hari", harga: 17500 },
        { label: "DC XL 25.000 / Bonus sd 2,5GB di myXL (Masa berlaku bonus 2 hari", harga: 27500 },
        { label: "DC XL 30.000 / Bonus sd 2,5GB di myXL (Masa berlaku bonus 2 hari", harga: 32500 },
        { label: "DC XL 50.000 / Bonus sd 3GB di myXL (Masa berlaku bonus 2 hari", harga: 53000 },
        { label: "DC XL 100.000 / Bonus sd 5GB di myXL (Masa berlaku bonus 2 hari", harga: 103000 },
        ],
      Indosat: [
        { label: "indosat 5.000 / Masa aktif 7 hari", harga: 8000 },
        { label: "indosat 10.000 / Masa aktif 15 hari", harga: 13000 },
        { label: "indosat 12.000 / Masa aktif 15 hari", harga: 14500 },
        { label: "indosat 15.000 / Masa aktif 20 hari", harga: 17500 },
        { label: "indosat 20.000 / Masa aktif 30 hari", harga: 22500 },
        { label: "indosat 25.000 / Masa aktif 30 hari", harga: 27500 },
        { label: "indosat 30.000 / Masa aktif 30 hari", harga: 32500 },
        { label: "indosat 40.000 / Masa aktif 30 hari", harga: 42500 },
        { label: "indosat 50.000 / Masa aktif 45 hari", harga: 52000 },
        { label: "indosat 60.000 / Masa aktif 60 hari", harga: 62500 },
        { label: "indosat 70.000 / Masa aktif 60 hari", harga: 72500 },
        { label: "indosat 80.000 / Masa aktif 60 hari", harga: 82500 },
        { label: "indosat 90.000 / Masa aktif 60 hari", harga: 92500 },
        { label: "indosat 100.000 / Masa aktif 60 hari", harga: 102000 },
        ],
      Tri: [
        { label: "DC Tri 5.000 / Masa aktif 30 hari", harga: 8000 },
        { label: "DC Tri 10.000 / Masa aktif 30 hari", harga: 13000 },
        { label: "Tri 15.000 / Masa aktif 15 hari", harga: 17500 },
        { label: "Tri 20.000 / Masa aktif 20 hari", harga: 23000 },
        { label: "DC Tri 25.000 / Masa aktif 25 hari", harga: 28000 },
        { label: "DC Tri 30.000 / Masa aktif 30 hari", harga: 33000 },
        { label: "DC Tri 40.000 / Masa aktif 40 hari", harga: 43000 },
        { label: "DC Tri 50.000 / Masa aktif 50 hari", harga: 52000 },
        { label: "DC Tri 60.000 / Masa aktif 60 hari", harga: 63000 },
        { label: "DC Tri 70.000 / Masa aktif 70 hari", harga: 73000 },
        { label: "DC Tri 75.000 / Masa aktif 70 hari", harga: 77000 },
        { label: "DC Tri 80.000 / Masa aktif 80 hari", harga: 83000 },
        { label: "DC Tri 90.000 / Masa aktif 90 hari", harga: 95000 },
        { label: "DC Tri 100.000 / Masa aktif 100 hari", harga: 102000 },
        ],
      Smartfren: [
        { label: "DC Smartfren 5.000 / Masa aktif 7 hari", harga: 7500 },
        { label: "DC Smartfren 10.000 / Masa aktif 15 hari", harga: 12500 },
        { label: "Smartfren 20.000 / Masa aktif 30 hari", harga: 22000 },
        { label: "DC Smartfren 20.000 / Masa aktif 30 hari", harga: 22500 },
        { label: "DC Smartfren 25.000 / Masa aktif 30 hari", harga: 27000 },
        { label: "DC Smartfren 30.000 / Masa aktif 30 hari", harga: 32000 },
        { label: "DC Smartfren 50.000 / Masa aktif 60 hari", harga: 52000 },
        { label: "DC Smartfren 60.000 / Masa aktif 75 hari", harga: 62000 },
        { label: "DC Smartfren 75.000 / Masa aktif 75 hari", harga: 77000 },
        { label: "DC Smartfren 100.000 / Masa aktif 120 hari", harga: 102000 },
        ],
    }
  },

data: {
  title: "Paket Data",
  placeholder: "Nomor HP",
  autoDetect: true,
  providers: {
    Axis: [
        { label: "AIGO Mini 3GB + Kuota di Kota-mu 1hr", harga: 10000 },
        { label: "AIGO Mini Bronet 24 Jam 1GB + lokal 3hr", harga: 13000 },
        { label: "AIGO Mini 5GB 2hri", harga: 13000 },
        { label: "AIGO Mini 6,5GB + Lokal 1hr", harga: 14000 },
        { label: "BOOSTR VIDEO 3GB 7hr", harga: 13000 },
        { label: "BOOSTR SOSMED 3GB 7hr", harga: 13000 },
        { label: "BOOSTR GAMES 3GB 7hr", harga: 13000 },
        { label: "BOOSTR 3GB 2hr Weekend", harga: 13000 },
        { label: "DC Tri 50.000 / Masa aktif 50 hari", harga: 52000 },
        { label: "DC Tri 60.000 / Masa aktif 60 hari", harga: 63000 },
        { label: "DC Tri 70.000 / Masa aktif 70 hari", harga: 73000 },
        { label: "DC Tri 75.000 / Masa aktif 70 hari", harga: 77000 },
        { label: "DC Tri 80.000 / Masa aktif 80 hari", harga: 83000 },
        { label: "DC Tri 90.000 / Masa aktif 90 hari", harga: 95000 },
        { label: "DC Tri 100.000 / Masa aktif 100 hari", harga: 102000 },
      ],
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
      DANA: [ 
        {label: "DANA 20.000", harga: 25000},
        {label: "DANA 25.000", harga: 30000},
        {label: "DANA 30.000", harga: 35000},
        {label: "DANA 35.000", harga: 40000},
        {label: "DANA 40.000", harga: 45000},
        {label: "DANA 45.000", harga: 50000},
        {label: "DANA 50.000", harga: 55000},
        {label: "DANA 55.000", harga: 60000},
        {label: "DANA 60.000", harga: 65000},
        {label: "DANA 65.000", harga: 70000},
        {label: "DANA 70.000", harga: 75000},
        {label: "DANA 75.000", harga: 80000},
        {label: "DANA 80.000", harga: 85000},
        {label: "DANA 85.000", harga: 90000},
        {label: "DANA 90.000", harga: 95000},
        {label: "DANA 95.000", harga: 100000},
        {label: "DANA 100.000", harga: 105000},
        {label: "DANA 105.000", harga: 110000},
        {label: "DANA 110.000", harga: 115000},
        {label: "DANA 115.000", harga: 120000},
        {label: "DANA 120.000", harga: 125000},
        {label: "DANA 125.000", harga: 130000},
        {label: "DANA 130.000", harga: 135000},
        {label: "DANA 135.000", harga: 140000},
        {label: "DANA 140.000", harga: 145000},
        {label: "DANA 145.000", harga: 150000},
        {label: "DANA 150.000", harga: 155000},
        {label: "DANA 155.000", harga: 160000},
        {label: "DANA 165.000", harga: 170000},
        {label: "DANA 170.000", harga: 175000},
        {label: "DANA 175.000", harga: 180000},
        {label: "DANA 180.000", harga: 185000},
        {label: "DANA 185.000", harga: 190000},
        {label: "DANA 190.000", harga: 195000},
        {label: "DANA 195.000", harga: 200000},
        {label: "DANA 205.000", harga: 210000},
        {label: "DANA 210.000", harga: 215000},
        {label: "DANA 215.000", harga: 220000},
        {label: "DANA 220.000", harga: 225000},
        {label: "DANA 225.000", harga: 230000},
        {label: "DANA 230.000", harga: 235000},
        {label: "DANA 235.000", harga: 240000},
        {label: "DANA 245.000", harga: 250000},
        {label: "DANA 250.000", harga: 255000},
        ],
      OVO: [
        {label: "OVO 20.000", harga: 25000},
        {label: "OVO 25.000", harga: 30000},
        {label: "OVO 30.000", harga: 35000},
        {label: "OVO 35.000", harga: 40000},
        {label: "OVO 40.000", harga: 45000},
        {label: "OVO 45.000", harga: 50000},
        {label: "OVO 50.000", harga: 55000},
        {label: "OVO 55.000", harga: 60000},
        {label: "OVO 60.000", harga: 65000},
        {label: "OVO 65.000", harga: 70000},
        {label: "OVO 70.000", harga: 75000},
        {label: "OVO 75.000", harga: 80000},
        {label: "OVO 80.000", harga: 85000},
        {label: "OVO 85.000", harga: 90000},
        {label: "OVO 90.000", harga: 95000},
        {label: "OVO 95.000", harga: 100000},
        {label: "OVO 100.000", harga: 105000},
        {label: "OVO 105.000", harga: 110000},
        {label: "OVO 110.000", harga: 115000},
        {label: "OVO 115.000", harga: 120000},
        {label: "OVO 120.000", harga: 125000},
        {label: "OVO 125.000", harga: 130000},
        {label: "OVO 130.000", harga: 135000},
        {label: "OVO 135.000", harga: 140000},
        {label: "OVO 140.000", harga: 145000},
        {label: "OVO 145.000", harga: 150000},
        {label: "OVO 150.000", harga: 155000},
        {label: "OVO 155.000", harga: 160000},
        {label: "OVO 165.000", harga: 170000},
        {label: "OVO 170.000", harga: 175000},
        {label: "OVO 175.000", harga: 180000},
        {label: "OVO 180.000", harga: 185000},
        {label: "OVO 185.000", harga: 190000},
        {label: "OVO 190.000", harga: 195000},
        {label: "OVO 195.000", harga: 200000},
        {label: "OVO 205.000", harga: 210000},
        {label: "OVO 210.000", harga: 215000},
        {label: "OVO 215.000", harga: 220000},
        {label: "OVO 220.000", harga: 225000},
        {label: "OVO 225.000", harga: 230000},
        {label: "OVO 230.000", harga: 235000},
        {label: "OVO 235.000", harga: 240000},
        {label: "OVO 245.000", harga: 250000},
        {label: "OVO 250.000", harga: 255000},
        ],
      GoPay: [
        {label: "GOPAY Cutomer 20.000", harga: 25000},
        {label: "GOPAY Cutomer 25.000", harga: 30000},
        {label: "GOPAY Cutomer 30.000", harga: 35000},
        {label: "GOPAY Cutomer 35.000", harga: 40000},
        {label: "GOPAY Cutomer 40.000", harga: 45000},
        {label: "GOPAY Cutomer 45.000", harga: 50000},
        {label: "GOPAY Cutomer 50.000", harga: 55000},
        {label: "GOPAY Cutomer 55.000", harga: 60000},
        {label: "GOPAY Cutomer 60.000", harga: 65000},
        {label: "GOPAY Cutomer 65.000", harga: 70000},
        {label: "GOPAY Cutomer 70.000", harga: 75000},
        {label: "GOPAY Cutomer 75.000", harga: 80000},
        {label: "GOPAY Cutomer 80.000", harga: 85000},
        {label: "GOPAY Cutomer 85.000", harga: 90000},
        {label: "GOPAY 90.000", harga: 95000},
        {label: "GOPAY 95.000", harga: 100000},
        {label: "GOPAY 100.000", harga: 105000},
        {label: "GOPAY 105.000", harga: 110000},
        {label: "GOPAY 110.000", harga: 115000},
        {label: "GOPAY 115.000", harga: 120000},
        {label: "GOPAY 120.000", harga: 125000},
        {label: "GOPAY 125.000", harga: 130000},
        {label: "GOPAY 130.000", harga: 135000},
        {label: "GOPAY 135.000", harga: 140000},
        {label: "GOPAY 140.000", harga: 145000},
        {label: "GOPAY 145.000", harga: 150000},
        {label: "GOPAY 150.000", harga: 155000},
        {label: "GOPAY 155.000", harga: 160000},
        {label: "GOPAY 165.000", harga: 170000},
        {label: "GOPAY 170.000", harga: 175000},
        {label: "GOPAY 175.000", harga: 180000},
        {label: "GOPAY 180.000", harga: 185000},
        {label: "GOPAY 185.000", harga: 190000},
        {label: "GOPAY 190.000", harga: 195000},
        {label: "GOPAY 195.000", harga: 200000},
        {label: "GOPAY 205.000", harga: 210000},
        {label: "GOPAY 210.000", harga: 215000},
        {label: "GOPAY 215.000", harga: 220000},
        {label: "GOPAY 220.000", harga: 225000},
        {label: "GOPAY 225.000", harga: 230000},
        {label: "GOPAY 230.000", harga: 235000},
        {label: "GOPAY 235.000", harga: 240000},
        {label: "GOPAY 245.000", harga: 250000},
        {label: "GOPAY 250.000", harga: 255000},
        ],
      ShopeePay: [
        {label: "GOPAY 20.000", harga: 25000},
        {label: "GOPAY 25.000", harga: 30000},
        {label: "GOPAY 30.000", harga: 35000},
        {label: "GOPAY 35.000", harga: 40000},
        {label: "GOPAY 40.000", harga: 45000},
        {label: "GOPAY 45.000", harga: 50000},
        {label: "GOPAY 50.000", harga: 55000},
        {label: "GOPAY 55.000", harga: 60000},
        {label: "GOPAY 60.000", harga: 65000},
        {label: "GOPAY 65.000", harga: 70000},
        {label: "GOPAY 70.000", harga: 75000},
        {label: "GOPAY 75.000", harga: 80000},
        {label: "GOPAY 80.000", harga: 85000},
        {label: "GOPAY 85.000", harga: 90000},
        {label: "GOPAY 90.000", harga: 95000},
        {label: "GOPAY 95.000", harga: 100000},
        {label: "GOPAY 100.000", harga: 105000},
        {label: "GOPAY 105.000", harga: 110000},
        {label: "GOPAY 110.000", harga: 115000},
        {label: "GOPAY 115.000", harga: 120000},
        {label: "GOPAY 120.000", harga: 125000},
        {label: "GOPAY 125.000", harga: 130000},
        {label: "GOPAY 130.000", harga: 135000},
        {label: "GOPAY 135.000", harga: 140000},
        {label: "GOPAY 140.000", harga: 145000},
        {label: "GOPAY 145.000", harga: 150000},
        {label: "GOPAY 150.000", harga: 155000},
        {label: "GOPAY 155.000", harga: 160000},
        {label: "GOPAY 165.000", harga: 170000},
        {label: "GOPAY 170.000", harga: 175000},
        {label: "GOPAY 175.000", harga: 180000},
        {label: "GOPAY 180.000", harga: 185000},
        {label: "GOPAY 185.000", harga: 190000},
        {label: "GOPAY 190.000", harga: 195000},
        {label: "GOPAY 195.000", harga: 200000},
        {label: "GOPAY 205.000", harga: 210000},
        {label: "GOPAY 210.000", harga: 215000},
        {label: "GOPAY 215.000", harga: 220000},
        {label: "GOPAY 220.000", harga: 225000},
        {label: "GOPAY 225.000", harga: 230000},
        {label: "GOPAY 230.000", harga: 235000},
        {label: "GOPAY 235.000", harga: 240000},
        {label: "GOPAY 245.000", harga: 250000},
        {label: "GOPAY 250.000", harga: 255000},
        ],
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
    isNominalText: true,
    adminFee: 10000,
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
  adminFee: {
    rules: [
      { min: 0, max: 99999, fee: 2500 },
      { min: 100000, max: 499999, fee: 5000 },
      { min: 500000, max: 999999, fee: 7500 },
      { min: 1000000, max: 1000000000, fee: 10000 }
    ],
    default: 10000
  },
  providers: {
    BCA: [], BRI: [], BNI: [], Mandiri: [],
    DANA: [], "GOPAY DRIVER": [], "GOPAY CUSTOMER": [], "OVO": []
  }
},

tarik: {
  title: "Tarik Tunai",
  placeholder: "Nomor Akun",
  isNominalText: true,
  adminFee: 5000,
  providers: { BCA: [], BRI: [], BNI: [], Mandiri: [], DANA: [], "GOPAY DRIVER": [], "GOPAY CUSTOMER": [], "OVO": [] }
},

setor: {
  title: "Setor Tunai",
  placeholder: "Nomor Akun",
  isNominalText: true,
  adminFee: 10000,
  providers: { BCA: [], BRI: [], BNI: [], Mandiri: [], DANA: [], "GOPAY DRIVER": [], "GOPAY CUSTOMER": [], "OVO": [] }
},

ecommerce: {
  title: "Pembayaran E-Commerce",
  placeholder: "No Pesanan",
  isNominalText: true,
  adminFee: 5000,
  providers: { Shopee: [], Tokopedia: [], Lazada: [], Lainya: [] }
}
};

// ===== HITUNG ADMIN FEE (SUPPORT ANGKA & RULES) =====
function getAdminFee(service, nominal) {
  if (!service || !service.adminFee) return 0;

  // admin fee lama (angka)
  if (typeof service.adminFee === "number") {
    return service.adminFee;
  }

  // admin fee bertingkat (rules)
  if (service.adminFee.rules) {
    const rule = service.adminFee.rules.find(
      r => nominal >= r.min && nominal <= r.max
    );
    return rule ? rule.fee : service.adminFee.default;
  }

  return 0;
}


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
  const inputData = document.getElementById("inputData");

  // reset harga
  priceBox.classList.add("hidden");
  priceText.innerText = "Rp 0";
  adminText.innerText = "";

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

  // PROVIDER CHANGE
 provider.onchange = () => {
  if (activeService.isNominalText) return;

  nominal.innerHTML = `<option value="">Pilih Nominal / Paket</option>`;
  priceBox.classList.add("hidden");

  const list = activeService.providers[provider.value];
  if (!Array.isArray(list)) return;

  list.forEach(item => {
    if (typeof item === "string") {
      nominal.innerHTML += `<option value="${item}">${item}</option>`;
    } else {
      nominal.innerHTML += `
        <option value="${item.label}" data-harga="${item.harga}">
          ${item.label} - Rp ${item.harga.toLocaleString("id-ID")}
        </option>`;
    }
  });
};

  // NOMINAL DROPDOWN
  nominal.onchange = () => {
    const opt = nominal.selectedOptions[0];
    if (!opt || !opt.dataset.harga) return;

    priceText.innerText =
      "Rp " + Number(opt.dataset.harga).toLocaleString("id-ID");
    adminText.innerText = "";
    priceBox.classList.remove("hidden");
  };

  // AUTO DETEKSI OPERATOR
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

/* ================= HITUNG TOTAL NOMINAL MANUAL ================= */
nominalText.oninput = () => {
  if (!activeService || !activeService.isNominalText) return;

  const nominal = Number(nominalText.value.replace(/\D/g, ""));
  if (!nominal) {
    priceBox.classList.add("hidden");
    return;
  }

  // ✅ UBAH DI SINI SAJA
  const admin =
    typeof activeService.adminFee === "number"
      ? activeService.adminFee
      : activeService.adminFee?.rules
        ? (activeService.adminFee.rules.find(
            r => nominal >= r.min && nominal <= r.max
          )?.fee ?? activeService.adminFee.default)
        : 0;

  const total = nominal + admin;

  priceText.innerText = "Rp " + total.toLocaleString("id-ID");
  adminText.innerText = `Biaya admin Rp ${admin.toLocaleString("id-ID")}`;

  priceBox.classList.remove("hidden");
  adminText.classList.remove("hidden");
};

/* ================= SEND WHATSAPP ================= */
function sendWA() {
  const nama = document.getElementById("inputNama").value.trim();
  const provider = document.getElementById("provider").value;
  const data = document.getElementById("inputData").value.trim();
  const admin = getAdminFee(activeService, nominalNumber);

  const nominalValue = activeService.isNominalText
    ? nominalText.value.trim()
    : document.getElementById("nominal").value;

  const hargaEl = document.getElementById("nominal")
    .selectedOptions[0]?.dataset.harga;

  if (!nama || !provider || !nominalValue || !data) {
    alert("Lengkapi semua data pesanan!");
    return;
  }

  if (!bukti.files || bukti.files.length === 0) {
    alert("Silakan upload bukti pembayaran terlebih dahulu!");
    return;
  }

  if (!buktiURL) {
    alert("Upload bukti pembayaran terlebih dahulu!");
    return;
  }

  if (activeService.isNominalText && isNaN(Number(nominalValue.replace(/\D/g, "")))) {
    alert("Nominal tidak valid");
    return;
  }

  const totalHarga = activeService.isNominalText
    ? Number(nominalValue.replace(/\D/g, "")) + admin
    : Number(hargaEl || 0) + admin;

  let pesan = `*PESANAN LAYANAN DIGITAL – UD FIKRI*\n====================\n`;
  pesan += `*Nama*: ${nama}\n`;
  pesan += `*Layanan*: ${activeService.title}\n`;
  pesan += `*Provider*: ${provider}\n`;
  pesan += `*Data*: ${data}\n`;
  pesan += `*Nominal/Paket*: ${nominalValue}\n`;
  pesan += `*Total Harga*: Rp ${totalHarga.toLocaleString("id-ID")}\n`;
  if (admin > 0) pesan += `*Biaya Admin*: Rp ${admin.toLocaleString("id-ID")}\n`;
  pesan += `--------------------\n`;
  pesan += `*Bukti Pembayaran*:\n${buktiURL}\n`;
  pesan += `====================\n`;
  pesan += `_Terima kasih sudah berbelanja_\n`;
  pesan += `https://ud-fikri.vercel.app`;

  const nomorAdmin = "6288803060094"; // nomor tujuan WA
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

/* ===================== Preview Foto =====================*/
/* Preview foto */
bukti.onchange = async () => {
  const file = bukti.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File harus berupa gambar!");
    bukti.value = "";
    return;
  }

  // preview
  const reader = new FileReader();
  reader.onload = e => {
    preview.src = e.target.result;
    previewWrapper.classList.remove("hidden");
  };
  reader.readAsDataURL(file);

  // upload ke supabase
  const ext = file.name.split(".").pop();
  const fileName = `bukti-${Date.now()}.${ext}`;
  const path = `layanan-digital/${fileName}`;

  const { error } = await db.storage
    .from("bukti-pembayaran")
    .upload(path, file);

  if (error) {
    alert("Gagal upload bukti pembayaran!");
    console.error(error);
    return;
  }

  const { data } = db.storage
    .from("bukti-pembayaran")
    .getPublicUrl(path);

  buktiURL = data.publicUrl;
};

/* Hapus bukti */
removeBtn.onclick = () => {
  bukti.value = "";
  preview.src = "";
  previewWrapper.classList.add("hidden");
};

/* Klik foto → fullscreen */
preview.onclick = () => {
  imgModalContent.src = preview.src;
  imgModal.classList.remove("hidden");
};

/* Tutup fullscreen */
imgModal.onclick = () => {
  imgModal.classList.add("hidden");
};

/* ================= SERVICE BUTTON CLICK ================= */
document.querySelectorAll(".service-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.service;
    openService(key);
  });
});

/* ================= BUTTON MODAL ACTION ================= */
document.getElementById("btnSendWA").onclick = sendWA;
document.getElementById("btnCloseModal").onclick = closeModal;
