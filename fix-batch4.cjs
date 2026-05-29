/**
 * Batch 4: Oprava názvů F40-F48 dle UZIS MKN-10
 */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));

const FIXES = {
  // F40 – "anxiózně fobické" místo "fobické úzkostné"
  'F40.8': { nazev_cz: 'Jiné anxiózně fobické poruchy' },
  'F40.9': { nazev_cz: 'Anxiózně fobická porucha NS' },

  // F41 – "anxiózní" místo "úzkostné" + F41.2 přesný název
  'F41':   { nazev_cz: 'Jiné anxiózní poruchy' },
  'F41.2': { nazev_cz: 'Smíšená úzkostná a depresivní porucha' }, // UZIS: bez "ně"

  // F42 – "obsedantně-nutkavá" je oficiální termín (ne "kompulzivní")
  'F42':   { nazev_cz: 'Obsedantně-nutkavá porucha' },
  'F42.0': { nazev_cz: 'Převážně vtíravé myšlenky nebo ruminace' },
  'F42.1': { nazev_cz: 'Převážně nutkavé činy (obsedantní rituály)' },
  'F42.2': { nazev_cz: 'Smíšené vtíravé myšlenky a nutkavé činy' },
  'F42.8': { nazev_cz: 'Jiné obsedantně-nutkavé poruchy' },
  'F42.9': { nazev_cz: 'Obsedantně-nutkavá porucha NS' },

  // F43 – drobné opravy
  'F43.1': { nazev_cz: 'Posttraumatická stresová porucha' }, // odstranit zkratku "(PTSP)"
  'F43.2': { nazev_cz: 'Poruchy přizpůsobení' },            // plurál dle UZIS

  // F44 – přesnější termíny
  'F44.1': { nazev_cz: 'Disociativní fuga' },               // "fugue" → česky "fuga"
  'F44.3': { nazev_cz: 'Trans a posedlost' },               // "stavy posedlosti" → jen "posedlost"
  'F44.4': { nazev_cz: 'Disociativní motorické poruchy' },  // "pohybové" → "motorické"
  'F44.5': { nazev_cz: 'Disociativní záchvaty' },           // "konvulze" → "záchvaty"
  'F44.6': { nazev_cz: 'Disociativní anestezie a ztráta citlivosti' },

  // F45 – "vegetativní" místo "autonomní"; "perzistující" místo "přetrvávající"
  'F45.3': { nazev_cz: 'Somatoformní vegetativní dysfunkce' },
  // F45.3x subcodes – update název
  'F45.30':{ nazev_cz: 'Somatoformní vegetativní dysfunkce srdce a kardiovaskulárního systému' },
  'F45.31':{ nazev_cz: 'Somatoformní vegetativní dysfunkce horního gastrointestinálního traktu' },
  'F45.32':{ nazev_cz: 'Somatoformní vegetativní dysfunkce dolního gastrointestinálního traktu' },
  'F45.33':{ nazev_cz: 'Somatoformní vegetativní dysfunkce dýchacích orgánů' },
  'F45.34':{ nazev_cz: 'Somatoformní vegetativní dysfunkce urogenitálního systému' },
  'F45.38':{ nazev_cz: 'Somatoformní vegetativní dysfunkce jiných orgánů nebo systémů' },
  'F45.4': { nazev_cz: 'Perzistující somatoformní bolestivá porucha' },

  // F48 – "Depersonalizačně-derealizační syndrom" → přesné znění UZIS
  'F48.1': { nazev_cz: 'Depersonalizace a derealizace' },
};

let count = 0;
for (const d of data) {
  if (FIXES[d.id]) {
    Object.assign(d, FIXES[d.id]);
    count++;
  }
  // kategorie
  if (d.kategorie === 'F40–F48 Neurotické a stresové poruchy') {
    d.kategorie = 'F40–F48 Neurotické, stresové a somatoformní poruchy';
  }
}

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Batch 4 hotov: opraveno ${count} názvů F40-F48`);
['F42','F42.0','F42.1','F44.3','F44.4','F44.5','F45.3','F45.4','F48.1','F43.1','F43.2','F41'].forEach(id => {
  const d = data.find(x => x.id === id);
  if (d) console.log(`  ${id}: ${d.nazev_cz}`);
});
