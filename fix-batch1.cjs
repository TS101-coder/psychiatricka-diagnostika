/**
 * Batch 1: Oprava názvů F00-F09 dle oficiálního UZIS MKN-10
 * Zdroj: mkn10.uzis.cz (verze platná od 1.1.2026)
 */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));

const FIXES = {
  // F00 – subcodes: "začátkem" → "nástupem" + jiné formulace
  'F00.0': { nazev_cz: 'Demence u Alzheimerovy nemoci s časným nástupem' },
  'F00.1': { nazev_cz: 'Demence u Alzheimerovy nemoci s pozdním nástupem' },
  'F00.2': { nazev_cz: 'Demence u Alzheimerovy nemoci, atypického nebo smíšeného typu' },
  'F00.9': { nazev_cz: 'Demence u Alzheimerovy nemoci NS' }, // "při Alzheimerově" → "u Alzheimerovy"

  // F02 – chybí "zařazených jinde" + jiné názvy
  'F02':   { nazev_cz: 'Demence u jiných nemocí zařazených jinde' },
  'F02.0': { nazev_cz: 'Demence u Pickovy choroby' },       // nemoci → choroby
  'F02.1': { nazev_cz: 'Demence u Creutzfeldtovy–Jakobovy nemoci' },
  'F02.4': { nazev_cz: 'Demence u onemocnění virem lidské imunodeficience [HIV]' },
  'F02.8': { nazev_cz: 'Demence u jiných určených nemocí zařazených jinde' },

  // F04 – zkrácený název doplnit
  'F04':   { nazev_cz: 'Organický amnestický syndrom, který nebyl vyvolán alkoholem nebo jinými psychoaktivními látkami' },

  // F05 – přesné formulace dle UZIS
  'F05':   { nazev_cz: 'Delirium, které není vyvolané alkoholem nebo jinými psychoaktivními látkami' },
  'F05.0': { nazev_cz: 'Delirium, které nenasedá na demenci' },
  'F05.1': { nazev_cz: 'Delirium, nasedající na demenci' },

  // F06 – přesnější české termíny
  'F06':   { nazev_cz: 'Jiné duševní poruchy, způsobené poškozením mozku, jeho dysfunkcí a somatickou nemocí' },
  'F06.1': { nazev_cz: 'Organická katatonní porucha' },     // katatonická → katatonní
  'F06.2': { nazev_cz: 'Organická porucha s bludy' },       // bludná (schizoformní) → porucha s bludy
  'F06.6': { nazev_cz: 'Organická emoční labilita' },       // emocionálně labilní (astenická) → emoční labilita
  'F06.7': { nazev_cz: 'Lehká porucha poznávání' },         // Mírná kognitivní porucha → Lehká porucha poznávání
  'F06.8': { nazev_cz: 'Jiné určené duševní poruchy způsobené poškozením a dysfunkcí mozku' },
  'F06.9': { nazev_cz: 'Neurčená duševní porucha způsobená poškozením a dysfunkcí mozku' },

  // F07 – poraněním → poškozením
  'F07':   { nazev_cz: 'Poruchy osobnosti a chování způsobené onemocněním, poškozením a dysfunkcí mozku' },
  'F07.8': { nazev_cz: 'Jiné organické poruchy osobnosti a chování způsobené onemocněním, poškozením a dysfunkcí mozku' },
  'F07.9': { nazev_cz: 'Organické poruchy osobnosti a chování, neurčené' },
};

let count = 0;
for (const d of data) {
  if (FIXES[d.id]) {
    Object.assign(d, FIXES[d.id]);
    count++;
  }
  // Aktualizuj kategorie F00-F09 na úplný název
  if (d.kategorie === 'F00–F09 Organické duševní poruchy') {
    d.kategorie = 'F00–F09 Organické duševní poruchy včetně symptomatických';
  }
}

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Batch 1 hotov: opraveno ${count} názvů F00-F09`);

// Ověření
const toCheck = ['F00.0','F00.9','F02','F02.0','F02.1','F02.4','F05.0','F05.1','F06.2','F06.7','F07'];
toCheck.forEach(id => {
  const d = data.find(x => x.id === id);
  if (d) console.log(`  ${id}: ${d.nazev_cz}`);
});
