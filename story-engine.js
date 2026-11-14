/* ThreadCraft V2: narrative-first copy engine, no API or fabricated testimonials. */
(function (global) {
  'use strict';
  const normalize = value => String(value || '').trim().replace(/\s+/g, ' ');
  const end = value => /[.!?…]$/.test(value) ? value : value + '.';
  const choose = (items, seed) => items[((seed % items.length) + items.length) % items.length];
  const factsOf = text => String(text || '').split(/[;\n]+/).map(x => normalize(x).replace(/[.!?;,\s]+$/g, '')).filter(Boolean).slice(0, 5);
  const sentence = text => end(normalize(text));
  const crop = (text, limit) => text.length <= limit ? text : text.slice(0, limit - 1).trimEnd().replace(/[,:;\s]+$/,'') + '…';
  const validSeed = v => Number.isFinite(Number(v)) ? Math.floor(Number(v)) : 0;
  const contexts = [
    {
      test: /rak kasut|shoe rack|kasut.*(rack|rak)|almari kasut/i,
      scene: 'Pintu rumah baru dibuka. Kasut kerja ada di satu sudut, selipar pula dekat pintu. Esok pagi, mulalah sesi mencari pasangan yang hilang.',
      friction: 'Bukan masalah besar, tapi bila benda yang sama jadi rutin, ruang kecil pun terasa serabut.',
      insight: 'Kadang kita tak perlukan rumah lebih luas. Kita cuma perlukan setiap benda ada tempat sendiri.',
      desired: 'ruang depan rumah yang lebih teratur',
      lens: 'ruang kecil, rutin pagi dan keselesaan balik kerja',
      check: 'ukuran rak, kestabilan dan ruang yang tersedia',
      question: 'Apa guna beli yang cantik kalau saiznya tak muat di tempat sebenar?'
    },
    {
      test: /rak|organizer|storage|almari|laci|penyimpan|susun|hanger|penyangkut/i,
      scene: 'Dah kemas satu sudut rumah. Dua hari kemudian, barang mula bertimbun balik sebab semuanya tak ada tempat tetap.',
      friction: 'Yang memenatkan bukan mengemas sekali. Yang memenatkan ialah mengulang benda yang sama.',
      insight: 'Kemas bukan tentang buang semua benda. Ia tentang sistem yang senang nak ikut.',
      desired: 'sudut yang senang diurus setiap hari',
      lens: 'susun atur, ruang dan tabiat harian',
      check: 'saiz, bahan dan kesesuaian ruang',
      question: 'Kalau sistem tu rumit, adakah kita akan guna selepas seminggu?'
    },
    {
      test: /dapur|periuk|kuali|air fryer|bekas makanan|food container|pisau|cutlery|sink|rak pinggan|chopper/i,
      scene: 'Dah dekat waktu makan. Atas meja dapur macam-macam ada, tapi benda yang nak dicari pula susah jumpa.',
      friction: 'Nak sediakan makanan pun boleh jadi panjang bila setiap langkah ada gangguan kecil.',
      insight: 'Kadang nikmat dapur bukan menu yang mewah. Cukup kalau kerja jadi kurang kelam-kabut.',
      desired: 'rutin dapur yang lebih lancar',
      lens: 'masa memasak, susun atur dan ruang dapur',
      check: 'material, ukuran, cara cuci dan kesesuaian kegunaan',
      question: 'Kalau barang tu susah dibersihkan, berbaloi ke untuk kegunaan harian?'
    },
    {
      test: /charger|cable|kabel|powerbank|earbud|headphone|earphone|phone|telefon|holder|stand laptop|lampu meja|keyboard|mouse/i,
      scene: 'Masa nak keluar, telefon dah bagi amaran bateri merah. Kabel entah dekat mana, dan masa pula tak tunggu sesiapa.',
      friction: 'Benda kecil macam aksesori pun boleh ganggu rutin bila tak kena dengan cara kita guna.',
      insight: 'Aksesori yang bagus bukan yang paling banyak fungsi; yang penting sesuai dengan masalah sebenar.',
      desired: 'urusan gadget yang lebih mudah',
      lens: 'keserasian, kemudahan dan penggunaan harian',
      check: 'keserasian peranti, spesifikasi sebenar dan keselamatan penggunaan',
      question: 'Spesifikasi nampak menarik, tapi sesuai tak dengan peranti sendiri?'
    },
    {
      test: /vakum|vacuum|mop|penyapu|pembersih|cleaner|berus|spray|sabun|detergent/i,
      scene: 'Baru lepas kemas rumah. Tak lama kemudian nampak habuk di sudut yang susah dicapai. Terus rasa macam kerja belum habis.',
      friction: 'Kerja rumah bukan susah sebab sekali buat. Ia terasa berat bila prosesnya berulang tanpa henti.',
      insight: 'Kadang yang kita cari bukan rumah sempurna. Kita cuma nak proses mengemas terasa lebih ringan.',
      desired: 'rutin mengemas yang kurang melelahkan',
      lens: 'masa, tenaga dan proses membersihkan',
      check: 'fungsi, jenis permukaan yang sesuai dan cara penjagaan',
      question: 'Kalau alat tu menyusahkan nak simpan, adakah ia betul-betul memudahkan?'
    },
    {
      test: /bantal|tilam|cadar|selimut|comforter|pillow|bed|sleep/i,
      scene: 'Hari dah panjang. Malam cuma nak satu perkara: ruang rehat yang terasa selesa untuk diri sendiri.',
      friction: 'Bila rehat pun rasa tak kena, perkara kecil boleh terasa jauh lebih besar.',
      insight: 'Keselesaan kadang tak perlukan perubahan satu bilik. Cukup mula dengan benda yang kita guna selalu.',
      desired: 'ruang rehat yang lebih menyenangkan',
      lens: 'keselesaan dan rutin waktu rehat',
      check: 'saiz, material, cara penjagaan dan review sebenar',
      question: 'Kalau saiz atau material tak kena, secantik mana pun gambar tak membantu.'
    },
    {
      test: /beg|bag|backpack|pouch|wallet|dompet|tote|luggage|suitcase/i,
      scene: 'Dah bersiap nak keluar. Tiba-tiba kunci hilang dalam beg, kabel terselit, benda penting pula berada paling bawah.',
      friction: 'Bukan berat barang semata-mata; yang penat ialah bila semua benda bercampur tanpa susunan.',
      insight: 'Kadang rasa teratur bermula dengan satu perubahan kecil pada cara kita bawa barang.',
      desired: 'barang penting yang lebih mudah dicapai',
      lens: 'ruang simpanan dan rutin di luar rumah',
      check: 'saiz, pembahagian ruang, jahitan dan material',
      question: 'Cantik memang cantik, tapi selesa ke bila dipakai lama?'
    },
    {
      test: /kereta|car|dashboard|seat|visor|wiper|motor|motorcycle|helmet/i,
      scene: 'Masuk kereta nak gerak cepat. Resit, kabel dan barang kecil masing-masing ada cerita sendiri dekat tempat duduk.',
      friction: 'Ruang yang kecil cepat terasa sempit bila barang tiada tempat khusus.',
      insight: 'Bila ruang teratur, rutin singkat pun boleh terasa lebih tenang.',
      desired: 'ruang kenderaan yang lebih selesa',
      lens: 'susunan ruang dan kegunaan dalam kenderaan',
      check: 'saiz, pemasangan, bahan dan keserasian model',
      question: 'Sesuai tak dengan model kenderaan sendiri?'
    },
    {
      test: /serum|skincare|sunscreen|moisturizer|cleanser|lip|makeup|foundation|cosmetic/i,
      scene: 'Pagi-pagi, masa nak siap cuma beberapa minit. Pilihan produk pula banyak sampai susah nak tentukan apa yang benar-benar diperlukan.',
      friction: 'Bila terlalu banyak pilihan, rutin yang patut ringkas jadi terasa rumit.',
      insight: 'Kadang rutin yang konsisten lebih berguna daripada ikut setiap trend baru.',
      desired: 'rutin penjagaan yang sesuai dengan keperluan',
      lens: 'kesesuaian, kandungan dan rutin harian',
      check: 'senarai ramuan, kesesuaian kulit dan maklumat produk rasmi',
      question: 'Popular tak semestinya sesuai untuk semua orang.'
    },
    {
      test: /botol|tumbler|flask|mug|cup|water bottle/i,
      scene: 'Pagi kelam-kabut. Dah bergerak baru teringat air minum tertinggal atas meja.',
      friction: 'Benda kecil yang terlupa boleh mengganggu rutin bila hari dah sibuk.',
      insight: 'Kadang tabiat jadi lebih mudah bila barang harian senang dicapai dan dibawa.',
      desired: 'rutin minum yang lebih praktikal',
      lens: 'saiz, kebocoran dan mudah dibawa',
      check: 'kapasiti, material, penutup dan cara mencuci',
      question: 'Kalau susah nak cuci, adakah kita rajin guna setiap hari?'
    }
  ];
  const fallback = {
    scene: 'Pagi belum pun habis, dah ada macam-macam perkara kecil yang perlu dibereskan. Satu lagi benda dalam rutin pun boleh buat kepala penuh.',
    friction: 'Satu masalah kecil mungkin boleh diabaikan. Bila berulang hari demi hari, ia mula makan masa dan tenaga.',
    insight: 'Kadang yang kita perlukan bukan perubahan besar. Kita cuma nak satu perkara dalam rutin jadi lebih mudah.',
    desired: 'hari yang terasa sedikit lebih teratur',
    lens: 'kegunaan harian dan keperluan sebenar',
    check: 'spesifikasi, bahan, ukuran dan review pembeli',
    question: 'Kalau barang ni tak menyelesaikan masalah kita, untuk apa beli?'
  };

  function contextOf(p) {
    return contexts.find(c => c.test.test(p.product || '')) || fallback;
  }

  function intro(p, c, v) {
    const scene = normalize(p.scene) ? sentence(p.scene) : c.scene;
    const customer = normalize(p.audience) ? 'Mungkin lagi terasa kalau kau ' + normalize(p.audience) + '.' : '';
    const variants = [
      'Bayangkan satu situasi ni.\n\n' + scene,
      'Pernah tak benda kecil macam ni tiba-tiba jadi isu besar dalam sehari?\n\n' + scene,
      'Ada satu babak harian yang nampak biasa, tapi ramai boleh relate.\n\n' + scene,
      'Kadang hari yang penat tak bermula dengan masalah besar pun.\n\n' + scene,
      'Satu benda pasal rutin harian: yang kecil itulah selalu berulang.\n\n' + scene
    ];
    let opening = choose(variants, v);
    if (p.angle === 'contrast') opening = 'Benda nampak kecil. Kesan pada rutin kadang tak kecil.\n\n' + scene;
    if (p.angle === 'reflective') opening = 'Kita selalu fikir penat datang daripada benda besar.\n\nPadahal ada juga penat yang datang perlahan-lahan.\n\n' + scene;
    if (p.angle === 'light') opening = 'Tak perlu drama TV. Drama harian pun dah cukup. 😅\n\n' + scene;
    return {opening, customer};
  }

  function storyPost(p, c, facts, v) {
    const scene = intro(p, c, v);
    const mood = p.angle || 'daily';
    const emotional = choose([
      'Yang terasa bukan masalah tu semata-mata. Tapi rasa penat sebab perkara sama berulang lagi.',
      'Kecil, ya. Tapi kalau hari-hari, ia tetap mengambil ruang dalam kepala.',
      'Masalahnya bukan satu hari yang serabut. Masalahnya bila ia jadi kebiasaan.',
      'Bukan sebab kita tak pandai urus. Kadang sistem yang ada memang tak memudahkan.'
    ], v);
    const pivot = mood === 'reflective'
      ? 'Mungkin kita tak perlukan hidup yang sempurna. Cukup satu bahagian kecil terasa lebih ringan.'
      : mood === 'contrast'
        ? 'Sebab tu aku suka fikir tentang sistem, bukan sekadar barang.'
        : mood === 'light'
          ? 'Kalau ada cara untuk kurangkan satu episod kecil ni, kenapa tidak?'
          : choose([c.insight, 'Lama-lama kita sedar: '+c.insight.charAt(0).toLowerCase()+c.insight.slice(1)], v);

    const tease = choose([
      'Sebab tu ' + p.product + ' masuk senarai untuk aku semak. Bukan sebab nak beli ikut trend—tapi sebab nak tengok sama ada ia boleh bantu. Cerita aku sambung 👇',
      'Dekat sini, ' + p.product + ' nampak relevan untuk dibandingkan. Yang penting bukan janji manis; yang penting sesuai atau tidak. Sambung bawah 👇',
      'Bila ternampak ' + p.product + ', soalan pertama bukan “cantik tak?” tapi “ini betul-betul menjawab masalah tadi ke?” Aku sambung 👇',
      'Itu yang buat ' + p.product + ' menarik untuk diselidik. Jom tengok kenapa, tanpa overclaim 👇'
    ],v);
    const withPivot = [scene.opening, choose([c.friction, emotional], v), pivot, tease].join('\n\n');
    if (withPivot.length <= 500) return withPivot;
    const trimmed = [scene.opening, pivot, tease].join('\n\n');
    if (trimmed.length <= 500) return trimmed;
    return [crop(scene.opening, 210), crop(pivot, 120), crop(tease, 150)].join('\n\n');
  }

  function storyReplies(p, c, facts, count, v) {
    const out = [];
    const why = [
      'Yang menarik dalam cerita ni bukan semata-mata barang baru.\n\n' + c.friction + '\n\nBenda kecil yang berulang selalunya paling kita rasa.',
      'Aku suka tengok masalah dari sudut ni: ' + c.insight + '\n\nTargetnya bukan nak jadi sempurna. Cukup ' + c.desired + '.',
      'Mungkin ramai tak perasan, tapi ' + c.lens + ' selalu memberi kesan pada hari kita.\n\nSebab tu elok fikir apa yang kita nak mudahkan dahulu.'
    ];
    const factPart = () => facts.length
      ? 'Dekat maklumat produk, antara ciri yang dinyatakan ialah ' + facts.map(f => '“' + f + '”').join(', ') + '.\n\nCiri ni mungkin relevan untuk ' + c.desired + ', tapi kena semak detail sebenar sebelum checkout.'
      : 'Untuk ' + p.product + ', aku akan semak ' + c.check + '.\n\nBukan semua produk sesuai untuk setiap orang—pilih ikut keperluan sendiri.';
    const thought = [
      'Satu benda yang aku tak nak skip: ' + c.question + '\n\nAku akan baca review bergambar dulu. Listing yang nampak cantik belum tentu sesuai dengan ruang atau bajet kita.',
      'Bayangkan kalau benda kecil ni akhirnya kurang mengganggu rutin.\n\nItulah payoff sebenar: ' + c.desired + '. Tapi jangan terburu-buru; compare ukuran, material dan harga akhir.',
      'Pada aku, cerita yang best bukan berakhir dengan “terus beli”. Ia berakhir dengan pilihan yang masuk akal.\n\nTengok keperluan sendiri, kemudian baru decide.'
    ];
    if (count === 0) return out;
    if (count === 1) return [factPart() + '\n\n' + c.question];
    if (count === 2) return [choose(why,v), factPart() + '\n\n' + c.question];
    if (count === 3) return [choose(why,v), factPart(), choose(thought,v)];
    return [choose(why,v), factPart(), choose(thought,v), 'Kalau nak check sendiri, paling selamat bandingkan ' + c.check + '.\n\nYang penting, barang ni sesuai dengan realiti rutin kau, bukan sekadar nampak menarik di skrin.'];
  }

  function alternativePost(p, c, facts, v) {
    const item = p.product;
    const effect = c.desired;
    const detail = facts.length ? 'Antara ciri yang disenaraikan: ' + facts[0] + '.' : 'Aku akan tengok spesifikasi sebenar dan review pembeli dulu.';
    if (p.mood === 'curious') {
      return choose([
        'Kadang kita ingat masalahnya perlukan solusi besar.\n\nTapi bila tengok betul-betul, mungkin yang kita nak cuma ' + effect + '.\n\nSebab tu aku curious dengan ' + item + '. Aku sambung satu detail penting dekat komen 👇',
        'Satu benda yang aku perasan: bila rutin selalu terganggu, kita jarang fikir tentang puncanya.\n\nAku tengah tengok ' + item + ' untuk konteks ni.\n\nTapi sebelum decide, ada soalan yang patut kita tanya 👇',
        'Apa kena-mengena satu produk dengan hari yang kurang serabut?\n\nBoleh jadi banyak, boleh jadi tak ada langsung.\n\nAku nak bandingkan ' + item + ' berdasarkan ' + c.lens + '. Sambung dekat bawah 👇'
      ],v);
    }
    if (p.mood === 'hook') {
      return choose([
        'JANGAN beli ' + item + ' sebab gambar nampak lawa semata-mata.\n\n' + detail + '\n\nTapi ada satu perkara lagi yang lebih penting sebelum checkout 👇',
        'Kalau tengah survey ' + item + ', cuba jawab satu soalan dulu:\n\n“' + c.question + '”\n\nAku pecahkan apa yang patut check dekat komen 👇',
        'Barang murah tak semestinya berbaloi. Barang mahal pun tak semestinya sesuai.\n\nAku letak ' + item + ' dalam shortlist untuk dibandingkan. Ini yang aku akan semak 👇'
      ],v);
    }
    return choose([
      'Kalau korang tengah cari cara untuk dapatkan ' + effect + ', mungkin boleh tengok ' + item + '. 🌿\n\n' + detail + '\n\nAku letak beberapa perkara yang elok disemak dekat komen. Tak perlu rush beli.',
      'Sharing satu pilihan yang boleh masuk shortlist: ' + item + '.\n\nKadang kita cuma nak rutin jadi sikit lebih mudah.\n\nAku sambung info untuk dibandingkan sebelum checkout 👇',
      'Untuk yang sedang survey barang berkaitan ' + c.lens + ', aku jumpa satu pilihan untuk diteliti: ' + item + '.\n\nAku kongsikan poin dan link dekat bawah 👇'
    ],v);
  }

  function alternativeReplies(p, c, facts, count, v) {
    const out = [];
    const detail = facts.length
      ? 'Antara ciri yang dinyatakan pada input produk:\n' + facts.map(x => '• ' + x).join('\n') + '.\n\nSemak semula spesifikasi pada listing asal.'
      : 'Benda yang aku akan semak: ' + c.check + '.\n\nJangan nilai daripada gambar produk sahaja.';
    const advice = [
      'Sebelum checkout, fikir keadaan sebenar: ' + c.lens + '.\n\n' + c.question,
      'Review bergambar lebih membantu untuk faham saiz dan rupa sebenar.\n\nLepas tu baru bandingkan harga akhir termasuk shipping.',
      'Yang penting bukan sama ada ramai orang beli. Yang penting sesuai ke tak dengan keperluan sendiri.'
    ];
    for (let i = 0; i < count; i++) out.push(i === 0 ? detail : choose(advice, v+i));
    return out;
  }

  function linkReply(p, c, v) {
    const lines = [
      'Kalau nak tengok sendiri, ini link ' + p.product + '. Semak ' + c.check + ' dulu ya 👇',
      'Aku letak link untuk bandingkan spesifikasi, harga semasa dan review pembeli 👇',
      'Nak tengok listing asal? Boleh check link ni. Tak perlu beli kalau tak sesuai 👇',
      'Kalau rasa berkaitan dengan situasi tadi, boleh semak sendiri dekat sini 👇'
    ];
    const disclosure = p.disclose !== false ? '\n\nPautan affiliate: aku mungkin terima komisen jika kau membeli melalui link ini.' : '';
    const preferred = choose(lines,v) + '\n\n' + p.link + disclosure;
    if (preferred.length <= 500) return preferred;
    return 'Link produk 👇\n\n' + p.link + disclosure;
  }

  function styleTone(text, tone, preserveLink) {
    if (tone === 'polished') {
      return text
        .replace(/\bAku\b/g, 'Saya')
        .replace(/\baku\b/g, 'saya')
        .replace(/\bkau\b/g, 'anda')
        .replace(/\bkorang\b/g, 'anda')
        .replace(/\bcheckout\b/g, 'buat pesanan')
        .replace(/\bnak\b/g, 'mahu')
        .replace(/\bdekat\b/g, 'di')
        .replace(/\bcheck\b/g, 'semak');
    }
    if (tone === 'direct' && !preserveLink) {
      const paragraphs = text.split('\n\n');
      if (paragraphs.length > 3) {
        return [paragraphs[0],paragraphs[2],paragraphs[paragraphs.length-1]].join('\n\n');
      }
    }
    return text;
  }

  function generate(p, variant) {
    const v = validSeed(variant);
    const normalized = Object.assign({ mood:'story', tone:'casual', angle:'daily', scene:'', features:'', product:'', audience:'', count:3, disclose:true }, p);
    const c = contextOf(normalized), facts=factsOf(normalized.features);
    const count=Math.min(4, Math.max(1, Number(normalized.count)||3));
    const post = normalized.mood === 'story' ? storyPost(normalized,c,facts,v) : alternativePost(normalized,c,facts,v);
    const middles = normalized.mood === 'story' ? storyReplies(normalized,c,facts,count-1,v) : alternativeReplies(normalized,c,facts,count-1,v);
    return [
      crop(styleTone(post, normalized.tone, false), 500),
      ...middles.map(x => crop(styleTone(x, normalized.tone, false), 500)),
      styleTone(linkReply(normalized,c,v), normalized.tone, true)
    ];
  }
  global.ThreadCraftEngine = Object.freeze({generate});
})(window);
