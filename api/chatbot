// === /api/chatbot.js ===

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Pesan kosong" });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY belum diatur di environment." });
  }

  const tokoContext = `
  Kamu adalah asisten virtual untuk *Toko Sembako UD Fikri*.
  Jawabanmu harus berdasarkan informasi berikut:

  - Nama toko: UD Fikri
  - Jenis usaha: Sembako & kebutuhan harian
  - Lokasi: Jl Ampera Raya. Jl RIni RT.6/RW.2, Ragunan, Ps. Minggu, Kota Jakarta Selatan
  - Jam buka: Setiap hari pukul 06.00–18.00 WIB
  - Kontak: 0852-8106-6230 (WhatsApp)
  - Ongkir: Gratis antar sampai depan rumah.
            Tambahan Rp1.000 per item jika diantar sampai dalam rumah.
  - Produk: Gas Elpiji 3Kg dan 12 Kg, Beras, minyak goreng, telur, aqua, lemiral, teh botol, dll.
  - Motto: “Murah, cepat, dan ramah.”

  Aturan menjawab:
  1. Jawablah sopan, singkat, dan mudah dimengerti.
  2. Jika pertanyaan tidak berkaitan dengan toko, jawab:
     "Maaf, saya hanya bisa membantu seputar toko UD Fikri."
  3. Jangan menciptakan data baru di luar informasi di atas.
  4. Jika ditanya harga produk, beri contoh umum atau sarankan cek langsung di toko.
  5. Gunakan gaya bahasa ramah dan profesional.
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: tokoContext },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    res.status(200).json({
      reply: reply || "Maaf, saya belum bisa menjawab pertanyaan itu 😅",
    });
  } catch (error) {
    console.error("Error ChatGPT:", error);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
}
