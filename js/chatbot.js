document.addEventListener("DOMContentLoaded", () => {

  // Ambil konten info dari index.html
  const htmlInfo = {
    deskripsiToko: document.querySelector("#store-info .desc-text ul")?.innerText || "",
    jamOperasional: document.querySelector("#store-info .panel strong")?.innerText || "",
    kontak: document.querySelector("#store-info .panel li i.fa-phone")?.nextSibling?.textContent?.trim() || "",
    alamat: document.querySelector("#store-info .panel li i.fa-location-dot")?.nextSibling?.textContent?.trim() || "",
    saranProdukPlaceholder: document.getElementById("saran-produk")?.placeholder || ""
  };

  // Ambil info dari script.js
  const tokoInfo = {
    nama: "UD Fikri",
    jamBuka: htmlInfo.jamOperasional || "06.00–18.00 WIB",
    alamat: htmlInfo.alamat || "Jl Ampera Raya, RT.6/RW.2, Ragunan, Ps. Minggu, Jakarta Selatan",
    kontak: htmlInfo.kontak || "0852-8106-6230 (WhatsApp)",
    deskripsi: htmlInfo.deskripsiToko,
    produk: window.products?.map(p => p.name) || [],
    motto: "Murah, cepat, dan ramah.",
    status: window.storeOpen ? "Toko Sedang Buka" : "Toko Tutup",
    ongkir: window.jarak <= 1 ? "Gratis (≤ 1 km)" : window.detailOngkir?.(window.cart.length) || "Belum dihitung"
  };

  // Preset jawaban offline
  const presetOffline = [
    { pattern: /(jam buka|buka jam|toko buka)/i, answer: () => `Toko buka setiap hari pukul ${tokoInfo.jamBuka}.` },
    { pattern: /(alamat|lokasi|dimana)/i, answer: () => `Lokasi: ${tokoInfo.alamat}.` },
    { pattern: /(kontak|whatsapp)/i, answer: () => `Kontak: ${tokoInfo.kontak}.` },
    { pattern: /(ongkir|antar)/i, answer: () => `${tokoInfo.ongkir}.` },
    { pattern: /(produk|barang|apa saja dijual)/i, answer: () => `Produk tersedia: ${tokoInfo.produk.join(", ")}.` },
    { pattern: /(status toko|toko buka tutup)/i, answer: () => `Status saat ini: ${tokoInfo.status}.` },
    { pattern: /(deskripsi|cerita toko|tentang toko)/i, answer: () => tokoInfo.deskripsi || "Deskripsi toko tidak tersedia." },
    { pattern: /(promo|diskon|harga)/i, answer: () => {
        const promoList = window.products?.filter(p => p.promo).map(p => `${p.name}: Beli ${p.promo.qty} Rp ${p.promo.price.toLocaleString()}`) || [];
        return promoList.length ? `Promo saat ini:\n${promoList.join("\n")}` : "Tidak ada promo saat ini.";
      }
    },
    { pattern: /(motto|slogan)/i, answer: () => `Motto toko: "${tokoInfo.motto}".` }
  ];

  function getPreset(message) {
    for (let p of presetOffline) {
      if (p.pattern.test(message.toLowerCase())) {
        return typeof p.answer === "function" ? p.answer() : p.answer;
      }
    }
    return null;
  }

  // Chatbot input & output
  const chatInput = document.getElementById("chat-input");
  const chatContainer = document.getElementById("chat-container");

  function appendMessage(sender, text, align = "left", isTyping = false) {
    if (!chatContainer) return;
    const div = document.createElement("div");
    div.className = `chat-message ${align}${isTyping ? " typing" : ""}`;
    div.textContent = text;
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

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
        context: `Kamu adalah asisten virtual ${tokoInfo.nama}. Info toko: jam buka ${tokoInfo.jamBuka}, alamat ${tokoInfo.alamat}, kontak ${tokoInfo.kontak}, produk: ${tokoInfo.produk.join(", ")}, motto: ${tokoInfo.motto}, deskripsi: ${tokoInfo.deskripsi}`
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

  // Event enter
  if (chatInput) {
    chatInput.addEventListener("keypress", e => {
      if (e.key === "Enter") sendMessage();
    });
  }

  // Tombol kirim
  const chatSendBtn = document.getElementById("chat-send");
  if (chatSendBtn) chatSendBtn.addEventListener("click", sendMessage);

});
