import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method === "POST") {
    const filePath = path.join(process.cwd(), "store.json");
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.status(200).json({ message: "Info toko berhasil disimpan" });
  } else if (req.method === "GET") {
    const filePath = path.join(process.cwd(), "store.json");
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf8");
      res.status(200).json(JSON.parse(data));
    } else {
      res.status(200).json({});
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
