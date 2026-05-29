/**
 * Batch 6: Oprava názvů F70-F99 dle UZIS + kategorie v mapping.json
 */
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));
const mapping = JSON.parse(fs.readFileSync('src/data/mapping.json', 'utf8'));

const FIXES = {
  // F71 – "Středně těžká" je OK ale UZIS říká "Střední"? Check: obě jsou v použití
  // UZIS 2026 říká "Střední mentální retardace"
  'F71':   { nazev_cz: 'Střední mentální retardace' },
  'F71.0': { nazev_cz: 'Střední mentální retardace – bez poruch chování nebo s minimálními poruchami chování' },
  'F71.1': { nazev_cz: 'Střední mentální retardace – s výraznou poruchou chování vyžadující léčbu nebo péči' },
  'F71.8': { nazev_cz: 'Střední mentální retardace – s jinou poruchou chování' },
  'F71.9': { nazev_cz: 'Střední mentální retardace – bez informace o poruše chování' },

  // F80 – drobné opravy
  'F80.3': { nazev_cz: 'Získaná afázie s epilepsií (Landauův–Kleffnerův syndrom)' }, // Landau → Landauův

  // F81 – přesnější UZIS termíny
  'F81.1': { nazev_cz: 'Specifická porucha psaní a výslovnosti' }, // "hláskování" → "psaní a výslovnosti"
  'F81.3': { nazev_cz: 'Smíšená porucha školních dovedností' },    // odstranit "vývojová"

  // F84 – přesná jména
  'F84.0': { nazev_cz: 'Dětský autismus' },                        // bez "(Kannerův autismus)"
  'F84.3': { nazev_cz: 'Jiná dětská dezintegrační porucha' },      // pořadí slov

  // F90 – bez zkratky
  'F90.0': { nazev_cz: 'Porucha aktivity a pozornosti' },          // bez "(ADHD)"

  // F91
  'F91.3': { nazev_cz: 'Opoziční vzdorovité chování' },            // "porucha" → "chování" (UZIS)

  // F93 – "anxiózní" dle UZIS
  'F93.0': { nazev_cz: 'Separační anxiózní porucha v dětství' },
  'F93.1': { nazev_cz: 'Fobická anxiózní porucha v dětství' },
  'F93.2': { nazev_cz: 'Sociální anxiózní porucha v dětství' },

  // F94
  'F94.1': { nazev_cz: 'Reaktivní porucha příchylnosti v dětství' }, // OK, check: UZIS "dětí" vs "v dětství"
  'F94.2': { nazev_cz: 'Porucha desinhibovaných vztahů u dětí' },   // přesné UZIS znění

  // F95 – "Tiky" (UZIS název kategorie)
  'F95':   { nazev_cz: 'Tiky' },
  'F95.1': { nazev_cz: 'Chronické motorické nebo vokální tiky' },
  'F95.2': { nazev_cz: 'Kombinovaná tiková porucha vokální a mnohočetná motorická (Touretteův syndrom)' },
  'F95.8': { nazev_cz: 'Jiné tikové poruchy' },
  'F95.9': { nazev_cz: 'Tiková porucha NS' },

  // F98 – přesnější znění
  'F98.2': { nazev_cz: 'Poruchy příjmu potravy v kojeneckém a dětském věku' },
  'F98.3': { nazev_cz: 'Pika kojenců a dětí' },
  'F98.5': { nazev_cz: 'Koktavost (zadrhávání v řeči)' },
};

let count = 0;
for (const d of data) {
  if (FIXES[d.id]) {
    Object.assign(d, FIXES[d.id]);
    count++;
  }
  // kategorie F90-F98
  if (d.kategorie === 'F90–F98 Poruchy chování v dětství') {
    d.kategorie = 'F90–F98 Poruchy chování a emocí s obvyklým nástupem v dětství a dospívání';
  }
}

// Aktualizuj mapping.json kategorie na přesné UZIS názvy (sidebar)
mapping.kategorie = mapping.kategorie.map(k => {
  const map = {
    'F00-F09': 'Organické duševní poruchy',             // zkráceno pro sidebar
    'F10-F19': 'Poruchy způsobené psychoaktivními látkami',
    'F20-F29': 'Schizofrenie a poruchy s bludy',
    'F30-F39': 'Afektivní poruchy (poruchy nálady)',
    'F40-F48': 'Neurotické, stresové a somatoformní poruchy',
    'F50-F59': 'Behaviorální syndromy a fyziologické poruchy',
    'F60-F69': 'Poruchy osobnosti a chování u dospělých',
    'F70-F79': 'Mentální retardace',
    'F80-F89': 'Poruchy psychického vývoje',
    'F90-F98': 'Poruchy chování a emocí v dětství',
    'F99': 'Neurčená duševní porucha'
  };
  return { ...k, nazev: map[k.rozsah] || k.nazev };
});

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync('src/data/mapping.json', JSON.stringify(mapping, null, 2), 'utf8');
console.log(`✅ Batch 6 hotov: opraveno ${count} názvů F70-F99 + kategorie mapping.json`);
['F71','F81.1','F84.0','F90.0','F91.3','F93.0','F94.2','F95','F95.2','F98.3','F98.5'].forEach(id => {
  const d = data.find(x => x.id === id);
  if (d) console.log(`  ${id}: ${d.nazev_cz}`);
});
console.log('\nKategorie (mapping.json):');
mapping.kategorie.forEach(k => console.log(`  ${k.rozsah}: ${k.nazev}`));
