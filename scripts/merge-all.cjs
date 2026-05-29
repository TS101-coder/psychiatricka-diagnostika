const fs = require('fs');
const path = require('path');

const { f11_chybejici, f12_chybejici, f13_chybejici, f14_chybejici,
        f15_chybejici, f16_chybejici, f17_chybejici, f18_chybejici,
        f19_chybejici, existing, dataPath } = require('./pridej-diagnozy.cjs');

const { nove: cast2 } = require('./pridej-cast2.cjs');
const { nove: cast3 } = require('./pridej-cast3.cjs');
const { nove: cast4 } = require('./pridej-cast4.cjs');

const vsechnoNove = [
  ...f11_chybejici, ...f12_chybejici, ...f13_chybejici, ...f14_chybejici,
  ...f15_chybejici, ...f16_chybejici, ...f17_chybejici, ...f18_chybejici,
  ...f19_chybejici,
  ...cast2, ...cast3, ...cast4,
];

// Merge with existing (skip duplicates)
const existingIds = new Set(existing.map(d => d.id));
const toAdd = vsechnoNove.filter(n => !existingIds.has(n.id));
const merged = [...existing, ...toAdd];

// Sort by code: F00, F00.0, F00.1, F01, F01.0 ...
merged.sort((a, b) => {
  // parse "F23.1" → ["F23", "1"] for sorting
  const parse = id => {
    const [main, sub] = id.split('.');
    const num = parseInt(main.replace('F', ''));
    const subNum = sub ? parseFloat('0.' + sub) : 0;
    return num + subNum;
  };
  return parse(a.id) - parse(b.id);
});

fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✅ Hotovo! Celkem diagnóz: ${merged.length} (přidáno: ${toAdd.length})`);
