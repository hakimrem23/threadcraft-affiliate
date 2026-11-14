# ThreadCraft — Shopee Affiliate Studio

Mobile-first web app untuk menjana post Threads dan komen bersambung daripada **link Shopee Affiliate**.

## Status: V2 — Narrative-first (percuma, tanpa API)

- 4 mood: Storytelling, Curiosity, Strong Hook, Soft Sell
- Storytelling V2: konteks situasi harian, konflik → turning point → soft product bridge
- Boleh masukkan situasi cerita sendiri serta pilih jalan cerita (relatable, reflektif, konflik → perubahan, humor ringan)
- Context-aware mengikut kategori produk (contoh: rak kasut, dapur, gadget, beg, kereta, skincare)
- Bahasa Melayu, 3 tone, 1–4 komen berurutan
- Copy setiap post/komen atau semua sekali
- Edit teks terus dalam preview sebelum copy
- Kekalkan link affiliate asal dalam komen terakhir
- Disclosure affiliate pilihan (diaktifkan secara default)
- Simpan sehingga 12 hasil terakhir dan draft di **localStorage browser** (tiada akaun / database)
- Responsive, dark mode, boleh dibuka di Chrome Android, sokongan offline asas

**Penting:** Enjin V2 ialah penjana naratif berasaskan peraturan dan pustaka adegan (bukan model generatif). Ia **bukan model AI** dan tidak memerlukan atau menggunakan OpenAI API. Link pendek Shopee tidak di-scrape; isi nama dan fakta produk secara manual. Tiada auto-publish ke Threads. App ini tidak menjamin pematuhan polisi pemasaran; pengguna perlu menyemak fakta dan mematuhi syarat Shopee Affiliate/Threads.

## Live di GitHub Pages (percuma)

1. Di GitHub, buka repository ini → **Settings** → **Pages**.
2. Dalam **Build and deployment**, pilih **Deploy from a branch**.
3. Pilih **main** dan folder **/(root)** → **Save**.
4. Selepas Pages selesai menerbitkan laman, buka:
   https://hakimrem23.github.io/threadcraft-affiliate/
5. Pada Android Chrome, buka menu **⋮** → **Add to Home screen** (atau **Install app** jika dipaparkan).

Jangan anggap URL sudah aktif sebelum Pages diaktifkan dan deployment selesai.

## Jalankan secara lokal

Fail statik, tiada build tools/dependencies. Guna static server contohnya:
python -m http.server 8000
Kemudian buka http://localhost:8000.
Untuk service worker/offline, gunakan HTTPS (Pages) atau localhost.

## Privasi dan keselamatan

Data post disimpan di browser/peranti sendiri (localStorage). Tiada data dihantar ke server daripada skrip aplikasi. Tiada API token atau kata laluan disimpan dalam source. Link yang dibekalkan tidak dipendekkan atau diubah.

## Cadangan V2

Tambah backend AI berasingan dengan OpenAI API, API key hanya dalam environment variable server, kadar penggunaan dan kawalan kos; akses metadata produk hanya melalui sumber yang dibenarkan. **Jangan masukkan API key ke JavaScript front end atau commit ke repo awam.**

## Ruang lingkup

Repository ini hanya untuk ThreadCraft. Jangan ubah screen-the-hell-out atau stho-moomoo-test.
