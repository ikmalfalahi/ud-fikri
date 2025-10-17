document.addEventListener("DOMContentLoaded", () => {
  let chatSaran = ""; // Menyimpan saran dari chat
  const chatButton = document.createElement("div");
  chatButton.innerHTML = `<i class="fa-solid fa-comments"></i>`;
  chatButton.style.cssText = `position: fixed; bottom: 20px; right: 20px; background: linear-gradient(90deg,#00bfff,#1e90ff); color: white; width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 26px; box-shadow: 0 4px 8px rgba(0,0,0,0.3); z-index: 9999; transition: transform 0.2s;`;
  chatButton.addEventListener("mouseenter", () => chatButton.style.transform = "scale(1.1)");
  chatButton.addEventListener("mouseleave", () => chatButton.style.transform = "scale(1)");
  document.body.appendChild(chatButton);

  const chatBox = document.createElement("div");
  chatBox.style.cssText = `position: fixed; bottom: 90px; right: 20px; width: 320px; height: 420px; background: #fff; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); display: none; flex-direction: column; overflow: hidden; z-index: 10000; font-family: 'Segoe UI', sans-serif;`;
  chatBox.innerHTML = `
    <div style="background: linear-gradient(90deg,#00bfff,#1e90ff); color:white; padding:10px; font-weight:bold; display:flex; justify-content:space-between; align-items:center;">
      <span><i class="fa-solid fa-robot"></i> Asisten UD Fikri</span>
      <button id="chat-close" style="background:none; border:none; color:white; font-size:18px; cursor:pointer;">✕</button>
    </div>
    <div id="chat-content" style="flex:1; padding:10px; overflow-y:auto; font-size:14px; background:#f9f9f9;"></div>
    <div style="display:flex; border-top:1px solid #ddd; background:white;">
      <input id="chat-input" type="text" placeholder="Tulis pesan..." style="flex:1; border:none; padding:10px; outline:none; font-size:14px;">
      <button id="chat-send" style="background:#00bfff; color:white; border:none; padding:10px 15px; cursor:pointer;"><i class="fa-solid fa-paper-plane"></i></button>
    </div>
  `;
  document.body.appendChild(chatBox);

  const closeBtn = chatBox.querySelector("#chat-close");
  chatButton.addEventListener("click", () => { chatBox.style.display = "flex"; chatButton.style.display = "none"; });
  closeBtn.addEventListener("click", () => { chatBox.style.display = "none"; chatButton.style.display = "flex"; });

  const chatContent = document.getElementById("chat-content");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");

  function appendMessage(sender, text, side = "left", isTyping = false) {
    const msg = document.createElement("div");
    msg.className = isTyping ? "typing" : "";
    msg.style.cssText = `margin: 6px 0; display: flex; justify-content: ${side === "right" ? "flex-end" : "flex-start"};`;
    msg.innerHTML = `<div style="background:${side==="right"?"#1e90ff":"#e9ecef"}; color:${side==="right"?"white":"black"}; padding:8px 10px; border-radius:10px; max-width:80%; word-wrap:break-word;">${isTyping ? text : text.replace(/\n/g,"<br>")}</div>`;
    chatContent.appendChild(msg);
    chatContent.scrollTop = chatContent.scrollHeight;
  }

  const presetOffline = [
    { pattern: /(jam buka|buka jam)/i, answer: "Toko buka setiap hari pukul 06.00–18.00 WIB." },
    { pattern: /(alamat|lokasi|dimana)/i, answer: "Lokasi: Jl Ampera Raya, RT.6/RW.2, Ragunan, Ps. Minggu, Jakarta Selatan." },
    { pattern: /(kontak|whatsapp)/i, answer: "Kontak: 0852-8106-6230 (WhatsApp)." },
    { pattern: /ongkir/i, answer: "Gratis antar sampai depan rumah. Tambahan Rp1.000 per item jika diantar dalam rumah." },
    { pattern: /(produk|barang|jual)/i, answer: "Kami menyediakan Gas Elpiji, Beras, Minyak goreng, Telur, Aqua, Lemiral, Teh botol, dll." }
  ];
  function getPreset(message) { const m = message.toLowerCase(); for (let p of presetOffline) if(p.pattern.test(m)) return p.answer; return null; }

  async function sendMessage() {
    const message = chatInput.value.trim();
    if(!message) return;
    appendMessage("Anda", message, "right");
    chatInput.value = "";
    appendMessage("Bot", "⏳ Sedang mengetik...", "left", true);
    const lastTyping = document.querySelector(".typing");

    // Simpan saran dari user
    if(/saran/i.test(message)) chatSaran += `- ${message}\n`;

    const preset = getPreset(message);
    if(preset) { if(lastTyping) lastTyping.remove(); appendMessage("Bot", preset,"left"); return; }

    try {
      if(!window.puter || !puter.ai) throw new Error("Puter.js belum dimuat.");
      const tokoContext = `
Kamu adalah asisten virtual UD Fikri.
Jawabanmu harus berdasarkan info berikut:
- Nama toko: UD Fikri
- Jenis usaha: Sembako & kebutuhan harian
- Lokasi: Jl Ampera Raya, Ragunan, Ps. Minggu, Jakarta Selatan
- Jam buka: 06.00–18.00 WIB
- Kontak: 0852-8106-6230 (WhatsApp)
- Ongkir: Gratis antar depan rumah, tambahan Rp1.000 per item jika diantar dalam rumah
- Produk: Gas Elpiji 3Kg & 12Kg, Beras, Minyak goreng, Telur, Aqua, Lemiral, Teh botol, dll
- Motto: “Murah, cepat, dan ramah.”
- Saran user bisa diterima dan dikirim saat checkout
      `;
      const response = await puter.ai.chat({ model: "gpt-mini", input_text: message, context: tokoContext });
      if(lastTyping) lastTyping.remove();
      appendMessage("Bot", response?.output_text || "Maaf, saya belum bisa menjawab itu 😅", "left");
    } catch(e) {
      console.error(e);
      if(lastTyping) lastTyping.remove();
      appendMessage("Bot", "Maaf, saya sedang mengalami gangguan. Coba lagi sebentar ya 😊", "left");
    }
  }

  chatSend.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress",(e)=>{if(e.key==="Enter") sendMessage();});

  appendMessage("Bot", "Halo! 👋 Saya asisten UD Fikri. Saya bisa menerima saranmu dan membantu info toko, produk, ongkir, promo.", "left");

  // === Integrasi WhatsApp Checkout ===
  const checkoutBtn = document.getElementById("checkout");
  checkoutBtn.addEventListener("click", () => {
    const name = document.getElementById("customer-name").value || "-";
    const address = document.getElementById("customer-address").value || "-";
    const products = Array.from(document.querySelectorAll("#cart-items li")).map(li=>li.textContent).join("\n") || "-";
    const total = document.getElementById("cart-total").textContent || "-";
    const saranText = chatSaran ? `Saran / Masukan:\n${chatSaran}` : "";

    const waMessage = `Halo UD Fikri! Saya ingin memesan:\n\nNama: ${name}\nAlamat: ${address}\nProduk:\n${products}\n${total}\n${saranText}`;
    const waUrl = `https://wa.me/6285281066230?text=${encodeURIComponent(waMessage)}`;
    window.open(waUrl,"_blank");
  });
});
