import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const filePath = path.join(process.cwd(), 'products.json');
    fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
    res.status(200).json({ message: 'Produk berhasil disimpan!' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
