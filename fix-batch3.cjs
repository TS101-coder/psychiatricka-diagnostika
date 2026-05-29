/**
 * Batch 3: Oprava názvů F30-F39 dle UZIS MKN-10
 * Klíčová změna: "epizoda" → "fáze", "Rekurentní" → "Periodická"
 */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));

const FIXES = {
  // F30 – "epizoda" → "fáze"
  'F30':   { nazev_cz: 'Manická fáze' },
  'F30.1': { nazev_cz: 'Manie bez psychotických symptomů' },
  'F30.2': { nazev_cz: 'Manie s psychotickými symptomy' },
  'F30.8': { nazev_cz: 'Jiné manické fáze' },
  'F30.9': { nazev_cz: 'Manická fáze NS' },

  // F31 – "epizoda" → "fáze", "aktuální" → "současná"
  'F31.0': { nazev_cz: 'Bipolární afektivní porucha, současná fáze je hypomanická' },
  'F31.1': { nazev_cz: 'Bipolární afektivní porucha, současná fáze manická bez psychotických symptomů' },
  'F31.2': { nazev_cz: 'Bipolární afektivní porucha, současná fáze manická s psychotickými symptomy' },
  'F31.3': { nazev_cz: 'Bipolární afektivní porucha, současná fáze lehká nebo střední deprese' },
  'F31.4': { nazev_cz: 'Bipolární afektivní porucha, současná fáze těžké deprese bez psychotických symptomů' },
  'F31.5': { nazev_cz: 'Bipolární afektivní porucha, současná fáze těžké deprese s psychotickými symptomy' },
  'F31.6': { nazev_cz: 'Bipolární afektivní porucha, současná fáze smíšená' },
  'F31.7': { nazev_cz: 'Bipolární afektivní porucha, v současné době v remisi' },

  // F32 – "Depresivní epizoda" → "Depresivní fáze"
  'F32':   { nazev_cz: 'Depresivní fáze' },
  'F32.0': { nazev_cz: 'Lehká depresivní fáze' },
  'F32.1': { nazev_cz: 'Středně těžká depresivní fáze' },
  'F32.2': { nazev_cz: 'Těžká depresivní fáze bez psychotických příznaků' },
  'F32.3': { nazev_cz: 'Těžká depresivní fáze s psychotickými příznaky' },
  'F32.8': { nazev_cz: 'Jiné depresivní fáze' },
  'F32.9': { nazev_cz: 'Depresivní fáze NS' },

  // F33 – "Rekurentní" → "Periodická"; "epizoda" → "fáze"
  'F33':   { nazev_cz: 'Periodická depresivní porucha' },
  'F33.0': { nazev_cz: 'Periodická depresivní porucha, současná fáze je lehká' },
  'F33.1': { nazev_cz: 'Periodická depresivní porucha, současná fáze je středně těžká' },
  'F33.2': { nazev_cz: 'Periodická depresivní porucha, současná fáze je těžká bez psychotických symptomů' },
  'F33.3': { nazev_cz: 'Periodická depresivní porucha, současná fáze je těžká s psychotickými příznaky' },
  'F33.4': { nazev_cz: 'Periodická depresivní porucha, v současné době v remisi' },
  'F33.8': { nazev_cz: 'Jiné periodické depresivní poruchy' },
  'F33.9': { nazev_cz: 'Periodická depresivní porucha NS' },

  // F34 – "Trvalé" → "Perzistentní"
  'F34':   { nazev_cz: 'Perzistentní afektivní poruchy (poruchy nálady)' },
  'F34.8': { nazev_cz: 'Jiné perzistentní afektivní poruchy' },
  'F34.9': { nazev_cz: 'Perzistentní afektivní porucha NS' },

  // F38 – "opakující se" → "periodické"
  'F38.1': { nazev_cz: 'Jiné periodické afektivní poruchy' },
  'F38.80':{ nazev_cz: 'Jiné určené afektivní poruchy' }, // OK, confirm

  // F39 – OK
};

let count = 0;
for (const d of data) {
  if (FIXES[d.id]) {
    Object.assign(d, FIXES[d.id]);
    count++;
  }
  // Update kategorie – zůstane "Afektivní poruchy" – to je OK (zkrácený)
  // ale doplníme závorku dle UZIS
  if (d.kategorie === 'F30–F39 Afektivní poruchy') {
    d.kategorie = 'F30–F39 Afektivní poruchy (poruchy nálady)';
  }
}

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Batch 3 hotov: opraveno ${count} názvů F30-F39`);
['F30','F32','F32.0','F33','F33.0','F34','F34.8','F31.0','F31.3'].forEach(id => {
  const d = data.find(x => x.id === id);
  if (d) console.log(`  ${id}: ${d.nazev_cz}`);
});
