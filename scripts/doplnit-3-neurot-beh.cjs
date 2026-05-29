const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../src/data/mkn10.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const have = new Set(data.map(d => d.id));

const KAT_NEU = 'F40–F48 Neurotické, stresové a somatoformní poruchy';
const KAT_BEH = 'F50–F59 Behaviorální syndromy spojené s fyziologickými poruchami';
const KAT_OSO = 'F60–F69 Poruchy osobnosti a chování u dospělých';

const nove = [
  // F48.8, F48.9
  { id:'F48.8', kod:'F48.8',
    nazev_cz:'Jiné určené neurotické poruchy',
    system:'MKN-10', kategorie:KAT_NEU, podkategorie:'Jiné neurotické poruchy',
    popis:'Neurotické poruchy nespadající do výše uvedených kategorií F40–F48.1. Zahrnuje Dhat syndrom (indický kulturně vázaný syndrom), kokard, psychasténii aj.',
    diagnosticka_kriteria:['Neurotické příznaky','Nespadají do F40–F48.1'],
    priznaky:['variabilní neurotické příznaky','kulturně vázané syndromy','psychasténie'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F48.0','F48.1','F45'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F48.9', kod:'F48.9',
    nazev_cz:'Neurotická porucha NS',
    system:'MKN-10', kategorie:KAT_NEU, podkategorie:'Jiné neurotické poruchy',
    popis:'Neurčená neurotická porucha.',
    diagnosticka_kriteria:['Neurotická porucha','Nelze upřesnit typ'],
    priznaky:['neurotické příznaky'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F48.0','F41.1'], mapovani:{mkn11:null,dsm5:'300.9'} },

  // F50.5, F50.8, F50.9
  { id:'F50.5', kod:'F50.5',
    nazev_cz:'Zvracení spojené s jinými psychologickými poruchami',
    system:'MKN-10', kategorie:KAT_BEH, podkategorie:'Poruchy příjmu potravy',
    popis:'Opakované zvracení, ke kterému dochází v rámci disociativních poruch (F44), hypochondrické poruchy (F45.2) nebo v těhotenství. Odlišit od F50.2 (bulimie nervosa).',
    diagnosticka_kriteria:['Opakované zvracení','Psychologická příčina prokázána','Nesplňuje kritéria F50.2 (bulimie nervosa)'],
    priznaky:['opakované zvracení','psychologická příčina','bez kontrolovaného přejídání typického pro bulimii'],
    prubeh:'Závisí na základní psychologické poruše.', onset:'Variabilní.',
    diferencialni_diagnozy:['F50.2','F44','F45.2','organické zvracení'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F50.8', kod:'F50.8',
    nazev_cz:'Jiné poruchy příjmu potravy',
    system:'MKN-10', kategorie:KAT_BEH, podkategorie:'Poruchy příjmu potravy',
    popis:'Jiné poruchy příjmu potravy nespadající do F50.0–F50.5, jako je pica u dospělých nebo ortorexie.',
    diagnosticka_kriteria:['Porucha příjmu potravy u dospělého','Nespadá do F50.0–F50.5'],
    priznaky:['abnormální jídelní chování','distres','funkční omezení'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F50.0','F50.2'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F50.9', kod:'F50.9',
    nazev_cz:'Porucha příjmu potravy NS',
    system:'MKN-10', kategorie:KAT_BEH, podkategorie:'Poruchy příjmu potravy',
    popis:'Neurčená porucha příjmu potravy.',
    diagnosticka_kriteria:['Porucha příjmu potravy','Nelze upřesnit typ'],
    priznaky:['abnormální jídelní chování'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F50.0','F50.2'], mapovani:{mkn11:null,dsm5:'307.50'} },

  // F53.8, F53.9
  { id:'F53.8', kod:'F53.8',
    nazev_cz:'Jiné duševní poruchy a poruchy chování spojené s šestinedělím',
    system:'MKN-10', kategorie:KAT_BEH, podkategorie:'Poruchy duševního zdraví spojené s šestinedělím',
    popis:'Jiné duševní poruchy spojené s porodem nebo šestinedělím nespadající do F53.0 (mírné) nebo F53.1 (závažné). Zahrnuje poporodní anxiózní poruchy nebo poporodní PTSD.',
    diagnosticka_kriteria:['Duševní porucha v průběhu šestinedělí (do 6 týdnů po porodu)','Nespadá do F53.0 nebo F53.1'],
    priznaky:['poporodní úzkost','PTSD po porodu','poruchy přizpůsobení'],
    prubeh:'Přechodný nebo chronický dle poruchy.', onset:'Do 6 týdnů po porodu.',
    diferencialni_diagnozy:['F53.0','F53.1','F43.1'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F53.9', kod:'F53.9',
    nazev_cz:'NS duševní porucha spojená s šestinedělím',
    system:'MKN-10', kategorie:KAT_BEH, podkategorie:'Poruchy duševního zdraví spojené s šestinedělím',
    popis:'Neurčená duševní porucha spojená s šestinedělím.',
    diagnosticka_kriteria:['Duševní porucha v šestinedělí','Nelze upřesnit typ'],
    priznaky:['duševní příznaky po porodu'],
    prubeh:'Variabilní.', onset:'Do 6 týdnů po porodu.',
    diferencialni_diagnozy:['F53.0','F53.1'], mapovani:{mkn11:null,dsm5:null} },

  // F68.0, F68.8
  { id:'F68.0', kod:'F68.0',
    nazev_cz:'Záměrné vyvolání nebo předstírání tělesných příznaků z psychologických důvodů',
    system:'MKN-10', kategorie:KAT_OSO, podkategorie:'Jiné poruchy osobnosti a chování u dospělých',
    popis:'Pacient si způsobuje tělesné příznaky nebo stav (ne pro hmotný zisk) z psychologických důvodů. Odlišit od F68.1 (Munchausenův syndrom) — F68.0 zahrnuje méně dramatické, reaktivní formy.',
    diagnosticka_kriteria:['Záměrné způsobení nebo zveličení tělesných příznaků','Bez zjevné vnější motivace (finanční, vyhnutí se právní odpovědnosti)','Psychologická motivace pravděpodobná'],
    priznaky:['záměrné způsobení příznaků','opakované hospitalizace','manipulativní chování','absence zjevného zisku'],
    prubeh:'Chronický.', onset:'Dospělost.',
    diferencialni_diagnozy:['F68.1','F45.0','F45.2','agravace'], mapovani:{mkn11:'6D50',dsm5:'300.19'} },

  { id:'F68.8', kod:'F68.8',
    nazev_cz:'Jiné určené poruchy osobnosti a chování u dospělých',
    system:'MKN-10', kategorie:KAT_OSO, podkategorie:'Jiné poruchy osobnosti a chování u dospělých',
    popis:'Jiné určené poruchy osobnosti a chování nespadající do jiných kategorií F60–F68.1.',
    diagnosticka_kriteria:['Porucha osobnosti nebo chování','Nespadá do F60–F68.1'],
    priznaky:['variabilní poruchy osobnosti nebo chování'],
    prubeh:'Variabilní.', onset:'Dospělost.',
    diferencialni_diagnozy:['F60','F62','F68.0','F68.1'], mapovani:{mkn11:null,dsm5:null} },
];

const toAdd = nove.filter(n => !have.has(n.id));
const merged = [...data, ...toAdd].sort((a,b) => {
  const p = id => { const [m,s] = id.split('.'); return parseInt(m.replace('F','')) + (s ? parseFloat('0.'+s) : 0); };
  return p(a.id) - p(b.id);
});
fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Krok 3 hotov: pridano ${toAdd.length} zaznamu. Celkem: ${merged.length}`);
