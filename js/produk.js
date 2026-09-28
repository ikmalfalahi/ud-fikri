(() => {
  "use strict";
  const db = window.supabaseClient;
  const $ = id => document.getElementById(id);
  const money = n => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
  let products = [], page = 1;
  const BUCKET = 'produk-fikri';
  const allowedTypes = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
  function storageUrl(path) { return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl; }
  async function uploadImage(file) {
    if (!allowedTypes[file.type] || file.size > 5 * 1024 * 1024 || !file.size) throw new Error('Pilih gambar JPG, PNG, WebP, atau GIF berukuran maksimal 5 MB.');
    const path = `catalog/${crypto.randomUUID()}.${allowedTypes[file.type]}`;
    const { error } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw new Error('Gagal mengunggah gambar: ' + error.message);
    return { path, url: storageUrl(path) };
  }
  function notice(message) { $('notice').textContent = message; }
  function cell(tr, value) { const td = tr.insertCell(); td.textContent = value; return td; }
  async function checkAccess() {
    const { data: { user }, error } = await db.auth.getUser();
    if (error || !user) { location.replace('login.html?next=produk.html'); return; }
    const { data, error: roleError } = await db.rpc('is_fikri_admin');
    if (roleError || !data) {
      notice(roleError ? 'Akses belum tersedia. Pastikan setup-produk.sql sudah dijalankan.' : 'Akun ini belum terdaftar sebagai pengurus.');
      return;
    }
    $('content').hidden = false; $('newProduct').hidden = false; $('migrateImages').hidden = false; $('logout').hidden = false;
    await load();
  }
  async function load() {
    const { data, error } = await db.from('catalog_products').select('*').order('sort_order').order('id');
    if (error) { notice('Gagal mengambil produk: ' + error.message); return; }
    products = data;
    $('totalProducts').textContent = products.length;
    $('activeProducts').textContent = products.filter(p => p.is_active).length;
    const categories = [...new Set(products.map(p => p.category))].sort();
    $('categoryCount').textContent = categories.length;
    $('category').replaceChildren(new Option('Semua kategori', ''), ...categories.map(c => new Option(c, c)));
    $('categoryOptions').replaceChildren(...categories.map(c => new Option(c)));
    render();
  }
  function render() {
    const search = $('search').value.trim().toLocaleLowerCase('id-ID');
    const category = $('category').value, status = $('status').value;
    const filtered = products.filter(p => p.name.toLocaleLowerCase('id-ID').includes(search) && (!category || category === p.category) && (!status || p.is_active === (status === 'active')));
    const size = Number($('pageSize').value); const pages = Math.max(1, Math.ceil(filtered.length / size)); page = Math.min(page, pages);
    const rows = $('rows'); rows.replaceChildren();
    for (const product of filtered.slice((page - 1) * size, page * size)) {
      const tr = rows.insertRow();
      const first = tr.insertCell(); first.className = 'item';
      const img = document.createElement('img'); img.src = product.image_url || 'images/logo.png'; img.alt = ''; img.onerror = () => { img.onerror = null; img.src = 'images/logo.png'; };
      const name = document.createElement('strong'); name.textContent = product.name;
      first.append(img, name);
      cell(tr, product.category); cell(tr, money(product.price));
      cell(tr, product.promo_qty ? `${product.promo_qty} × ${money(product.promo_price)}` : '—');
      const badge = cell(tr, product.is_active ? 'Tampil' : 'Disembunyikan'); badge.className = 'badge' + (product.is_active ? '' : ' off');
      const actions = tr.insertCell(); actions.className = 'row-actions';
      const edit = document.createElement('button'); edit.textContent = 'Ubah'; edit.onclick = () => openEditor(product);
      const toggle = document.createElement('button'); toggle.textContent = product.is_active ? 'Sembunyikan' : 'Tampilkan'; toggle.onclick = () => toggleProduct(product);
      const remove = document.createElement('button'); remove.textContent = 'Hapus'; remove.className = 'danger'; remove.onclick = () => deleteProduct(product);
      actions.append(edit, toggle, remove);
    }
    if (!filtered.length) { const tr = rows.insertRow(); const td = tr.insertCell(); td.colSpan = 6; td.textContent = 'Tidak ada produk yang cocok.'; }
    $('pageInfo').textContent = `Halaman ${page} dari ${pages} · ${filtered.length} produk`;
    $('prev').disabled = page === 1; $('next').disabled = page === pages;
  }
  function openEditor(product = null) {
    const form = $('productForm'); form.reset(); $('formError').textContent = '';
    $('formTitle').textContent = product ? 'Ubah Produk' : 'Tambah Produk';
    if (product) for (const key of ['id','name','category','price','sort_order','image_url','description','promo_qty','promo_price']) form.elements[key].value = product[key] ?? '';
    form.elements.tambahan_biaya.checked = !!product?.tambahan_biaya;
    form.elements.is_active.checked = product?.is_active ?? true;
    $('imageCurrent').textContent = product?.image_url ? 'Gambar saat ini: ' + product.image_url : 'Belum ada gambar. Pilih file gambar sebelum menyimpan.';
    $('editor').showModal();
  }
  async function toggleProduct(product) {
    const { error } = await db.from('catalog_products').update({ is_active: !product.is_active }).eq('id', product.id);
    if (error) notice(error.message); else { notice('Status produk diperbarui.'); await load(); }
  }
  async function deleteProduct(product) {
    if (!confirm(`Hapus permanen produk “${product.name}”?`)) return;
    const { error } = await db.from('catalog_products').delete().eq('id', product.id);
    if (error) notice(error.message); else { notice('Produk dihapus.'); await load(); }
  }
  $('productForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.target, el = form.elements, id = el.id.value;
    const qty = el.promo_qty.value, promo = el.promo_price.value;
    if (!!qty !== !!promo) { $('formError').textContent = 'Isi jumlah dan harga promo sekaligus, atau kosongkan keduanya.'; return; }
    const payload = { name: el.name.value.trim(), category: el.category.value.trim(), price: Number(el.price.value), sort_order: Number(el.sort_order.value), image_url: el.image_url.value.trim(), description: el.description.value.trim(), tambahan_biaya: el.tambahan_biaya.checked, is_active: el.is_active.checked, promo_qty: qty ? Number(qty) : null, promo_price: promo ? Number(promo) : null };
    if (!payload.name || !payload.category || payload.price < 0 || (qty && Number(qty) < 2)) { $('formError').textContent = 'Periksa nama, kategori, harga, dan jumlah promo.'; return; }
    const button = form.querySelector('button[type=submit]'); button.disabled = true;
    let uploaded = null;
    try {
      const file = el.image_file.files[0];
      if (file) { uploaded = await uploadImage(file); payload.image_url = uploaded.url; }
      else if (!payload.image_url) throw new Error('Pilih gambar produk terlebih dahulu.');
    } catch (error) { $('formError').textContent = error.message; button.disabled = false; return; }
    const result = id ? await db.from('catalog_products').update(payload).eq('id', id).select('id') : await db.from('catalog_products').insert(payload).select('id');
    button.disabled = false;
    if (result.error || !result.data?.length) {
      if (uploaded) await db.storage.from(BUCKET).remove([uploaded.path]);
      $('formError').textContent = result.error?.message || 'Perubahan tidak tersimpan. Periksa hak akses akun.'; return; }
    $('editor').close(); notice('Produk berhasil disimpan.'); await load();
  });
  $('migrateImages').onclick = async () => {
    const pending = products.filter(p => /^images\/[^?#]+\.(jpe?g|png|webp|gif)$/i.test(p.image_url || ''));
    if (!pending.length) { notice('Semua gambar produk sudah menggunakan Supabase Storage.'); return; }
    if (!confirm(`Pindahkan ${pending.length} gambar produk lama ke Supabase Storage? Proses ini bisa memakan waktu beberapa menit.`)) return;
    const button = $('migrateImages'); button.disabled = true;
    let completed = 0, failed = 0;
    for (const product of pending) {
      let uploaded = null;
      try {
        const response = await fetch(new URL(product.image_url, location.href));
        if (!response.ok) throw new Error('Gambar lama tidak ditemukan');
        const blob = await response.blob();
        const type = allowedTypes[blob.type] ? blob.type : ({jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif'}[product.image_url.split('.').pop().toLowerCase()]);
        uploaded = await uploadImage(new File([blob], product.image_url.split('/').pop(), { type }));
        const { data, error } = await db.from('catalog_products').update({ image_url: uploaded.url }).eq('id', product.id).eq('image_url', product.image_url).select('id');
        if (error || !data?.length) throw new Error(error?.message || 'Produk berubah saat proses berjalan');
        completed++;
      } catch (error) {
        failed++; console.error('Gagal memindahkan gambar:', product.name, error);
        if (uploaded) await db.storage.from(BUCKET).remove([uploaded.path]);
      }
      notice(`Pemindahan gambar: ${completed + failed}/${pending.length}. Berhasil ${completed}, gagal ${failed}.`);
    }
    await load(); button.disabled = false;
    notice(`Selesai: ${completed} gambar dipindahkan, ${failed} gagal. Yang gagal masih memakai gambar lama; tombol ini dapat dicoba lagi.`);
  };
  $('newProduct').onclick = () => openEditor();
  $('closeEditor').onclick = $('cancelEditor').onclick = () => $('editor').close();
  $('logout').onclick = async () => { await db.auth.signOut(); location.reload(); };
  $('search').oninput = $('category').onchange = $('status').onchange = $('pageSize').onchange = () => { page = 1; render(); };
  $('prev').onclick = () => { page--; render(); }; $('next').onclick = () => { page++; render(); };
  checkAccess();
})();
