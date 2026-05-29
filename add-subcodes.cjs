const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/mkn10.json', 'utf8'));

function insertAfter(afterId, newItems) {
  const idx = data.findIndex(d => d.id === afterId);
  if (idx === -1) { console.log('NOT FOUND: ' + afterId); return; }
  data.splice(idx + 1, 0, ...newItems);
}

const kat_organicke = 'F00–F09 Organické duševní poruchy';
const kat_somatoformni = 'F40–F48 Neurotické, stresové a somatoformní poruchy';

// F06.3 subcodes
const f063subcodes = [
  {
    id: 'F06.30', kod: 'F06.30',
    nazev_cz: 'Organická manická porucha',
    system: 'MKN-10', kategorie: kat_organicke, podkategorie: 'Organické poruchy nálady',
    popis: 'Manická nebo hypomanická epizoda způsobená průkazným onemocněním, poraněním nebo dysfunkcí mozku nebo systémovým tělesným onemocněním.',
    diagnosticka_kriteria: [
      'Splněna kritéria manické nebo hypomanické epizody',
      'Průkaz organické příčiny (cerebrální nebo systémové)',
      'Porucha není způsobena delirantním stavem'
    ],
    priznaky: ['Zvýšená nálada', 'Zrychlенé myšlení', 'Snížená potřeba spánku', 'Grandiozita', 'Dezinhibice'],
    prubeh: 'Závisí na základním organickém onemocnění.',
    onset: 'Zpravidla náhlý nástup v kontextu organického onemocnění.',
    diferencialni_diagnozy: ['F06.31', 'F30', 'F31'],
    mapovani: { mkn11: '6D8Z', dsm5: null }
  },
  {
    id: 'F06.31', kod: 'F06.31',
    nazev_cz: 'Organická bipolární afektivní porucha',
    system: 'MKN-10', kategorie: kat_organicke, podkategorie: 'Organické poruchy nálady',
    popis: 'Střídání manických a depresivních epizod podmíněné průkazným organickým onemocněním mozku nebo systémovým tělesným onemocněním.',
    diagnosticka_kriteria: [
      'Střídání manických a depresivních epizod',
      'Průkaz organické příčiny',
      'Porucha není způsobena delirantním stavem'
    ],
    priznaky: ['Střídání elevace a deprese nálady', 'Psychomotorická aktivace nebo zpomalení', 'Poruchy spánku'],
    prubeh: 'Závisí na základním organickém onemocnění.',
    onset: 'V kontextu organického onemocnění.',
    diferencialni_diagnozy: ['F06.30', 'F06.32', 'F31'],
    mapovani: { mkn11: '6D8Z', dsm5: null }
  },
  {
    id: 'F06.32', kod: 'F06.32',
    nazev_cz: 'Organická depresivní porucha',
    system: 'MKN-10', kategorie: kat_organicke, podkategorie: 'Organické poruchy nálady',
    popis: 'Depresivní epizoda způsobená průkazným onemocněním, poraněním nebo dysfunkcí mozku nebo systémovým tělesným onemocněním.',
    diagnosticka_kriteria: [
      'Splněna kritéria depresivní epizody',
      'Průkaz organické příčiny (cerebrální nebo systémové)',
      'Porucha není způsobena delirantním stavem'
    ],
    priznaky: ['Depresivní nálada', 'Ztráta zájmu', 'Únava', 'Pokles aktivity', 'Poruchy spánku a chuti k jídlu'],
    prubeh: 'Závisí na základním organickém onemocnění.',
    onset: 'V kontextu organického onemocnění.',
    diferencialni_diagnozy: ['F06.31', 'F32', 'F33'],
    mapovani: { mkn11: '6D8Z', dsm5: null }
  },
  {
    id: 'F06.33', kod: 'F06.33',
    nazev_cz: 'Organická smíšená afektivní porucha',
    system: 'MKN-10', kategorie: kat_organicke, podkategorie: 'Organické poruchy nálady',
    popis: 'Smíšená manická a depresivní symptomatologie podmíněná organickým onemocněním; splněna kritéria F06.30 i F06.32 simultánně nebo v rychlém sledu.',
    diagnosticka_kriteria: [
      'Simultánní nebo rychle se střídající manické a depresivní příznaky',
      'Průkaz organické příčiny',
      'Porucha není způsobena delirantním stavem'
    ],
    priznaky: ['Smíšená nálada', 'Agitovanost', 'Emocionální labilita'],
    prubeh: 'Závisí na základním organickém onemocnění.',
    onset: 'V kontextu organického onemocnění.',
    diferencialni_diagnozy: ['F06.30', 'F06.32', 'F31.6'],
    mapovani: { mkn11: '6D8Z', dsm5: null }
  }
];

// F45.3 subcodes
const f453subcodes = [
  {
    id: 'F45.30', kod: 'F45.30',
    nazev_cz: 'Somatoformní autonomní dysfunkce srdce a kardiovaskulárního systému',
    system: 'MKN-10', kategorie: kat_somatoformni, podkategorie: 'Somatoformní poruchy',
    popis: 'Psychogenní srdeční a oběhové potíže bez organického podkladu. Zahrnuje Da Costův syndrom, neurocirkulacční asténii a psychogenní kardiovaskulární poruchu.',
    diagnosticka_kriteria: [
      'Kardiovaskulární příznaky (palpitace, bolest na hrudi, dušnost)',
      'Příznaky způsobeny psychologickými faktory',
      'Absence organického kardiovaskulárního onemocnění'
    ],
    priznaky: ['Palpitace', 'Bolest na hrudi', 'Dušnost', 'Tachykardie', 'Presynkopa'],
    prubeh: 'Chronický, zvlněný.',
    onset: 'Obyčejně v mladší dospělosti, při stresu.',
    diferencialni_diagnozy: ['F41', 'F45.31', 'I49.8'],
    mapovani: { mkn11: '6C20', dsm5: null }
  },
  {
    id: 'F45.31', kod: 'F45.31',
    nazev_cz: 'Somatoformní autonomní dysfunkce horního gastrointestinálního traktu',
    system: 'MKN-10', kategorie: kat_somatoformni, podkategorie: 'Somatoformní poruchy',
    popis: 'Psychogenní poruchy horního GI traktu. Zahrnuje psychogenni aerofagii, funkční dyspepsii, pylorospazmus a funkční nevolnost.',
    diagnosticka_kriteria: [
      'GI příznaky (nevolnost, aerofagie, dyspepsie)',
      'Příznaky způsobeny psychologickými faktory',
      'Absence organického GI onemocnění'
    ],
    priznaky: ['Aerofagie', 'Říhání', 'Nevolnost', 'Pocit plnosti', 'Funkční dyspepsie'],
    prubeh: 'Chronický, zvlněný.',
    onset: 'Postupný, spojen se stresovými situacemi.',
    diferencialni_diagnozy: ['F45.32', 'K21', 'K25'],
    mapovani: { mkn11: '6C20', dsm5: null }
  },
  {
    id: 'F45.32', kod: 'F45.32',
    nazev_cz: 'Somatoformní autonomní dysfunkce dolního gastrointestinálního traktu',
    system: 'MKN-10', kategorie: kat_somatoformni, podkategorie: 'Somatoformní poruchy',
    popis: 'Psychogenní poruchy dolního GI traktu. Zahrnuje syndrom dráždivého tračníku a psychogenni plynatost.',
    diagnosticka_kriteria: [
      'Příznaky dolního GI traktu (bolest břicha, průjem, zácpa)',
      'Příznaky způsobeny psychologickými faktory',
      'Absence organického onemocnění'
    ],
    priznaky: ['Bolest břicha', 'Průjem nebo zácpa', 'Nadýmání', 'Tenesmy'],
    prubeh: 'Chronický.',
    onset: 'V kontextu stresu nebo psychické zátěže.',
    diferencialni_diagnozy: ['F45.31', 'K58', 'K59'],
    mapovani: { mkn11: '6C20', dsm5: null }
  },
  {
    id: 'F45.33', kod: 'F45.33',
    nazev_cz: 'Somatoformní autonomní dysfunkce dýchacích orgánů',
    system: 'MKN-10', kategorie: kat_somatoformni, podkategorie: 'Somatoformní poruchy',
    popis: 'Psychogenní poruchy dýchání. Zahrnuje psychogenní kašel, hyperventilaci a jiné respiracční příznaky bez organického podkladu.',
    diagnosticka_kriteria: [
      'Respiracční příznaky (kašel, dušnost, hyperventilace)',
      'Příznaky způsobeny psychologickými faktory',
      'Absence organického respiracčního onemocnění'
    ],
    priznaky: ['Hyperventilace', 'Kašel', 'Subjektivní dušnost', 'Parestežie z hyperventilace'],
    prubeh: 'Epizodický, vázaný na stres.',
    onset: 'Náhlý, typicky při stresu nebo anxietě.',
    diferencialni_diagnozy: ['F41.0', 'F45.30', 'J45'],
    mapovani: { mkn11: '6C20', dsm5: null }
  },
  {
    id: 'F45.34', kod: 'F45.34',
    nazev_cz: 'Somatoformní autonomní dysfunkce urogenitálního systému',
    system: 'MKN-10', kategorie: kat_somatoformni, podkategorie: 'Somatoformní poruchy',
    popis: 'Psychogenní urogenitlní potíže bez organického podkladu. Zahrnuje psychogenni dysúriu, psychogenni polakisuri a psychogenni retenci moče.',
    diagnosticka_kriteria: [
      'Urogenitlní příznaky (dysúrie, polakisurie, retence)',
      'Příznaky způsobeny psychologickými faktory',
      'Absence organického urogenitlního onemocnění'
    ],
    priznaky: ['Dysúrie', 'Polakisurie', 'Psychogenní retence moče', 'Funkční urgence'],
    prubeh: 'Chronický, spojen s psychickým napětím.',
    onset: 'Postupný.',
    diferencialni_diagnozy: ['F45.30', 'N30', 'N32'],
    mapovani: { mkn11: '6C20', dsm5: null }
  },
  {
    id: 'F45.38', kod: 'F45.38',
    nazev_cz: 'Somatoformní autonomní dysfunkce jiných orgánů nebo systémů',
    system: 'MKN-10', kategorie: kat_somatoformni, podkategorie: 'Somatoformní poruchy',
    popis: 'Psychogenní autonomní dysfunkce orgánů nebo systémů, která není zařazena pod F45.30–F45.34.',
    diagnosticka_kriteria: [
      'Příznaky autonomní dysfunkce jiného orgánového systému',
      'Příznaky způsobeny psychologickými faktory',
      'Absence organické příčiny'
    ],
    priznaky: ['Variabilní – dle postiženého systému'],
    prubeh: 'Závisí na postiženém systému.',
    onset: 'Spojen s psychickým stresem.',
    diferencialni_diagnozy: ['F45.30', 'F45.31', 'F45.32', 'F45.33', 'F45.34'],
    mapovani: { mkn11: '6C20', dsm5: null }
  }
];

insertAfter('F06.3', f063subcodes);
insertAfter('F45.3', f453subcodes);

fs.writeFileSync('src/data/mkn10.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Done. Total diagnoses: ' + data.length);

// Verify
console.log('\nF06.3 subcodes:');
data.filter(d => d.id.startsWith('F06.3')).forEach(d => console.log('  ' + d.id + ': ' + d.nazev_cz));
console.log('\nF45.3 subcodes:');
data.filter(d => d.id.startsWith('F45.3')).forEach(d => console.log('  ' + d.id + ': ' + d.nazev_cz));
