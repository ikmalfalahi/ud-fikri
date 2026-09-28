-- Jalankan di Supabase SQL Editor setelah memeriksa kebijakan lama pada pesanan_sembako.
-- Pelanggan tidak perlu login untuk membuat pesanan. Akses baca/ubah/hapus tetap mengikuti kebijakan admin yang sudah ada.
alter table public.pesanan_sembako enable row level security;
grant usage on schema public to anon, authenticated;
grant insert (nama, alamat, lokasi_map, items, total, metode_pembayaran, status, created_at)
  on public.pesanan_sembako to anon, authenticated;
drop policy if exists "Pelanggan kirim pesanan sembako" on public.pesanan_sembako;
create policy "Pelanggan kirim pesanan sembako"
  on public.pesanan_sembako
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and length(btrim(nama)) > 0
    and length(btrim(alamat)) > 0
    and total >= 0
  );
-- Jangan membuka SELECT, UPDATE, DELETE kepada anon.
