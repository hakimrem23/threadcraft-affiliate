(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const STORAGE_HISTORY = 'threadcraft-history-v1';
  const STORAGE_DRAFT = 'threadcraft-draft-v1';
  const form = $('thread-form');
  const labels = { story: 'Storytelling', curious: 'Curiosity', hook: 'Strong Hook', soft: 'Soft Sell' };
  let history = readStore(STORAGE_HISTORY, []);
  let current = null;
  let revision = 0;
  let toastTimer;

  function readStore(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed === null ? fallback : parsed;
    } catch (_) { return fallback; }
  }
  function saveStore(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (_) {}
  }
  function pick(items, index) { return items[((index % items.length) + items.length) % items.length]; }
  function normalize(s) { return String(s || '').trim().replace(/[ \t]+/g, ' '); }
  function cleanClause(s) { return normalize(s).replace(/[.!?;,\s]+$/g, ''); }
  function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
  function shorten(s, max) { return s.length > max ? s.slice(0, max - 1).trimEnd() + '…' : s; }

  function getInputs() {
    const data = new FormData(form);
    return {
      link: normalize(data.get('affiliateLink')),
      product: cleanClause(data.get('productName')),
      features: normalize(data.get('features')),
      audience: cleanClause(data.get('audience')),
      mood: data.get('mood') || 'story',
      tone: data.get('tone') || 'casual',
      count: Math.min(4, Math.max(1, Number(data.get('commentCount')) || 3)),
      disclose: $('disclose').checked
    };
  }

  function validate(p) {
    if (!p.link) return 'Masukkan link Shopee Affiliate dahulu.';
    try {
      const url = new URL(p.link);
      if (url.protocol !== 'https:' || !url.hostname.includes('.')) {
        return 'Gunakan link penuh bermula dengan https://';
      }
    } catch (_) { return 'Link tak sah. Pastikan link penuh bermula dengan https://'; }
    if (p.link.length > 2000) return 'Link terlalu panjang. Gunakan link affiliate yang lebih pendek.';
    if (p.product.length < 3) return 'Masukkan nama produk yang jelas (sekurang-kurangnya 3 huruf).';
    return '';
  }

  function getFacts(raw) {
    return raw.split(/[;\n]+/).map(cleanClause).filter(Boolean).slice(0, 5).map(x => shorten(x, 100));
  }

  function writePost(p, v) {
    const item = p.product;
    const who = p.audience ? 'Untuk ' + p.audience + ', ' : '';
    const facts = getFacts(p.features);
    const isFormal = p.tone === 'polished';
    const isDirect = p.tone === 'direct';

    const starters = {
      story: isFormal ? [
        'Kadang-kadang, penyelesaian bermula dengan satu idea yang ringkas.',
        'Ada produk yang menarik perhatian kerana kegunaannya yang praktikal.',
        'Bila mencari pilihan untuk kegunaan harian, perkara kecil pun wajar dipertimbangkan.',
        'Mencari produk yang sesuai tidak semestinya rumit.'
      ] : [
        'Pernah tak scroll Shopee, tiba-tiba jumpa sesuatu yang buat kita berhenti sekejap? 👀',
        'Kadang benda yang paling simple tu yang buat kita terfikir, “eh, menarik juga”.',
        'Cerita dia macam ni: tengah tengok pilihan dekat Shopee, terjumpa satu produk ni.',
        'Korang pernah nampak produk yang nampak biasa, tapi ada fungsi yang menarik?'
      ],
      curious: [
        'Aku tengah tengok satu produk ni… tapi yang buat aku curious bukan nama dia. 👀',
        'Apa yang buat produk ni patut masuk dalam shortlist? Ada satu perkara menarik.',
        'Ada sebab kenapa aku simpan link produk ni untuk tengok balik.',
        'Kalau kau tengah survey barang macam ni, mungkin kau nak tengok yang satu ni.'
      ],
      hook: [
        'SEBELUM checkout, tengok dulu pilihan ni. ⚡',
        'Jangan beli ikut gambar semata-mata. Check produk ni dulu.',
        'Kalau tengah survey barang, jangan skip bahagian spesifikasi.',
        'STOP sekejap kalau kau tengah cari barang kategori ni. 👇'
      ],
      soft: isFormal ? [
        'Sekadar berkongsi satu pilihan produk untuk dipertimbangkan.',
        'Untuk yang sedang membuat perbandingan, ini satu listing yang boleh disemak.',
        'Pilihan yang mungkin relevan untuk keperluan tertentu.',
        'Satu cadangan untuk dimasukkan dalam senarai semakan.'
      ] : [
        'Sharing je kalau ada yang tengah cari benda macam ni 🌿',
        'Aku letak sini satu produk yang boleh korang usha.',
        'Bukan nak paksa beli, cuma nak share satu pilihan.',
        'Kalau korang suka compare dulu sebelum beli, boleh tengok yang ni.'
      ]
    };
    const intros = {
      story: [
        'Produk yang aku nak highlight: ' + item + '.',
        'Nama produk tu ' + item + '.',
        'Pilihan yang aku jumpa ialah ' + item + '.',
        'Produk ni bernama ' + item + '.'
      ],
      curious: [
        'Produk tu ialah ' + item + '.',
        'Aku maksudkan ' + item + '.',
        'Nama dia: ' + item + '.',
        'Yang aku tengah survey ialah ' + item + '.'
      ],
      hook: [
        'Produk untuk dibandingkan: ' + item + '.',
        'Cuba semak listing ' + item + '.',
        'Nama item: ' + item + '.',
        'Aku letak ' + item + ' dalam shortlist.'
      ],
      soft: [
        'Nama produk: ' + item + '.',
        'Aku jumpa listing ' + item + '.',
        'Kalau relevan, boleh usha ' + item + '.',
        'Antara pilihan yang boleh dipertimbangkan: ' + item + '.'
      ]
    };

    const benefitsLine = facts.length
      ? pick([
          'Antara perkara yang menarik untuk disemak: ' + facts[0] + '.',
          'Ciri yang dimasukkan dalam info produk: ' + facts[0] + '.',
          'Satu detail yang boleh diberi perhatian: ' + facts[0] + '.',
          'Dalam senarai ciri produk: ' + facts[0] + '.'
        ], v)
      : pick([
          'Aku akan tengok spesifikasi dan review sebelum buat keputusan.',
          'Paling penting, semak detail listing dulu sebelum beli.',
          'Boleh compare dengan pilihan lain ikut bajet dan keperluan.',
          'Jom tengok apa yang listing ni tawarkan.'
        ], v);
    const audienceLine = p.audience ? capitalize(who) + (isFormal ? 'pilihan ini mungkin relevan untuk dibandingkan.' : 'mungkin boleh masuk shortlist dulu.') : '';
    const outro = pick(
      p.mood === 'hook'
        ? ['Aku pecahkan apa yang patut disemak dekat bawah 👇', 'Detail ringkas aku sambung dekat komen 👇', 'Jom semak poin penting sebelum klik link 👇', 'Ada beberapa perkara yang elok dibandingkan 👇']
        : p.mood === 'curious'
          ? ['Aku sambung kenapa ia menarik perhatian 👇', 'Aku letak detail yang boleh korang semak dekat bawah 👇', 'Jom tengok apa yang ada dalam listing 👇', 'Aku sambung di komen sebab ada beberapa poin nak semak 👇']
          : ['Aku sambung details di komen 👇', 'Link dan benda yang boleh disemak aku letak di bawah 👇', 'Aku pecahkan sikit dekat komen 👇', 'Kalau berminat, aku sambung di bawah 👇'],
      v
    );
    if (isDirect) return shorten([pick(intros[p.mood], v), benefitsLine, outro].join('\n\n'), 470);
    return shorten([pick(starters[p.mood], v), pick(intros[p.mood], v), audienceLine, benefitsLine, outro].filter(Boolean).join('\n\n'), 470);
  }

  function writeMiddleReplies(p, v, middleCount) {
    const facts = getFacts(p.features);
    const audience = p.audience;
    const texts = [];
    const detailTitles = [
      'Benda pertama yang aku akan check:',
      'Detail yang patut dibandingkan:',
      'Satu lagi perkara sebelum checkout:',
      'Kalau nak pilih ikut keperluan:'
    ];
    const general = [
      'Semak saiz, material dan pilihan variasi pada listing supaya sesuai dengan kegunaan sendiri.',
      'Baca review bergambar dan rating terkini. Gambar produk sahaja tak cukup untuk buat keputusan.',
      'Bandingkan harga akhir selepas voucher dan kos penghantaran, bukan harga paparan sahaja.',
      'Pastikan warna, ukuran dan polisi pemulangan sesuai sebelum buat pesanan.'
    ];

    for (let i = 0; i < middleCount; i++) {
      let body;
      if (facts.length) {
        const idx = i % facts.length;
        body = 'Antara info yang boleh disemak pada produk:\n• ' + facts[idx] + '.';
        if (facts.length > middleCount && i === middleCount - 1) {
          const extra = facts.slice(i + 1, i + 3);
          if (extra.length) body += '\n• ' + extra.join('\n• ') + '.';
        }
        body += '\n\nSemak semula pada listing untuk pastikan spesifikasi tepat.';
      } else {
        body = pick(general, i + v);
      }

      if (i === 0 && audience) {
        body += '\n\n' + pick([
          'Kalau kau ' + audience + ', compare ikut ruang dan keperluan sendiri.',
          'Untuk ' + audience + ', semak sama ada item ni sesuai dengan penggunaan sebenar.'
        ], v);
      }
      texts.push(pick(detailTitles, i + v) + '\n\n' + body);
    }
    return texts;
  }

  function writeLinkReply(p, v) {
    const openers = [
      'Nak semak listing asal? Link aku letak dekat sini 👇',
      'Kalau nak tengok gambar, spesifikasi dan harga semasa, boleh check sini 👇',
      'Link untuk yang nak compare sendiri 👇',
      'Boleh tengok detail produk terus dekat link ni 👇'
    ];
    const disclosure = p.disclose ? '\n\nPautan affiliate: aku mungkin terima komisen jika ada pembelian melalui link ini.' : '';
    return pick(openers, v) + '\n\n' + p.link + disclosure;
  }

  function generate(p, v) {
    const post = writePost(p, v);
    const replies = writeMiddleReplies(p, v, p.count - 1);
    replies.push(writeLinkReply(p, v));
    return [post, ...replies];
  }

  function setError(message) {
    $('error').textContent = message;
    $('error').hidden = !message;
  }

  function showToast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
  }

  async function copy(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const helper = document.createElement('textarea');
        helper.value = text;
        helper.style.position = 'fixed';
        helper.style.opacity = '0';
        document.body.appendChild(helper);
        helper.select();
        const ok = document.execCommand('copy');
        helper.remove();
        if (!ok) throw new Error('copy failed');
      }
      showToast('✓ Dah copy ke clipboard');
    } catch (_) { showToast('Tak dapat copy. Tekan lama pada teks untuk salin.'); }
  }

  function createEl(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) el.textContent = content;
    return el;
  }

  function render() {
    if (!current || !Array.isArray(current.parts)) {
      $('empty').hidden = false;
      $('output').hidden = true;
      $('preview-badge').classList.remove('ready');
      $('preview-badge').textContent = 'BELUM SIAP';
      return;
    }
    $('empty').hidden = true;
    $('output').hidden = false;
    $('preview-badge').classList.add('ready');
    $('preview-badge').textContent = 'READY TO POST';
    $('result-mood').textContent = labels[current.inputs.mood] || 'Content';
    $('result-count').textContent = '1 post · ' + (current.parts.length - 1) + ' komen';

    const target = $('cards');
    target.replaceChildren();
    current.parts.forEach((content, index) => {
      const card = createEl('article', 'thread-card');
      const avatar = createEl('div', 'avatar', index === 0 ? '✳' : '↳');
      avatar.setAttribute('aria-hidden', 'true');
      const body = createEl('div', 'thread-body');
      const head = createEl('div', 'thread-head');
      const title = createEl('strong', '', index === 0 ? 'POST UTAMA' : 'KOMEN ' + index);
      const copyButton = createEl('button', 'copy-button', '⧉ Copy');
      copyButton.type = 'button';
      copyButton.setAttribute('aria-label', 'Salin ' + (index === 0 ? 'post utama' : 'komen ' + index));
      copyButton.addEventListener('click', () => copy(current.parts[index]));
      head.append(title, copyButton);
      const paragraph = createEl('div', 'thread-content', content);
      paragraph.setAttribute('contenteditable', 'true');
      paragraph.setAttribute('role', 'textbox');
      paragraph.setAttribute('aria-multiline', 'true');
      paragraph.setAttribute('aria-label', 'Edit teks ' + (index === 0 ? 'post utama' : 'komen ' + index));
      paragraph.setAttribute('spellcheck', 'true');
      paragraph.addEventListener('input', () => {
        if (!current) return;
        current.parts[index] = paragraph.innerText;
        saveLatest();
      });
      body.append(head, paragraph);
      card.append(avatar, body);
      target.appendChild(card);
    });
  }

  function saveLatest() {
    if (!current) return;
    const idx = history.findIndex(item => item.id === current.id);
    if (idx >= 0) history[idx] = current;
    else history.unshift(current);
    history = history.slice(0, 12);
    saveStore(STORAGE_HISTORY, history);
  }

  function renderHistory() {
    const target = $('history-list');
    target.replaceChildren();
    $('clear-history').hidden = !history.length;
    if (!history.length) {
      target.append(createEl('p', 'history-empty', 'Belum ada post dijana.'));
      return;
    }
    history.forEach(item => {
      if (!item || !item.inputs || !Array.isArray(item.parts)) return;
      const row = createEl('div', 'history-entry');
      const info = createEl('div', 'history-info');
      info.append(
        createEl('strong', '', item.inputs.product),
        createEl('small', '', (labels[item.inputs.mood] || 'Post') + ' · ' + new Date(item.createdAt).toLocaleString('ms-MY', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}))
      );
      const button = createEl('button', '', 'Buka ↗');
      button.type = 'button';
      button.addEventListener('click', () => {
        current = item;
        render();
        document.querySelector('.preview').scrollIntoView({behavior:'smooth',block:'start'});
      });
      row.append(info, button);
      target.append(row);
    });
  }

  function saveDraft() {
    saveStore(STORAGE_DRAFT, getInputs());
  }

  function restoreDraft() {
    const d = readStore(STORAGE_DRAFT, null);
    if (!d || typeof d !== 'object') return;
    $('affiliate-link').value = d.link || '';
    $('product-name').value = d.product || '';
    $('features').value = d.features || '';
    $('audience').value = d.audience || '';
    $('comment-count').value = String(d.count || 3);
    $('tone').value = d.tone || 'casual';
    $('disclose').checked = d.disclose !== false;
    const radio = form.querySelector('input[name="mood"][value="' + (labels[d.mood] ? d.mood : 'story') + '"]');
    if (radio) radio.checked = true;
  }

  function runGeneration() {
    const data = getInputs();
    const error = validate(data);
    setError(error);
    if (error) {
      document.getElementById(error.includes('Link') || error.includes('link') ? 'affiliate-link' : 'product-name').focus();
      return;
    }
    revision += 1;
    const parts = generate(data, revision);
    current = {id:String(Date.now())+'-'+revision,createdAt:Date.now(),inputs:data,parts};
    saveLatest();
    saveDraft();
    renderHistory();
    render();
    $('output').scrollIntoView({behavior:'smooth',block:'start'});
  }

  form.addEventListener('submit', event => { event.preventDefault(); runGeneration(); });
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);
  $('regenerate').addEventListener('click', runGeneration);
  $('copy-all').addEventListener('click', () => {
    if (!current) return;
    copy(current.parts.map((p, i) => (i===0?'POST UTAMA':'KOMEN '+i)+'\n'+p).join('\n\n──────────\n\n'));
  });
  $('new-post').addEventListener('click', () => {
    form.reset();
    current = null;
    setError('');
    saveDraft();
    render();
    $('form-title').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('clear-history').addEventListener('click', () => {
    if (!window.confirm('Padam semua sejarah post yang tersimpan pada telefon ini?')) return;
    history = [];
    current = null;
    saveStore(STORAGE_HISTORY, []);
    render();
    renderHistory();
    showToast('Sejarah telah dipadam');
  });

  if (!Array.isArray(history)) history = [];
  restoreDraft();
  renderHistory();
  render();

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();