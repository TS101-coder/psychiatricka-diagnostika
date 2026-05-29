/**
 * Batch 2: Oprava názvů F20-F29 dle UZIS MKN-10
 */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));

const FIXES = {
  // F20 – obecně OK, jen F20.6
  'F20.6': { nazev_cz: 'Schizophrenia simplex' }, // "Simplexní schizofrenie" → latinský termín

  // F22 – "Trvalé" → "Přetrvávající/Perzistující" + přesnější nazvy
  'F22':   { nazev_cz: 'Poruchy s trvalými bludy' },
  'F22.0': { nazev_cz: 'Porucha s bludy' },             // "Paranoia (porucha s bludy)" → jen "Porucha s bludy"
  'F22.8': { nazev_cz: 'Ostatní poruchy s přetrvávajícími bludy' },
  'F22.9': { nazev_cz: 'Perzistující porucha s bludy NS' },

  // F23 – přesnější formulace dle UZIS
  'F23.0': { nazev_cz: 'Akutní polymorfní psychotická porucha bez symptomů schizofrenie' },
  'F23.1': { nazev_cz: 'Akutní polymorfní psychotická porucha se symptomy schizofrenie' },
  'F23.2': { nazev_cz: 'Akutní psychotická porucha podobná schizofrenii' },
  'F23.3': { nazev_cz: 'Jiné akutní psychotické poruchy převážně s bludy' },
  'F23.9': { nazev_cz: 'Akutní a přechodná psychotická porucha NS' },

  // F25 – "porucha" → "poruchy" ve F25.8
  'F25.8': { nazev_cz: 'Jiné schizoafektivní poruchy' },  // OK, check: already correct

  // F28 – "neorganické" → "nonorganické" (official is "Jiné neorganické psychotické poruchy")
  'F28': { nazev_cz: 'Jiné neorganické psychotické poruchy' }, // OK as-is
  'F29': { nazev_cz: 'Neurčená neorganická psychóza' },
};

let count = 0;
for (const d of data) {
  if (FIXES[d.id]) {
    Object.assign(d, FIXES[d.id]);
    count++;
  }
  // Update kategorie
  if (d.kategorie === 'F20–F29 Schizofrenie a psychotické poruchy') {
    d.kategorie = 'F20–F29 Schizofrenie, poruchy schizotypální a poruchy s bludy';
  }
}

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Batch 2 hotov: opraveno ${count} názvů F20-F29`);

['F20.6','F22','F22.0','F22.8','F22.9','F23.0','F23.2','F23.3'].forEach(id => {
  const d = data.find(x => x.id === id);
  if (d) console.log(`  ${id}: ${d.nazev_cz}`);
});
