async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;

  appendMessage("Anda", message, "right");
  chatInput.value = "";
  appendMessage("Bot", "⏳ Sedang mengetik...", "left", true);

  try {
    // Menggunakan Puter.js untuk chat
    const response = await puter.ai.chat(message, { model: "gpt-4.1-nano" });

    // Hapus "sedang mengetik"
    const lastTyping = document.querySelector(".typing");
    if (lastTyping) lastTyping.remove();

    appendMessage("Bot", response.output_text || "Maaf, saya belum bisa menjawab itu 😅", "left");
  } catch (e) {
    const lastTyping = document.querySelector(".typing");
    if (lastTyping) lastTyping.remove();
    appendMessage("Bot", "⚠️ Terjadi kesalahan, coba lagi ya.", "left");
  }
}
