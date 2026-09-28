# ud-fikri
Menjual GAS ELPIJI 12Kg &amp; 3Kg, AQUA, LEMINERAL, PRIMA, VIT dan bahan pokok sehari-hari seperti BERAS, MINYAK, TELUR, dan TISSUE. 


## Kelola produk

1. Jalankan `setup-produk.sql` sekali di Supabase SQL Editor. Skrip membuat tabel katalog, bucket `produk-fikri` beserta kebijakan akses, serta memasukkan 46 produk yang sebelumnya tertulis di `js/script.js`. Impor bisa dijalankan kembali tanpa menggandakan nama produk.
2. Buat akun pengurus di **Supabase Authentication → Users** dengan email yang sama seperti kolom `email` pada `admin_users`. Akun login lama yang hanya tersimpan di tabel `admin_users` belum merupakan akun Supabase Authentication. Halaman `login.html` kini menggunakan Supabase Authentication dan sesi yang sama dipakai oleh `kamar.html` dan `produk.html`. Buat akun Auth dengan email pengurus yang sama sebelum mengganti situs aktif. Jangan simpan service role key dalam JavaScript.
3. Unggah seluruh folder ke GitHub/Vercel. Buka `produk.html` atau tautan **Kelola Produk** di `kamar.html`. Halaman toko (`index.html`) langsung membaca daftar produk aktif dari Supabase.
4. Setelah masuk lewat `login.html` dan membuka `produk.html`, klik **Pindahkan Gambar Lama** untuk mengunggah gambar katalog yang masih mengarah ke `images/` ke Supabase Storage. Jangan hapus folder `images` hingga pemindahan selesai tanpa kegagalan dan katalog sudah dicek. Impor gambar bisa diulang untuk produk yang gagal.
5. Untuk produk baru, pilih file gambar langsung dari formulir; file masuk ke bucket `produk-fikri`. Gambar pengganti juga bisa diunggah saat mengubah produk. Produk tersembunyi tidak ditampilkan di toko. Kolom promo memasangkan jumlah barang dengan harga paket.
6. Gambar lama yang sudah diganti atau produk yang dihapus tidak dihapus otomatis dari Storage, agar gambar yang mungkin masih digunakan oleh data lain tidak hilang.

Catatan: perubahan login adalah migrasi ke Supabase Authentication. Kata sandi dari `admin_users` tidak dipakai lagi. Akun Auth harus disiapkan sebelum menerbitkan situs agar pengurus tetap bisa masuk.
