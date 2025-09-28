import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), "public", "data.json");

  if (req.method === "GET") {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Gagal membaca data.json" });
    }
  } 
  
  else if (req.method === "POST") {
    try {
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Gagal menyimpan data.json" });
    }
  } 
  
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
