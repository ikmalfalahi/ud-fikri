import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const productsPath = path.join(process.cwd(), "public", "products.json");
  const storePath = path.join(process.cwd(), "public", "store.json");

  if (req.method === "GET") {
    try {
      const products = fs.existsSync(productsPath)
        ? JSON.parse(fs.readFileSync(productsPath, "utf8"))
        : [];
      const storeSettings = fs.existsSync(storePath)
        ? JSON.parse(fs.readFileSync(storePath, "utf8"))
        : {};

      res.status(200).json({ products, storeSettings });
    } catch (err) {
      res.status(500).json({ error: "Gagal membaca data" });
    }
  }

  else if (req.method === "POST") {
    try {
      const { products, storeSettings } = req.body;

      // simpan produk
      fs.writeFileSync(productsPath, JSON.stringify(products || [], null, 2));

      // simpan info toko
      fs.writeFileSync(storePath, JSON.stringify(storeSettings || {}, null, 2));

      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Gagal menyimpan data" });
    }
  }

  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
