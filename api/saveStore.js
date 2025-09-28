import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.join(process.cwd(), "store.json");

  if (req.method === "GET") {
    try {
      const data = await fs.readFile(filePath, "utf8");
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Gagal membaca store.json" });
    }
  }

  if (req.method === "POST") {
    try {
      await fs.writeFile(filePath, JSON.stringify(req.body, null, 2));
      res.status(200).json({ message: "Info toko berhasil disimpan" });
    } catch (err) {
      res.status(500).json({ error: "Gagal menyimpan info toko" });
    }
  }
}
