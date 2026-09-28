# ud-fikri
Menjual GAS ELPIJI 12Kg &amp; 3Kg, AQUA, LEMINERAL, PRIMA, VIT dan bahan pokok sehari-hari seperti BERAS, MINYAK, TELUR, dan TISSUE. 


## Kelola produk

1. Jalankan `setup-produk.sql` sekali di Supabase SQL Editor. Skrip membuat tabel katalog, kebijakan akses, serta memasukkan 46 produk yang sebelumnya tertulis di `js/script.js`. Impor bisa dijalankan kembali tanpa menggandakan nama produk.
2. Buat akun pengurus di **Supabase Authentication → Users** dengan email yang sama seperti kolom `email` pada `admin_users`. Akun login lama yang hanya tersimpan di tabel `admin_users` belum merupakan akun Supabase Authentication. Agar halaman produk aman, gunakan akun Authentication saat masuk ke `produk.html`. Jangan simpan service role key dalam JavaScript.
3. Unggah seluruh folder ke GitHub/Vercel. Buka `produk.html` atau tautan **Kelola Produk** di `kamar.html`. Halaman toko (`index.html`) langsung membaca daftar produk aktif dari Supabase.
4. Gambar produk lama tetap menggunakan folder `images`. Untuk gambar baru, unggah ke folder itu lalu isi `images/nama-file.jpg` di form. Kolom promo memasangkan jumlah barang dengan harga paket. Produk tersembunyi tidak ditampilkan di toko.

Catatan: login lama di `login.html` memakai pemeriksaan kata sandi dari tabel `admin_users` dan tidak memenuhi pengamanan halaman produk. Sebaiknya migrasikan sistem login admin lama ke Supabase Authentication secara terpisah.
