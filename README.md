# ThreadCraft — Shopee Affiliate Studio

Mobile-first web app untuk menjana post Threads dan komen bersambung daripada **link Shopee Affiliate**.

## Status: V5 — Import kad produk ChatGPT + Copy AI Brief (percuma, tanpa API)

- Import kad produk terus dari ChatGPT, dengan format stabil THREADCRAFT-PRODUCT-V1
- Sekali copy/paste atau butang "Ambil dari clipboard" jika izin clipboard diberikan
- Kad mengisi nama produk, ciri, nota screenshot dan pautan affiliate Shopee (jika disertakan)
- Copy brief siap untuk ChatGPT supaya gaya copywriting dalam chat lebih natural daripada generator template
- Screenshot **tidak dihantar/dimuat naik dalam web app**; pengguna upload screenshot ke ChatGPT terlebih dahulu
- 4 mood: Storytelling, Curiosity, Strong Hook, Soft Sell
- Storytelling V2: konteks situasi harian, konflik → turning point → soft product bridge
- Ruang Idea / relatable angle optional (contoh: MCR + Bukit Jalil + cuaca panas), disimpan dalam draft; jika kosong enjin pilih angle ikut produk
- Untuk kategori kipas dan konteks concert/MCR, enjin percuma sudah ada draf khusus. **Topik arbitrary lain tidak difahami secara semantik sepenuhnya**; perlu AI berbackend untuk pemahaman bebas
- Default 1 post + 2 komen, bilangan boleh ditukar
- Boleh masukkan situasi cerita sendiri serta pilih jalan cerita (relatable, reflektif, konflik → perubahan, humor ringan)
- Context-aware mengikut kategori produk (termasuk kipas mini / handheld fan, rak kasut, dapur, gadget, beg, kereta, skincare)
- Tidak lagi guna cerita penat/serabut generik apabila kategori produk tidak dikenali: sebut had dan minta situasi khusus
- Jika link atau nama produk berubah, input fakta dan situasi lama dikosongkan bagi mengelak cerita tersalah produk
- Bahasa Melayu, 3 tone, 1–4 komen berurutan
- Copy setiap post/komen atau semua sekali
- Edit teks terus dalam preview sebelum copy
- Kekalkan link affiliate asal dalam komen terakhir
- Disclosure affiliate pilihan (diaktifkan secara default)
- Simpan sehingga 12 hasil terakhir dan draft di **localStorage browser** (tiada akaun / database)
- Responsive, dark mode, boleh dibuka di Chrome Android, sokongan offline asas

**Penting:** Enjin V4 ialah penjana naratif berasaskan peraturan dan pustaka adegan (bukan model generatif). Ia **bukan model AI** dan tidak memerlukan atau menggunakan OpenAI API. Link pendek Shopee tidak di-scrape; isi nama dan fakta produk secara manual. Semak bahawa nama/fakta sama dengan produk dalam link. Untuk penulisan kreatif benar-benar unik, diperlukan model AI melalui backend berasingan. Tiada auto-publish ke Threads. App ini tidak menjamin pematuhan polisi pemasaran; pengguna perlu menyemak fakta dan mematuhi syarat Shopee Affiliate/Threads.

## Cara import kad produk dari ChatGPT

1. Hantar screenshot produk Shopee kepada ChatGPT (dalam perbualan ini atau lain) dan minta output kad menggunakan format di bawah.
2. Copy keseluruhan kad sekali sahaja, termasuk baris pembuka dan penutup.
3. Buka ThreadCraft V5 → **Import produk dari ChatGPT** → **Ambil dari clipboard**. Jika browser tidak beri kebenaran clipboard, paste manual dalam kotak dan tekan **Import teks**.
4. App akan mengisi nama produk, ciri dan nota screenshot serta link affiliate jika disertakan. Semak semuanya sebelum generate. Idea atau angle kekal optional.
5. Untuk gaya penulisan benar-benar natural, pilih **Copy brief untuk ChatGPT**, paste ke ChatGPT, kemudian gunakan hasil draf selepas semakan. Generator dalam app masih aturan statik, bukan ChatGPT.

Contoh format yang diterima:

    THREADCRAFT-PRODUCT-V1
    NAME: JisuLife Handheld Fan Life10/10S
    FEATURES: kipas mini mudah alih; boleh dicas semula
    SELLER_CLAIMS: diiklankan bateri sehingga 28 jam; diiklankan ultra quiet
    SNAPSHOT: RM93.00 dipaparkan; rating 4.9; lebih 10k terjual; 6 variasi; CommsXtra 4% — berdasarkan screenshot, belum diverifikasi
    AFFILIATE_URL: https://s.shopee.com.my/1qdaf4bs2y
    END-THREADCRAFT-PRODUCT

Kod di atas hanya contoh format. Metadata perlu disahkan daripada screenshot yang benar dan harga mungkin berubah. Jangan tambah spesifikasi atau testimoni yang tak wujud. App tidak mengesahkan padanan kad dengan destinasi link affiliate; semak produk/link sebelum diterbitkan. Kad hanyalah teks dan diproses secara lokal, bukan panggilan ke Shopee.

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
