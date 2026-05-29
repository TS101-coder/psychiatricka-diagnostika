/**
 * Batch 5: Oprava názvů F50-F69 dle UZIS MKN-10
 */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));

const FIXES = {
  // F51 – přesné termíny
  'F51.0': { nazev_cz: 'Neorganická nespavost' },            // "insomnie" → "nespavost"
  'F51.1': { nazev_cz: 'Neorganická hypersomnie' },          // "hypersomnolence" → "hypersomnie"
  'F51.2': { nazev_cz: 'Neorganická porucha cyklu bdění a spánku' },
  'F51.3': { nazev_cz: 'Náměsíčnictví (somnambulismus)' },   // pořadí: Somnambulismus → Náměsíčnictví
  'F51.4': { nazev_cz: 'Spánkové děsy (noční děsy)' },       // "Děs ze spánku (pavor nocturnus)" → UZIS termín

  // F52 – přesnější termíny
  'F52.0': { nazev_cz: 'Nedostatek nebo ztráta sexuální žádostivosti' },
  'F52.1': { nazev_cz: 'Odpor k sexu a nedostatek požitku ze sexuality' },
  'F52.3': { nazev_cz: 'Poruchy orgasmu' },                  // "Orgasmická dysfunkce" → "Poruchy orgasmu"
  'F52.7': { nazev_cz: 'Nadměrné sexuální nutkání' },
  'F52.8': { nazev_cz: 'Jiné sexuální poruchy, které nejsou způsobeny organickou poruchou nebo nemocí' },
  'F52.9': { nazev_cz: 'Neurčená sexuální porucha, která není způsobena organickou poruchou nebo nemocí' },

  // F53 – přesnější názvy
  'F53':   { nazev_cz: 'Duševní poruchy a poruchy chování související se šestinedělím' },
  'F53.0': { nazev_cz: 'Lehké duševní poruchy a poruchy chování v souvislosti se šestinedělím' },
  'F53.1': { nazev_cz: 'Těžké duševní poruchy v souvislosti se šestinedělím' },
  'F53.8': { nazev_cz: 'Jiné duševní poruchy v souvislosti se šestinedělím' },
  'F53.9': { nazev_cz: 'Puerperální duševní poruchy NS' },

  // F54 – přesnější znění
  'F54':   { nazev_cz: 'Psychologické a behaviorální faktory spojené s chorobami nebo poruchami zařazenými jinde' },

  // F60 subcodes drobné opravy
  'F60.5': { nazev_cz: 'Anankastická porucha osobnosti' },   // bez "(obsedantně kompulzivní)"
  'F60.6': { nazev_cz: 'Anxiózní (vyhýbavá) porucha osobnosti' }, // UZIS: "Anxiózní (vyhýbavá) osobnost" → zachovat "porucha"

  // F62 – "Trvalé" → "Přetrvávající"
  'F62':   { nazev_cz: 'Přetrvávající změny osobnosti, které nelze přisoudit poškození nebo nemoci mozku' },
  'F62.0': { nazev_cz: 'Přetrvávající změna osobnosti po katastrofické zkušenosti' },
  'F62.1': { nazev_cz: 'Přetrvávající změna osobnosti po psychiatrickém onemocnění' },
  'F62.8': { nazev_cz: 'Jiné přetrvávající změny osobnosti' },
  'F62.9': { nazev_cz: 'Přetrvávající změna osobnosti NS' },

  // F63 – "Návykové" → "Nutkavé"
  'F63':   { nazev_cz: 'Nutkavé a impulzivní poruchy' },
  'F63.1': { nazev_cz: 'Patologické zakládání požárů (pyromanie)' }, // "žhářství" → "zakládání požárů"
  'F63.2': { nazev_cz: 'Patologické kradení (kleptomanie)' },        // "krádeže" → "kradení"
  'F63.8': { nazev_cz: 'Jiné nutkavé a impulzivní poruchy' },
  'F63.9': { nazev_cz: 'Nutkavá a impulzivní porucha NS' },

  // F64
  'F64.1': { nazev_cz: 'Transvestitismus dvojí role' },             // "Duální-rolový" → "dvojí role"

  // F65
  'F65.3': { nazev_cz: 'Voyerismus' },                             // "Voyeurismus" → "Voyerismus" (česky)

  // F66
  'F66.0': { nazev_cz: 'Porucha sexuálního vyzrávání' },           // "zrání" → "vyzrávání"
  'F66.2': { nazev_cz: 'Porucha sexuálních vztahů' },              // singulár → plurál

  // F68 – přesnější UZIS termíny
  'F68.0': { nazev_cz: 'Zpracování somatických symptomů psychologickými vlivy' },
  'F68.1': { nazev_cz: 'Záměrná produkce nebo předstírání symptomů nebo invalidity (Münchhausenův syndrom)' },
};

let count = 0;
for (const d of data) {
  if (FIXES[d.id]) {
    Object.assign(d, FIXES[d.id]);
    count++;
  }
  // kategorie F50-F59
  if (d.kategorie === 'F50–F59 Behaviorální syndromy') {
    d.kategorie = 'F50–F59 Syndromy poruch chování spojené s fyziologickými poruchami a somatickými faktory';
  }
  // kategorie F60-F69
  if (d.kategorie === 'F60–F69 Poruchy osobnosti') {
    d.kategorie = 'F60–F69 Poruchy osobnosti a chování u dospělých';
  }
}

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Batch 5 hotov: opraveno ${count} názvů F50-F69`);
['F51.0','F51.3','F51.4','F52.0','F52.3','F52.7','F53.9','F62','F63','F63.1','F63.2','F68.0','F68.1'].forEach(id => {
  const d = data.find(x => x.id === id);
  if (d) console.log(`  ${id}: ${d.nazev_cz}`);
});
