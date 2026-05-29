/**
 * MKN-11 data – Part 2: OKP + Stres + Disociace + Jídlo + Vylučování + Tělo
 */
const fs = require('fs');

function d(id, nazev_cz, kategorie, opts = {}) {
  return { id, kod: id, nazev_cz, kategorie,
    podkategorie: opts.pod || null, popis: opts.popis || null,
    diagnosticka_kriteria: opts.krit || [], priznaky: opts.priz || [],
    prubeh: opts.prubeh || null, onset: opts.onset || null,
    mapovani_mkn10: opts.mkn10 || [] };
}

const K = {
  OKP:   'Obsedantně-kompulzivní nebo příbuzné poruchy',
  STRES: 'Poruchy specificky spojené se stresem',
  DISOC: 'Disociativní poruchy',
  JIDLO: 'Poruchy příjmu potravy a stravovacího chování',
  VYLUC: 'Poruchy vylučování',
  TELO:  'Poruchy tělesné úzkosti nebo tělesných prožitků',
};

const data = [
  // ─── 6B2x OKP ────────────────────────────────────────────
  d('6B20','Obsedantně-kompulzivní porucha', K.OKP, {
    popis:'Přetrvávající obsese nebo kompulze nebo obojí; jsou časově náročné nebo způsobují výraznou tíseň.',
    krit:['Přetrvávající obsese nebo kompulze nebo nejčastěji obojí',
      'Obsese: opakující se vtíravé myšlenky, obrazy nebo impulzy asociované s úzkostí',
      'Kompulze: opakující se chování nebo mentální akty v reakci na obsesi nebo podle přísných pravidel',
      'Obsese a kompulze jsou časově náročné (>1 hod/den) nebo způsobují výraznou tíseň či funkční postižení'],
    priz:['Vtíravé myšlenky','Rituální chování','Mytí rukou','Kontrolování','Počítání','Potřeba symetrie'],
    prubeh:'Chronický, bez léčby postupně narůstající; s léčbou výrazné zlepšení.',
    onset:'Typicky v adolescenci nebo ranné dospělosti.',
    mkn10:['F42'] }),
  d('6B20.0','Obsedantně-kompulzivní porucha s dostatečným až dobrým náhledem', K.OKP, { mkn10:['F42.9'] }),
  d('6B20.1','Obsedantně-kompulzivní porucha s nedostatečným až chybějícím náhledem', K.OKP, { mkn10:['F42.9'] }),
  d('6B20.Z','Obsedantně-kompulzivní porucha, neurčená', K.OKP, { mkn10:['F42.9'] }),

  d('6B21','Tělesná dysmorfická porucha', K.OKP, {
    popis:'Přetrvávající zaobírání se jedním nebo více vnímanými defekty nebo vadami fyzického vzhledu, které jsou ostatními nepozorovatelné nebo se jeví jako nepatrné.',
    krit:['Přetrvávající zaobírání se vnímanými defekty nebo vadami fyzického vzhledu nepozorovatelné ostatními',
      'Opakované chování v reakci na toto zaobírání (kontrolování v zrcadle, maskování, vyhledávání ujištění)',
      'Způsobuje výraznou tíseň nebo funkční postižení'],
    mkn10:['F45.2'] }),
  d('6B21.0','Tělesná dysmorfická porucha s dostatečným až dobrým náhledem', K.OKP, { mkn10:['F45.2'] }),
  d('6B21.1','Tělesná dysmorfická porucha s nedostatečným až chybějícím náhledem', K.OKP, { mkn10:['F45.2'] }),
  d('6B21.Z','Tělesná dysmorfická porucha, neurčená', K.OKP, { mkn10:['F45.2'] }),

  d('6B22','Čichová vztahovačná porucha', K.OKP, {
    popis:'Přetrvávající přesvědčení o vydávání nepříjemného tělesného zápachu, který ostatní nevnímají; doprovázeno opakujícím se chováním v reakci na toto přesvědčení.',
    mkn10:['F45.8'] }),
  d('6B22.0','Čichová vztahovačná porucha s dostatečným až dobrým náhledem', K.OKP, {}),
  d('6B22.1','Čichová vztahovačná porucha s nedostatečným až chybějícím náhledem', K.OKP, {}),
  d('6B22.Z','Čichová vztahovačná porucha, neurčená', K.OKP, {}),

  d('6B23','Hypochondrická porucha', K.OKP, {
    popis:'Přetrvávající obavy nebo přesvědčení o přítomnosti závažného onemocnění; doprovázené nadměrným zdravotnickým vyhledáváním nebo vyhýbáním se.',
    krit:['Přetrvávající obavy o přítomnost závažného, progresivního nebo život ohrožujícího onemocnění',
      'Opakované zdravotnické vyhledávání nebo vyhýbání se lékařům ze strachu z diagnózy',
      'Příznaky přetrvávají nejméně několik měsíců',
      'Způsobují výraznou tíseň nebo funkční postižení'],
    mkn10:['F45.2'] }),
  d('6B23.0','Hypochondrická porucha s dostatečným až dobrým náhledem', K.OKP, { mkn10:['F45.2'] }),
  d('6B23.1','Hypochondrická porucha s nedostatečným až chybějícím náhledem', K.OKP, { mkn10:['F45.2'] }),
  d('6B23.Z','Hypochondrická porucha, neurčená', K.OKP, { mkn10:['F45.2'] }),

  d('6B24','Porucha hromadění', K.OKP, {
    popis:'Přetrvávající obtíže s vyhazováním věcí bez ohledu na jejich skutečnou hodnotu; doprovázené vnímáním potřeby věci uchovat a tísní spojenou s jejich vyhazováním.',
    krit:['Přetrvávající obtíže s vyhazováním věcí bez ohledu na jejich skutečnou hodnotu',
      'Vnímání potřeby věci zachovat a tíseň spojenou s vyhazováním',
      'Nahromadění věcí způsobuje přeplnění životního prostoru',
      'Způsobuje výraznou tíseň nebo funkční postižení'],
    mkn10:['F63.8'] }),
  d('6B24.0','Porucha hromadění s dostatečným až dobrým náhledem', K.OKP, {}),
  d('6B24.1','Porucha hromadění s nedostatečným až chybějícím náhledem', K.OKP, {}),
  d('6B24.Z','Porucha hromadění, neurčená', K.OKP, {}),

  d('6B25','Repetitivní poruchy chování zaměřené na tělo', K.OKP, {
    popis:'Opakující se kompulzivní chování zaměřené na tělo způsobující tíseň nebo funkční postižení.',
    mkn10:['F63.8'] }),
  d('6B25.0','Trichotilomanie', K.OKP, {
    popis:'Opakované vytrhávání vlastních vlasů s výsledným vypadáváním vlasů.',
    mkn10:['F63.3'] }),
  d('6B25.1','Exkoriační porucha', K.OKP, {
    popis:'Opakované drbání nebo škrábání kůže způsobující kožní léze.',
    mkn10:['F63.8'] }),
  d('6B25.Y','Repetitivní poruchy chování zaměřené na tělo, jiné určené', K.OKP, { mkn10:['F63.8'] }),
  d('6B25.Z','Repetitivní poruchy chování zaměřené na tělo, neurčené', K.OKP, {}),

  d('6B2Y','Obsedantně-kompulzivní nebo příbuzné poruchy, jiné určené', K.OKP, { mkn10:['F42.8'] }),
  d('6B2Z','Obsedantně-kompulzivní nebo příbuzné poruchy, neurčené', K.OKP, { mkn10:['F42.9'] }),

  // ─── 6B4x STRESOVÉ PORUCHY ───────────────────────────────
  d('6B40','Posttraumatická stresová porucha', K.STRES, {
    popis:'Porucha vznikající po expozici extrémně ohrožující nebo hrůzné události; charakterizovaná znovuprožíváním, vyhýbáním se a přetrvávajícím vnímáním zvýšeného ohrožení.',
    krit:['Expozice extrémně ohrožující nebo hrůzné události',
      'Znovuprožívání: živé vtíravé vzpomínky, flashbacky nebo noční můry s intenzivním strachem',
      'Vyhýbání se: myšlenkám a vzpomínkám nebo situacím, které událost připomínají',
      'Přetrvávající vnímání zvýšeného aktuálního ohrožení: hypervigilance nebo zvýšená startovací reakce',
      'Příznaky přetrvávají nejméně několik týdnů a způsobují výrazné funkční postižení'],
    priz:['Flashbacky','Noční můry','Hypervigilance','Vyhýbání se spouštěčům','Emocionální otupělost','Poruchy spánku'],
    prubeh:'Chronický bez léčby; se správnou léčbou (EMDR, CBT) dobré výsledky.',
    onset:'Do 6 měsíců od traumatické události.',
    mkn10:['F43.1'] }),

  d('6B41','Komplexní posttraumatická stresová porucha', K.STRES, {
    popis:'Rozvinutá po expozici extrémně ohrožující nebo hrůzné události nebo sérii takových událostí, typicky prolongovaných nebo opakujících se; zahrnuje příznaky PTSD + poruchy v afektivní regulaci, sebepojetí a vztazích.',
    krit:['Splněna kritéria PTSD (6B40)',
      'Těžké a přetrvávající problémy s regulací afektu',
      'Přetrvávající negativní přesvědčení o sobě samém (pocity bezcennosti, selhání, studu)',
      'Přetrvávající obtíže s udržením vztahů a pocitem blízkosti s druhými'],
    mkn10:['F43.1'] }),

  d('6B42','Prodloužené truchlení', K.STRES, {
    popis:'Perzistentní a pervazivní zármutek nad ztrátou osoby přesahující normativní kulturní a sociální normy; intenzivní touha po zemřelém a obtíže přijmout ztrátu přetrvávající >6 měsíců.',
    krit:['Smrt blízké osoby',
      'Přetrvávající a pervazivní zármutek přesahující normativní kulturní a sociální normy (>6 měsíců)',
      'Intenzivní touha po zemřelém nebo přetrvávající zaobírání se zemřelým',
      'Způsobuje výraznou tíseň nebo funkční postižení'],
    mkn10:['F43.8'] }),

  d('6B43','Porucha přizpůsobení', K.STRES, {
    popis:'Maladaptivní reakce na identifikovatelný psychosociální stresor nebo více stresorů, typicky do 1 měsíce; příznaky obvykle odezní do 6 měsíců.',
    krit:['Maladaptivní reakce na identifikovatelný psychosociální stresor nebo více stresorů, typicky do 1 měsíce',
      'Zaobírání se stresorem nebo selhání adaptace způsobující výrazné funkční postižení',
      'Příznaky nejsou lépe vysvětleny jinou duševní poruchou',
      'Příznaky obvykle odezní do 6 měsíců'],
    mkn10:['F43.2'] }),

  d('6B44','Reaktivní porucha příchylnosti', K.STRES, {
    popis:'Hrubě abnormální vzorce připoutání v raném dětství vznikající v kontextu hrubě nedostatečné péče; dítě se neuchyluje k pečovateli pro útěchu.',
    krit:['Hrubě abnormální vzorce připoutání vzniklé v kontextu hrubě nedostatečné péče',
      'Dítě se ani při dostupném pečovateli k němu neuchyluje pro útěchu nebo podporu',
      'Zřídka projevuje chování hledající bezpečí u kohokoliv z dospělých',
      'Lze diagnostikovat pouze u dětí; rysy se rozvíjejí do 5. roku věku'],
    mkn10:['F94.1'] }),

  d('6B45','Dezinhibovaná porucha sociální angažovanosti', K.STRES, {
    popis:'Vzorec chování, při němž dítě aktivně přistupuje k dospělým cizincům a projevuje dezinhibované sociální chování; vzniká v kontextu hrubě nedostatečné péče.',
    krit:['Vzorec dezinhibovaného chování vůči neznámým dospělým',
      'Vzniklý v kontextu hrubě nedostatečné péče (zanedbávání, institucionalizace)',
      'Chybí přiměřená opatrnost vůči cizím lidem',
      'Lze diagnostikovat pouze u dětí; rozvíjí se do 5. roku věku'],
    mkn10:['F94.2'] }),

  d('6B4Y','Poruchy specificky spojené se stresem, jiné určené', K.STRES, { mkn10:['F43.8'] }),
  d('6B4Z','Poruchy specificky spojené se stresem, neurčené', K.STRES, { mkn10:['F43.9'] }),

  // ─── 6B6x DISOCIATIVNÍ PORUCHY ───────────────────────────
  d('6B60','Disociativní porucha s neurologickými příznaky', K.DISOC, {
    popis:'Disociativní příznaky neurologického charakteru (motorické, senzorické, kognitivní nebo záchvatové) způsobené psychologickými faktory; příznaky neodpovídají neurologickému onemocnění.',
    krit:['Přítomnost neurologických příznaků (pohybové, senzorické, kognitivní nebo záchvatové)',
      'Pozitivní klinické příznaky disociace',
      'Příznaky nejsou vysvětleny neurologickým onemocněním',
      'Způsobují výraznou tíseň nebo funkční postižení'],
    mkn10:['F44'] }),
  d('6B60.0','Disociativní porucha s neurologickými příznaky, s poruchou zraku', K.DISOC, { mkn10:['F44.6'] }),
  d('6B60.1','Disociativní porucha s neurologickými příznaky, s poruchou sluchu', K.DISOC, { mkn10:['F44.6'] }),
  d('6B60.2','Disociativní porucha s neurologickými příznaky, se závratěmi nebo motáním hlavy', K.DISOC, { mkn10:['F44.6'] }),
  d('6B60.3','Disociativní porucha s neurologickými příznaky, s jinými senzorickými poruchami', K.DISOC, { mkn10:['F44.6'] }),
  d('6B60.4','Disociativní porucha s neurologickými příznaky, s neepileptickými záchvaty', K.DISOC, { mkn10:['F44.5'] }),
  d('6B60.5','Disociativní porucha s neurologickými příznaky, s poruchou řeči', K.DISOC, { mkn10:['F44.8'] }),
  d('6B60.6','Disociativní porucha s neurologickými příznaky, s parézou nebo slabostí', K.DISOC, { mkn10:['F44.4'] }),
  d('6B60.7','Disociativní porucha s neurologickými příznaky, s poruchou chůze', K.DISOC, { mkn10:['F44.4'] }),
  d('6B60.8','Disociativní porucha s neurologickými příznaky, s poruchou pohybu', K.DISOC, { mkn10:['F44.4'] }),
  d('6B60.80','Disociativní porucha s neurologickými příznaky, s choreou', K.DISOC, {}),
  d('6B60.81','Disociativní porucha s neurologickými příznaky, s myoklonem', K.DISOC, {}),
  d('6B60.82','Disociativní porucha s neurologickými příznaky, s tremorem', K.DISOC, {}),
  d('6B60.83','Disociativní porucha s neurologickými příznaky, s dystonií', K.DISOC, {}),
  d('6B60.84','Disociativní neurologická symptomatická porucha, s křečemi obličeje', K.DISOC, {}),
  d('6B60.85','Disociativní porucha s neurologickými příznaky, s parkinsonismem', K.DISOC, {}),
  d('6B60.8Y','Disociativní porucha s neurologickými příznaky, s jinou určenou poruchou pohybu', K.DISOC, {}),
  d('6B60.8Z','Disociativní porucha s neurologickými příznaky, s neurčenou poruchou pohybu', K.DISOC, {}),
  d('6B60.9','Disociativní porucha s neurologickými příznaky, s kognitivními příznaky', K.DISOC, { mkn10:['F44.8'] }),
  d('6B60.Y','Disociativní porucha s neurologickými příznaky, jiná určená', K.DISOC, { mkn10:['F44.8'] }),
  d('6B60.Z','Disociativní porucha s neurologickými příznaky, neurčená', K.DISOC, { mkn10:['F44.9'] }),

  d('6B61','Disociativní amnézie', K.DISOC, {
    popis:'Neschopnost vybavit si důležité autobiografické vzpomínky, typicky z nedávno prožitých traumatických nebo stresujících událostí; zapomínání je nepřiměřené normální zapomnětlivosti.',
    krit:['Neschopnost vybavit si důležité autobiografické vzpomínky, typicky traumatické nebo stresující',
      'Zapomínání je nepřiměřené normální zapomnětlivosti',
      'Příznaky nejsou způsobeny neurologickým onemocněním, látkou ani jinou disociativní poruchou',
      'Způsobuje výrazné funkční postižení'],
    mkn10:['F44.0','F44.1'] }),
  d('6B61.0','Disociativní amnézie s disociativní fugou', K.DISOC, { mkn10:['F44.1'] }),
  d('6B61.1','Disociativní amnézie bez disociativní fugy', K.DISOC, { mkn10:['F44.0'] }),
  d('6B61.Z','Disociativní amnézie, neurčená', K.DISOC, { mkn10:['F44.0'] }),

  d('6B62','Porucha transu', K.DISOC, {
    popis:'Epizody výrazného omezení nebo ztráty vědomí vlastní identity a plného uvědomění si okolí; opakující se nebo trvalé, mimovolní a nežádoucí.',
    krit:['Epizody výrazného omezení nebo ztráty vědomí vlastní identity a plného uvědomění si okolí',
      'Příznaky jsou opakující se nebo trvalé',
      'Jsou nepodmíněné a nežádoucí (netvoří součást přijímaných rituálů nebo praxe)',
      'Způsobují klinicky závažnou tíseň nebo funkční postižení'],
    mkn10:['F44.3'] }),

  d('6B63','Porucha posedlosti a transu', K.DISOC, {
    popis:'Epizody transu při nichž se v osobnosti projevuje cizí síla nebo bytost; mimovolní a nežádoucí mimo přijímané kulturní nebo náboženské kontexty.',
    mkn10:['F44.3'] }),

  d('6B64','Disociativní porucha identity', K.DISOC, {
    popis:'Narušení identity charakterizované dvěma nebo více odlišnými osobnostními stavy nebo identitami; doprovázené opakujícími se mezerami v paměti, chování a myšlení.',
    krit:['Dvě nebo více odlišných osobnostních stavů nebo identit',
      'Opakující se mezery v paměti každodenních událostí, osobních informací nebo traumatických událostí',
      'Příznaky způsobují výraznou tíseň nebo funkční postižení',
      'Nejsou součástí přijímaných kulturních nebo náboženských praktik'],
    mkn10:['F44.8'] }),

  d('6B65','Částečná disociativní porucha identity', K.DISOC, {
    popis:'Méně kompletní forma disociativní poruchy identity s méně výraznými přepínáními, přítomností jediné dominantní identity.',
    mkn10:['F44.8'] }),

  d('6B66','Porucha depersonalizace a derealizace', K.DISOC, {
    popis:'Přetrvávající nebo opakující se zážitky depersonalizace nebo derealizace; testování reality je zachováno.',
    krit:['Přetrvávající nebo opakující se zážitky depersonalizace nebo derealizace',
      'Depersonalizace: prožívání vlastního já jako cizího nebo neskutečného, odtažitost od vlastních myšlenek, pocitů nebo těla',
      'Derealizace: prožívání okolí jako cizího, neskutečného, mlhavého nebo vizuálně zkresleného',
      'Testování reality je zachováno (diferenciace od psychózy)',
      'Způsobuje výraznou tíseň nebo funkční postižení'],
    mkn10:['F48.1'] }),

  d('6B6Y','Disociativní poruchy, jiné určené', K.DISOC, { mkn10:['F44.8'] }),
  d('6B6Z','Disociativní poruchy, neurčené', K.DISOC, { mkn10:['F44.9'] }),

  // ─── 6B8x PORUCHY PŘÍJMU POTRAVY ─────────────────────────
  d('6B80','Mentální anorexie', K.JIDLO, {
    popis:'Výrazně nízká tělesná hmotnost; přetrvávající chování zaměřené na zabránění obnovy hmotnosti; nízká hmotnost nebo tvar těla jsou ústřední pro hodnocení vlastní hodnoty.',
    krit:['Výrazně nízká tělesná hmotnost (BMI < 18,5 kg/m² u dospělých nebo < 5. percentil u dětí)',
      'Přetrvávající chování zaměřené na zabránění obnovy hmotnosti (omezování jídla, zvracení, laxativa, cvičení)',
      'Nízká hmotnost nebo tvar těla jsou ústřední pro hodnocení vlastní hodnoty nebo nepřesně vnímány jako normální nebo nadměrné'],
    priz:['Výrazně nízká hmotnost','Strach z přibírání','Narušené vnímání těla','Omezování jídla','Amenorea (u žen)'],
    prubeh:'Chronický s různými průběhy; vysoká mortalita (5–10 %).',
    onset:'Typicky adolescence.',
    mkn10:['F50.0','F50.1'] }),
  d('6B80.0','Anorexia nervosa s významně nízkou tělesnou hmotností', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.00','Anorexia nervosa s významně nízkou tělesnou hmotností, restriktivní typ', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.01','Mentální anorexie s významně nízkou tělesnou hmotností, typ s přejídáním a vyprazdňováním', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.0Z','Anorexia nervosa s významně nízkou tělesnou hmotností, neurčená', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.1','Mentální anorexie s nebezpečně nízkou tělesnou hmotností', K.JIDLO, {
    popis:'BMI < 14,0 kg/m² u dospělých; spojeno s vysokým rizikem mortality.',
    mkn10:['F50.0'] }),
  d('6B80.10','Mentální anorexie s nebezpečně nízkou tělesnou hmotností, restriktivní typ', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.11','Mentální anorexie s nebezpečně nízkou tělesnou hmotností, typ s přejídáním a vyprazdňováním', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.1Z','Mentální anorexie s nebezpečně nízkou tělesnou hmotností, neurčená', K.JIDLO, { mkn10:['F50.0'] }),
  d('6B80.2','Mentální anorexie v zotavení s normální tělesnou hmotností', K.JIDLO, { mkn10:['F50.1'] }),
  d('6B80.Y','Mentální anorexie, jiná určená', K.JIDLO, { mkn10:['F50.1'] }),
  d('6B80.Z','Mentální anorexie, neurčená', K.JIDLO, { mkn10:['F50.9'] }),

  d('6B81','Mentální bulimie', K.JIDLO, {
    popis:'Časté opakující se epizody záchvatovitého přejídání + kompenzační chování + zaobírání se tvarem těla nebo hmotností.',
    krit:['Časté opakující se epizody záchvatovitého přejídání (≥1×/týden, ≥1 měsíc)',
      'Subjektivní ztráta kontroly nad jídlem při záchvatu',
      'Opakující se kompenzační chování (zvracení, laxativa, nadměrné cvičení)',
      'Zaobírání se tvarem těla nebo hmotností silně ovlivňuje vlastní hodnocení',
      'Nesplňuje kritéria pro anorexii nervózu'],
    mkn10:['F50.2','F50.3'] }),
  d('6B81.0','Mentální bulimie, bez purging chování', K.JIDLO, { mkn10:['F50.2'] }),
  d('6B81.1','Mentální bulimie, s purging chováním', K.JIDLO, { mkn10:['F50.2'] }),
  d('6B81.Z','Mentální bulimie, neurčená', K.JIDLO, { mkn10:['F50.9'] }),

  d('6B82','Záchvatovitá porucha příjmu potravy', K.JIDLO, {
    popis:'Časté opakující se epizody záchvatovitého přejídání + ztráta kontroly nad jídlem; bez pravidelného kompenzačního chování.',
    krit:['Časté opakující se epizody záchvatovitého přejídání (≥1×/týden, ≥3 měsíce)',
      'Ztráta kontroly nad jídlem: neschopnost zastavit nebo omezit množství',
      'Bez pravidelného kompenzačního chování (diferenciace od bulimie)',
      'Způsobuje výraznou tíseň nebo funkční postižení'],
    mkn10:['F50.4'] }),

  d('6B83','Vyhýbavá a restriktivní porucha příjmu potravy', K.JIDLO, {
    popis:'Přetrvávající porucha příjmu potravy/stravování vedoucí k selhání plnit adekvátní výživové nebo energetické potřeby; nesouvisí s narušeným vnímáním těla.',
    krit:['Přetrvávající porucha příjmu potravy vedoucí k selhání plnit výživové nebo energetické potřeby',
      'Výsledkem je jedno nebo více z: výrazný pokles hmotnosti, výrazný výživový nedostatek, závislost na enterální výživě, výrazné narušení psychosociálního fungování',
      'Nesouvisí s narušeným vnímáním těla nebo hmotnosti (diferenciace od anorexie)'],
    mkn10:['F98.2'] }),

  d('6B84','Pika', K.JIDLO, {
    popis:'Pravidelná konzumace nenutričních látek nebo nepotravinových předmětů u jedince, který dosáhl vývojového věku pro rozlišování jedlého a nejedlého (cca 2 roky).',
    mkn10:['F98.3'] }),

  d('6B85','Porucha ruminace a regurgitace', K.JIDLO, {
    popis:'Opakované regurgitace jídla, které může být znovu přežvýkáno, znovu spolknuto nebo vyplivnuto; bez příčinné trávicí poruchy.',
    mkn10:['F98.2'] }),

  d('6B8Y','Poruchy příjmu potravy a stravovacího chování, jiné určené', K.JIDLO, { mkn10:['F50.8'] }),
  d('6B8Z','Poruchy příjmu potravy a stravovacího chování, neurčené', K.JIDLO, { mkn10:['F50.9'] }),

  // ─── 6C0x PORUCHY VYLUČOVÁNÍ ─────────────────────────────
  d('6C00','Enuréza', K.VYLUC, {
    popis:'Opakované mimovolní nebo záměrné pomočování u jedince, u něhož lze očekávat, že bude kontinentní.',
    krit:['Opakované mimovolní nebo záměrné pomočování (≥2× týdně po ≥3 měsíce nebo způsobující klinicky závažnou tíseň)',
      'Chronologický nebo vývojový věk ≥5 let',
      'Není způsobeno tělesnou nemocí'],
    mkn10:['F98.0'] }),
  d('6C00.0','Noční enuréza', K.VYLUC, { mkn10:['F98.0'] }),
  d('6C00.1','Denní enuréza', K.VYLUC, { mkn10:['F98.0'] }),
  d('6C00.2','Noční a denní enuréza', K.VYLUC, { mkn10:['F98.0'] }),
  d('6C00.Z','Enuréza, neurčená', K.VYLUC, { mkn10:['F98.0'] }),

  d('6C01','Enkopréza', K.VYLUC, {
    popis:'Opakované záměrné nebo mimovolní vyprazdňování stolice na nevhodných místech u jedince s chronologickým nebo vývojovým věkem ≥4 let.',
    krit:['Opakované záměrné nebo mimovolní vyprazdňování stolice na nevhodných místech',
      'Výskyt ≥1× měsíčně po ≥3 měsíce',
      'Chronologický nebo vývojový věk ≥4 let',
      'Není způsobeno tělesnou nemocí'],
    mkn10:['F98.1'] }),
  d('6C01.0','Enkopréza se zácpou nebo inkontinencí z přeplnění', K.VYLUC, { mkn10:['F98.1'] }),
  d('6C01.1','Enkopréza bez zácpy nebo inkontinence z přeplnění', K.VYLUC, { mkn10:['F98.1'] }),
  d('6C01.Z','Enkopréza, neurčená', K.VYLUC, { mkn10:['F98.1'] }),

  d('6C0Z','Poruchy vylučování, neurčené', K.VYLUC, { mkn10:['F98.9'] }),

  // ─── 6C2x TĚLESNÁ ÚZKOST ─────────────────────────────────
  d('6C20','Porucha tělesné úzkosti', K.TELO, {
    popis:'Přítomnost tělesných příznaků způsobujících tíseň a nadměrná pozornost věnovaná příznakům; přetrvávající po dobu nejméně několika měsíců.',
    krit:['Přítomnost tělesných příznaků způsobujících tíseň a nadměrná pozornost věnovaná příznakům',
      'Opakované kontakty se zdravotními službami nepřiměřené charakteru obtíží',
      'Příznaky přetrvávají po většinu dní nejméně několik měsíců',
      'Způsobují výraznou tíseň nebo funkční postižení'],
    mkn10:['F45'] }),
  d('6C20.0','Mírná porucha tělesné úzkosti', K.TELO, {
    popis:'Méně než 1 hodina denní preokupace; žádné výrazné funkční postižení.',
    mkn10:['F45.0'] }),
  d('6C20.1','Středně těžká porucha tělesné úzkosti', K.TELO, {
    popis:'Více než 1 hodina denní preokupace; středně těžké funkční postižení.',
    mkn10:['F45.0'] }),
  d('6C20.2','Těžká porucha tělesné úzkosti', K.TELO, {
    popis:'Pervazivní preokupace stávající se ústřední v životě; závažné funkční postižení.',
    mkn10:['F45.0'] }),
  d('6C20.Z','Porucha tělesné úzkosti, neurčená', K.TELO, { mkn10:['F45.9'] }),

  d('6C21','Dysforie tělesné integrity', K.TELO, {
    popis:'Intenzivní a přetrvávající touha po amputaci specifické části těla (typicky zdravé končetiny) přetrvávající od adolescence nebo ranné dospělosti.',
    mkn10:['F48.8'] }),

  d('6C2Y','Poruchy tělesné úzkosti nebo tělesných prožitků, jiné určené', K.TELO, { mkn10:['F45.8'] }),
  d('6C2Z','Poruchy tělesné úzkosti nebo tělesných prožitků, neurčené', K.TELO, { mkn10:['F45.9'] }),
];

fs.writeFileSync('mkn11-part2.json', JSON.stringify(data, null, 2), 'utf8');
console.log(`Part 2: ${data.length} záznamů`);
