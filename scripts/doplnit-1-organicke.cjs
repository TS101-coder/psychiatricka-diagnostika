const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../src/data/mkn10.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const have = new Set(data.map(d => d.id));

const KAT = 'F00–F09 Organické duševní poruchy včetně symptomatických';

const nove = [
  // F00.9
  { id:'F00.9', kod:'F00.9',
    nazev_cz:'Demence při Alzheimerově nemoci NS',
    system:'MKN-10', kategorie:KAT, podkategorie:'Demence při Alzheimerově nemoci',
    popis:'Demence při Alzheimerově nemoci, která nesplňuje kritéria pro časný (F00.0) ani pozdní (F00.1) ani atypický (F00.2) typ, nebo kombinuje rysy více typů.',
    diagnosticka_kriteria:['Splněna obecná kritéria demence při Alzheimerově nemoci','Nelze upřesnit typ (F00.0–F00.2)'],
    priznaky:['porucha paměti','kognitivní úpadek','dezorientace'],
    prubeh:'Progresivní, chronický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F00.0','F00.1','F00.2'], mapovani:{mkn11:'6D80',dsm5:'331.0'} },

  // F01.3
  { id:'F01.3', kod:'F01.3',
    nazev_cz:'Smíšená kortikální a subkortikální vaskulární demence',
    system:'MKN-10', kategorie:KAT, podkategorie:'Vaskulární demence',
    popis:'Vaskulární demence s kombinací kortikálních (afázie, agnózie) a subkortikálních (zpomalení, poruchy chůze) příznaků. Nejčastěji při rozsáhlém cerebrovaskulárním onemocnění.',
    diagnosticka_kriteria:['Splněna kritéria vaskulární demence','Klinické nebo zobrazovací důkazy postižení kortex i subkortex','Smíšený obraz kortiokální a subkortikální symptomatiky'],
    priznaky:['kognitivní poruchy','afázie','apraxie','poruchy chůze','pseudobulbární syndrom','fokální neurologické příznaky'],
    prubeh:'Progresivní nebo schodovitý.', onset:'Střední nebo pozdní dospělost.',
    diferencialni_diagnozy:['F01.0','F01.1','F01.2','F00'], mapovani:{mkn11:'6D81',dsm5:'290.40'} },

  // F01.8
  { id:'F01.8', kod:'F01.8',
    nazev_cz:'Jiná vaskulární demence',
    system:'MKN-10', kategorie:KAT, podkategorie:'Vaskulární demence',
    popis:'Vaskulární demence nesplňující kritéria pro F01.0–F01.3, například při specifických cerebrovaskulárních příčinách (CADASIL, amyloidní angiopatie).',
    diagnosticka_kriteria:['Splněna obecná kritéria vaskulární demence','Nesplňuje kritéria F01.0–F01.3'],
    priznaky:['kognitivní poruchy','fokální neurologické příznaky','vaskulární rizikové faktory'],
    prubeh:'Variabilní dle příčiny.', onset:'Variabilní.',
    diferencialni_diagnozy:['F01.0','F01.1','F00'], mapovani:{mkn11:'6D81',dsm5:'290.40'} },

  // F01.9
  { id:'F01.9', kod:'F01.9',
    nazev_cz:'Vaskulární demence NS',
    system:'MKN-10', kategorie:KAT, podkategorie:'Vaskulární demence',
    popis:'Neurčená vaskulární demence – splněna obecná kritéria, typ nelze upřesnit.',
    diagnosticka_kriteria:['Splněna obecná kritéria vaskulární demence','Typ nelze upřesnit'],
    priznaky:['kognitivní úpadek','cerebrovaskulární patologie'],
    prubeh:'Progresivní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F01.0','F01.1'], mapovani:{mkn11:'6D81',dsm5:'290.40'} },

  // F02.8
  { id:'F02.8', kod:'F02.8',
    nazev_cz:'Demence při jiných určených onemocněních',
    system:'MKN-10', kategorie:KAT, podkategorie:'Demence při jiných onemocněních',
    popis:'Demence způsobená jinými specifickými onemocněními nezahrnutými v F02.0–F02.4, jako jsou normotenzní hydrocefalus, subdurální hematom, nádory mozku, neurosyfilis nebo Wilsonova nemoc.',
    diagnosticka_kriteria:['Splněna obecná kritéria demence','Prokázáno jiné specifické mozkové nebo systémové onemocnění jako příčina'],
    priznaky:['kognitivní poruchy','příznaky dle základního onemocnění'],
    prubeh:'Variabilní, závisí na příčině. Může být reverzibilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F02.0','F02.3','F00','F03'], mapovani:{mkn11:'6D85',dsm5:null} },

  // F05.8
  { id:'F05.8', kod:'F05.8',
    nazev_cz:'Jiné delirium',
    system:'MKN-10', kategorie:KAT, podkategorie:'Delirium',
    popis:'Delirium způsobené příčinami nespadajícími pod F05.0 nebo F05.1, například smíšené příčiny nebo specifická somatická onemocnění.',
    diagnosticka_kriteria:['Splněna obecná kritéria deliria','Příčina je jiná než abstinence (F05.1) nebo samotná demence (F05.0)'],
    priznaky:['porucha vědomí','dezorientace','halucinace','neklid','třes','vegetativní labilita'],
    prubeh:'Akutní, přechodný.', onset:'Akutní.',
    diferencialni_diagnozy:['F05.0','F05.1','F10.4'], mapovani:{mkn11:'6D70',dsm5:'293.0'} },

  // F05.9
  { id:'F05.9', kod:'F05.9',
    nazev_cz:'Delirium NS',
    system:'MKN-10', kategorie:KAT, podkategorie:'Delirium',
    popis:'Neurčené delirium – splněna kritéria deliria, příčina nebo typ nelze upřesnit.',
    diagnosticka_kriteria:['Splněna obecná kritéria deliria','Typ nebo příčina nelze upřesnit'],
    priznaky:['porucha vědomí','dezorientace','fluktuující průběh'],
    prubeh:'Akutní.', onset:'Akutní.',
    diferencialni_diagnozy:['F05.0','F05.1'], mapovani:{mkn11:'6D70',dsm5:'293.0'} },

  // F06.5
  { id:'F06.5', kod:'F06.5',
    nazev_cz:'Organická disociativní porucha',
    system:'MKN-10', kategorie:KAT, podkategorie:'Jiné duševní poruchy způsobené poškozením mozku',
    popis:'Disociativní porucha splňující kritéria F44.x, která je způsobena prokazatelným organickým (mozkovým nebo systémovým) onemocněním.',
    diagnosticka_kriteria:['Splněna kritéria pro některou disociativní poruchu (F44)','Přítomno organické onemocnění způsobující poruchu','Časová nebo biologická vazba mezi onemocněním a poruchou'],
    priznaky:['amnézie','disociativní stupor','dissociativní pohybové poruchy','organická příčina'],
    prubeh:'Závisí na základním onemocnění.', onset:'Variabilní.',
    diferencialni_diagnozy:['F44','F06.6','F06.7'], mapovani:{mkn11:'6D70',dsm5:null} },

  // F06.6
  { id:'F06.6', kod:'F06.6',
    nazev_cz:'Organická emocionálně labilní (astenická) porucha',
    system:'MKN-10', kategorie:KAT, podkategorie:'Jiné duševní poruchy způsobené poškozením mozku',
    popis:'Porucha charakterizovaná výraznou emocionální labilitou, únavností a různými nepříjemnými tělesnými vjemy (závratě, bolesti) způsobená organickým onemocněním. Typicky po mozkových příhodách.',
    diagnosticka_kriteria:['Emocionální labilita nebo únava způsobená organickým onemocněním','Nesplňuje kritéria F06.3 (organická deprese)','Prokázáno organické onemocnění mozku'],
    priznaky:['emocionální labilita','snadný pláč nebo smích','únava','závratě','bolesti hlavy','podrážděnost'],
    prubeh:'Závisí na základním onemocnění. Může se zlepšit.', onset:'Variabilní, typicky po mozkové příhodě.',
    diferencialni_diagnozy:['F06.3','F07.0','F34.1'], mapovani:{mkn11:'6D70',dsm5:null} },

  // F06.7
  { id:'F06.7', kod:'F06.7',
    nazev_cz:'Mírná kognitivní porucha',
    system:'MKN-10', kategorie:KAT, podkategorie:'Jiné duševní poruchy způsobené poškozením mozku',
    popis:'Porucha paměti, učení nebo koncentrace méně závažná než demence, způsobená organickým onemocněním (mozkovým nebo systémovým). Zahrnuje postvirové stavy a postkomoční syndrom.',
    diagnosticka_kriteria:['Porucha paměti, pozornosti nebo jiných kognitivních funkcí','Závažnost nedosahuje demence','Prokázáno organické onemocnění jako příčina','Porucha interferuje s každodenními aktivitami'],
    priznaky:['porucha paměti','porucha koncentrace','porucha učení','únava','kognitivní zpomalení'],
    prubeh:'Závisí na příčině. Může být reverzibilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F03','F07.0','F48.0'], mapovani:{mkn11:'6D71',dsm5:'331.83'} },

  // F06.8
  { id:'F06.8', kod:'F06.8',
    nazev_cz:'Jiné určené duševní poruchy způsobené poškozením mozku',
    system:'MKN-10', kategorie:KAT, podkategorie:'Jiné duševní poruchy způsobené poškozením mozku',
    popis:'Jiné určené organické duševní poruchy nespadající do F06.0–F06.7.',
    diagnosticka_kriteria:['Duševní porucha způsobena organickým onemocněním','Nespadá do F06.0–F06.7'],
    priznaky:['variabilní psychické příznaky','organická příčina'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F06.0','F06.3'], mapovani:{mkn11:null,dsm5:null} },

  // F06.9
  { id:'F06.9', kod:'F06.9',
    nazev_cz:'NS duševní porucha způsobená poškozením mozku',
    system:'MKN-10', kategorie:KAT, podkategorie:'Jiné duševní poruchy způsobené poškozením mozku',
    popis:'Neurčená organická duševní porucha.',
    diagnosticka_kriteria:['Duševní porucha způsobena organickým onemocněním','Nelze upřesnit typ'],
    priznaky:['psychické příznaky','organická příčina'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F06.0','F06.3'], mapovani:{mkn11:null,dsm5:null} },

  // F07.1
  { id:'F07.1', kod:'F07.1',
    nazev_cz:'Postencefalitický syndrom',
    system:'MKN-10', kategorie:KAT, podkategorie:'Poruchy osobnosti a chování způsobené onemocněním mozku',
    popis:'Reziduální a přechodné nespecifické behaviorální změny po virové nebo bakteriální encefalitidě. Zahrnuje podrážděnost, apetenci, změny osobnosti a kognitivní deficity.',
    diagnosticka_kriteria:['Prodělána encefalitida','Přetrvávající poruchy po odeznění akutní fáze','Poruchy nálady, chování nebo kognitivních funkcí'],
    priznaky:['únava','podrážděnost','poruchy paměti','změny osobnosti','hypersomnie nebo insomnie','sexuální dezinhibice'],
    prubeh:'Chronický, pomalé zlepšování.', onset:'Po prodělané encefalitidě.',
    diferencialni_diagnozy:['F07.0','F06.7','F07.2'], mapovani:{mkn11:'6D70',dsm5:null} },

  // F07.8
  { id:'F07.8', kod:'F07.8',
    nazev_cz:'Jiné organické poruchy osobnosti a chování způsobené onemocněním mozku',
    system:'MKN-10', kategorie:KAT, podkategorie:'Poruchy osobnosti a chování způsobené onemocněním mozku',
    popis:'Jiné poruchy osobnosti nebo chování po poškození nebo onemocnění mozku nespadající do F07.0–F07.2.',
    diagnosticka_kriteria:['Porucha osobnosti nebo chování po poškození mozku','Nespadá do F07.0–F07.2'],
    priznaky:['změny osobnosti','behaviorální poruchy','organická příčina'],
    prubeh:'Variabilní.', onset:'Po poškození mozku.',
    diferencialni_diagnozy:['F07.0','F07.1','F07.2'], mapovani:{mkn11:null,dsm5:null} },

  // F07.9
  { id:'F07.9', kod:'F07.9',
    nazev_cz:'NS organická porucha osobnosti a chování způsobená onemocněním mozku',
    system:'MKN-10', kategorie:KAT, podkategorie:'Poruchy osobnosti a chování způsobené onemocněním mozku',
    popis:'Neurčená organická porucha osobnosti a chování.',
    diagnosticka_kriteria:['Organická porucha osobnosti nebo chování','Nelze upřesnit typ'],
    priznaky:['změny osobnosti nebo chování','organická příčina'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F07.0','F07.1'], mapovani:{mkn11:null,dsm5:null} },
];

const toAdd = nove.filter(n => !have.has(n.id));
const merged = [...data, ...toAdd].sort((a,b) => {
  const p = id => { const [m,s] = id.split('.'); return parseInt(m.replace('F','')) + (s ? parseFloat('0.'+s) : 0); };
  return p(a.id) - p(b.id);
});
fs.writeFileSync(dataPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`✅ Krok 1 hotov: přidáno ${toAdd.length} záznamů (F00-F07). Celkem: ${merged.length}`);
