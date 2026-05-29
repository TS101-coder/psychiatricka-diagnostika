const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../src/data/mkn10.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const have = new Set(data.map(d => d.id));

const KAT_VYVOJ = 'F80–F89 Poruchy psychického vývoje';
const KAT_DET   = 'F90–F98 Poruchy chování s počátkem v dětství a dospívání';

const nove = [
  // F83
  { id:'F83', kod:'F83',
    nazev_cz:'Smíšené specifické vývojové poruchy',
    system:'MKN-10', kategorie:KAT_VYVOJ, podkategorie:'Smíšené specifické vývojové poruchy',
    popis:'Kategorie pro poruchy zahrnující kombinaci specifických vývojových poruch řeči (F80), školních dovedností (F81) a motoriky (F82), kde žádná není jasně dominantní, takže nemohou být primárně klasifikovány v jiné kategorii.',
    diagnosticka_kriteria:['Kombinace specifických vývojových poruch','Žádná není dominantní pro primární klasifikaci','Nesplňuje kritéria pro F80, F81 ani F82 jako izolovanou poruchu'],
    priznaky:['kombinace: poruchy řeči, čtení, pravopisu, matematiky, motoriky','školní selhání','frustrace z učení'],
    prubeh:'Chronický.', onset:'Dětství, zjevný při školní docházce.',
    diferencialni_diagnozy:['F80','F81','F82','F84.0'], mapovani:{mkn11:null,dsm5:null} },

  // F88
  { id:'F88', kod:'F88',
    nazev_cz:'Jiné poruchy psychického vývoje',
    system:'MKN-10', kategorie:KAT_VYVOJ, podkategorie:'Jiné poruchy psychického vývoje',
    popis:'Vývojové poruchy nespadající do F80–F84. Zahrnuje agnosii pro mimiku obličeje a jiné specifické vývojové poruchy neurčitého zařazení.',
    diagnosticka_kriteria:['Vývojová porucha','Nespadá do F80–F84'],
    priznaky:['vývojové deficity','variabilní klinický obraz'],
    prubeh:'Chronický.', onset:'Dětství.',
    diferencialni_diagnozy:['F80','F81','F84'], mapovani:{mkn11:null,dsm5:null} },

  // F89
  { id:'F89', kod:'F89',
    nazev_cz:'NS porucha psychického vývoje',
    system:'MKN-10', kategorie:KAT_VYVOJ, podkategorie:'Neurčené poruchy psychického vývoje',
    popis:'Neurčená porucha psychického vývoje.',
    diagnosticka_kriteria:['Vývojová porucha','Nelze upřesnit typ'],
    priznaky:['vývojové deficity'],
    prubeh:'Chronický.', onset:'Dětství.',
    diferencialni_diagnozy:['F80','F84'], mapovani:{mkn11:null,dsm5:'315.9'} },

  // F92, F92.0, F92.8, F92.9
  { id:'F92', kod:'F92',
    nazev_cz:'Smíšené poruchy chování a emocí',
    system:'MKN-10', kategorie:KAT_DET, podkategorie:'Smíšené poruchy chování a emocí',
    popis:'Skupina poruch charakterizovaná kombinací trvale agresivního, dissociálního nebo vzdorovitého chování S výraznými příznaky deprese, úzkosti nebo jiných emočních poruch. Vyžaduje splnění obou složek.',
    diagnosticka_kriteria:['Přítomna porucha chování (F91)','Přítomny výrazné emocionální příznaky (deprese, úzkost)','Obě složky jsou dostatečně závažné pro diagnózu'],
    priznaky:['agresivita','dissociální chování','depresivní nálada','úzkost','poruchy spánku','negativismus'],
    prubeh:'Variabilní.', onset:'Dětství nebo adolescence.',
    diferencialni_diagnozy:['F91','F93','F32'], mapovani:{mkn11:'6C93',dsm5:null} },

  { id:'F92.0', kod:'F92.0',
    nazev_cz:'Depresivní porucha chování',
    system:'MKN-10', kategorie:KAT_DET, podkategorie:'Smíšené poruchy chování a emocí',
    popis:'Splňuje kritéria poruchy chování (F91) i depresivní epizody (F32 nebo F33). Agresivní a dissociální chování souběžně s depresivní náladou, anhedonií a sebeobviňováním.',
    diagnosticka_kriteria:['Splněna kritéria poruchy chování (F91)','Splněna kritéria depresivní epizody (F32 nebo F33)','Obě poruchy jsou dostatečně závažné'],
    priznaky:['agresivita','dissociální chování','depresivní nálada','anhedonie','sebeobviňování','beznaděj','suicidální myšlenky'],
    prubeh:'Variabilní, horší prognóza než izolovaná porucha chování.', onset:'Dětství nebo adolescence.',
    diferencialni_diagnozy:['F91','F32','F92.8'], mapovani:{mkn11:'6C93',dsm5:null} },

  { id:'F92.8', kod:'F92.8',
    nazev_cz:'Jiné smíšené poruchy chování a emocí',
    system:'MKN-10', kategorie:KAT_DET, podkategorie:'Smíšené poruchy chování a emocí',
    popis:'Kombinace poruchy chování s úzkostnou poruchou nebo jinými emočními poruchami (nikoliv primárně depresí).',
    diagnosticka_kriteria:['Splněna kritéria poruchy chování (F91)','Splněna kritéria pro úzkostnou nebo jinou emocionální poruchu','Obě složky jsou dostatečně závažné'],
    priznaky:['agresivita','dissociální chování','úzkost','strachy','emocionální labilita'],
    prubeh:'Variabilní.', onset:'Dětství nebo adolescence.',
    diferencialni_diagnozy:['F91','F93','F92.0'], mapovani:{mkn11:'6C93',dsm5:null} },

  { id:'F92.9', kod:'F92.9',
    nazev_cz:'Smíšená porucha chování a emocí NS',
    system:'MKN-10', kategorie:KAT_DET, podkategorie:'Smíšené poruchy chování a emocí',
    popis:'Neurčená smíšená porucha chování a emocí.',
    diagnosticka_kriteria:['Kombinace poruchy chování a emočních poruch','Nelze upřesnit typ'],
    priznaky:['porucha chování','emocionální poruchy'],
    prubeh:'Variabilní.', onset:'Dětství.',
    diferencialni_diagnozy:['F92.0','F92.8'], mapovani:{mkn11:null,dsm5:null} },
];

const toAdd = nove.filter(n => !have.has(n.id));
const merged = [...data, ...toAdd].sort((a,b) => {
  const p = id => { const [m,s] = id.split('.'); return parseInt(m.replace('F','')) + (s ? parseFloat('0.'+s) : 0); };
  return p(a.id) - p(b.id);
});
fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Krok 4 hotov: pridano ${toAdd.length} zaznamu. Celkem: ${merged.length}`);
