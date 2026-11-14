/* ThreadCraft card format v1: paste product information extracted in ChatGPT.
   This parser never fetches Shopee and never executes pasted data. */
(function (global) {
  "use strict";
  const HEADER = "THREADCRAFT-PRODUCT-V1";
  const END = "END-THREADCRAFT-PRODUCT";
  const ALLOWED = new Set(["NAME","FEATURES","SELLER_CLAIMS","SNAPSHOT","AFFILIATE_URL"]);
  const lineValue = v => String(v || "").replace(/[\r\n]+/g, " ").trim();

  function parse(text) {
    if (typeof text !== "string" || text.length > 8000) throw new Error("Kad terlalu panjang atau format tak sah.");
    const normalized = text.trim().replace(/^\x60{3}(?:text|plaintext)?\s*\n/i,"").replace(/\n\x60{3}\s*$/,"").trim();
    const lines = normalized.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    if(lines[0] !== HEADER || lines[lines.length-1] !== END) {
      throw new Error("Format tak dikenali. Copy kad produk lengkap dari ChatGPT, dari baris THREADCRAFT sampai END.");
    }
    const values = {};
    for (const line of lines.slice(1,-1)) {
      const match = line.match(/^([A-Z_]+):\s*(.*)$/);
      if(!match || !ALLOWED.has(match[1])) throw new Error("Ada baris tak dikenali dalam kad produk. Sila copy kad asal tanpa ubah format.");
      if (Object.prototype.hasOwnProperty.call(values, match[1])) throw new Error("Kad ada label berulang: "+match[1]);
      values[match[1]]=lineValue(match[2]);
    }
    const name = values.NAME || "";
    if (name.length < 3 || name.length > 110) throw new Error("Nama produk dalam kad mesti antara 3 hingga 110 aksara.");
    const features = [values.FEATURES,values.SELLER_CLAIMS].filter(Boolean).join("; ");
    if(features.length > 400)throw new Error("Ciri dalam kad terlalu panjang. Minta ChatGPT ringkaskan kepada bawah 400 aksara.");
    const snapshot = values.SNAPSHOT || "";
    if(snapshot.length > 700)throw new Error("Nota screenshot terlalu panjang.");
    const url = values.AFFILIATE_URL || "";
    if(url) {
      let parsed;
      try { parsed = new URL(url); } catch (_) { throw new Error("Link affiliate dalam kad tidak sah."); }
      if(parsed.protocol !== "https:" ||
         !(parsed.hostname === "shopee.com.my" || parsed.hostname.endsWith(".shopee.com.my")) ||
         url.length > 350 || parsed.username || parsed.password) {
        throw new Error("Untuk import automatik, kad mesti guna link HTTPS Shopee Malaysia yang sah.");
      }
    }
    return {name, features, snapshot, url};
  }
  global.ThreadCraftProductCard = Object.freeze({parse, format:HEADER});
})(window);
