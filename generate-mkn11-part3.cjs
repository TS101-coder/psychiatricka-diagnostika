/**
 * MKN-11 data – Part 3: Látky + Impulzy + Disruptivní + Osobnost + Parafilní + Faktitivní + Neurokognitivní + Sekundární
 */
const fs = require('fs');
function d(id, nazev_cz, kategorie, opts = {}) {
  return { id, kod: id, nazev_cz, kategorie,
    podkategorie: opts.pod||null, popis: opts.popis||null,
    diagnosticka_kriteria: opts.krit||[], priznaky: opts.priz||[],
    prubeh: opts.prubeh||null, onset: opts.onset||null,
    mapovani_mkn10: opts.mkn10||[] };
}
const K = {
  LATKY: 'Poruchy způsobené užíváním návykových látek nebo návykovým chováním',
  IMPULZ: 'Poruchy kontroly impulzů',
  DISRUP: 'Rušivé chování nebo disociální poruchy',
  OSOBNOST: 'Poruchy osobnosti a související rysy',
  PARAFIL: 'Parafilní poruchy',
  FAKTIT: 'Faktitivní porucha',
  NEUROK: 'Neurokognitivní poruchy',
  SEKUND: 'Sekundární duševní nebo behaviorální syndromy',
  OSTATNI: 'Ostatní duševní, behaviorální nebo neurovývojové poruchy'
};

// ─── Substance use – helper pro generování subkódů ────────
function substance(parentId, parentName, mkn10parent, opts = {}) {
  const result = [];
  result.push(d(parentId, parentName, K.LATKY, {
    popis: opts.popis || `Porucha způsobená užíváním ${opts.latka || 'psychoaktivní látky'}, zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky.`,
    mkn10: opts.mkn10 || [mkn10parent]
  }));
  const sub = [
    ['.0', `Škodlivé epizodické užívání`, `${mkn10parent}.1`],
    ['.1', `Škodlivý vzorec užívání`, `${mkn10parent}.1`],
    ['.2', `Závislost`, `${mkn10parent}.2`],
    ['.3', `Intoxikace`, `${mkn10parent}.0`],
    ['.4', `Odvykací stav`, `${mkn10parent}.3`],
    ['.5', `Delirium`, `${mkn10parent}.4`],
    ['.6', `Psychotická porucha`, `${mkn10parent}.5`],
    ['.7', `Porucha nálady`, `${mkn10parent}.5`],
    ['.8', `Úzkostná porucha`, `${mkn10parent}.5`],
    ['.Y', `Jiné poruchy`, `${mkn10parent}.8`],
    ['.Z', `Neurčené poruchy`, `${mkn10parent}.9`],
  ];
  sub.forEach(([suf, nazev, m10]) => {
    const subName = opts.useNamePrefix
      ? `${opts.namePrefix || parentName}, ${nazev.toLowerCase()}`
      : `${nazev} způsobená/é ${opts.latka ? `užíváním ${opts.latka}` : 'užíváním látky'}`;
    result.push(d(parentId + suf, subName, K.LATKY, { mkn10: [m10] }));
  });
  return result;
}

const data = [

  // ─── 6C4x PORUCHY Z LÁTEK ─────────────────────────────────
  ...substance('6C40', 'Poruchy způsobené užíváním alkoholu', 'F10', { latka:'alkoholu', popis:'Poruchy způsobené užíváním alkoholu zahrnující škodlivé vzorce, závislost, intoxikaci, odvykací stav a alkoholem indukované poruchy.', mkn10:['F10'] }),
  ...substance('6C41', 'Poruchy způsobené užíváním kanabisu', 'F12', { latka:'kanabisu', mkn10:['F12'] }),
  ...substance('6C42', 'Poruchy způsobené užíváním syntetických kanabinoidů', 'F12', { latka:'syntetických kanabinoidů', mkn10:['F12'] }),
  ...substance('6C43', 'Poruchy způsobené užíváním opioidů', 'F11', { latka:'opioidů', mkn10:['F11'] }),
  ...substance('6C44', 'Poruchy způsobené užíváním sedativ, hypnotik nebo anxiolytik', 'F13', { latka:'sedativ, hypnotik nebo anxiolytik', mkn10:['F13'] }),
  ...substance('6C45', 'Poruchy způsobené užíváním kokainu', 'F14', { latka:'kokainu', mkn10:['F14'] }),
  ...substance('6C46', 'Poruchy způsobené užíváním stimulancií (amfetaminy, metamfetamin)', 'F15', { latka:'stimulancií (amfetaminy, metamfetamin)', mkn10:['F15'] }),
  ...substance('6C47', 'Poruchy způsobené užíváním syntetických katinonů', 'F15', { latka:'syntetických katinonů', mkn10:['F15'] }),
  ...substance('6C48', 'Poruchy způsobené užíváním kofeinu', 'F15', { latka:'kofeinu', mkn10:['F15'] }),
  ...substance('6C49', 'Poruchy způsobené užíváním halucinogenů', 'F16', { latka:'halucinogenů', mkn10:['F16'] }),
  ...substance('6C4A', 'Poruchy způsobené užíváním nikotinu', 'F17', { latka:'nikotinu', mkn10:['F17'] }),
  ...substance('6C4B', 'Poruchy způsobené užíváním těkavých inhalantů', 'F18', { latka:'těkavých inhalantů', mkn10:['F18'] }),
  ...substance('6C4C', 'Poruchy způsobené užíváním MDMA nebo příbuzných látek', 'F19', { latka:'MDMA nebo příbuzných látek', mkn10:['F19'] }),
  ...substance('6C4D', 'Poruchy způsobené disociačními drogami (ketamin, PCP)', 'F19', { latka:'disociačních drog (ketamin, PCP)', mkn10:['F19'] }),
  ...substance('6C4E', 'Poruchy způsobené anabolickými androgennými steroidy', 'F19', { latka:'anabolických androgenních steroidů', mkn10:['F19'] }),
  ...substance('6C4F', 'Poruchy způsobené nepsychoaktivními látkami', 'F55', { latka:'nepsychoaktivních látek', mkn10:['F55'] }),
  ...substance('6C4G', 'Poruchy způsobené neznámými nebo neurčenými látkami', 'F19', { latka:'neznámých nebo neurčených látek', mkn10:['F19'] }),
  ...substance('6C4H', 'Poruchy způsobené užíváním vícero látek nebo jiných psychoaktivních látek', 'F19', { latka:'vícero látek', mkn10:['F19'] }),

  // ─── 6C5x ZÁVISLOSTNÍ CHOVÁNÍ ─────────────────────────────
  d('6C50','Porucha hraní hazardních her', K.LATKY, {
    popis:'Přetrvávající nebo opakující se vzorec hazardní hry s narušenou kontrolou, narůstající prioritou hazardu a přetrvávání navzdory negativním důsledkům.',
    krit:['Přetrvávající vzorec hazardní hry způsobující výrazné postižení',
      'Narušená kontrola nad hazardní hrou',
      'Zvyšující se priorita hazardu před ostatními životními zájmy',
      'Přetrvávání navzdory negativním důsledkům',
      'Obvykle patrné nejméně 12 měsíců'],
    mkn10:['F63.0'] }),
  d('6C50.0','Porucha hraní hazardních her, převážně offline', K.LATKY, { mkn10:['F63.0'] }),
  d('6C50.1','Porucha hraní hazardních her, převážně online', K.LATKY, { mkn10:['F63.0'] }),
  d('6C50.Z','Porucha hraní hazardních her, neurčená', K.LATKY, { mkn10:['F63.0'] }),

  d('6C51','Porucha hraní digitálních her', K.LATKY, {
    popis:'Přetrvávající nebo opakující se vzorec hraní digitálních her s narušenou kontrolou, narůstající prioritou her a přetrvávání navzdory negativním důsledkům.',
    krit:['Přetrvávající vzorec hraní her způsobující výrazné postižení nebo tíseň',
      'Narušená kontrola nad hraním her',
      'Zvyšující se priorita hraní před ostatními aktivitami',
      'Přetrvávání navzdory negativním důsledkům',
      'Obvykle patrné nejméně 12 měsíců'],
    mkn10:['F63.8'] }),
  d('6C51.0','Porucha hraní digitálních her, převážně online', K.LATKY, { mkn10:['F63.8'] }),
  d('6C51.1','Porucha hraní digitálních her, převážně offline', K.LATKY, { mkn10:['F63.8'] }),
  d('6C51.Z','Porucha hraní digitálních her, neurčená', K.LATKY, { mkn10:['F63.8'] }),

  d('6C5Y','Poruchy způsobené návykovým chováním, jiné určené', K.LATKY, { mkn10:['F63.8'] }),
  d('6C5Z','Poruchy způsobené návykovým chováním, neurčené', K.LATKY, { mkn10:['F63.9'] }),

  // ─── 6C7x PORUCHY IMPULZŮ ─────────────────────────────────
  d('6C70','Pyromanie', K.IMPULZ, {
    popis:'Záměrné a cílevědomé zakládání požárů opakovaně; napětí nebo vzrušení před činem; fascinace ohněm; úleva nebo satisfakce po zapálení.',
    krit:['Záměrné zakládání požárů opakovaně',
      'Napětí nebo vzrušení před zakládáním požáru',
      'Fascinace, zájem nebo přitažlivost ohněm',
      'Úleva nebo satisfakce po zapálení',
      'Není způsobeno finančním ziskem, pomstou nebo bludy'],
    mkn10:['F63.1'] }),
  d('6C71','Kleptomanie', K.IMPULZ, {
    popis:'Opakující se selhání v odolání impulzu ke kradení předmětů, které nejsou nutné pro osobní použití ani pro jejich finanční hodnotu.',
    krit:['Opakující se selhání v odolání impulzu ke kradení věcí',
      'Věci nejsou nutné pro osobní použití ani pro jejich finanční hodnotu',
      'Narůstající napětí bezprostředně před krádeží',
      'Pocit uspokojení nebo úlevy při krádeži',
      'Krádež není způsobena hněvem, pomstou ani reakcí na bludy'],
    mkn10:['F63.2'] }),
  d('6C72','Kompulzivní porucha sexuálního chování', K.IMPULZ, {
    popis:'Přetrvávající vzorec nekontrolovatelného intenzivního, opakujícího se sexuálního impulzu vedoucího k opakovanému sexuálnímu chování způsobujícímu tíseň nebo postižení.',
    krit:['Přetrvávající vzorec intenzivního, opakujícího se sexuálního impulzu nebo nutkání',
      'Opakované sexuální chování způsobující tíseň nebo závažné funkční postižení',
      'Sexuální chování se stalo prioritou; zanedbávání zdraví nebo jiných aktivit',
      'Příznaky přetrvávají nejméně 6 měsíců'],
    mkn10:['F52.7','F63.8'] }),
  d('6C73','Intermitentní výbušná porucha', K.IMPULZ, {
    popis:'Opakující se epizody verbální nebo fyzické agresivity výrazně nepřiměřené provokaci nebo spouštěcím environmentálním podnětům.',
    krit:['Opakující se epizody verbální nebo fyzické agresivity nepřiměřené spouštěči',
      'Impulzivní agresivní činy vedou k fyzické újmě nebo majetkové škodě nebo verbální agresi',
      'Epizody nejsou projevem jiné duševní poruchy lépe vysvětlující agresivní chování'],
    mkn10:['F63.8'] }),
  d('6C7Y','Poruchy kontroly impulzů, jiné určené', K.IMPULZ, { mkn10:['F63.8'] }),
  d('6C7Z','Poruchy kontroly impulzů, neurčené', K.IMPULZ, { mkn10:['F63.9'] }),

  // ─── 6C9x RUŠIVÉ CHOVÁNÍ ──────────────────────────────────
  d('6C90','Porucha opozičního vzdoru', K.DISRUP, {
    popis:'Přetrvávající vzorec (≥6 měsíců) vzdorovitého, neposlušného, provokativního nebo zlostného chování přesahující vývojové normy; s nebo bez chronické dráždivosti.',
    krit:['Přetrvávající vzorec (≥6 měsíců) výrazně vzdorovitého, neposlušného, provokativního nebo zlostného chování',
      'Chování přesahuje vývojové normy a způsobuje výrazné funkční postižení',
      'Přítomno v různých prostředích'],
    mkn10:['F91.3'] }),
  d('6C90.0','Porucha opozičního vzdoru s chronickou podrážděností a hněvem', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.00','Porucha opozičního vzdoru s chronickou podrážděností a hněvem, s omezenými prosociálními emocemi', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.01','Porucha opozičního vzdoru s chronickou podrážděností a hněvem, s typickými prosociálními emocemi', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.0Z','Porucha opozičního vzdoru s chronickou podrážděností a hněvem, neurčená', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.1','Porucha opozičního vzdoru bez chronické podrážděnosti a hněvu', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.10','Porucha opozičního vzdoru bez chronické podrážděnosti a hněvu, s omezenými prosociálními emocemi', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.11','Porucha opozičního vzdoru bez chronické podrážděnosti a hněvu, s typickými prosociálními emocemi', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.1Z','Porucha opozičního vzdoru bez chronické podrážděnosti a hněvu, neurčená', K.DISRUP, { mkn10:['F91.3'] }),
  d('6C90.Z','Porucha opozičního vzdoru, neurčená', K.DISRUP, { mkn10:['F91.3'] }),

  d('6C91','Disociální porucha', K.DISRUP, {
    popis:'Opakující se a přetrvávající vzorec chování (≥12 měsíců) při němž jsou porušována základní práva ostatních nebo hlavní věkově přiměřené normy, pravidla nebo zákony.',
    krit:['Opakující se a přetrvávající vzorec chování porušující práva ostatních nebo společenské normy',
      'Zahrnuje: agresi vůči lidem nebo zvířatům, ničení majetku, podvod nebo krádeže, závažné porušování pravidel',
      'Vzorec přetrvává nejméně 12 měsíců',
      'Způsobuje výrazné funkční postižení'],
    mkn10:['F91'] }),
  d('6C91.0','Disociální porucha nastupující v dětství', K.DISRUP, { mkn10:['F91.0'] }),
  d('6C91.00','Disociální porucha nastupující v dětství, s omezenými prosociálními emocemi', K.DISRUP, { mkn10:['F91.0'] }),
  d('6C91.01','Disociální porucha nastupující v dětství, s typickými prosociálními emocemi', K.DISRUP, { mkn10:['F91.0'] }),
  d('6C91.0Z','Disociální porucha nastupující v dětství, neurčená', K.DISRUP, { mkn10:['F91.0'] }),
  d('6C91.1','Disociální porucha nastupující v dospívání', K.DISRUP, { mkn10:['F91.1'] }),
  d('6C91.10','Disociální porucha nastupující v dospívání, s omezenými prosociálními emocemi', K.DISRUP, { mkn10:['F91.1'] }),
  d('6C91.11','Disociální porucha nastupující v dospívání, s typickými prosociálními emocemi', K.DISRUP, { mkn10:['F91.1'] }),
  d('6C91.1Y','Disociální porucha nastupující v dospívání, jiné určené', K.DISRUP, { mkn10:['F91.1'] }),
  d('6C91.Z','Disociální porucha, neurčená', K.DISRUP, { mkn10:['F91.9'] }),

  d('6C9Y','Rušivé chování nebo disociální poruchy, jiné určené', K.DISRUP, { mkn10:['F91.8'] }),
  d('6C9Z','Rušivé chování nebo disociální poruchy, neurčené', K.DISRUP, { mkn10:['F91.9'] }),

  // ─── 6D1x PORUCHY OSOBNOSTI ───────────────────────────────
  d('6D10','Porucha osobnosti', K.OSOBNOST, {
    popis:'Trvalá porucha projevující se problémy ve fungování vlastního já a/nebo mezilidskými dysfunkcemi; přetrvává nejméně 2 roky; maladaptivní vzorce v různých situacích.',
    krit:['Trvalá porucha ve fungování vlastního já (identita, sebeúcta, sebeurčení) a/nebo mezilidskými dysfunkcemi',
      'Porucha přetrvává nejméně 2 roky a je patrná v širokém spektru situací',
      'Projevuje se maladaptivními vzorci kognice, emocionálního prožívání a chování',
      'Způsobuje výraznou tíseň nebo funkční postižení',
      'Není způsobena jiným duševním onemocněním ani účinky látky'],
    prubeh:'Trvalý vzorec od adolescence nebo ranné dospělosti.',
    onset:'Typicky do 25 let.',
    mkn10:['F60'] }),
  d('6D10.0','Lehká forma poruchy osobnosti', K.OSOBNOST, {
    popis:'Problémy ve fungování vlastního já nebo mezilidské dysfunkce přítomny, ale obecné kapacity fungování zachovány.',
    mkn10:['F60.9'] }),
  d('6D10.1','Středně těžká porucha osobnosti', K.OSOBNOST, {
    popis:'Výrazné problémy ve fungování vlastního já nebo mezilidské dysfunkce v více oblastech.',
    mkn10:['F60.9'] }),
  d('6D10.2','Těžká porucha osobnosti', K.OSOBNOST, {
    popis:'Závažné a rozsáhlé problémy ve fungování vlastního já nebo mezilidské dysfunkce.',
    mkn10:['F60.9'] }),
  d('6D10.Z','Porucha osobnosti, neurčená tíže', K.OSOBNOST, { mkn10:['F60.9'] }),

  d('6D11','Výrazné osobnostní rysy nebo vzorce', K.OSOBNOST, {
    popis:'Osobnostní rysy nebo vzorce, které jsou klinicky pozoruhodné, ale nedosahují plných kritérií pro poruchu osobnosti.',
    mkn10:['F60.8'] }),
  d('6D11.0','Negativní afektivita u poruch osobnosti nebo osobnostních obtížích', K.OSOBNOST, {
    popis:'Tendence prožívat širokou škálu negativních emocí nepřiměřenou situaci; zahrnuje emocionální nestabilitu, úzkostnost, separační úzkost, nízké sebevědomí.',
    mkn10:['F60.3'] }),
  d('6D11.1','Odtažitost u poruchy osobnosti nebo osobnostních obtíží', K.OSOBNOST, {
    popis:'Tendence udržovat si sociální distanci; zahrnuje sociální odtažitost, omezené emocionální prožívání a vyjadřování.',
    mkn10:['F60.1'] }),
  d('6D11.2','Disocialita u poruchy osobnosti nebo osobnostních obtíží', K.OSOBNOST, {
    popis:'Nezájem o práva a pocity druhých; zahrnuje bezohlednost, agresi, neschopnost empatie.',
    mkn10:['F60.2'] }),
  d('6D11.3','Dezinhibice u poruchy osobnosti nebo osobnostních obtíží', K.OSOBNOST, {
    popis:'Tendence k impulzivnímu jednání bez reflexe; zahrnuje impulzivitu, lehkomyslnost, neschopnost plánovat.',
    mkn10:['F60.3'] }),
  d('6D11.4','Anankasmus u poruchy osobnosti nebo osobnostních obtíží', K.OSOBNOST, {
    popis:'Úzce zaměřené perfekcionistické a rigidní chování; zahrnuje rigidní perfekcionismus, kontrolu, lpění na pravidlech, neflexibilitu.',
    mkn10:['F60.5'] }),
  d('6D11.5','Hraniční vzorec', K.OSOBNOST, {
    popis:'Vzorec zahrnující intenzivní nestabilní vztahy, sebepoškozenicí nebo suicidální chování, nestabilní sebeobraz, chronické pocity prázdnoty, intenzivní emocionální dysregulaci.',
    mkn10:['F60.31'] }),
  d('6D1Y','Poruchy osobnosti nebo příbuzné rysy, jiné určené', K.OSOBNOST, { mkn10:['F60.8'] }),
  d('6D1Z','Poruchy osobnosti nebo příbuzné rysy, neurčené', K.OSOBNOST, { mkn10:['F60.9'] }),

  // ─── 6D3x PARAFILNÍ PORUCHY ───────────────────────────────
  d('6D30','Exhibicionistická porucha', K.PARAFIL, {
    popis:'Přetrvávající a intenzivní vzorec sexuálního vzrušení z odhalování genitálií nebo pohlavního styku nesouhlasícím jedincům; způsobuje tíseň nebo realizovaný jednáním.',
    mkn10:['F65.2'] }),
  d('6D31','Voyeristická porucha', K.PARAFIL, {
    popis:'Přetrvávající a intenzivní sexuální vzrušení z pozorování jiné osoby svlékající se nebo zapojené do sexuální aktivity bez jejího vědomí.',
    mkn10:['F65.3'] }),
  d('6D32','Pedofilní porucha', K.PARAFIL, {
    popis:'Přetrvávající, intenzivní a opakující se sexuální vzrušení zaměřené na prepubertální děti; způsobuje tíseň nebo je realizované.',
    krit:['Přetrvávající, intenzivní a opakující se sexuální vzrušení zaměřené na prepubertální děti',
      'Způsobuje klinicky závažnou tíseň nebo je realizované nebo je ohroženy bezpečnost dítěte',
      'Jedinec je ve věku ≥16 let a nejméně 5 let starší než dítě'],
    mkn10:['F65.4'] }),
  d('6D33','Porucha sexuálního sadismu', K.PARAFIL, {
    popis:'Přetrvávající, intenzivní a opakující se vzorec sexuálního vzrušení z působení fyzické nebo psychické bolesti, ponižování nebo utrpení nesouhlasícímu jedinci.',
    mkn10:['F65.5'] }),
  d('6D34','Frotteuristická porucha', K.PARAFIL, {
    popis:'Přetrvávající, intenzivní a opakující se vzorec sexuálního vzrušení z dotýkání nebo tření se o nesouhlasícího jedince.',
    mkn10:['F65.8'] }),
  d('6D35','Jiné parafilní poruchy s účastí nesouhlasících osob', K.PARAFIL, { mkn10:['F65.8'] }),
  d('6D36','Parafilní porucha s chováním o samotě nebo s účastí souhlasících osob', K.PARAFIL, { mkn10:['F65.6','F65.8'] }),
  d('6D3Z','Parafilní poruchy, neurčené', K.PARAFIL, { mkn10:['F65.9'] }),

  // ─── 6D5x FAKTITIVNÍ PORUCHA ──────────────────────────────
  d('6D50','Faktitivní porucha zaměřená na sebe sama', K.FAKTIT, {
    popis:'Záměrné předstírání, napodobování nebo vyvolávání fyzických nebo psychologických příznaků nebo poranění bez zjevného vnějšího motivu (ne pro finanční zisk).',
    krit:['Záměrné předstírání nebo způsobování fyzických nebo psychologických příznaků',
      'Chování není motivováno jinými vnějšími odměnami (finanční zisk, vyhnutí se závazku)',
      'Chování přetrvává i po konfrontaci'],
    mkn10:['F68.1'] }),
  d('6D51','Faktitivní porucha zaměřená na druhou osobu', K.FAKTIT, {
    popis:'Záměrné předstírání, napodobování nebo vyvolávání příznaků u jiné osoby (typicky dítě), nikoliv u sebe samotného (Münchhausenův syndrom by proxy).',
    mkn10:['F68.1'] }),
  d('6D5Z','Faktitivní porucha, neurčená', K.FAKTIT, { mkn10:['F68.1'] }),

  // ─── 6D7x, 6D8x NEUROKOGNITIVNÍ PORUCHY ─────────────────
  d('6D70','Delirium', K.NEUROK, {
    popis:'Porucha pozornosti, orientace a vědomí rozvíjející se v krátké době (hodiny až dny); příznaky typicky kolísají v průběhu dne.',
    krit:['Porucha pozornosti, orientace a vědomí rozvíjející se v krátké době',
      'Příznaky typicky kolísají v průběhu dne',
      'Může zahrnovat kognitivní deficity, behaviorální nebo emocionální poruchy, narušení cyklu spánku a bdění',
      'Příčina: jiné onemocnění, psychoaktivní látky/léky nebo kombinace'],
    priz:['Zmatenost','Dezorientace','Kolísání vědomí','Halucinace (typicky zrakové)','Neklid nebo ospalost','Poruchy spánku'],
    prubeh:'Typicky reverzibilní při léčbě příčiny; trvá dny až týdny.',
    mkn10:['F05'] }),
  d('6D70.0','Delirium způsobené onemocněním zařazeným jinde', K.NEUROK, { mkn10:['F05.0','F05.1'] }),
  d('6D70.1','Delirium způsobené psychoaktivními látkami včetně léků', K.NEUROK, { mkn10:['F10.4'] }),
  d('6D70.2','Delirium způsobené vícero etiologickými faktory', K.NEUROK, { mkn10:['F05.8'] }),
  d('6D70.Y','Delirium, jiná určená příčina', K.NEUROK, { mkn10:['F05.8'] }),
  d('6D70.Z','Delirium, neurčená nebo neznámá příčina', K.NEUROK, { mkn10:['F05.9'] }),

  d('6D71','Mírná neurokognitivní porucha', K.NEUROK, {
    popis:'Mírný pokles kognitivního výkonu z předchozí úrovně; každodenní aktivity zachovány, ale mohou vyžadovat větší úsilí.',
    krit:['Mírný pokles kognitivního výkonu z předchozí úrovně (typicky 1–2 SD pod normou)',
      'Každodenní aktivity jsou zachovány, ale mohou vyžadovat větší úsilí nebo kompenzační strategie',
      'Příznaky nejsou způsobeny delirantním stavem ani jinou duševní poruchou'],
    mkn10:['F06.7'] }),

  d('6D72','Amnestická porucha', K.NEUROK, {
    popis:'Výrazná porucha paměti bez jiného výrazného kognitivního postižení; obtíže s pořizováním, učením nebo uchováváním nových informací.',
    krit:['Výrazná porucha paměti bez poruchy vědomí nebo deliria',
      'Obtíže s pořizováním, učením nebo uchováváním nových informací; recentní paměť typicky více postižena',
      'Bez jiného výrazného kognitivního postižení (diferenciace od demence)',
      'Způsobuje výrazné funkční postižení'],
    mkn10:['F04'] }),
  d('6D72.0','Amnestická porucha způsobená onemocněními zařazenými jinde', K.NEUROK, { mkn10:['F04'] }),
  d('6D72.1','Amnestická porucha způsobená psychoaktivními látkami včetně léků', K.NEUROK, { mkn10:['F10.6'] }),
  d('6D72.10','Amnestická porucha způsobená užíváním alkoholu', K.NEUROK, { mkn10:['F10.6'] }),
  d('6D72.11','Amnestická porucha způsobená užíváním sedativ, hypnotik nebo anxiolytik', K.NEUROK, { mkn10:['F13.6'] }),
  d('6D72.12','Amnestická porucha způsobená jinou určenou psychoaktivní látkou včetně léků', K.NEUROK, { mkn10:['F19.6'] }),
  d('6D72.13','Amnestická porucha způsobená užíváním těkavých látek', K.NEUROK, { mkn10:['F18.6'] }),
  d('6D72.Y','Amnestická porucha, jiná určená příčina', K.NEUROK, { mkn10:['F04'] }),
  d('6D72.Z','Amnestická porucha, neznámá nebo neurčená příčina', K.NEUROK, { mkn10:['F04'] }),

  // Demence (v ICD-11 v Kapitole 08 – Onemocnění nervového systému)
  d('6D80','Demence způsobená Alzheimerovou chorobou', K.NEUROK, {
    popis:'Primárně degenerativní demence s plíživým nástupem a postupnou progresí; typicky začíná poruchou paměti.',
    krit:['Plíživý nástup; první stížností je typicky porucha paměti',
      'Pomalý, ale trvalý pokles kognitivního výkonu z předchozí úrovně',
      'Zhoršení v dalších kognitivních doménách (exekutivní funkce, jazyk, pozornost, visuopercepce)',
      'Pozitivní genetické testování, rodinná anamnéza nebo zobrazovací metody podporují diagnózu'],
    mkn10:['F00'] }),
  d('6D80.0','Demence způsobená Alzheimerovou chorobou, s časným nástupem', K.NEUROK, { mkn10:['F00.0'] }),
  d('6D80.1','Demence způsobená Alzheimerovou chorobou, s pozdním nástupem', K.NEUROK, { mkn10:['F00.1'] }),
  d('6D80.2','Demence způsobená Alzheimerovou chorobou, smíšený typ s cerebrovaskulárním onemocněním', K.NEUROK, { mkn10:['F00.2'] }),
  d('6D80.3','Demence způsobená Alzheimerovou chorobou, smíšený typ s jinými nevaskulárními etiologiemi', K.NEUROK, { mkn10:['F00.2'] }),
  d('6D80.Z','Demence způsobená Alzheimerovou chorobou, s neznámým nebo neurčeným nástupem', K.NEUROK, { mkn10:['F00.9'] }),

  d('6D81','Demence způsobená cerebrovaskulárním onemocněním', K.NEUROK, {
    popis:'Demence způsobená ischemickým nebo hemoragickým poškozením mozkového parenchymu; nástup kognitivních deficitů časově spojen s cerebrovaskulárními příhodami.',
    krit:['Nástup kognitivních deficitů časově spojen s cerebrovaskulárními příhodami',
      'Kognitivní pokles typicky nejzřetelnější v rychlosti zpracování informací, pozornosti a frontálně-exekutivní oblasti',
      'Průkaz cerebrovaskulárního onemocnění z anamnézy, vyšetření a neuroimagingu'],
    mkn10:['F01'] }),

  d('6D82','Demence způsobená onemocněním Lewyho tělísek', K.NEUROK, {
    popis:'Demence s fluktuující kognicí, zrakovými halucinacemi, parkinsonismem a poruchami spánku ve fázi REM.',
    mkn10:['F02.8'] }),

  d('6D83','Frontotemporální demence', K.NEUROK, {
    popis:'Progresivní demence s frontální nebo temporální lobární degenerací; dominují změny osobnosti a chování nebo jazykové poruchy.',
    mkn10:['F02.0'] }),

  d('6D84','Demence způsobená psychoaktivními látkami včetně léků', K.NEUROK, { mkn10:['F10.7','F19.7'] }),
  d('6D84.0','Demence způsobená užíváním alkoholu', K.NEUROK, { mkn10:['F10.7'] }),
  d('6D84.1','Demence způsobená užíváním sedativ, hypnotik nebo anxiolytik', K.NEUROK, { mkn10:['F13.7'] }),
  d('6D84.2','Demence způsobená používáním těkavých látek', K.NEUROK, { mkn10:['F18.7'] }),
  d('6D84.Y','Demence způsobená jinými určenými psychoaktivními látkami', K.NEUROK, { mkn10:['F19.7'] }),

  d('6D85','Demence způsobená onemocněními zařazenými jinde', K.NEUROK, { mkn10:['F02'] }),
  d('6D85.0','Demence způsobená Parkinsonovou chorobou', K.NEUROK, { mkn10:['F02.3'] }),
  d('6D85.1','Demence způsobená Huntingtonovou chorobou', K.NEUROK, { mkn10:['F02.2'] }),
  d('6D85.2','Demence způsobená expozicí těžkým kovům a dalším toxinům', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D85.3','Demence způsobená virem lidské imunodeficience', K.NEUROK, { mkn10:['F02.4'] }),
  d('6D85.4','Demence způsobená roztroušenou sklerózou', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D85.5','Demence způsobená prionovým onemocněním', K.NEUROK, { mkn10:['F02.1'] }),
  d('6D85.6','Demence způsobená normotenzním hydrocefalem', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D85.7','Demence způsobená poraněním hlavy', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D85.8','Demence způsobená pelagrou', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D85.9','Demence způsobená Downovým syndromem', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D85.Y','Demence způsobená jinými určenými onemocněními zařazenými jinde', K.NEUROK, { mkn10:['F02.8'] }),

  d('6D86','Demence s poruchami chování nebo psychickými poruchami', K.NEUROK, { mkn10:['F06'] }),
  d('6D86.0','Demence s psychotickými příznaky', K.NEUROK, { mkn10:['F06.2'] }),
  d('6D86.1','Demence s příznaky poruchy nálady', K.NEUROK, { mkn10:['F06.3'] }),
  d('6D86.2','Demence s příznaky úzkosti', K.NEUROK, { mkn10:['F06.4'] }),
  d('6D86.3','Demence s projevem apatie', K.NEUROK, { mkn10:['F06.6'] }),
  d('6D86.4','Demence s projevy agitovanosti nebo agrese', K.NEUROK, { mkn10:['F07'] }),
  d('6D86.5','Demence s projevy dezinhibice', K.NEUROK, { mkn10:['F07.0'] }),
  d('6D86.6','Demence s projevy toulavosti', K.NEUROK, { mkn10:['F07'] }),
  d('6D86.Y','Demence s poruchami chování nebo psychickými poruchami, jiné určené', K.NEUROK, { mkn10:['F06.8'] }),
  d('6D86.Z','Demence s poruchami chování nebo psychickými poruchami, neurčené', K.NEUROK, { mkn10:['F06.9'] }),

  d('6D8Y','Demence, jiná určená příčina', K.NEUROK, { mkn10:['F02.8'] }),
  d('6D8Z','Demence, neznámá nebo neurčená příčina', K.NEUROK, { mkn10:['F03'] }),

  // ─── 6E6x SEKUNDÁRNÍ SYNDROMY ─────────────────────────────
  d('6E60','Sekundární neurovývojový syndrom', K.SEKUND, { mkn10:['F06'] }),
  d('6E60.0','Sekundární řečový nebo jazykový syndrom', K.SEKUND, { mkn10:['F06'] }),
  d('6E60.Y','Sekundární neurovývojový syndrom, jiný určený', K.SEKUND, { mkn10:['F06.8'] }),
  d('6E60.Z','Sekundární neurovývojový syndrom, neurčený', K.SEKUND, { mkn10:['F06.9'] }),

  d('6E61','Sekundární psychotický syndrom', K.SEKUND, { mkn10:['F06.2'] }),
  d('6E61.0','Sekundární psychotický syndrom s halucinacemi', K.SEKUND, { mkn10:['F06.0'] }),
  d('6E61.1','Sekundární psychotický syndrom s bludy', K.SEKUND, { mkn10:['F06.2'] }),
  d('6E61.2','Sekundární psychotický syndrom s halucinacemi a bludy', K.SEKUND, { mkn10:['F06.2'] }),
  d('6E61.3','Sekundární psychotický syndrom s neurčenými příznaky', K.SEKUND, { mkn10:['F06.9'] }),

  d('6E62','Sekundární porucha nálady', K.SEKUND, { mkn10:['F06.3'] }),
  d('6E62.0','Syndrom symptomatické poruchy nálady, s příznaky deprese', K.SEKUND, { mkn10:['F06.32'] }),
  d('6E62.1','Syndrom symptomatické poruchy nálady, s příznaky mánie', K.SEKUND, { mkn10:['F06.30'] }),
  d('6E62.2','Syndrom symptomatické poruchy nálady, se smíšenými příznaky', K.SEKUND, { mkn10:['F06.33'] }),
  d('6E62.3','Syndrom symptomatické poruchy nálady, s blíže neurčenými příznaky', K.SEKUND, { mkn10:['F06.3'] }),

  d('6E63','Syndrom symptomatické úzkosti', K.SEKUND, { mkn10:['F06.4'] }),
  d('6E64','Sekundární obsedantně-kompulzivní nebo příbuzný syndrom', K.SEKUND, { mkn10:['F06.8'] }),
  d('6E65','Sekundární disociativní syndrom', K.SEKUND, { mkn10:['F06.5'] }),
  d('6E66','Syndrom sekundární kontroly impulzů', K.SEKUND, { mkn10:['F07'] }),
  d('6E67','Sekundární neurokognitivní syndrom', K.SEKUND, { mkn10:['F06.7'] }),
  d('6E68','Sekundární změna osobnosti', K.SEKUND, { mkn10:['F07.0'] }),
  d('6E69','Syndrom symptomatické katatonie', K.SEKUND, { mkn10:['F06.1'] }),
  d('6E6Y','Sekundární psychický nebo behaviorální syndrom, jiný určený', K.SEKUND, { mkn10:['F06.8'] }),
  d('6E6Z','Sekundární psychický nebo behaviorální syndrom, neurčený', K.SEKUND, { mkn10:['F06.9'] }),

  // ─── Poruchy spojené s těhotenstvím ──────────────────────
  d('6E20','Duševní poruchy spojené s těhotenstvím, porodem nebo šestinedělím, bez psychotických příznaků', K.OSTATNI, {
    popis:'Duševní nebo behaviorální poruchy s nástupem v průběhu těhotenství nebo do 6 týdnů po porodu; bez psychotických příznaků.',
    mkn10:['F53.0'] }),
  d('6E21','Duševní nebo behaviorální poruchy spojené s těhotenstvím, porodem nebo šestinedělím, s psychotickými příznaky', K.OSTATNI, {
    popis:'Závažné duševní poruchy s psychotickými příznaky spojené s těhotenstvím nebo šestinedělím.',
    mkn10:['F53.1'] }),
  d('6E2Z','Duševní poruchy spojené s těhotenstvím, porodem nebo šestinedělím, neurčené', K.OSTATNI, { mkn10:['F53.9'] }),

  // ─── Psychologické faktory ────────────────────────────────
  d('6E40','Psychologické faktory nebo faktory chování ovlivňující poruchy nebo onemocnění zařazené jinde', K.OSTATNI, {
    popis:'Psychologické nebo behaviorální faktory, které negativně ovlivňují průběh nebo léčbu jiného onemocnění.',
    mkn10:['F54'] }),
  d('6E40.0','Duševní porucha ovlivňující poruchy nebo onemocnění zařazené jinde', K.OSTATNI, { mkn10:['F54'] }),
  d('6E40.1','Psychologické příznaky ovlivňující poruchy nebo onemocnění zařazené jinde', K.OSTATNI, { mkn10:['F54'] }),
  d('6E40.2','Osobnostní rysy nebo styl zvládání situací ovlivňující poruchy nebo onemocnění zařazené jinde', K.OSTATNI, { mkn10:['F54'] }),
  d('6E40.3','Maladaptivní chování ovlivňující poruchy nebo onemocnění zařazené jinde', K.OSTATNI, { mkn10:['F54'] }),
  d('6E40.4','Fyziologická reakce související se stresem ovlivňující poruchy nebo onemocnění zařazené jinde', K.OSTATNI, { mkn10:['F54'] }),
  d('6E40.Y','Psychologické faktory nebo faktory chování ovlivňující onemocnění, jiné určené', K.OSTATNI, { mkn10:['F54'] }),
  d('6E40.Z','Psychologické faktory nebo faktory chování ovlivňující onemocnění, neurčené', K.OSTATNI, { mkn10:['F54'] }),

  // ─── Ostatní ─────────────────────────────────────────────
  d('6E8Y','Duševní, behaviorální nebo neurovývojové poruchy, jiné určené', K.OSTATNI, { mkn10:['F99'] }),
  d('6E8Z','Duševní, behaviorální nebo neurovývojové poruchy, neurčené', K.OSTATNI, { mkn10:['F99'] }),
];

fs.writeFileSync('mkn11-part3.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Part 3: ${data.length} záznamů`);
