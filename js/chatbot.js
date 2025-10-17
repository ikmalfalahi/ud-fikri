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
    position: fixed; bottom: 90px; right: 20px; width: 350px; height: 450px;
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

  // === Preset fallback offline ===
  const presetOffline = [
    { pattern: /(jam buka|buka jam)/i, answer: "Toko buka setiap hari pukul 06.00–18.00 WIB." },
    { pattern: /(alamat|lokasi|dimana)/i, answer: "Lokasi: Jl Ampera Raya, RT.6/RW.2, Ragunan, Ps. Minggu, Jakarta Selatan." },
    { pattern: /(kontak|whatsapp)/i, answer: "Kontak: 0852-8106-6230 (WhatsApp)." },
    { pattern: /ongkir/i, answer: "Gratis antar sampai depan rumah. Tambahan Rp1.000 per item jika diantar dalam rumah." }
  ];

  function getPreset(message) {
    const m = message.toLowerCase();
    for (let p of presetOffline) if (p.pattern.test(m)) return p.answer;
    return null;
  }

  // === Fungsi kirim pesan ke AI (OpenAI GPT) ===
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage("Anda", message, "right");
    chatInput.value = "";
    appendMessage("Bot", "⏳ Sedang mengetik...", "left", true);

    const lastTyping = document.querySelector(".typing");

    // fallback offline
    const preset = getPreset(message);
    if (preset) {
      if (lastTyping) lastTyping.remove();
      appendMessage("Bot", preset, "left");
      return;
    }

    try {
      // === Panggil API OpenAI GPT (via fetch) ===
      const apiKey = "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"; // <-- ganti dengan key kamu
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `
Kamu adalah asisten virtual UD Fikri.
Jawabanmu harus realistis dan ramah.
Berikan informasi tentang jam buka, alamat, produk, harga, ongkir, dan saran pelanggan.
          `
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || "Maaf, saya belum bisa menjawab itu 😅";

      if (lastTyping) lastTyping.remove();
      appendMessage("Bot", text, "left");
    } catch (err) {
      console.error(err);
      if (lastTyping) lastTyping.remove();
      appendMessage("Bot", "Maaf, sedang ada gangguan. Coba lagi ya 😊", "left");
    }
  }

  // === Event input ===
  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // === Pesan awal ===
  appendMessage("Bot", "Halo! 👋 Saya asisten UD Fikri. Bisa bantu info produk, harga, atau pengiriman.", "left");
});
