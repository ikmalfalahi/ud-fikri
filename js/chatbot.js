document.addEventListener("DOMContentLoaded", () => {
  // === Tombol Bubble Chat ===
  const chatButton = document.createElement("div");
  chatButton.innerHTML = `<i class="fa-solid fa-comments"></i>`;
  chatButton.style.cssText = `
    position: fixed; bottom: 20px; right: 20px;
    background: linear-gradient(90deg,#00bfff,#1e90ff);
    color: white; width: 55px; height: 55px;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 26px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    z-index: 9999; transition: transform 0.2s;
  `;
  chatButton.addEventListener("mouseenter", () => chatButton.style.transform = "scale(1.1)");
  chatButton.addEventListener("mouseleave", () => chatButton.style.transform = "scale(1)");
  document.body.appendChild(chatButton);

  // === Kotak Chat ===
  const chatBox = document.createElement("div");
  chatBox.style.cssText = `
    position: fixed; bottom: 90px; right: 20px; width: 320px; height: 420px;
    background: #fff; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    display: none; flex-direction: column; overflow: hidden; z-index: 10000;
    font-family: 'Segoe UI', sans-serif;
  `;
  chatBox.innerHTML = `
    <div style="background: linear-gradient(90deg,#00bfff,#1e90ff); color:white; padding:10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
      <span><i class="fa-solid fa-robot"></i> Asisten UD Fikri</span>
      <button id="chat-close" style="background:none; border:none; color:white; font-size:18px; cursor:pointer;">✕</button>
    </div>
    <div id="chat-content" style="flex:1; padding:10px; overflow-y:auto; font-size:14px; background:#f9f9f9;"></div>
    <div style="display:flex; border-top:1px solid #ddd; background:white;">
      <input id="chat-input" type="text" placeholder="Tulis pesan..." style="flex:1; border:none; padding:10px; outline:none; font-size:14px;">
      <button id="chat-send" style="background:#00bfff; color:white; border:none; padding:10px 15px; cursor:pointer;">
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>
  `;
  document.body.appendChild(chatBox);

  // === Event tombol chat ===
  const closeBtn = chatBox.querySelector("#chat-close");
  chatButton.addEventListener("click", () => {
    chatBox.style.display = "flex";
    chatButton.style.display = "none";
  });
  closeBtn.addEventListener("click", () => {
    chatBox.style.display = "none";
    chatButton.style.display = "flex";
  });

  const chatContent = document.getElementById("chat-content");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  // === Fungsi tampil pesan ===
  function appendMessage(sender, text, side = "left", isTyping = false) {
    const msg = document.createElement("div");
    msg.className = isTyping ? "typing" : "";
    msg.style.cssText = `margin: 6px 0; display: flex; justify-content: ${side === "right" ? "flex-end" : "flex-start"};`;
    msg.innerHTML = `
      <div style="
        background:${side === "right" ? "#1e90ff" : "#e9ecef"};
        color:${side === "right" ? "white" : "black"};
        padding:8px 10px; border-radius:10px;
        max-width:80%; word-wrap:break-word;
      ">
        ${isTyping ? text : text.replace(/\n/g, "<br>")}
      </div>
    `;
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
  }

  // === Ambil info dari index.html & script.js ===
  const htmlInfo = {
    deskripsiToko: document.querySelector("#store-info .desc-text ul")?.innerText || "",
    jamOperasional: document.querySelector("#store-info .panel strong")?.innerText || "06.00–18.00 WIB",
    kontak: document.querySelector("#store-info .panel li i.fa-phone")?.nextSibling?.textContent?.trim() || "0852-8106-6230 (WhatsApp)",
    alamat: document.querySelector("#store-info .panel li i.fa-location-dot")?.nextSibling?.textContent?.trim() || "Jl Ampera Raya, Ragunan, Ps. Minggu, Jakarta Selatan",
    produk: window.products?.map(p => p.name) || ["Gas Elpiji 3Kg", "Beras", "Minyak goreng", "Telur", "Aqua", "Lemiral", "Teh botol"]
  };

  const tokoInfo = {
    nama: "UD Fikri",
    jamBuka: htmlInfo.jamOperasional,
    alamat: htmlInfo.alamat,
    kontak: htmlInfo.kontak,
    deskripsi: htmlInfo.deskripsiToko,
    produk: htmlInfo.produk,
    motto: "Murah, cepat, dan ramah.",
    status: window.storeOpen ? "Toko Sedang Buka" : "Toko Tutup",
    ongkir: window.jarak <= 1 ? "Gratis (≤1 km)" : "Tambahan Rp2.500 per km"
  };

  // === Simpan saran user ===
  const saranTextarea = document.getElementById("saran-produk");
  const saranList = [];

  // === Preset offline lebih lengkap ===
  const presetOffline = [
    { pattern: /(jam buka|buka jam)/i, answer: () => `Toko buka setiap hari pukul ${tokoInfo.jamBuka}.` },
    { pattern: /(alamat|lokasi|dimana)/i, answer: () => `Lokasi: ${tokoInfo.alamat}.` },
    { pattern: /(kontak|whatsapp)/i, answer: () => `Kontak: ${tokoInfo.kontak}.` },
    { pattern: /(ongkir|antar)/i, answer: () => `${tokoInfo.ongkir}.` },
    { pattern: /(produk|barang|apa saja dijual)/i, answer: () => `Produk tersedia: ${tokoInfo.produk.join(", ")}.` },
    { pattern: /(status toko|toko buka tutup)/i, answer: () => `Status saat ini: ${tokoInfo.status}.` },
    { pattern: /(deskripsi|cerita toko|tentang toko)/i, answer: () => tokoInfo.deskripsi || "Deskripsi toko tidak tersedia." },
    { pattern: /(motto|slogan)/i, answer: () => `Motto toko: "${tokoInfo.motto}".` },
    { pattern: /(saran produk|masukan produk)/i, answer: () => {
        if (saranList.length === 0) return "Belum ada saran produk masuk.";
        return "Berikut saran produk dari pengguna:\n- " + saranList.join("\n- ");
      } 
    }
  ];

  function getPreset(message) {
    for (let p of presetOffline) {
      if (p.pattern.test(message.toLowerCase())) {
        return typeof p.answer === "function" ? p.answer() : p.answer;
      }
    }
    return null;
  }

  // === Konteks toko untuk Puter.js ===
  const tokoContext = `
Kamu adalah asisten virtual ${tokoInfo.nama}.
Jawabanmu harus berdasarkan info berikut:
- Nama toko: ${tokoInfo.nama}
- Jenis usaha: Sembako & kebutuhan harian
- Lokasi: ${tokoInfo.alamat}
- Jam buka: ${tokoInfo.jamBuka}
- Kontak: ${tokoInfo.kontak}
- Ongkir: ${tokoInfo.ongkir}
- Produk: ${tokoInfo.produk.join(", ")}
- Motto: ${tokoInfo.motto}
- Deskripsi: ${tokoInfo.deskripsi}
`;

  // === Fungsi kirim pesan ===
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Simpan saran jika user mengetik “saran:” atau dari textarea
    if (/^saran[:]?/i.test(message)) {
      const saranText = message.replace(/^saran[:]?/i, "").trim() || saranTextarea.value.trim();
      if (saranText) {
        saranList.push(saranText);
        appendMessage("Anda", message, "right");
        appendMessage("Bot", `Terima kasih! Saranmu sudah kami catat 😊`, "left");
        chatInput.value = "";
        saranTextarea.value = "";
        return;
      }
    }

    appendMessage("Anda", message, "right");
    chatInput.value = "";
    appendMessage("Bot", "⏳ Sedang mengetik...", "left", true);

    try {
      const lastTyping = document.querySelector(".typing");

      // Cek preset offline dulu
      const preset = getPreset(message);
      if (preset) {
        if (lastTyping) lastTyping.remove();
        appendMessage("Bot", preset, "left");
        return;
      }

      // Fallback ke Puter.js
      if (!window.puter || !puter.ai) throw new Error("Puter.js belum dimuat.");
      const response = await puter.ai.chat({
        model: "gpt-mini",
        input_text: message,
        context: tokoContext
      });

      if (lastTyping) lastTyping.remove();
      appendMessage("Bot", response?.output_text || "Maaf, saya belum bisa menjawab itu 😅", "left");

    } catch (e) {
      console.error("Error Puter.js:", e);
      const lastTyping = document.querySelector(".typing");
      if (lastTyping) lastTyping.remove();
      appendMessage("Bot", "Maaf, saya sedang mengalami gangguan. Coba lagi sebentar ya 😊", "left");
    }
  }

  // === Event input ===
  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // === Pesan awal ===
  appendMessage("Bot", "Halo! 👋 Saya asisten UD Fikri. Ada yang bisa saya bantu hari ini? Kamu bisa memberikan saran produk dengan menulis 'Saran: ...'", "left");
});
