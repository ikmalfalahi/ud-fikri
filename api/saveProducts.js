// api/saveProducts.js

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    try {
      const filePath = path.join(process.cwd(), 'products.json');
      fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
      res.status(200).json({ message: 'Produk berhasil disimpan!' });
    } catch (err) {
      res.status(500).json({ error: 'Gagal menyimpan produk', detail: err.message });
    }
  } else if (req.method === 'GET') {
    try {
      const filePath = path.join(process.cwd(), 'products.json');
      if (!fs.existsSync(filePath)) {
        return res.status(200).json([]);
      }
      const data = fs.readFileSync(filePath);
      res.status(200).json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Gagal membaca produk', detail: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
