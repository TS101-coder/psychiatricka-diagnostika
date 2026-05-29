/**
 * MKN-11 data – Part 1: Neurovývojové + Psychotické + Katatonie + Nálada + Úzkost
 * Zdroj: WHO ICD-11 MMS 2025-01 (česká verze)
 */
const fs = require('fs');

// Helper: vytvoří vstupní záznam
function d(id, nazev_cz, kategorie, opts = {}) {
  return {
    id,
    kod: id,
    nazev_cz,
    kategorie,
    podkategorie: opts.pod || null,
    popis: opts.popis || null,
    diagnosticka_kriteria: opts.krit || [],
    priznaky: opts.priz || [],
    prubeh: opts.prubeh || null,
    onset: opts.onset || null,
    mapovani_mkn10: opts.mkn10 || []
  };
}

const KAT = {
  NEURO:    'Neurovývojové poruchy',
  PSYCH:    'Schizofrenie nebo jiné primární psychotické poruchy',
  KATATONIE:'Katatonie',
  BIPOLAR:  'Poruchy nálady – bipolární nebo příbuzné',
  DEPRESE:  'Poruchy nálady – depresivní',
  NALADA:   'Poruchy nálady – specifikátory a průběh',
  UZKOST:   'Úzkostné poruchy nebo poruchy související se strachem',
  OKP:      'Obsedantně-kompulzivní nebo příbuzné poruchy',
  STRES:    'Poruchy specificky spojené se stresem',
  DISOC:    'Disociativní poruchy',
  JIDLO:    'Poruchy příjmu potravy a stravovacího chování',
  VYLUC:    'Poruchy vylučování',
  TELO:     'Poruchy tělesné úzkosti nebo tělesných prožitků',
  LATKY:    'Poruchy způsobené užíváním návykových látek nebo návykovým chováním',
  IMPULZ:   'Poruchy kontroly impulzů',
  DISRUP:   'Rušivé chování nebo disociální poruchy',
  OSOBNOST: 'Poruchy osobnosti a související rysy',
  PARAFIL:  'Parafilní poruchy',
  FAKTIT:   'Faktitivní porucha',
  NEUROK:   'Neurokognitivní poruchy',
  SEKUND:   'Sekundární duševní nebo behaviorální syndromy',
  OSTATNI:  'Ostatní duševní, behaviorální nebo neurovývojové poruchy'
};

const data = [

  // ═══════════════════════════════════════════════════════════
  // 6A0x NEUROVÝVOJOVÉ PORUCHY
  // ═══════════════════════════════════════════════════════════

  d('6A00', 'Poruchy vývoje intelektu', KAT.NEURO, {
    pod: 'Poruchy intelektového vývoje',
    popis: 'Etiologicky různorodé stavy vznikající v průběhu vývojového období, charakterizované výrazně podprůměrným intelektuálním fungováním a adaptivním chováním (přibližně 2 a více směrodatných odchylek pod průměrem).',
    krit: [
      'Výrazně podprůměrné intelektuální fungování (přibližně 2+ SD pod průměrem)',
      'Deficity v adaptivním chování v konceptuální, sociální a praktické oblasti',
      'Nástup v průběhu vývojového období'
    ],
    priz: ['Omezené kognitivní schopnosti', 'Problémy s učením', 'Omezená adaptivní funkce', 'Potíže s komunikací'],
    mkn10: ['F70', 'F71', 'F72', 'F73', 'F78', 'F79']
  }),
  d('6A00.0', 'Mírná porucha vývoje intelektu', KAT.NEURO, {
    pod: 'Poruchy intelektového vývoje',
    popis: 'Přibližně 2–3 SD pod průměrem (0,1–2,3. percentil). Jedinci typicky zvládají základní jazykové a akademické dovednosti s obtížemi u složitějších pojmů.',
    mkn10: ['F70']
  }),
  d('6A00.1', 'Středně těžká porucha vývoje intelektu', KAT.NEURO, {
    pod: 'Poruchy intelektového vývoje',
    popis: 'Přibližně 3–4 SD pod průměrem (0,003–0,1. percentil). Omezená jazyková a akademická schopnost; zvládají základní sebeobsluhu s podporou.',
    mkn10: ['F71']
  }),
  d('6A00.2', 'Těžká porucha vývoje intelektu', KAT.NEURO, {
    pod: 'Poruchy intelektového vývoje',
    popis: 'Přibližně 4+ SD pod průměrem. Velmi omezená jazyková kapacita; mohou být přítomny motorické poruchy; základní sebeobsluha s intenzivní výukou.',
    mkn10: ['F72']
  }),
  d('6A00.3', 'Hluboká porucha vývoje intelektu', KAT.NEURO, {
    pod: 'Poruchy intelektového vývoje',
    popis: 'Přibližně 4+ SD pod průměrem. Silně omezená komunikace; dovednosti omezeny na základní konkrétní schopnosti; mohou být motorické a senzorické poruchy.',
    mkn10: ['F73']
  }),
  d('6A00.4', 'Porucha vývoje intelektu, dočasná', KAT.NEURO, {
    popis: 'Přiřazuje se, pokud existuje důkaz poruchy, ale hodnocení nelze provést z důvodu věku nebo jiných stavů.',
    mkn10: ['F78']
  }),
  d('6A00.Z', 'Poruchy vývoje intelektu, neurčené', KAT.NEURO, { mkn10: ['F79'] }),

  d('6A01', 'Vývojové poruchy řeči nebo jazyka', KAT.NEURO, {
    pod: 'Vývojové poruchy řeči a jazyka',
    popis: 'Trvalé obtíže s nabýváním a používáním jazyka ve všech modalitách způsobené deficity v porozumění nebo produkci; jazykové schopnosti výrazně nižší oproti věkovým očekáváním.',
    krit: [
      'Trvalé obtíže s nabýváním a používáním jazyka (mluvená, psaná, nebo znaková)',
      'Jazykové schopnosti výrazně nižší oproti věkovým a intelektovým očekáváním',
      'Nástup v průběhu vývojového období',
      'Není lépe vysvětlen smyslovým nebo motorickým deficitem'
    ],
    mkn10: ['F80']
  }),
  d('6A01.0', 'Vývojová porucha zvukové podoby řeči', KAT.NEURO, {
    popis: 'Obtíže s výslovností, při nichž srozumitelnost řeči je výrazně snížená oproti věkové normě.',
    mkn10: ['F80.0']
  }),
  d('6A01.1', 'Vývojová porucha plynulosti řeči', KAT.NEURO, {
    popis: 'Přerušení normální plynulosti a časování řeči; opakování hlásek, slabik, slov; prolongace, bloky; zahrnuje koktavost.',
    mkn10: ['F98.5']
  }),
  d('6A01.2', 'Vývojová porucha jazyka', KAT.NEURO, {
    popis: 'Výrazné obtíže s nabýváním, porozuměním nebo používáním jazyka.',
    mkn10: ['F80.1', 'F80.2']
  }),
  d('6A01.20', 'Vývojová porucha jazyka s narušením receptivního a expresivního jazyka', KAT.NEURO, { mkn10: ['F80.2'] }),
  d('6A01.21', 'Vývojová porucha jazyka s narušením převážně expresivního jazyka', KAT.NEURO, { mkn10: ['F80.1'] }),
  d('6A01.22', 'Vývojová porucha jazyka s narušením převážně pragmatického jazyka', KAT.NEURO, { mkn10: ['F80.8'] }),
  d('6A01.23', 'Vývojová porucha jazyka s jiným určeným narušením jazyka', KAT.NEURO, { mkn10: ['F80.8'] }),
  d('6A01.Y', 'Vývojové poruchy řeči nebo jazyka, jiné určené', KAT.NEURO, { mkn10: ['F80.8'] }),
  d('6A01.Z', 'Vývojové poruchy řeči nebo jazyka, neurčené', KAT.NEURO, { mkn10: ['F80.9'] }),

  d('6A02', 'Porucha autistického spektra', KAT.NEURO, {
    pod: 'Autismus',
    popis: 'Charakterizována přetrvávajícími deficity ve schopnosti zahájit a udržet oboustrannou sociální interakci a komunikaci a omezenými, opakujícími se a nepružnými vzorci chování, zájmů nebo aktivit.',
    krit: [
      'Přetrvávající deficity ve schopnosti zahájit a udržet oboustrannou sociální interakci a komunikaci',
      'Omezené, opakující se a nepružné vzorce chování, zájmů nebo aktivit, které jsou pro věk atypické',
      'Nástup v průběhu vývojového období, typicky v raném dětství',
      'Příznaky způsobují výrazné funkční postižení'
    ],
    priz: ['Deficity v sociální komunikaci', 'Omezené zájmy', 'Repetitivní chování', 'Smyslová přecitlivělost nebo hyposenzitivita', 'Rigidní rutiny'],
    prubeh: 'Celoživotní, ale příznaky se mohou měnit s věkem a intervencí.',
    onset: 'Typicky v raném dětství, i když plné příznaky mohou být patrné až při větších sociálních nárocích.',
    mkn10: ['F84.0', 'F84.1', 'F84.5']
  }),
  d('6A02.0', 'Porucha autistického spektra bez poruchy vývoje intelektu a s mírným nebo žádným poškozením funkční řeči', KAT.NEURO, { mkn10: ['F84.5'] }),
  d('6A02.1', 'Porucha autistického spektra s poruchou vývoje intelektu a s mírným nebo žádným poškozením funkční řeči', KAT.NEURO, { mkn10: ['F84.0'] }),
  d('6A02.2', 'Porucha autistického spektra bez poruchy vývoje intelektu a se zhoršenou funkční řečí', KAT.NEURO, { mkn10: ['F84.0'] }),
  d('6A02.3', 'Porucha autistického spektra s poruchou vývoje intelektu a s narušením funkční řeči', KAT.NEURO, { mkn10: ['F84.0'] }),
  d('6A02.5', 'Porucha autistického spektra s poruchou vývoje intelektu a absencí funkční řeči', KAT.NEURO, { mkn10: ['F84.0'] }),
  d('6A02.Y', 'Porucha autistického spektra, jiná určená', KAT.NEURO, { mkn10: ['F84.8'] }),
  d('6A02.Z', 'Porucha autistického spektra, neurčená', KAT.NEURO, { mkn10: ['F84.9'] }),

  d('6A03', 'Vývojová porucha učení', KAT.NEURO, {
    pod: 'Specifické poruchy učení',
    popis: 'Trvalé a výrazné obtíže s nabýváním nebo používáním specifických akademických dovedností navzdory adekvátní vzdělávací příležitosti; dovednosti jsou výrazně nižší oproti věkovým a intelektovým očekáváním.',
    krit: [
      'Trvalé obtíže s nabýváním specifických akademických dovedností (čtení, psaní, matematika)',
      'Výkon výrazně nižší oproti věkovým a intelektovým očekáváním',
      'Nástup v průběhu vývojového/školního věku',
      'Není lépe vysvětlen poruchou intelektového vývoje ani smyslovým deficitem'
    ],
    mkn10: ['F81']
  }),
  d('6A03.0', 'Vývojová porucha učení s poruchou čtení', KAT.NEURO, {
    popis: 'Přesnost a plynulost čtení výrazně pod věkovou normou; obtíže s dekódováním a rozpoznáváním slov (dyslexie).',
    mkn10: ['F81.0']
  }),
  d('6A03.1', 'Vývojová porucha učení s poruchou v písemném vyjadřování', KAT.NEURO, {
    popis: 'Přesnost a plynulost psaní výrazně pod věkovou normou; obtíže s pravopisem a gramatickým vyjádřením (dysortografie/dysgrafie).',
    mkn10: ['F81.1']
  }),
  d('6A03.2', 'Vývojová porucha učení s poruchou v matematice', KAT.NEURO, {
    popis: 'Obtíže s matematickými koncepty a výpočty výrazně pod věkovou normou (dyskalkulie).',
    mkn10: ['F81.2']
  }),
  d('6A03.3', 'Vývojová porucha učení s jinou určenou poruchou učení', KAT.NEURO, { mkn10: ['F81.8'] }),
  d('6A03.Z', 'Vývojová porucha učení, neurčená', KAT.NEURO, { mkn10: ['F81.9'] }),

  d('6A04', 'Vývojová porucha motorické koordinace', KAT.NEURO, {
    pod: 'Motorické poruchy',
    popis: 'Výrazné a trvalé obtíže s nabýváním a prováděním koordinovaných motorických dovedností výrazně pod věkovým a intelektovým očekáváním (dyspraxie).',
    krit: [
      'Výrazné obtíže s nabýváním a prováděním koordinovaných motorických dovedností',
      'Dovednosti jsou výrazně nižší oproti věkovým a intelektovým očekáváním',
      'Nástup v průběhu vývojového období',
      'Způsobuje výrazné funkční postižení'
    ],
    mkn10: ['F82']
  }),

  d('6A05', 'Porucha pozornosti s hyperaktivitou', KAT.NEURO, {
    pod: 'ADHD',
    popis: 'Přetrvávající vzorec nepozornosti a/nebo hyperaktivity-impulzivity s přímým negativním dopadem na fungování; příznaky se projevily před 12. rokem věku.',
    krit: [
      'Přetrvávající vzorec (nejméně 6 měsíců) nepozornosti a/nebo hyperaktivity-impulzivity',
      'Příznaky mají přímý negativní dopad na akademické, pracovní nebo sociální fungování',
      'Příznaky se projevily před 12. rokem věku a přesahují normální vývojovou variaci',
      'Projevuje se v různých prostředích (domov, škola, práce)',
      'Není lépe vysvětlen jinou duševní poruchou ani účinky látky'
    ],
    priz: ['Obtíže s udržením pozornosti', 'Snadná rozptylitelnost', 'Zapomínání', 'Motorický neklid', 'Impulzivita', 'Obtíže s organizací'],
    prubeh: 'Příznaky přetrvávají do dospělosti u 50–70 % případů, i když hyperaktivita klesá.',
    onset: 'Příznaky patrné před 12. rokem věku; typicky v raném dětství.',
    mkn10: ['F90', 'F90.0', 'F90.1']
  }),
  d('6A05.0', 'Porucha pozornosti s hyperaktivitou, s převládajícími projevy nepozornosti', KAT.NEURO, { mkn10: ['F90.0'] }),
  d('6A05.1', 'Porucha pozornosti s hyperaktivitou, převážně hyperaktivní-impulzivní projev', KAT.NEURO, { mkn10: ['F90.1'] }),
  d('6A05.2', 'Kombinovaná porucha pozornosti s hyperaktivitou', KAT.NEURO, { mkn10: ['F90.0', 'F90.1'] }),
  d('6A05.Y', 'Porucha pozornosti s hyperaktivitou, jiné určené projevy', KAT.NEURO, { mkn10: ['F90.8'] }),
  d('6A05.Z', 'Porucha pozornosti s hyperaktivitou s neurčenými projevy', KAT.NEURO, { mkn10: ['F90.9'] }),

  d('6A06', 'Stereotypní pohybová porucha', KAT.NEURO, {
    pod: 'Pohybové poruchy',
    popis: 'Opakující se, zdánlivě účelové a zdánlivě neintencionální pohyby, které se stávají ritualizovanými, s nástupem v raném vývojovém období.',
    mkn10: ['F98.4']
  }),
  d('6A06.0', 'Stereotypní pohybová porucha bez sebepoškozování', KAT.NEURO, { mkn10: ['F98.4'] }),
  d('6A06.1', 'Stereotypní pohybová porucha se sebepoškozováním', KAT.NEURO, { mkn10: ['F98.4'] }),
  d('6A06.Z', 'Stereotypní pohybová porucha, neurčená', KAT.NEURO, { mkn10: ['F98.4'] }),

  d('6A0Y', 'Neurovývojové poruchy, jiné určené', KAT.NEURO, { mkn10: ['F88'] }),
  d('6A0Z', 'Neurovývojové poruchy, neurčené', KAT.NEURO, { mkn10: ['F89'] }),

  // ═══════════════════════════════════════════════════════════
  // 6A2x SCHIZOFRENIE NEBO JINÉ PRIMÁRNÍ PSYCHOTICKÉ PORUCHY
  // ═══════════════════════════════════════════════════════════

  d('6A20', 'Schizofrenie', KAT.PSYCH, {
    pod: 'Schizofrenie',
    popis: 'Poruchy ve více mentálních modalitách: myšlení, vnímání, prožívání sebe, kognice, vůle, afekt, chování. Jádrové příznaky zahrnují trvalé bludy, halucinace, dezorganizaci myšlení a zážitky ovlivňování.',
    krit: [
      'Poruchy ve více mentálních modalitách: myšlení (bludy, dezorganizace), vnímání (halucinace), prožívání sebe (ovlivňování, pasivita), kognice, vůle (ztráta motivace), afekt (oploštění), chování',
      'Jádrové příznaky: trvalé bludy, trvalé halucinace, dezorganizace myšlení, zážitky ovlivňování nebo kontroly',
      'Příznaky přetrvávají nejméně 1 měsíc',
      'Nejsou projevem jiného onemocnění ani důsledkem účinků látky na CNS'
    ],
    priz: ['Trvalé bludy', 'Halucinace (typicky sluchové)', 'Dezorganizace myšlení', 'Negativní příznaky', 'Oploštěný afekt', 'Alogie', 'Abulie', 'Anhedonie'],
    prubeh: 'Chronický, s různými průběhy: kontinuální, epizodický, nebo s epizodami a remisemi.',
    onset: 'Typicky pozdní adolescence až raná dospělost; muži dříve (18–25 let), ženy pozdněji (25–35 let).',
    mkn10: ['F20']
  }),
  d('6A20.0', 'Schizofrenie, první epizoda', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.00', 'Schizofrenie, první epizoda, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.01', 'Schizofrenie, první epizoda, v částečné remisi', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.02', 'Schizofrenie, první epizoda, v plné remisi', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.0Z', 'Schizofrenie, první epizoda, neurčená', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.1', 'Schizofrenie, opakované epizody', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.10', 'Schizofrenie, opakované epizody, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.11', 'Schizofrenie, opakované epizody, v částečné remisi', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.12', 'Schizofrenie, opakované epizody, v plné remisi', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.1Z', 'Schizofrenie, opakované epizody, neurčená', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A20.2', 'Schizofrenie, kontinuální', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.20', 'Schizofrenie, kontinuální, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.21', 'Schizofrenie, kontinuální, v částečné remisi', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.22', 'Schizofrenie, kontinuální, v plné remisi', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.2Z', 'Schizofrenie, kontinuální, neurčená', KAT.PSYCH, { mkn10: ['F20.5'] }),
  d('6A20.Y', 'Schizofrenie, jiná určená', KAT.PSYCH, { mkn10: ['F20.8'] }),
  d('6A20.Z', 'Schizofrenie, neurčená', KAT.PSYCH, { mkn10: ['F20.9'] }),

  d('6A21', 'Schizoafektivní porucha', KAT.PSYCH, {
    pod: 'Schizoafektivní porucha',
    popis: 'Epizodická porucha, při níž jsou v rámci téže epizody splněna diagnostická kritéria jak pro schizofrenii, tak pro manickou, smíšenou nebo středně těžkou či těžkou depresivní epizodu (simultánně nebo do několika dnů).',
    krit: [
      'V rámci téže epizody splněna kritéria pro schizofrenii i pro manickou, smíšenou nebo depresivní epizodu',
      'Příznaky přetrvávají nejméně 1 měsíc',
      'Nejsou projevem jiného onemocnění ani důsledkem účinků látky'
    ],
    mkn10: ['F25']
  }),
  d('6A21.0', 'Schizoafektivní porucha, první epizoda', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.00', 'Schizoafektivní porucha, první epizoda, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.01', 'Schizoafektivní porucha, první epizoda, v částečné remisi', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.02', 'Schizoafektivní porucha, první epizoda, v plné remisi', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.0Z', 'Schizoafektivní porucha, první epizoda, neurčená', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.1', 'Schizoafektivní porucha, opakované epizody', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.10', 'Schizoafektivní porucha, opakované epizody, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.11', 'Schizoafektivní porucha, více epizod, v částečné remisi', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.12', 'Schizoafektivní porucha, opakované epizody, v plné remisi', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.1Z', 'Schizoafektivní porucha, opakované epizody, neurčená', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.2', 'Schizoafektivní porucha, kontinuální', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.20', 'Schizoafektivní porucha, kontinuální, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.21', 'Schizoafektivní porucha, kontinuální, v částečné remisi', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.22', 'Schizoafektivní porucha, kontinuální, v plné remisi', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.2Z', 'Schizoafektivní porucha, kontinuální, neurčená', KAT.PSYCH, { mkn10: ['F25'] }),
  d('6A21.Y', 'Schizoafektivní porucha, jiná určená', KAT.PSYCH, { mkn10: ['F25.8'] }),
  d('6A21.Z', 'Schizoafektivní porucha, neurčená', KAT.PSYCH, { mkn10: ['F25.9'] }),

  d('6A22', 'Schizotypální porucha', KAT.PSYCH, {
    pod: 'Schizotypální porucha',
    popis: 'Trvalý vzorec trvající několik let s podivínstvím v chování, vzhledu a řeči, kognitivními a percepčními distorzemi, neobvyklými přesvědčeními a dyskomfortem v mezilidských vztazích.',
    krit: [
      'Trvalý vzorec trvající několik let: podivínství v chování, vzhledu a řeči',
      'Kognitivní a percepční distorze, neobvyklá přesvědčení',
      'Dyskomfort a snížená kapacita pro mezilidské vztahy',
      'Stažený nebo nepřiměřený afekt, anhedonie',
      'Příznaky nedosahují intenzity schizofrenie'
    ],
    mkn10: ['F21']
  }),

  d('6A23', 'Akutní a přechodná psychotická porucha', KAT.PSYCH, {
    pod: 'Akutní psychóza',
    popis: 'Akutní nástup psychotických příznaků (bludy, halucinace, dezorganizace, zmatenost) bez prodromu, dosahující maximální závažnosti do 2 týdnů; epizoda nepřesahuje 3 měsíce.',
    krit: [
      'Akutní nástup psychotických příznaků bez prodromu, dosahující maximální závažnosti do 2 týdnů',
      'Příznaky se typicky rychle mění v povaze i intenzitě',
      'Epizoda nepřesahuje 3 měsíce (typicky několik dní až 1 měsíc)',
      'Nejsou projevem jiného onemocnění ani důsledkem účinků látky'
    ],
    mkn10: ['F23']
  }),
  d('6A23.0', 'Akutní a přechodná psychotická porucha, první epizoda', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.00', 'Akutní a přechodná psychotická porucha, první epizoda, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.01', 'Akutní a přechodná psychotická porucha, první epizoda, v částečné remisi', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.02', 'Akutní a přechodná psychotická porucha, první epizoda, v plné remisi', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.0Z', 'Akutní a přechodná psychotická porucha, první epizoda, neurčená', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.1', 'Akutní a přechodná psychotická porucha, opakované epizody', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.10', 'Akutní a přechodná psychotická porucha, opakované epizody, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.11', 'Akutní a přechodná psychotická porucha, opakované epizody, v plné remisi', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.12', 'Akutní a přechodná psychotická porucha, více epizod, v plné remisi', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.1Z', 'Akutní a přechodná psychotická porucha, opakované epizody, neurčená', KAT.PSYCH, { mkn10: ['F23'] }),
  d('6A23.Y', 'Akutní a přechodná psychotická porucha, jiná určená', KAT.PSYCH, { mkn10: ['F23.8'] }),
  d('6A23.Z', 'Akutní a přechodná psychotická porucha, neurčená', KAT.PSYCH, { mkn10: ['F23.9'] }),

  d('6A24', 'Porucha s bludy', KAT.PSYCH, {
    pod: 'Porucha s bludy',
    popis: 'Rozvoj bludu nebo souboru příbuzných bludů, typicky přetrvávajících nejméně 3 měsíce; chybí jasné halucinace, negativní příznaky, dezorganizace myšlení nebo zážitky ovlivňování.',
    krit: [
      'Rozvoj bludu nebo souboru příbuzných bludů, typicky trvajících nejméně 3 měsíce',
      'Chybí jasné a trvalé halucinace, negativní příznaky, dezorganizace myšlení nebo zážitky ovlivňování',
      'Mimo chování přímo spojeného s bludem jsou afekt, řeč a chování typicky nezměněny',
      'Nejsou projevem jiného onemocnění ani důsledkem účinků látky'
    ],
    mkn10: ['F22']
  }),
  d('6A24.0', 'Porucha s bludy, v současnosti symptomatická', KAT.PSYCH, { mkn10: ['F22.0'] }),
  d('6A24.1', 'Porucha s bludy, částečná remise', KAT.PSYCH, { mkn10: ['F22'] }),
  d('6A24.2', 'Porucha s bludy v plné remisi', KAT.PSYCH, { mkn10: ['F22'] }),
  d('6A24.Z', 'Porucha s bludy, neurčená', KAT.PSYCH, { mkn10: ['F22.9'] }),

  d('6A25', 'Symptomatické projevy primárních psychotických poruch', KAT.PSYCH, {
    popis: 'Specifikátor k dalšímu popisu příznaků u primárně psychotických poruch.',
    mkn10: ['F28']
  }),
  d('6A25.0', 'Pozitivní příznaky u primárních psychotických poruch', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A25.1', 'Negativní příznaky u primárních psychotických poruch', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A25.2', 'Depresivní afektivní příznaky u primárních psychotických poruch', KAT.PSYCH, { mkn10: ['F20.4'] }),
  d('6A25.3', 'Manické afektivní příznaky u primární psychotické poruchy', KAT.PSYCH, { mkn10: ['F25.0'] }),
  d('6A25.4', 'Psychomotorické příznaky u primárních psychotických poruch', KAT.PSYCH, { mkn10: ['F20.2'] }),
  d('6A25.5', 'Kognitivní příznaky u primárních psychotických poruch', KAT.PSYCH, { mkn10: ['F20'] }),
  d('6A2Y', 'Primární psychotická porucha, jiná určená', KAT.PSYCH, { mkn10: ['F28'] }),
  d('6A2Z', 'Primární psychotická porucha, neurčená', KAT.PSYCH, { mkn10: ['F29'] }),

  // ═══════════════════════════════════════════════════════════
  // 6A4x KATATONIE
  // ═══════════════════════════════════════════════════════════

  d('6A40', 'Katatonie přidružená k jiné duševní poruše', KAT.KATATONIE, {
    popis: 'Katatonní syndrom (mutismus, strnulost, negativismus, stereotypie, echolalie apod.) vyskytující se v kontextu jiné duševní poruchy jako je schizofrenie, bipolární nebo depresivní porucha.',
    krit: [
      'Přítomnost katatonního syndromu (2+ ze symptomů: mutismus, strnulost, negativismus, stereotypie, manýry, katalepsie)',
      'Katatonní příznaky jsou přidruženy k jiné duševní poruše',
      'Příznaky nejsou lépe vysvětleny jinou příčinou'
    ],
    mkn10: ['F20.2']
  }),
  d('6A41', 'Katatonie vyvolaná látkami nebo léky', KAT.KATATONIE, {
    popis: 'Katatonní syndrom vyvolaný přímými fyziologickými účinky látky nebo léku.',
    mkn10: ['F20.2']
  }),
  d('6A4Z', 'Katatonie, neurčená', KAT.KATATONIE, { mkn10: ['F20.2'] }),

  // ═══════════════════════════════════════════════════════════
  // 6A6x BIPOLÁRNÍ NEBO PŘÍBUZNÉ PORUCHY
  // ═══════════════════════════════════════════════════════════

  d('6A60', 'Bipolární porucha typu I', KAT.BIPOLAR, {
    pod: 'Bipolární porucha I',
    popis: 'Porucha nálady definovaná výskytem jedné nebo více manických nebo smíšených epizod. Manické epizody typicky střídají depresivní epizody.',
    krit: [
      'Jedna nebo více manických nebo smíšených epizod (nutná podmínka)',
      'Manická epizoda: trvá nejméně 1 týden, extrémní zvýšení nebo dráždivost nálady + zvýšení aktivity',
      'Smíšená epizoda: simultánní nebo rychle se střídající manické i depresivní příznaky, nejméně 2 týdny',
      'Příznaky způsobují výrazné postižení nebo vyžadují hospitalizaci'
    ],
    priz: ['Zvýšená nebo dráždivá nálada', 'Snížená potřeba spánku', 'Zrychlené myšlení', 'Grandiozita', 'Impulzivita', 'Psychóza (v těžkých případech)'],
    prubeh: 'Celoživotní epizodický průběh s depresivními epizodami trvajícími déle než manické.',
    onset: 'Typicky mezi 18–25 lety; může začít kdykoli.',
    mkn10: ['F31']
  }),
  d('6A60.0', 'Bipolární porucha typu I, současná epizoda manická, bez psychotických příznaků', KAT.BIPOLAR, { mkn10: ['F31.1'] }),
  d('6A60.1', 'Bipolární porucha typu I, současná epizoda manická, s psychotickými příznaky', KAT.BIPOLAR, { mkn10: ['F31.2'] }),
  d('6A60.2', 'Bipolární porucha typu I, současná epizoda hypomanická', KAT.BIPOLAR, { mkn10: ['F31.0'] }),
  d('6A60.3', 'Bipolární porucha typu I, současná epizoda depresivní, mírná', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A60.4', 'Bipolární porucha typu I, současná epizoda depresivní, středně těžká bez psychotických příznaků', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A60.5', 'Bipolární porucha typu I, současná epizoda depresivní, středně těžká s psychotickými příznaky', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A60.6', 'Bipolární porucha typu I, současná epizoda depresivní, těžká bez psychotických příznaků', KAT.BIPOLAR, { mkn10: ['F31.4'] }),
  d('6A60.7', 'Bipolární porucha typu I, současná epizoda depresivní, těžká s psychotickými příznaky', KAT.BIPOLAR, { mkn10: ['F31.5'] }),
  d('6A60.8', 'Bipolární porucha typu I, současná epizoda depresivní, neurčená závažnost', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A60.9', 'Bipolární porucha typu I, současná epizoda smíšená, bez psychotických příznaků', KAT.BIPOLAR, { mkn10: ['F31.6'] }),
  d('6A60.A', 'Bipolární porucha typu I, současná epizoda smíšená s psychotickými příznaky', KAT.BIPOLAR, { mkn10: ['F31.6'] }),
  d('6A60.B', 'Bipolární porucha typu I, v částečné remisi, poslední epizoda manická nebo hypomanická', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A60.C', 'Bipolární porucha typu I, v částečné remisi, poslední epizoda depresivní', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A60.D', 'Bipolární porucha typu I, v částečné remisi, poslední epizoda smíšená', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A60.E', 'Bipolární porucha typu I, v částečné remisi, poslední epizoda neurčena', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A60.F', 'Bipolární porucha typu I, v současné době v plné remisi', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A60.Y', 'Bipolární porucha typu I, jiná určená', KAT.BIPOLAR, { mkn10: ['F31.8'] }),
  d('6A60.Z', 'Bipolární porucha typu I, neurčená', KAT.BIPOLAR, { mkn10: ['F31.9'] }),

  d('6A61', 'Bipolární porucha typu II', KAT.BIPOLAR, {
    pod: 'Bipolární porucha II',
    popis: 'Nejméně jedna hypomanická epizoda a nejméně jedna depresivní epizoda v anamnéze; žádná manická ani smíšená epizoda.',
    krit: [
      'Nejméně jedna hypomanická epizoda a nejméně jedna depresivní epizoda',
      'Hypomanická epizoda: přetrvávající (nejméně několik dní) zvýšení nálady nebo dráždivosti + zvýšení aktivity; příznaky nejsou dostatečně závažné k výraznému narušení fungování',
      'Žádná manická ani smíšená epizoda v anamnéze'
    ],
    mkn10: ['F31']
  }),
  d('6A61.0', 'Bipolární porucha typu II, současná epizoda hypomanická', KAT.BIPOLAR, { mkn10: ['F31.0'] }),
  d('6A61.1', 'Bipolární porucha typu II, současná epizoda depresivní, mírná', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A61.2', 'Bipolární porucha typu II, současná epizoda depresivní, středně těžká bez psychotických příznaků', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A61.3', 'Bipolární porucha typu II, současná epizoda depresivní, středně závažná s psychotickými příznaky', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A61.4', 'Bipolární porucha typu II, současná epizoda depresivní, těžká bez psychotických příznaků', KAT.BIPOLAR, { mkn10: ['F31.4'] }),
  d('6A61.5', 'Bipolární porucha typu II, současná epizoda depresivní, těžká s psychotickými příznaky', KAT.BIPOLAR, { mkn10: ['F31.5'] }),
  d('6A61.6', 'Bipolární porucha typu II, současná epizoda depresivní, neurčená závažnost', KAT.BIPOLAR, { mkn10: ['F31.3'] }),
  d('6A61.7', 'Bipolární porucha typu II, v částečné remisi, nejnovější epizoda hypomanická', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A61.8', 'Bipolární porucha typu II, v částečné remisi, poslední epizoda depresivní', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A61.9', 'Bipolární porucha typu II, v částečné remisi, poslední epizoda nespecifikována', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A61.A', 'Bipolární porucha typu II, v současné době v plné remisi', KAT.BIPOLAR, { mkn10: ['F31.7'] }),
  d('6A61.Y', 'Bipolární porucha typu II, jiná určená', KAT.BIPOLAR, { mkn10: ['F31.8'] }),
  d('6A61.Z', 'Bipolární porucha typu II, neurčená', KAT.BIPOLAR, { mkn10: ['F31.9'] }),

  d('6A62', 'Cyklotymická porucha', KAT.BIPOLAR, {
    pod: 'Cyklotymie',
    popis: 'Přetrvávající nestabilita nálady po dobu nejméně 2 let se střídáním symptomů hypomanie a deprese, aniž by dosáhly plných kritérií pro příslušnou epizodu.',
    krit: [
      'Přetrvávající nestabilita nálady po dobu nejméně 2 let',
      'Střídání symptomů hypomanie a deprese přítomných více času než ne',
      'Žádná manická, smíšená ani depresivní epizoda v anamnéze',
      'Způsobuje výraznou tíseň nebo funkční postižení'
    ],
    mkn10: ['F34.0']
  }),

  d('6A6Y', 'Bipolární nebo související poruchy, jiné určené', KAT.BIPOLAR, { mkn10: ['F31.8'] }),
  d('6A6Z', 'Bipolární nebo související poruchy, neurčené', KAT.BIPOLAR, { mkn10: ['F31.9'] }),

  // ═══════════════════════════════════════════════════════════
  // 6A7x DEPRESIVNÍ PORUCHY
  // ═══════════════════════════════════════════════════════════

  d('6A70', 'Jediná epizoda depresivní poruchy', KAT.DEPRESE, {
    pod: 'Depresivní porucha',
    popis: 'Přítomnost nebo anamnéza jedné depresivní epizody, pokud v anamnéze nejsou předchozí depresivní epizody.',
    krit: [
      'Depresivní nálada nebo snížený zájem o aktivity přítomné po většinu dne, téměř každý den, po dobu nejméně 2 týdnů',
      'Doprovodné příznaky: obtíže se soustředěním, pocity bezcennosti nebo viny, beznaděj, myšlenky na smrt nebo sebevraždu, změny chuti k jídlu nebo spánku, únava',
      'Žádná manická, hypomanická ani smíšená epizoda v anamnéze',
      'Způsobuje výraznou tíseň nebo funkční postižení'
    ],
    priz: ['Depresivní nálada', 'Ztráta zájmu a radosti (anhedonie)', 'Únava', 'Poruchy spánku', 'Změny chuti k jídlu', 'Snížená koncentrace', 'Pocity viny', 'Myšlenky na smrt'],
    prubeh: 'Průměrná délka epizody bez léčby je 6–12 měsíců.',
    onset: 'Kdykoli, nejčastěji v dospělosti.',
    mkn10: ['F32']
  }),
  d('6A70.0', 'Jediná epizoda depresivní poruchy, mírná', KAT.DEPRESE, { mkn10: ['F32.0'] }),
  d('6A70.1', 'Jediná epizoda depresivní poruchy, středně těžká, bez psychotických příznaků', KAT.DEPRESE, { mkn10: ['F32.1'] }),
  d('6A70.2', 'Jediná epizoda depresivní poruchy, středně těžká, s psychotickými příznaky', KAT.DEPRESE, { mkn10: ['F32.3'] }),
  d('6A70.3', 'Jediná epizoda depresivní poruchy, těžká, bez psychotických příznaků', KAT.DEPRESE, { mkn10: ['F32.2'] }),
  d('6A70.4', 'Jediná epizoda depresivní poruchy, těžká, s psychotickými příznaky', KAT.DEPRESE, { mkn10: ['F32.3'] }),
  d('6A70.5', 'Jediná epizoda depresivní poruchy, neurčená závažnost', KAT.DEPRESE, { mkn10: ['F32.9'] }),
  d('6A70.6', 'Jediná epizoda depresivní poruchy, v současné době v částečné remisi', KAT.DEPRESE, { mkn10: ['F32.8'] }),
  d('6A70.7', 'Jediná epizoda depresivní poruchy, v současné době v plné remisi', KAT.DEPRESE, { mkn10: ['F32.8'] }),
  d('6A70.Y', 'Jediná epizoda depresivní poruchy, jiná určená', KAT.DEPRESE, { mkn10: ['F32.8'] }),
  d('6A70.Z', 'Jediná epizoda depresivní poruchy, neurčená', KAT.DEPRESE, { mkn10: ['F32.9'] }),

  d('6A71', 'Rekurentní depresivní porucha', KAT.DEPRESE, {
    pod: 'Rekurentní deprese',
    popis: 'Anamnéza nejméně dvou depresivních epizod oddělených nejméně několika měsíci bez výrazné poruchy nálady; žádná manická, hypomanická ani smíšená epizoda.',
    krit: [
      'Anamnéza nejméně dvou depresivních epizod oddělených nejméně několika měsíci',
      'Žádná manická, hypomanická ani smíšená epizoda v anamnéze',
      'Každá epizoda splňuje kritéria depresivní poruchy'
    ],
    mkn10: ['F33']
  }),
  d('6A71.0', 'Rekurentní depresivní porucha, současná epizoda mírná', KAT.DEPRESE, { mkn10: ['F33.0'] }),
  d('6A71.1', 'Rekurentní depresivní porucha, současná epizoda středně těžká, bez psychotických příznaků', KAT.DEPRESE, { mkn10: ['F33.1'] }),
  d('6A71.2', 'Rekurentní depresivní porucha, současná epizoda středně těžká, s psychotickými příznaky', KAT.DEPRESE, { mkn10: ['F33.3'] }),
  d('6A71.3', 'Rekurentní depresivní porucha, současná epizoda těžká, bez psychotických příznaků', KAT.DEPRESE, { mkn10: ['F33.2'] }),
  d('6A71.4', 'Rekurentní depresivní porucha, současná epizoda těžká, s psychotickými příznaky', KAT.DEPRESE, { mkn10: ['F33.3'] }),
  d('6A71.5', 'Rekurentní depresivní porucha, současná epizoda neurčené závažnosti', KAT.DEPRESE, { mkn10: ['F33.9'] }),
  d('6A71.6', 'Rekurentní depresivní porucha, v současné době v částečné remisi', KAT.DEPRESE, { mkn10: ['F33.4'] }),
  d('6A71.7', 'Rekurentní depresivní porucha, v současné době v plné remisi', KAT.DEPRESE, { mkn10: ['F33.4'] }),
  d('6A71.Y', 'Rekurentní depresivní porucha, jiná určená', KAT.DEPRESE, { mkn10: ['F33.8'] }),
  d('6A71.Z', 'Rekurentní depresivní porucha, neurčená', KAT.DEPRESE, { mkn10: ['F33.9'] }),

  d('6A72', 'Dystymní porucha', KAT.DEPRESE, {
    pod: 'Dysthymie',
    popis: 'Přetrvávající depresivní nálada trvající 2 roky nebo déle, přítomná po většinu dne, více dní než ne; v průběhu prvních 2 let nikdy nesplňuje kritéria pro depresivní epizodu.',
    krit: [
      'Přetrvávající depresivní nálada trvající 2+ roky, pro většinu dne, více dní než ne',
      'V průběhu prvních 2 let nikdy nebyla depresivní epizoda dostatečně závažná',
      'Žádná manická, smíšená ani hypomanická epizoda v anamnéze',
      'Doprovodné příznaky: snížený zájem, koncentrace, sebeúcta, pesimismus, poruchy spánku a chuti k jídlu'
    ],
    mkn10: ['F34.1']
  }),

  d('6A73', 'Smíšená depresivní a úzkostná porucha', KAT.DEPRESE, {
    pod: 'Smíšená porucha',
    popis: 'Příznaky deprese i úzkosti jsou současně přítomny, ale ani jeden soubor příznaků samostatně nesplňuje kritéria pro příslušnou poruchu; způsobují klinicky závažnou tíseň.',
    mkn10: ['F41.2']
  }),

  d('6A7Y', 'Depresivní poruchy, jiné určené', KAT.DEPRESE, { mkn10: ['F32.8'] }),
  d('6A7Z', 'Depresivní poruchy, neurčené', KAT.DEPRESE, { mkn10: ['F32.9'] }),

  // Specifikátory nálady
  d('6A80', 'Symptomatické projevy a průběhové varianty epizod nálady', KAT.NALADA, {
    popis: 'Doplňkové kódy pro specifikaci průběhu a příznaků epizod nálady.'
  }),
  d('6A80.0', 'Výrazné úzkostné příznaky u epizod nálady', KAT.NALADA, {}),
  d('6A80.1', 'Panické záchvaty u epizod nálady', KAT.NALADA, {}),
  d('6A80.2', 'Současná depresivní epizoda, přetrvávající', KAT.NALADA, {}),
  d('6A80.3', 'Současná depresivní epizoda s melancholií', KAT.NALADA, {}),
  d('6A80.4', 'Sezónní průběh nástupu epizody nálady', KAT.NALADA, {}),
  d('6A80.5', 'Rychlé cyklování', KAT.NALADA, { mkn10: ['F38.10'] }),
  d('6A8Y', 'Poruchy nálady, jiné určené', KAT.NALADA, { mkn10: ['F38.8'] }),
  d('6A8Z', 'Poruchy nálady, neurčené', KAT.NALADA, { mkn10: ['F39'] }),

  // ═══════════════════════════════════════════════════════════
  // 6B0x ÚZKOSTNÉ PORUCHY
  // ═══════════════════════════════════════════════════════════

  d('6B00', 'Generalizovaná úzkostná porucha', KAT.UZKOST, {
    pod: 'GAD',
    popis: 'Volná úzkostnost nebo nadměrné obavy z negativních událostí ve více životních doménách; příznaky přetrvávají nejméně několik měsíců.',
    krit: [
      'Volná úzkostnost nebo nadměrné obavy z negativních událostí ve více životních doménách (rodina, zdraví, finance, práce)',
      'Doprovodné příznaky: svalové napětí nebo motorický neklid, autonomní hyperaktivita, nervozita, obtíže se soustředěním, dráždivost, poruchy spánku',
      'Příznaky přetrvávají nejméně několik měsíců, přítomny více dní než ne',
      'Způsobují výraznou tíseň nebo funkční postižení'
    ],
    priz: ['Nadměrné obavy', 'Svalové napětí', 'Únava', 'Poruchy spánku', 'Obtíže se soustředěním', 'Dráždivost', 'Palpitace'],
    mkn10: ['F41.1']
  }),

  d('6B01', 'Panická porucha', KAT.UZKOST, {
    pod: 'Panická porucha',
    popis: 'Opakované neočekávané záchvaty paniky + přetrvávající obavy z opakování nebo chování zaměřené na jejich předcházení.',
    krit: [
      'Opakované neočekávané záchvaty paniky neomezené na konkrétní podněty ani situace',
      'Záchvat paniky: intenzivní strach s rychlým nástupem palpitací, pocení, třesu, dušnosti, bolesti na hrudi, závratí, strachu z bezprostřední smrti',
      'Přetrvávající obavy z opakování záchvatů nebo chování zaměřené na jejich předcházení',
      'Způsobuje výrazné funkční postižení'
    ],
    priz: ['Náhlé záchvaty intenzivního strachu', 'Palpitace', 'Pocení', 'Třes', 'Dušnost', 'Bolest na hrudi', 'Závratě', 'Strach z bezprostřední smrti', 'Vyhýbavé chování'],
    mkn10: ['F41.0']
  }),

  d('6B02', 'Agorafobie', KAT.UZKOST, {
    popis: 'Výrazná a nadměrná úzkost nebo strach v situacích, kde by útěk mohl být obtížný nebo pomoc nedostupná; aktivní vyhýbání se těmto situacím.',
    krit: [
      'Výrazná a nadměrná úzkost nebo strach v situacích, kde by útěk mohl být obtížný nebo pomoc nedostupná',
      'Aktivní vyhýbání se takovým situacím nebo vstupování do nich s doprovodem nebo s intenzivním strachem',
      'Příznaky přetrvávají nejméně několik měsíců a způsobují výraznou tíseň nebo funkční postižení'
    ],
    mkn10: ['F40.0', 'F40.00', 'F40.01']
  }),

  d('6B03', 'Specifická fobie', KAT.UZKOST, {
    popis: 'Výrazná a nadměrná úzkost nebo strach konzistentně se objevující při expozici nebo anticipaci specifického objektu nebo situace (zvířata, výšky, krev, injekce, létání...).',
    krit: [
      'Výrazná a nadměrná úzkost nebo strach při expozici nebo anticipaci specifického podnětu',
      'Strach je nepřiměřený skutečnému nebezpečí',
      'Aktivní vyhýbání se nebo snášení s intenzivní úzkostí',
      'Příznaky přetrvávají nejméně několik měsíců'
    ],
    mkn10: ['F40.2']
  }),

  d('6B04', 'Sociální úzkostná porucha', KAT.UZKOST, {
    pod: 'Sociální fobie',
    popis: 'Výrazná a nadměrná úzkost nebo strach konzistentně se projevující v sociálních situacích s obavami z negativního hodnocení druhými.',
    krit: [
      'Výrazná a nadměrná úzkost nebo strach v sociálních situacích (konverzace, pozorování při jídle, vystupování)',
      'Obavy z negativního hodnocení druhými (ponížení, ostuda, odmítnutí)',
      'Aktivní vyhýbání se nebo snášení s intenzivní úzkostí',
      'Příznaky přetrvávají nejméně několik měsíců'
    ],
    mkn10: ['F40.1']
  }),

  d('6B05', 'Separační úzkostná porucha', KAT.UZKOST, {
    popis: 'Výrazná a nadměrná úzkost nebo strach ze separace od specifických osob citové vazby; přetrvává nejméně několik měsíců.',
    krit: [
      'Výrazná a nadměrná úzkost nebo strach ze separace od specifických osob citové vazby',
      'Projevy: myšlenky na újmu připadajícím osobám, odmítání školy/práce, výrazná tíseň při separaci, odmítání spát mimo domov',
      'Příznaky trvají nejméně několik měsíců a způsobují výraznou tíseň nebo funkční postižení'
    ],
    mkn10: ['F93.0']
  }),

  d('6B06', 'Selektivní mutismus', KAT.UZKOST, {
    popis: 'Konzistentní selektivita v mluvení – dítě mluví v určitých situacích, ale ne v jiných; spojená se sociální úzkostí.',
    krit: [
      'Konzistentní selhání ve mluvení v specifických sociálních situacích navzdory schopnosti mluvit v jiných',
      'Neschopnost mluvit je spojena se sociální úzkostí, ne s absencí znalosti jazyka',
      'Přetrvává nejméně 1 měsíc (neomezeno na první měsíc školní docházky)',
      'Způsobuje výrazné omezení vzdělávacích nebo pracovních výsledků nebo sociální komunikace'
    ],
    mkn10: ['F94.0']
  }),

  d('6B0Y', 'Úzkostné poruchy nebo poruchy související se strachem, jiné určené', KAT.UZKOST, { mkn10: ['F41.8'] }),
  d('6B0Z', 'Úzkostné poruchy nebo poruchy související se strachem, neurčené', KAT.UZKOST, { mkn10: ['F41.9'] }),

];

// Zapsat do souboru jako part1
fs.writeFileSync('mkn11-part1.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Part 1: ${data.length} záznamů zapsáno`);
