export const config = { runtime: "nodejs" };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Metode tidak diizinkan" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Pesan kosong" });

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) return res.status(500).json({ error: "OPENAI_API_KEY belum diatur." });

  const tokoContext = `
  Kamu adalah asisten virtual untuk *Toko Sembako UD Fikri*.
  Jawabanmu harus berdasarkan informasi berikut:

  - Nama toko: UD Fikri
  - Jenis usaha: Sembako & kebutuhan harian
  - Lokasi: Jl Ampera Raya, Ragunan, Ps. Minggu, Jakarta Selatan
  - Jam buka: 06.00–18.00 WIB
  - Kontak: 0852-8106-6230 (WhatsApp)
  - Ongkir: Gratis antar sampai depan rumah. Tambahan Rp1.000 per item jika diantar sampai dalam rumah.
  - Produk: Gas Elpiji, Beras, Minyak goreng, Telur, Aqua, Lemiral, Teh botol, dll.
  - Motto: “Murah, cepat, dan ramah.”
  `;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: tokoContext },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log("🧩 Response OpenAI:", JSON.stringify(data, null, 2));

    // Ambil reply dari OpenAI
    const reply = data.choices?.[0]?.message?.content?.trim();

    // Balasan fallback hanya kalau OpenAI tidak merespon
    res.status(200).json({
      reply: reply || "Maaf, saya belum bisa menjawab pertanyaan itu 😅",
    });
  } catch (error) {
    console.error("🚨 Error ChatGPT:", error);
    res.status(500).json({ reply: "⚠️ Terjadi kesalahan server, coba lagi nanti." });
  }
}
