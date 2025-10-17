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

  // === Fungsi kirim pesan dengan Puter.js ===
  async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage("Anda", message, "right");
    chatInput.value = "";
    appendMessage("Bot", "⏳ Sedang mengetik...", "left", true);

    try {
      if (!window.puter || !puter.ai) {
        throw new Error("Puter.js belum dimuat. Pastikan <script src='https://js.puter.com/v2/'> ada di HTML.");
      }

      // Gunakan model gratis "gpt-3.5-mini" untuk keamanan
      const response = await puter.ai.chat(message, { model: "gpt-3.5-mini" });

      const lastTyping = document.querySelector(".typing");
      if (lastTyping) lastTyping.remove();

      appendMessage("Bot", response?.output_text || "Maaf, saya belum bisa menjawab itu 😅", "left");
    } catch (e) {
      console.error("Error Puter.js:", e);

      const lastTyping = document.querySelector(".typing");
      if (lastTyping) lastTyping.remove();

      // Fallback sederhana: preset jawaban jika Puter.js gagal
      const fallback = [
        "Maaf, saya sedang mengalami gangguan. Coba lagi sebentar ya 😊",
        "Ups, saya tidak bisa merespons sekarang. Silakan tulis pertanyaan lain.",
        "Maaf, chatbot sedang offline. Bisa coba beberapa saat lagi."
      ];
      const randomFallback = fallback[Math.floor(Math.random() * fallback.length)];
      appendMessage("Bot", randomFallback, "left");
    }
  }

  // === Event input ===
  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // === Pesan awal ===
  appendMessage("Bot", "Halo! 👋 Saya asisten UD Fikri. Ada yang bisa saya bantu hari ini?", "left");
});
