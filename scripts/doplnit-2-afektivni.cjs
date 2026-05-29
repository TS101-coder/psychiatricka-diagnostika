const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../src/data/mkn10.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const have = new Set(data.map(d => d.id));

const KAT_LAT = 'F10–F19 Poruchy způsobené psychoaktivními látkami';
const KAT_AFF = 'F30–F39 Afektivní poruchy';
const KAT_NEU = 'F40–F48 Neurotické, stresové a somatoformní poruchy';

const nove = [
  // F10.7, F10.8, F10.9 — alkohol
  { id:'F10.7', kod:'F10.7',
    nazev_cz:'Poruchy způsobené užíváním alkoholu – reziduální a pozdní psychotická porucha',
    system:'MKN-10', kategorie:KAT_LAT, podkategorie:'Alkohol',
    popis:'Poruchy vědomí, emocí, osobnosti nebo kognice přetrvávající po odeznění přímého účinku alkoholu. Zahrnuje alkoholovou demenci, alkoholem vyvolaný amnestický syndrom (Korsakovův syndrom) jako reziduální stav.',
    diagnosticka_kriteria:['Předchozí chronická závislost na alkoholu','Poruchy přetrvávají po přímém účinku alkoholu','Zahrnuje: flashbacky, chronické kognitivní deficity, poruchy osobnosti'],
    priznaky:['kognitivní deficity','poruchy paměti','osobnostní změny','emocionální labilita','reziduální psychotické příznaky'],
    prubeh:'Chronický, může být trvalý.', onset:'Po letech chronické závislosti.',
    diferencialni_diagnozy:['F10.6','F10.2','F00'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F10.8', kod:'F10.8',
    nazev_cz:'Jiné duševní poruchy způsobené užíváním alkoholu',
    system:'MKN-10', kategorie:KAT_LAT, podkategorie:'Alkohol',
    popis:'Jiné duševní a behaviorální poruchy způsobené alkoholem nespadající do F10.0–F10.7.',
    diagnosticka_kriteria:['Prokázaná příčinná role alkoholu','Nespadá do F10.0–F10.7'],
    priznaky:['variabilní poruchy způsobené alkoholem'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F10.2','F10.5'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F10.9', kod:'F10.9',
    nazev_cz:'NS duševní porucha způsobená užíváním alkoholu',
    system:'MKN-10', kategorie:KAT_LAT, podkategorie:'Alkohol',
    popis:'Neurčená duševní nebo behaviorální porucha způsobená alkoholem.',
    diagnosticka_kriteria:['Porucha způsobena alkoholem','Nelze upřesnit typ'],
    priznaky:['duševní poruchy způsobené alkoholem'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F10.2','F10.1'], mapovani:{mkn11:null,dsm5:'291.9'} },

  // F30.8, F30.9
  { id:'F30.8', kod:'F30.8',
    nazev_cz:'Jiné manické epizody',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Manická epizoda',
    popis:'Manické epizody nespadající do F30.0 (hypomanie), F30.1 (mánie bez psychózy) nebo F30.2 (mánie s psychózou).',
    diagnosticka_kriteria:['Splněna obecná kritéria manické epizody','Nesplňuje kritéria F30.0, F30.1 nebo F30.2'],
    priznaky:['povznesená nálada','zvýšená energie','snížená potřeba spánku','expanzivní chování'],
    prubeh:'Epizodický.', onset:'Typicky 15–30 let.',
    diferencialni_diagnozy:['F30.0','F30.1','F30.2'], mapovani:{mkn11:'6A60',dsm5:null} },

  { id:'F30.9', kod:'F30.9',
    nazev_cz:'Manická epizoda NS',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Manická epizoda',
    popis:'Neurčená manická epizoda.',
    diagnosticka_kriteria:['Manická epizoda','Nelze upřesnit typ'],
    priznaky:['povznesená nálada','zvýšená energie'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F30.1','F30.0'], mapovani:{mkn11:'6A60',dsm5:'296.00'} },

  // F32.8, F32.9
  { id:'F32.8', kod:'F32.8',
    nazev_cz:'Jiné depresivní epizody',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Depresivní epizoda',
    popis:'Depresivní epizody, které nesplňují plně kritéria pro F32.0–F32.3, ale přesto způsobují klinicky významný distres nebo funkční omezení. Zahrnuje smíšené epizody s úzkostí a depresí (maskovaná deprese).',
    diagnosticka_kriteria:['Klinicky významné depresivní příznaky','Nespadá do F32.0–F32.3'],
    priznaky:['depresivní nálada','únava','anhedonie','somatické příznaky','atypické příznaky'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F32.0','F32.1','F41.3'], mapovani:{mkn11:'6A70',dsm5:null} },

  { id:'F32.9', kod:'F32.9',
    nazev_cz:'Depresivní epizoda NS',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Depresivní epizoda',
    popis:'Neurčená depresivní epizoda.',
    diagnosticka_kriteria:['Depresivní epizoda','Nelze upřesnit závažnost nebo typ'],
    priznaky:['depresivní nálada','anhedonie','únava'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F32.0','F32.1'], mapovani:{mkn11:'6A70',dsm5:'311'} },

  // F33.4, F33.8, F33.9
  { id:'F33.4', kod:'F33.4',
    nazev_cz:'Rekurentní depresivní porucha, aktuálně v remisi',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Rekurentní depresivní porucha',
    popis:'Pacient s rekurentní depresivní poruchou v anamnéze, který v současnosti nesplňuje kritéria pro depresivní epizodu jakékoliv závažnosti.',
    diagnosticka_kriteria:['V anamnéze nejméně dvě depresivní epizody','Aktuálně žádná klinicky významná depresivní symptomatika','Remise trvá nejméně 2 měsíce'],
    priznaky:['bez aktuálních depresivních příznaků','riziko relapsu přetrvává'],
    prubeh:'Remise. Chronicky relabující porucha.', onset:'Variabilní.',
    diferencialni_diagnozy:['F33.0','F34.1','F31.7'], mapovani:{mkn11:'6A70',dsm5:'296.36'} },

  { id:'F33.8', kod:'F33.8',
    nazev_cz:'Jiné rekurentní depresivní poruchy',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Rekurentní depresivní porucha',
    popis:'Rekurentní depresivní poruchy nespadající do F33.0–F33.4.',
    diagnosticka_kriteria:['Rekurentní depresivní epizody','Nespadá do F33.0–F33.4'],
    priznaky:['opakující se depresivní epizody','variabilní závažnost'],
    prubeh:'Rekurentní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F33.0','F33.1','F38.10'], mapovani:{mkn11:'6A70',dsm5:null} },

  { id:'F33.9', kod:'F33.9',
    nazev_cz:'Rekurentní depresivní porucha NS',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Rekurentní depresivní porucha',
    popis:'Neurčená rekurentní depresivní porucha.',
    diagnosticka_kriteria:['Rekurentní depresivní porucha','Nelze upřesnit typ'],
    priznaky:['opakující se depresivní epizody'],
    prubeh:'Rekurentní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F33.0','F33.1'], mapovani:{mkn11:'6A70',dsm5:'296.30'} },

  // F34.8, F34.9
  { id:'F34.8', kod:'F34.8',
    nazev_cz:'Jiné přetrvávající afektivní poruchy',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Přetrvávající afektivní poruchy',
    popis:'Přetrvávající poruchy nálady nespadající do F34.0 (cyklotymie) nebo F34.1 (dystymie).',
    diagnosticka_kriteria:['Chronická porucha nálady','Nespadá do F34.0 nebo F34.1'],
    priznaky:['chronická porucha nálady','funkční omezení'],
    prubeh:'Chronický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F34.0','F34.1'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F34.9', kod:'F34.9',
    nazev_cz:'Přetrvávající afektivní porucha NS',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Přetrvávající afektivní poruchy',
    popis:'Neurčená přetrvávající afektivní porucha.',
    diagnosticka_kriteria:['Chronická porucha nálady','Nelze upřesnit typ'],
    priznaky:['chronická porucha nálady'],
    prubeh:'Chronický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F34.0','F34.1'], mapovani:{mkn11:null,dsm5:null} },

  // F38.0
  { id:'F38.0', kod:'F38.0',
    nazev_cz:'Jiné jednotlivé afektivní poruchy',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Jiné afektivní poruchy',
    popis:'Afektivní poruchy tvořené jedinou epizodou (nikoliv rekurentní), nespadající do F30–F33. Zahrnuje smíšenou afektivní epizodu.',
    diagnosticka_kriteria:['Jednotlivá afektivní epizoda','Nespadá do F30–F33'],
    priznaky:['smíšená nebo jiná afektivní epizoda','poruchy nálady'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F38.00','F31.6','F30'], mapovani:{mkn11:null,dsm5:null} },

  // F43.8, F43.9
  { id:'F43.8', kod:'F43.8',
    nazev_cz:'Jiné reakce na těžký stres',
    system:'MKN-10', kategorie:KAT_NEU, podkategorie:'Reakce na těžký stres a poruchy přizpůsobení',
    popis:'Jiné reakce na těžký stres nespadající do F43.0 (akutní stresová reakce), F43.1 (PTSD) nebo F43.2 (porucha přizpůsobení).',
    diagnosticka_kriteria:['Identifikovatelná stresová událost','Reakce nesplňuje kritéria F43.0, F43.1 ani F43.2'],
    priznaky:['variabilní stresové reakce','úzkost','deprese','somatizace'],
    prubeh:'Variabilní.', onset:'Variabilní, po stresové události.',
    diferencialni_diagnozy:['F43.0','F43.1','F43.2'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F43.9', kod:'F43.9',
    nazev_cz:'Reakce na těžký stres NS',
    system:'MKN-10', kategorie:KAT_NEU, podkategorie:'Reakce na těžký stres a poruchy přizpůsobení',
    popis:'Neurčená reakce na těžký stres.',
    diagnosticka_kriteria:['Reakce na těžký stres','Nelze upřesnit typ'],
    priznaky:['stresové příznaky'],
    prubeh:'Variabilní.', onset:'Po stresové události.',
    diferencialni_diagnozy:['F43.0','F43.1'], mapovani:{mkn11:null,dsm5:'308.9'} },
];

const toAdd = nove.filter(n => !have.has(n.id));
const merged = [...data, ...toAdd].sort((a,b) => {
  const p = id => { const [m,s] = id.split('.'); return parseInt(m.replace('F','')) + (s ? parseFloat('0.'+s) : 0); };
  return p(a.id) - p(b.id);
});
fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✅ Krok 2 hotov: přidáno ${toAdd.length} záznamů. Celkem: ${merged.length}`);
