const { existingIds, existing, dataPath } = require('./pridej-diagnozy.cjs');
const fs = require('fs');

const KAT_SCHI = 'F20–F29 Schizofrenie, schizotypní poruchy a poruchy s bludy';
const KAT_AFF  = 'F30–F39 Afektivní poruchy';
const KAT_NEUR = 'F40–F48 Neurotické, stresové a somatoformní poruchy';

const nove = [

  // ── F20.8, F20.9 ────────────────────────────────────────────────────────
  { id:'F20.8', kod:'F20.8', nazev_cz:'Jiná schizofrenie', system:'MKN-10',
    kategorie:KAT_SCHI, podkategorie:'Schizofrenie',
    popis:'Schizofrenie nespadající do žádné ze specifických podtypů (F20.0–F20.6).',
    diagnosticka_kriteria:['Splněna obecná kritéria schizofrenie','Nelze zařadit do jiného podtypu'],
    priznaky:['bludy','halucinace','dezorganizace','negativní příznaky'],
    prubeh:'Chronický, variabilní.', onset:'Obvykle 15–35 let.',
    diferencialni_diagnozy:['F20.0','F20.3','F25'], mapovani:{mkn11:null,dsm5:'295.90'} },

  { id:'F20.9', kod:'F20.9', nazev_cz:'Schizofrenie NS', system:'MKN-10',
    kategorie:KAT_SCHI, podkategorie:'Schizofrenie',
    popis:'Neurčená schizofrenie; splněna obecná kritéria, typ nelze upřesnit.',
    diagnosticka_kriteria:['Splněna obecná kritéria schizofrenie','Dostatek informací k upřesnění podtypu chybí'],
    priznaky:['bludy','halucinace','dezorganizace myšlení'],
    prubeh:'Chronický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F20.0','F20.3'], mapovani:{mkn11:null,dsm5:'295.90'} },

  // ── F22.8, F22.9 ────────────────────────────────────────────────────────
  { id:'F22.8', kod:'F22.8', nazev_cz:'Jiné perzistující poruchy s bludy', system:'MKN-10',
    kategorie:KAT_SCHI, podkategorie:'Přetrvávající poruchy s bludy',
    popis:'Jiné dlouhodobé poruchy s bludy nespadající pod F22.0 (paranoia).',
    diagnosticka_kriteria:['Přítomnost perzistujících bludů mimo F22.0','Halucinace ne dominantní','Schizofrenie vyloučena'],
    priznaky:['perzistující bludy','emocionální odpověď přiměřená bludům','bez schizofrenie'],
    prubeh:'Chronický.', onset:'Střední dospělost.',
    diferencialni_diagnozy:['F22.0','F20.0','F25'], mapovani:{mkn11:null,dsm5:'297.1'} },

  { id:'F22.9', kod:'F22.9', nazev_cz:'Přetrvávající porucha s bludy NS', system:'MKN-10',
    kategorie:KAT_SCHI, podkategorie:'Přetrvávající poruchy s bludy',
    popis:'Neurčená přetrvávající porucha s bludy.',
    diagnosticka_kriteria:['Perzistující bludy','Nelze upřesnit typ'],
    priznaky:['perzistující bludy'],
    prubeh:'Chronický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F22.0'], mapovani:{mkn11:null,dsm5:'297.1'} },

  // ── F23.0–F23.9 ─────────────────────────────────────────────────────────
  { id:'F23.0', kod:'F23.0', nazev_cz:'Akutní polymorfní psychotická porucha bez příznaků schizofrenie',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Akutní a přechodné psychotické poruchy',
    popis:'Akutní psychóza s rychle se měnícími, polymorfními příznaky bez splnění kritérií schizofrenie. Příznaky jsou výrazně nestabilní a proměnlivé.',
    diagnosticka_kriteria:['Akutní nástup (do 2 týdnů)','Více typů halucinací nebo bludů měnících se den ze dne','Emocionální bouřlivost a nestálost','Nesplněna kritéria schizofrenie','Příznaky přetrvávají méně než 3 měsíce'],
    priznaky:['polymorfní halucinace','nestabilní bludy','emocionální labilita','zmatenost','neklid','rychle se měnící příznaky'],
    prubeh:'Přechodný, většinou odeznívá do 1–3 měsíců.', onset:'Akutní, do 2 týdnů.',
    diferencialni_diagnozy:['F23.1','F20.0','F25','F30.2'], mapovani:{mkn11:'6A23',dsm5:'298.9'} },

  { id:'F23.1', kod:'F23.1', nazev_cz:'Akutní polymorfní psychotická porucha s příznaky schizofrenie',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Akutní a přechodné psychotické poruchy',
    popis:'Splňuje kritéria F23.0 (polymorfní psychóza), ale souběžně jsou přítomny příznaky schizofrenie (bludy kontroly, typické halucinace). Pokud příznaky schizofrenie přetrvají > 1 měsíc, je třeba překlasifikovat na schizofrenii.',
    diagnosticka_kriteria:['Splněna kritéria F23.0 (polymorfní psychóza)','Souběžně přítomny příznaky typické pro schizofrenii','Akutní nástup (do 2 týdnů)','Příznaky přetrvávají méně než 1 měsíc'],
    priznaky:['polymorfní bludy','halucinace typické pro schizofrenii','ozvučování myšlenek','vkládání nebo odnímání myšlenek','emocionální labilita','dezorganizace'],
    prubeh:'Přechodný. Trvá-li > 1 měsíc, překlasifikovat na F20.', onset:'Akutní, do 2 týdnů.',
    diferencialni_diagnozy:['F23.0','F20.0','F25'], mapovani:{mkn11:'6A23',dsm5:'295.40'} },

  { id:'F23.2', kod:'F23.2', nazev_cz:'Akutní schizofreniiformní psychotická porucha',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Akutní a přechodné psychotické poruchy',
    popis:'Akutní psychotická epizoda splňující symptomatická kritéria schizofrenie, ale trvající méně než 1 měsíc. Příznaky nejsou polymorfní jako u F23.0.',
    diagnosticka_kriteria:['Splněna symptomatická kritéria schizofrenie','Trvání méně než 1 měsíc','Akutní nástup','Příznaky nejsou primárně polymorfní'],
    priznaky:['bludy','halucinace','dezorganizace řeči','negativní příznaky','katatonní příznaky'],
    prubeh:'Přechodný, do 1 měsíce. Může relabovat nebo přejít v schizofrenii.', onset:'Akutní.',
    diferencialni_diagnozy:['F20.0','F23.0','F23.1'], mapovani:{mkn11:'6A23',dsm5:'295.40'} },

  { id:'F23.3', kod:'F23.3', nazev_cz:'Jiná akutní psychotická porucha s převážně bludy',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Akutní a přechodné psychotické poruchy',
    popis:'Akutní psychóza s dominantními stabilními bludy, bez polymorfních příznaků typických pro F23.0. Halucinace jsou méně výrazné.',
    diagnosticka_kriteria:['Akutní nástup psychotických příznaků','Dominantní bludy (perzistentnější než u F23.0)','Halucinace ne dominantní','Nesplněna kritéria schizofrenie','Trvání méně než 3 měsíce'],
    priznaky:['dominantní bludy','méně výrazné halucinace','dezorganizace chování','emocionální nepřiměřenost'],
    prubeh:'Přechodný, obvykle do 3 měsíců.', onset:'Akutní.',
    diferencialni_diagnozy:['F22.0','F23.0','F23.1'], mapovani:{mkn11:'6A23',dsm5:'297.1'} },

  { id:'F23.8', kod:'F23.8', nazev_cz:'Jiné akutní a přechodné psychotické poruchy',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Akutní a přechodné psychotické poruchy',
    popis:'Jiné akutní psychotické poruchy nespadající do výše uvedených kategorií F23.0–F23.3.',
    diagnosticka_kriteria:['Akutní psychotické příznaky','Nesplněna kritéria F23.0–F23.3','Trvání méně než 3 měsíce'],
    priznaky:['akutní psychotické příznaky','variabilní klinický obraz'],
    prubeh:'Přechodný.', onset:'Akutní.',
    diferencialni_diagnozy:['F23.0','F23.3','F20'], mapovani:{mkn11:null,dsm5:'298.9'} },

  { id:'F23.9', kod:'F23.9', nazev_cz:'Akutní a přechodná psychotická porucha NS',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Akutní a přechodné psychotické poruchy',
    popis:'Neurčená akutní a přechodná psychotická porucha.',
    diagnosticka_kriteria:['Akutní psychotické příznaky','Přechodný průběh','Nelze blíže specifikovat'],
    priznaky:['psychotické příznaky','akutní nástup'],
    prubeh:'Přechodný.', onset:'Akutní.',
    diferencialni_diagnozy:['F23.0','F23.2'], mapovani:{mkn11:null,dsm5:'298.9'} },

  // ── F25.2, F25.8, F25.9 ──────────────────────────────────────────────────
  { id:'F25.2', kod:'F25.2', nazev_cz:'Schizoafektivní porucha, smíšený typ',
    system:'MKN-10', kategorie:KAT_SCHI,
    podkategorie:'Schizoafektivní poruchy',
    popis:'Epizoda splňující kritéria schizoafektivní poruchy, při níž jsou souběžně výrazné příznaky jak manické, tak depresivní spolu se schizofrenními příznaky.',
    diagnosticka_kriteria:['Splněna kritéria schizoafektivní poruchy','Příznaky manické i depresivní ve stejné epizodě','Schizofrenní příznaky přítomny souběžně'],
    priznaky:['bludy','halucinace','depresivní nálada','manické příznaky','dezorganizace','smíšená afektivita'],
    prubeh:'Epizodický, prognóza lepší než čistá schizofrenie.', onset:'Mladá dospělost.',
    diferencialni_diagnozy:['F25.0','F25.1','F31.6'], mapovani:{mkn11:'6A21',dsm5:'295.70'} },

  { id:'F25.8', kod:'F25.8', nazev_cz:'Jiné schizoafektivní poruchy',
    system:'MKN-10', kategorie:KAT_SCHI, podkategorie:'Schizoafektivní poruchy',
    popis:'Schizoafektivní poruchy nespadající pod F25.0–F25.2.',
    diagnosticka_kriteria:['Schizofrenní i afektivní příznaky ve stejné epizodě','Nelze klasifikovat jako F25.0, F25.1 nebo F25.2'],
    priznaky:['schizofrenní příznaky','afektivní příznaky'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F25.0','F25.1'], mapovani:{mkn11:null,dsm5:'295.70'} },

  { id:'F25.9', kod:'F25.9', nazev_cz:'Schizoafektivní porucha NS',
    system:'MKN-10', kategorie:KAT_SCHI, podkategorie:'Schizoafektivní poruchy',
    popis:'Neurčená schizoafektivní porucha.',
    diagnosticka_kriteria:['Schizoafektivní příznaky','Bližší specifikace není možná'],
    priznaky:['schizofrenní příznaky','afektivní příznaky'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F25.0','F25.1'], mapovani:{mkn11:null,dsm5:'295.70'} },

  // ── F31 bipolární – chybějící subkódy ───────────────────────────────────
  { id:'F31.1', kod:'F31.1', nazev_cz:'Bipolární afektivní porucha, aktuální manická epizoda bez psychotických příznaků',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Aktuální epizoda splňuje kritéria pro mánii (F30.1) bez psychotických příznaků. V anamnéze nejméně jedna jiná afektivní epizoda.',
    diagnosticka_kriteria:['V anamnéze nejméně jedna jiná afektivní epizoda','Aktuální epizoda splňuje kritéria F30.1 (mánie bez psychózy)','Bez bludů nebo halucinací'],
    priznaky:['povznesená nebo expanzivní nálada','zvýšená energie','snížená potřeba spánku','grandiózní myšlenky','zvýšená hovornost','závodivé myšlenky','zbrklé chování'],
    prubeh:'Epizodický, bipolární.', onset:'15–30 let.',
    diferencialni_diagnozy:['F30.1','F25.0','F31.2'], mapovani:{mkn11:'6A60',dsm5:'296.41'} },

  { id:'F31.2', kod:'F31.2', nazev_cz:'Bipolární afektivní porucha, aktuální manická epizoda s psychotickými příznaky',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Aktuální manická epizoda s bludy nebo halucinacemi. V anamnéze nejméně jedna jiná afektivní epizoda.',
    diagnosticka_kriteria:['V anamnéze jiná afektivní epizoda','Aktuální mánie (F30.2) s bludy nebo halucinacemi','Psychotické příznaky mohou být kongruentní nebo inkongruentní s náladou'],
    priznaky:['manická nálada','bludy grandioزní nebo pronásledovatelské','halucinace','dezorganizace','agitace','snížená potřeba spánku'],
    prubeh:'Epizodický.', onset:'15–30 let.',
    diferencialni_diagnozy:['F30.2','F25.0','F31.1'], mapovani:{mkn11:'6A60',dsm5:'296.42'} },

  { id:'F31.4', kod:'F31.4', nazev_cz:'Bipolární afektivní porucha, aktuální těžká depresivní epizoda bez psychotických příznaků',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Aktuální těžká depresivní epizoda bez psychotických příznaků u pacienta s bipolární poruchou v anamnéze.',
    diagnosticka_kriteria:['V anamnéze nejméně jedna manická nebo hypomanická epizoda','Aktuální epizoda splňuje kritéria F32.2 (těžká deprese bez psychózy)'],
    priznaky:['těžká depresivní nálada','anhedonie','výrazná únava','suicidální myšlenky','psychomotorická retardace','poruchy spánku a chuti k jídlu'],
    prubeh:'Epizodický.', onset:'15–30 let.',
    diferencialni_diagnozy:['F32.2','F33.2','F31.5'], mapovani:{mkn11:'6A60',dsm5:'296.54'} },

  { id:'F31.6', kod:'F31.6', nazev_cz:'Bipolární afektivní porucha, aktuální smíšená epizoda',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Smíšená epizoda charakterizovaná souběžnými nebo rychle se střídajícími manickými a depresivními příznaky. Diagnosticky nejkomplexnější typ bipolární poruchy.',
    diagnosticka_kriteria:['V anamnéze nejméně jedna jiná afektivní epizoda','Souběžné nebo rychle střídající se manické a depresivní příznaky po dobu nejméně 2 týdnů'],
    priznaky:['dysforická nálada','agitace','zvýšená energie s depresivní náladou','suicidální myšlenky','grandiózní a depresivní myšlenky souběžně','poruchy spánku','závodivé myšlenky'],
    prubeh:'Epizodický, obtížně léčitelný.', onset:'15–30 let.',
    diferencialni_diagnozy:['F31.1','F31.3','F25.2'], mapovani:{mkn11:'6A60',dsm5:'296.60'} },

  { id:'F31.7', kod:'F31.7', nazev_cz:'Bipolární afektivní porucha, aktuálně v remisi',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Pacient s bipolární poruchou v anamnéze, který v současnosti nesplňuje kritéria pro žádnou afektivní epizodu jakékoliv závažnosti.',
    diagnosticka_kriteria:['V anamnéze nejméně jedna manická a nejméně jedna jiná afektivní epizoda','Aktuálně žádná klinicky významná nálada'],
    priznaky:['bez výrazných afektivních příznaků','může přetrvávat mírné funkční omezení'],
    prubeh:'Remise, chronicky relabující.', onset:'15–30 let.',
    diferencialni_diagnozy:['F34.0','F34.1'], mapovani:{mkn11:'6A60',dsm5:'296.56'} },

  { id:'F31.8', kod:'F31.8', nazev_cz:'Jiné bipolární afektivní poruchy',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Bipolární poruchy nespadající do F31.0–F31.7, včetně bipolární poruchy II a rychle cyklujících forem.',
    diagnosticka_kriteria:['Epizodický průběh s afektivními epizodami','Nelze zařadit do F31.0–F31.7'],
    priznaky:['hypomanie','depresivní epizody','rychlé cyklování'],
    prubeh:'Epizodický.', onset:'15–35 let.',
    diferencialni_diagnozy:['F34.0','F31.0'], mapovani:{mkn11:'6A61',dsm5:'296.89'} },

  { id:'F31.9', kod:'F31.9', nazev_cz:'Bipolární afektivní porucha NS',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Bipolární afektivní porucha',
    popis:'Neurčená bipolární afektivní porucha.',
    diagnosticka_kriteria:['Bipolární charakter poruchy','Nelze upřesnit typ'],
    priznaky:['afektivní epizody','variabilní klinický obraz'],
    prubeh:'Epizodický.', onset:'Variabilní.',
    diferencialni_diagnozy:['F31.0','F31.3'], mapovani:{mkn11:null,dsm5:'296.80'} },

  // ── F38 – ostatní afektivní ──────────────────────────────────────────────
  { id:'F38.1', kod:'F38.1', nazev_cz:'Jiné opakující se afektivní poruchy',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Jiné afektivní poruchy',
    popis:'Opakující se afektivní poruchy, které nesplňují kritéria pro rekurentní depresivní poruchu (F33) nebo jiné specifické kategorie.',
    diagnosticka_kriteria:['Opakující se epizody změn nálady','Nesplňují kritéria pro F33 nebo jiné specifické diagnózy'],
    priznaky:['opakující se afektivní epizody','poruchy nálady','funkční omezení'],
    prubeh:'Opakující se.', onset:'Variabilní.',
    diferencialni_diagnozy:['F33','F34.1'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F38.10', kod:'F38.10', nazev_cz:'Krátká rekurentní depresivní porucha',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Jiné afektivní poruchy',
    popis:'Opakující se krátké depresivní epizody (2–3 dny) přibližně jednou měsíčně bez zřejmé vazby na menstruační cyklus.',
    diagnosticka_kriteria:['Depresivní epizody trvající 2–3 dny','Epizody se opakují přibližně jednou měsíčně po dobu ≥ 1 roku','Epizody splňují symptomatická kritéria depresivní epizody'],
    priznaky:['krátké depresivní epizody','výrazné kolísání nálady','funkční narušení v průběhu epizod'],
    prubeh:'Chronicky rekurentní, krátké epizody.', onset:'Mladá dospělost.',
    diferencialni_diagnozy:['F33','F34.1','F32'], mapovani:{mkn11:null,dsm5:null} },

  { id:'F38.80', kod:'F38.80', nazev_cz:'Jiné určené afektivní poruchy',
    system:'MKN-10', kategorie:KAT_AFF, podkategorie:'Jiné afektivní poruchy',
    popis:'Určené afektivní poruchy nespadající do jiných kategorií.',
    diagnosticka_kriteria:['Klinicky významné poruchy nálady','Nespadají do jiné určené kategorie afektivních poruch'],
    priznaky:['poruchy nálady','funkční omezení'],
    prubeh:'Variabilní.', onset:'Variabilní.',
    diferencialni_diagnozy:['F38.1','F34'], mapovani:{mkn11:null,dsm5:null} },

];

const filtered = nove.filter(n => !existingIds.has(n.id));
console.log(`Část 2: přidáno ${filtered.length} záznamů (F20, F22, F23, F25, F31, F38)`);
module.exports = { nove: filtered };
