import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const productsFile = path.join(process.cwd(), "public", "products.json");
  const storeFile = path.join(process.cwd(), "public", "store.json");

  if (req.method === "POST") {
    try {
      const { products, storeSettings } = req.body;

      if (products) {
        fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
      }

      if (storeSettings) {
        fs.writeFileSync(storeFile, JSON.stringify(storeSettings, null, 2));
      }

      res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal menyimpan data" });
    }
  } else if (req.method === "GET") {
    try {
      const products = fs.existsSync(productsFile)
        ? JSON.parse(fs.readFileSync(productsFile, "utf8"))
        : [];
      const storeSettings = fs.existsSync(storeFile)
        ? JSON.parse(fs.readFileSync(storeFile, "utf8"))
        : {};
      res.status(200).json({ products, storeSettings });
    } catch (err) {
      res.status(500).json({ error: "Gagal membaca data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
