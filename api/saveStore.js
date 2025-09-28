import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'store.json');
    await fs.writeFile(filePath, JSON.stringify(req.body, null, 2), 'utf-8');
    return res.status(200).json({ message: 'Info toko berhasil disimpan' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Gagal menyimpan info toko' });
  }
}
