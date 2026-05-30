// Diagnostické škály a skórovací nástroje
// Pouze bezplatně dostupné škály (public domain, WHO, NIMH, VA, Pfizer clinical use)
//
// Struktura každé škály:
//   id, zkratka, nazev, kategorie, popis, verze, licence,
//   casNaplneni, pocetOtazek, castoU (MKN-10 kódy),
//   otazky[]: { id, text, odpovedi[], hodnoty[] }
//   skoring: { rozsah, cutoff?, interpretace[]: {od, do, label, barva, popis} }
//   poznamka? (klinická poznámka)
//   zdroj, url

export const KATEGORIE_SKAL = [
  { id: 'deprese',    nazev: 'Deprese',          barva: 'yellow', ikona: '😔' },
  { id: 'uzkost',     nazev: 'Úzkost',            barva: 'orange', ikona: '😰' },
  { id: 'ptsd',       nazev: 'Trauma / PTSD',     barva: 'red',    ikona: '⚡' },
  { id: 'bipolarni',  nazev: 'Bipolární porucha', barva: 'purple', ikona: '🔄' },
  { id: 'psychoza',   nazev: 'Psychóza',          barva: 'violet', ikona: '🧠' },
  { id: 'ocd',        nazev: 'OCD',               barva: 'teal',   ikona: '🔁' },
  { id: 'alkohol',    nazev: 'Alkohol / Látky',   barva: 'amber',  ikona: '🍺' },
  { id: 'spanek',     nazev: 'Spánek',            barva: 'indigo', ikona: '🌙' },
  { id: 'adhd',       nazev: 'ADHD',              barva: 'sky',    ikona: '⚡' },
  { id: 'kognitivni', nazev: 'Kognice',           barva: 'green',  ikona: '🧩' },
  { id: 'obecne',     nazev: 'Obecné / Pohoda',   barva: 'slate',  ikona: '⚖️' },
]

const ODPOVEDI_PHQ_GAD = [
  { label: 'Vůbec ne', hodnota: 0 },
  { label: 'Několik dní', hodnota: 1 },
  { label: 'Více než polovinu dní', hodnota: 2 },
  { label: 'Téměř každý den', hodnota: 3 },
]

export const SKALY = [

  // ════════════════════════════════════════════════
  // DEPRESE
  // ════════════════════════════════════════════════

  {
    id: 'phq9',
    zkratka: 'PHQ-9',
    nazev: 'Dotazník zdraví pacienta – deprese',
    kategorie: 'deprese',
    popis: 'Standardizovaný 9-položkový nástroj pro screening a měření závažnosti deprese. Otázky vychází z diagnostických kritérií DSM-5 pro velkou depresivní poruchu.',
    casNaplneni: '2–3 min',
    pocetOtazek: 9,
    castoU: ['F32', 'F33', 'F34.1', 'F31.3', 'F31.4'],
    zdroj: 'Kroenke K, Spitzer RL, Williams JBW (2001). Pfizer Inc. – volně dostupné pro klinické použití.',
    url: 'https://www.phqscreeners.com',
    instrukce: 'Jak často vás v posledních 2 týdnech obtěžovaly následující problémy?',
    otazky: [
      { id: 1, text: 'Malý zájem nebo radost z dělání čehokoliv' },
      { id: 2, text: 'Pocit skleslosti, deprese nebo beznaděje' },
      { id: 3, text: 'Potíže s usínáním nebo spaním, nebo naopak příliš mnoho spánku' },
      { id: 4, text: 'Pocit únavy nebo nedostatku energie' },
      { id: 5, text: 'Špatná chuť k jídlu nebo přejídání' },
      { id: 6, text: 'Špatné mínění o sobě samém, pocit, že jste selhal/a nebo zklamal/a svou rodinu' },
      { id: 7, text: 'Obtíže soustředit se, např. při čtení nebo sledování televize' },
      { id: 8, text: 'Pohyboval/a nebo mluvil/a jste tak pomalu, že si toho ostatní mohli všimnout? Nebo naopak – byl/a jste tak neklidný/á, že jste mnohem více než obvykle pobíhal/a' },
      { id: 9, text: 'Myšlenky, že by bylo lépe být mrtvý/á, nebo přání si ublížit' },
    ].map(q => ({ ...q, odpovedi: ODPOVEDI_PHQ_GAD })),
    skoring: {
      rozsah: [0, 27],
      interpretace: [
        { od: 0,  do: 4,  label: 'Minimální deprese',     barva: 'green',  popis: 'Monitorovat; opakovat při změně stavu.' },
        { od: 5,  do: 9,  label: 'Mírná deprese',         barva: 'yellow', popis: 'Zvážit sledování a podpůrné intervence.' },
        { od: 10, do: 14, label: 'Střední deprese',       barva: 'orange', popis: 'Zvážit léčbu nebo psychoterapii.' },
        { od: 15, do: 19, label: 'Středně těžká deprese', barva: 'red',    popis: 'Aktivní léčba antidepresivy a/nebo psychoterapií.' },
        { od: 20, do: 27, label: 'Těžká deprese',         barva: 'red',    popis: 'Okamžitá léčba, zvážit hospitalizaci.' },
      ],
    },
    poznamka: 'Položka 9 (suicidalita) vyžaduje vždy klinické vyhodnocení bez ohledu na celkové skóre.',
  },

  {
    id: 'phq2',
    zkratka: 'PHQ-2',
    nazev: 'PHQ-2 – rychlý screening deprese',
    kategorie: 'deprese',
    popis: 'Dvouotázkový screening deprese. Při skóre ≥ 3 se doporučuje vyplnění kompletního PHQ-9.',
    casNaplneni: '< 1 min',
    pocetOtazek: 2,
    castoU: ['F32', 'F33'],
    zdroj: 'Kroenke K, Spitzer RL, Williams JBW (2003). Volně dostupné.',
    url: 'https://www.phqscreeners.com',
    instrukce: 'Jak často vás v posledních 2 týdnech obtěžovaly následující problémy?',
    otazky: [
      { id: 1, text: 'Malý zájem nebo radost z dělání čehokoliv', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 2, text: 'Pocit skleslosti, deprese nebo beznaděje', odpovedi: ODPOVEDI_PHQ_GAD },
    ],
    skoring: {
      rozsah: [0, 6],
      cutoff: 3,
      interpretace: [
        { od: 0, do: 2, label: 'Screening negativní', barva: 'green',  popis: 'Nízká pravděpodobnost deprese.' },
        { od: 3, do: 6, label: 'Screening pozitivní', barva: 'orange', popis: 'Doporučeno vyplnění PHQ-9 a klinické vyhodnocení.' },
      ],
    },
  },

  {
    id: 'madrs',
    zkratka: 'MADRS',
    nazev: 'Montgomeryho-Åsbergova škála deprese',
    kategorie: 'deprese',
    popis: 'Klinická hodnotící škála hodnocená lékařem/psychologem. 10 položek, každá 0–6. Citlivá na změnu při léčbě.',
    casNaplneni: '15–20 min (klinické interview)',
    pocetOtazek: 10,
    castoU: ['F32', 'F33'],
    zdroj: 'Montgomery SA, Åsberg M (1979). British Journal of Psychiatry. Volně dostupné.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/444788/',
    instrukce: 'Hodnotí klinický pracovník na základě rozhovoru s pacientem. Pro každou položku vyberte skóre 0–6.',
    otazky: [
      { id: 1,  text: 'Pozorovaný smutek (výraz smutku, skleslost, zoufalství)', odpovedi: [
        {label:'0 – Žádný smutek',hodnota:0},{label:'1',hodnota:1},{label:'2 – Příležitostně smutný',hodnota:2},{label:'3',hodnota:3},{label:'4 – Trvale smutný, nešťastný',hodnota:4},{label:'5',hodnota:5},{label:'6 – Extrémní a stálý smutek',hodnota:6}]},
      { id: 2,  text: 'Sdělovaný smutek (subjektivní pocit smutku, skleslosti)', odpovedi: [
        {label:'0 – Příležitostný smutek',hodnota:0},{label:'1',hodnota:1},{label:'2 – Smutný nebo skleslý',hodnota:2},{label:'3',hodnota:3},{label:'4 – Hluboký a trvalý smutek',hodnota:4},{label:'5',hodnota:5},{label:'6 – Nepřetržitý nesnesitelný smutek',hodnota:6}]},
      { id: 3,  text: 'Vnitřní napětí (neklid, tenzita, úzkost, panické záchvaty)', odpovedi: [
        {label:'0 – Klidný',hodnota:0},{label:'1',hodnota:1},{label:'2 – Příležitostné napětí',hodnota:2},{label:'3',hodnota:3},{label:'4 – Trvalé napětí, panika',hodnota:4},{label:'5',hodnota:5},{label:'6 – Nesnesitelná tenzní úzkost',hodnota:6}]},
      { id: 4,  text: 'Poruchy spánku (délka, kvalita)', odpovedi: [
        {label:'0 – Spí obvyklou délku',hodnota:0},{label:'1',hodnota:1},{label:'2 – Mírné potíže s usínáním',hodnota:2},{label:'3',hodnota:3},{label:'4 – Spánek zkrácen < 2 h',hodnota:4},{label:'5',hodnota:5},{label:'6 – Spí méně než 2 hodiny',hodnota:6}]},
      { id: 5,  text: 'Snížená chuť k jídlu', odpovedi: [
        {label:'0 – Normální nebo zvýšená chuť',hodnota:0},{label:'1',hodnota:1},{label:'2 – Mírně snížená chuť',hodnota:2},{label:'3',hodnota:3},{label:'4 – Výrazně snížená chuť, musí se nutit jíst',hodnota:4},{label:'5',hodnota:5},{label:'6 – Neschopen jíst bez pomoci',hodnota:6}]},
      { id: 6,  text: 'Obtíže se soustředěním', odpovedi: [
        {label:'0 – Žádné',hodnota:0},{label:'1',hodnota:1},{label:'2 – Příležitostné obtíže',hodnota:2},{label:'3',hodnota:3},{label:'4 – Výrazné obtíže i při snadných úkolech',hodnota:4},{label:'5',hodnota:5},{label:'6 – Neschopen se soustředit vůbec',hodnota:6}]},
      { id: 7,  text: 'Únava (slabost, ochablost)', odpovedi: [
        {label:'0 – Téměř žádná únava',hodnota:0},{label:'1',hodnota:1},{label:'2 – Snížená energie',hodnota:2},{label:'3',hodnota:3},{label:'4 – Výrazná únava i při malé námaze',hodnota:4},{label:'5',hodnota:5},{label:'6 – Neschopen začít cokoli bez pomoci',hodnota:6}]},
      { id: 8,  text: 'Neschopnost cítit (zhoršení prožívání radosti, zájmu)', odpovedi: [
        {label:'0 – Normální emoční reaktivita',hodnota:0},{label:'1',hodnota:1},{label:'2 – Snížená schopnost radosti',hodnota:2},{label:'3',hodnota:3},{label:'4 – Bez zájmu a radosti',hodnota:4},{label:'5',hodnota:5},{label:'6 – Absolutní necitlivost, utrpení',hodnota:6}]},
      { id: 9,  text: 'Pesimistické myšlenky (vina, sebeobviňování, bezcennost)', odpovedi: [
        {label:'0 – Bez pesimismu',hodnota:0},{label:'1',hodnota:1},{label:'2 – Přerušované sebevýčitky',hodnota:2},{label:'3',hodnota:3},{label:'4 – Trvalé pocity viny a sebeobviňování',hodnota:4},{label:'5',hodnota:5},{label:'6 – Fixní sebeobviňování, bludy viny',hodnota:6}]},
      { id: 10, text: 'Suicidální myšlenky', odpovedi: [
        {label:'0 – Bez suicidálních myšlenek',hodnota:0},{label:'1',hodnota:1},{label:'2 – Únava ze života, přechodné suicidální myšlenky',hodnota:2},{label:'3',hodnota:3},{label:'4 – Suicidální plány nebo přípravy',hodnota:4},{label:'5',hodnota:5},{label:'6 – Pokus o sebevraždu',hodnota:6}]},
    ],
    skoring: {
      rozsah: [0, 60],
      interpretace: [
        { od: 0,  do: 6,  label: 'Bez deprese',     barva: 'green'  },
        { od: 7,  do: 19, label: 'Mírná deprese',    barva: 'yellow' },
        { od: 20, do: 34, label: 'Střední deprese',  barva: 'orange' },
        { od: 35, do: 60, label: 'Těžká deprese',    barva: 'red'    },
      ],
    },
    poznamka: 'Hodnotí klinický pracovník, ne samohodnotící nástroj.',
  },

  // ════════════════════════════════════════════════
  // ÚZKOST
  // ════════════════════════════════════════════════

  {
    id: 'gad7',
    zkratka: 'GAD-7',
    nazev: 'Škála generalizované úzkostné poruchy',
    kategorie: 'uzkost',
    popis: '7-položkový nástroj pro screening a měření závažnosti generalizované úzkosti. Využitelný i pro jiné úzkostné poruchy.',
    casNaplneni: '2–3 min',
    pocetOtazek: 7,
    castoU: ['F41.1', 'F40', 'F41', 'F43.1'],
    zdroj: 'Spitzer RL et al. (2006). Pfizer Inc. – volně dostupné pro klinické použití.',
    url: 'https://www.phqscreeners.com',
    instrukce: 'Jak často vás v posledních 2 týdnech obtěžovaly následující problémy?',
    otazky: [
      { id: 1, text: 'Pocit nervozity, úzkosti nebo napětí', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 2, text: 'Neschopnost zastavit nebo ovládat obavy', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 3, text: 'Přílišné obavy o různé věci', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 4, text: 'Obtíže s relaxací', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 5, text: 'Tak velký neklid, že bylo obtížné vydržet v klidu', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 6, text: 'Tendence k podrážděnosti nebo vznětlivosti', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 7, text: 'Pocit strachu, jako by se mohlo přihodit něco hrozného', odpovedi: ODPOVEDI_PHQ_GAD },
    ],
    skoring: {
      rozsah: [0, 21],
      interpretace: [
        { od: 0,  do: 4,  label: 'Minimální úzkost', barva: 'green'  },
        { od: 5,  do: 9,  label: 'Mírná úzkost',     barva: 'yellow' },
        { od: 10, do: 14, label: 'Střední úzkost',   barva: 'orange' },
        { od: 15, do: 21, label: 'Těžká úzkost',     barva: 'red'    },
      ],
    },
  },

  {
    id: 'gad2',
    zkratka: 'GAD-2',
    nazev: 'GAD-2 – rychlý screening úzkosti',
    kategorie: 'uzkost',
    popis: 'Dvouotázkový screening úzkosti. Při skóre ≥ 3 se doporučuje vyplnění GAD-7.',
    casNaplneni: '< 1 min',
    pocetOtazek: 2,
    castoU: ['F41', 'F40'],
    zdroj: 'Kroenke K et al. (2007). Volně dostupné.',
    instrukce: 'Jak často vás v posledních 2 týdnech obtěžovaly následující problémy?',
    otazky: [
      { id: 1, text: 'Pocit nervozity, úzkosti nebo napětí', odpovedi: ODPOVEDI_PHQ_GAD },
      { id: 2, text: 'Neschopnost zastavit nebo ovládat obavy', odpovedi: ODPOVEDI_PHQ_GAD },
    ],
    skoring: {
      rozsah: [0, 6],
      cutoff: 3,
      interpretace: [
        { od: 0, do: 2, label: 'Screening negativní', barva: 'green',  popis: 'Nízká pravděpodobnost úzkostné poruchy.' },
        { od: 3, do: 6, label: 'Screening pozitivní', barva: 'orange', popis: 'Doporučeno GAD-7 a klinické vyhodnocení.' },
      ],
    },
  },

  // ════════════════════════════════════════════════
  // TRAUMA / PTSD
  // ════════════════════════════════════════════════

  {
    id: 'pcl5',
    zkratka: 'PCL-5',
    nazev: 'Checklist symptomů PTSD (DSM-5)',
    kategorie: 'ptsd',
    popis: '20-položkový sebehodnotící dotazník pro PTSD dle DSM-5. Sleduje 4 symptomové clustery: znovuprožívání, vyhýbání, negativní kognice/nálada, hyperarousal.',
    casNaplneni: '5–10 min',
    pocetOtazek: 20,
    castoU: ['F43.1', 'F43'],
    zdroj: 'Weathers FW et al. (2013). US Department of Veterans Affairs – volně dostupné.',
    url: 'https://www.ptsd.va.gov/professional/assessment/adult-sr/ptsd-checklist.asp',
    instrukce: 'Níže je uvedeno několik problémů, které lidé někdy mají v reakci na velmi stresující zážitek. Jak moc vás každý z těchto problémů obtěžoval za poslední měsíc?',
    otazky: [
      { id: 1,  text: 'Opakované, stresující vzpomínky, myšlenky nebo obrazy ze stresující zkušenosti' },
      { id: 2,  text: 'Opakující se stresující sny ze stresující zkušenosti' },
      { id: 3,  text: 'Náhlý pocit nebo jednání, jako by se stresující zkušenost znovu děla (jako byste ji znovu prožíval/a)' },
      { id: 4,  text: 'Pocit velké tísně, když vám něco připomnělo stresující zkušenost' },
      { id: 5,  text: 'Mít silné fyzické reakce (bušení srdce, potíže s dýcháním, pocení), když vám něco připomnělo stresující zkušenost' },
      { id: 6,  text: 'Vyhýbání se vzpomínkám, myšlenkám nebo pocitům spojeným se stresující zkušeností' },
      { id: 7,  text: 'Vyhýbání se vnějším připomínkám stresující zkušenosti (lidé, místa, rozhovory, aktivity, předměty, situace)' },
      { id: 8,  text: 'Potíže se zapamatováním důležitých částí stresující zkušenosti' },
      { id: 9,  text: 'Silně negativní přesvědčení o sobě samém, ostatních nebo světě' },
      { id: 10, text: 'Obviňování sebe sama nebo jiných za stresující zkušenost nebo to, co se přihodilo' },
      { id: 11, text: 'Mít silné negativní pocity jako strach, hrůza, vztek, vina nebo stud' },
      { id: 12, text: 'Ztráta zájmu o aktivity, které vás dříve bavily' },
      { id: 13, text: 'Pocit odtržení nebo odcizení od ostatních lidí' },
      { id: 14, text: 'Neschopnost mít pozitivní pocity (např. neschopnost cítit štěstí nebo lásku k blízkým)' },
      { id: 15, text: 'Podrážděné chování, výbuchy hněvu nebo agresivní jednání' },
      { id: 16, text: 'Příliš riskantní nebo sebedestruktivní chování' },
      { id: 17, text: 'Být přehnaně ostražitý/á, ve střehu nebo ve střehu' },
      { id: 18, text: 'Být skočný/á nebo být snadno vyplašen/a' },
      { id: 19, text: 'Potíže se soustředěním' },
      { id: 20, text: 'Problémy se spánkem' },
    ].map(q => ({
      ...q,
      odpovedi: [
        { label: '0 – Vůbec ne', hodnota: 0 },
        { label: '1 – Trochu', hodnota: 1 },
        { label: '2 – Středně', hodnota: 2 },
        { label: '3 – Hodně', hodnota: 3 },
        { label: '4 – Velmi mnoho', hodnota: 4 },
      ],
    })),
    skoring: {
      rozsah: [0, 80],
      cutoff: 33,
      interpretace: [
        { od: 0,  do: 32, label: 'Pod cut-off',           barva: 'green',  popis: 'PTSD méně pravděpodobné.' },
        { od: 33, do: 80, label: 'Pravděpodobné PTSD',    barva: 'red',    popis: 'Skóre ≥33 odpovídá pravděpodobnému PTSD; nutné klinické vyhodnocení.' },
      ],
    },
  },

  {
    id: 'iesr',
    zkratka: 'IES-R',
    nazev: 'Škála dopadu události – revidovaná',
    kategorie: 'ptsd',
    popis: '22-položkový nástroj hodnotící distres po traumatické události. 3 subškály: intruse, vyhýbání, hyperarousal.',
    casNaplneni: '5–10 min',
    pocetOtazek: 22,
    castoU: ['F43.1', 'F43.0'],
    zdroj: 'Weiss DS, Marmar CR (1997). Volně dostupné.',
    instrukce: 'Níže je uveden seznam obtíží, které lidé někdy prožívají po stresujících životních událostech. Přečtěte si každou položku a uveďte, jak moc vás každá obtíž obtěžovala za posledních 7 dní.',
    otazky: [
      { id: 1,  text: 'Jakákoli připomínka toho znovu vyvolala pocity z té doby', odpovedi: [{label:'0 – Vůbec',hodnota:0},{label:'1 – Trochu',hodnota:1},{label:'2 – Středně',hodnota:2},{label:'3 – Hodně',hodnota:3},{label:'4 – Velmi mnoho',hodnota:4}] },
      { id: 2,  text: 'Měl/a jsem potíže se spaním', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 3,  text: 'Ostatní věci mi to neustále připomínaly', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 4,  text: 'Cítil/a jsem se podrážděný/á a rozzlobený/á', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 5,  text: 'Snažil/a jsem se na to nevzpomínat, když se mi to vybavilo', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 6,  text: 'Myslel/a jsem na to, aniž jsem chtěl/a', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 7,  text: 'Cítil/a jsem, jako by se to nestalo nebo jako by to nebyla skutečnost', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 8,  text: 'Vyhýbal/a jsem se připomínkám této události', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 9,  text: 'Obrazy z té doby mi přicházely na mysl', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 10, text: 'Byl/a jsem nervózní a snadno vyplašen/a', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 11, text: 'Snažil/a jsem se na to nemyslet', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 12, text: 'Uvědomoval/a jsem si, že mám stále mnoho pocitů z té doby, ale nezabýval/a jsem se jimi', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 13, text: 'Mé pocity z té doby byly jaksi necitlivé', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 14, text: 'Zjišťoval/a jsem, že se chovám nebo cítím, jako bych byl/a zpět v té době', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 15, text: 'Nemohl/a jsem usnout kvůli tomu', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 16, text: 'Prožíval/a jsem silné vlny pocitů z toho', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 17, text: 'Snažil/a jsem se to vymazat z paměti', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 18, text: 'Měl/a jsem potíže se soustředěním', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 19, text: 'Věci, které mi to připomínaly, ve mně vyvolávaly fyzické reakce (pocení, potíže s dýcháním, nevolnost nebo bušení srdce)', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 20, text: 'Snil/a jsem o tom', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 21, text: 'Cítil/a jsem se ve střehu nebo ve střehu', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
      { id: 22, text: 'Snažil/a jsem se o tom nemluvit', odpovedi: [{label:'0',hodnota:0},{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4}] },
    ],
    skoring: {
      rozsah: [0, 88],
      interpretace: [
        { od: 0,  do: 23, label: 'Pod prahovou hodnotou', barva: 'green',  popis: 'Nízká klinická závažnost.' },
        { od: 24, do: 32, label: 'Mírný dopad',           barva: 'yellow' },
        { od: 33, do: 36, label: 'Střední dopad',         barva: 'orange', popis: 'Doporučeno klinické sledování.' },
        { od: 37, do: 88, label: 'Závažný dopad',         barva: 'red',    popis: 'Pravděpodobné PTSD; nutné klinické vyhodnocení.' },
      ],
    },
  },

  // ════════════════════════════════════════════════
  // BIPOLÁRNÍ PORUCHA
  // ════════════════════════════════════════════════

  {
    id: 'mdq',
    zkratka: 'MDQ',
    nazev: 'Dotazník poruch nálady',
    kategorie: 'bipolarni',
    popis: 'Screeningový nástroj pro bipolární spektrum. Screen pozitivní = ≥7 z 13 příznaků + příznaky zároveň + středně závažné nebo závažné potíže.',
    casNaplneni: '5 min',
    pocetOtazek: 13,
    castoU: ['F31', 'F30', 'F34.0'],
    zdroj: 'Hirschfeld RM et al. (2000). Volně dostupné.',
    instrukce: 'Zažil/a jste někdy v životě období, kdy jste nebyl/a svým obvyklým já a kdy:',
    otazky: [
      { id: 1,  text: 'Byl/a jste tak naladён/a, že ostatní lidé říkali, že jste byl/a nadměrně šťastný/á nebo veselý/á?' },
      { id: 2,  text: 'Byl/a jste tak podrážděný/á, že jste křičel/a na lidi nebo jste začal/a rvačku nebo hádku?' },
      { id: 3,  text: 'Cítil/a jste se mnohem sebejistěji než obvykle?' },
      { id: 4,  text: 'Potřeboval/a jste méně spánku než obvykle a přesto jste se cítil/a odpočatý/á?' },
      { id: 5,  text: 'Byl/a jste mnohem upovídanější nebo mluvil/a jste mnohem rychleji než obvykle?' },
      { id: 6,  text: 'Myšlenky se vám honily v hlavě nebo jste nedokázal/a zpomalit mysl?' },
      { id: 7,  text: 'Rozptyloval vás to tak, že jste měl/a potíže soustředit se nebo udržet přehled?' },
      { id: 8,  text: 'Byl/a jste energičtější než obvykle?' },
      { id: 9,  text: 'Byl/a jste mnohem aktivnější nebo jste udělal/a mnohem více věcí než obvykle?' },
      { id: 10, text: 'Byl/a jste mnohem společenštější nebo přívětivější než obvykle (např. telefonoval/a přátelům v noci)?' },
      { id: 11, text: 'Byl/a jste mnohem zájmovější o sex než obvykle?' },
      { id: 12, text: 'Dělal/a jste věci, které jsou pro vás neobvyklé, nebo které ostatní považovali za přehnané, pošetilé nebo riskantní?' },
      { id: 13, text: 'Utrácení peněz vás přivedlo do potíží nebo do potíží s vaší rodinou?' },
    ].map(q => ({
      ...q,
      odpovedi: [
        { label: 'Ano', hodnota: 1 },
        { label: 'Ne', hodnota: 0 },
      ],
    })),
    skoring: {
      rozsah: [0, 13],
      cutoff: 7,
      interpretace: [
        { od: 0, do: 6,  label: 'Screening negativní', barva: 'green',  popis: 'Bipolární spektrum méně pravděpodobné.' },
        { od: 7, do: 13, label: 'Screening pozitivní', barva: 'orange', popis: 'Zvážit diagnostiku bipolárního spektra; nutné klinické vyhodnocení.' },
      ],
    },
    poznamka: 'Výsledek MDQ je pozitivní pouze pokud: (1) ≥7 odpovědí ANO, (2) příznaky nastaly ve STEJNÉM OBDOBÍ, (3) způsobily středně závažné nebo závažné problémy. Potvrdit klinickým interview.',
  },

  {
    id: 'ymrs',
    zkratka: 'YMRS',
    nazev: 'Youngova škála hodnocení mánie',
    kategorie: 'bipolarni',
    popis: 'Klinická škála hodnocení závažnosti manické epizody. 11 položek. Hodnotí klinický pracovník.',
    casNaplneni: '15–30 min (klinické interview)',
    pocetOtazek: 11,
    castoU: ['F30', 'F31.1', 'F31.2', 'F25.0'],
    zdroj: 'Young RC et al. (1978). Volně dostupné.',
    instrukce: 'Hodnotí klinický pracovník na základě rozhovoru. Hodnocení vychází ze stavu pacienta za poslední 48 hodin.',
    otazky: [
      { id: 1,  text: 'Zvýšená nálada', odpovedi: [
        {label:'0 – Nepřítomna',hodnota:0},{label:'1 – Mírně nebo možná zvýšená',hodnota:1},{label:'2 – Subjektivně zvýšená; optimistická, sebejistá; veselá; přiměřená obsahu',hodnota:2},{label:'3 – Zvýšená; nepřiměřená obsahu; vtipkování',hodnota:3},{label:'4 – Euforická; nevhodný smích; zpívání',hodnota:4}]},
      { id: 2,  text: 'Zvýšená motorická aktivita a energie', odpovedi: [
        {label:'0 – Nepřítomna',hodnota:0},{label:'1 – Subjektivně zvýšená',hodnota:1},{label:'2 – Animovaný; zvýšená gestikulace',hodnota:2},{label:'3 – Nadměrná energie; hyperaktivní občas; neklidný, ale jej lze uklidnit',hodnota:3},{label:'4 – Motorický neklid; neustálá hyperaktivita; nelze uklidnit',hodnota:4}]},
      { id: 3,  text: 'Sexuální zájem', odpovedi: [
        {label:'0 – Normální; nesexuální obsah',hodnota:0},{label:'1 – Mírně zvýšený',hodnota:1},{label:'2 – Zvýšený při dotazování',hodnota:2},{label:'3 – Spontánní sexuální obsah; popisuje hypersexualitu',hodnota:3},{label:'4 – Zjevné sexuální chování',hodnota:4}]},
      { id: 4,  text: 'Spánek', odpovedi: [
        {label:'0 – Nespí o méně než 1 hodinu méně než obvykle',hodnota:0},{label:'1 – Spí o méně než 1 hodinu méně než obvykle',hodnota:1},{label:'2 – Spí o méně než 2 hodiny méně než obvykle',hodnota:2},{label:'3 – Spí o méně než 3 hodiny méně než obvykle',hodnota:3},{label:'4 – Nespí nebo spí jen zcela výjimečně',hodnota:4}]},
      { id: 5,  text: 'Podrážděnost', odpovedi: [
        {label:'0 – Nepřítomna',hodnota:0},{label:'2 – Subjektivně zvýšená',hodnota:2},{label:'4 – Podrážděný po část rozhovoru; výbuchy vzteku',hodnota:4},{label:'6 – Snadno podrážděný, prudký',hodnota:6},{label:'8 – Hostilní, nespolupracující',hodnota:8}]},
      { id: 6,  text: 'Řeč (rychlost a množství)', odpovedi: [
        {label:'0 – Bez nárůstu',hodnota:0},{label:'2 – Mírně zvýšená',hodnota:2},{label:'4 – Zvýšená; tlak řeči občas',hodnota:4},{label:'6 – Trvalý tlak řeči; těžce přerušitelný',hodnota:6},{label:'8 – Nepřerušitelný, rychlý trysk řeči',hodnota:8}]},
      { id: 7,  text: 'Jazykové a myšlenkové poruchy', odpovedi: [
        {label:'0 – Nepřítomny',hodnota:0},{label:'1 – Okolkování; rychlé myšlenky',hodnota:1},{label:'2 – Trysk myšlenek; tangencialita; distraktibilita; přelétavost',hodnota:2},{label:'3 – Letový trysk; inkoherence',hodnota:3},{label:'4 – Nesrozumitelná; inkoherentní',hodnota:4}]},
      { id: 8,  text: 'Obsah myšlenek', odpovedi: [
        {label:'0 – Normální',hodnota:0},{label:'2 – Pochybné plány; nové zájmy',hodnota:2},{label:'4 – Specifické grandiózní projekty; religiózní',hodnota:4},{label:'6 – Grandiózní nebo paranoidní bludy; přesvědčen',hodnota:6},{label:'8 – Bludy; halucinace',hodnota:8}]},
      { id: 9,  text: 'Narušované nebo agresivní chování', odpovedi: [
        {label:'0 – Přítomen a kooperativní',hodnota:0},{label:'2 – Sarkastický; hlasitý, opatrný',hodnota:2},{label:'4 – Obtěžuje nebo si stěžuje; hostilní',hodnota:4},{label:'6 – Vyhrožující; křičí, rozhovor je obtížný',hodnota:6},{label:'8 – Útočný; destruktivní; rozhovor nemožný',hodnota:8}]},
      { id: 10, text: 'Zevnějšek (upravenost)', odpovedi: [
        {label:'0 – Přiměřený',hodnota:0},{label:'1 – Mírně nepřiměřený',hodnota:1},{label:'2 – Špatně upravený; středně nepřiměřený',hodnota:2},{label:'3 – Dezorganizovaný; nemůže se ustrojit',hodnota:3},{label:'4 – Zcela dezorganizovaný; malbuje se',hodnota:4}]},
      { id: 11, text: 'Náhled (pochopení nemoci)', odpovedi: [
        {label:'0 – Uznává nemoc; souhlasí s nutností léčby',hodnota:0},{label:'1 – Uznává možné nemoci',hodnota:1},{label:'2 – Uznává změny chování, ale popírá nemoc',hodnota:2},{label:'3 – Uznává možné změny chování, ale popírá nemoc',hodnota:3},{label:'4 – Popírá jakoukoli změnu chování',hodnota:4}]},
    ],
    skoring: {
      rozsah: [0, 60],
      interpretace: [
        { od: 0,  do: 11, label: 'Bez mánie',       barva: 'green'  },
        { od: 12, do: 19, label: 'Mírná mánie',      barva: 'yellow' },
        { od: 20, do: 29, label: 'Střední mánie',    barva: 'orange' },
        { od: 30, do: 60, label: 'Těžká mánie',      barva: 'red'    },
      ],
    },
    poznamka: 'Hodnotí klinický pracovník, ne samohodnotící nástroj.',
  },

  // ════════════════════════════════════════════════
  // PSYCHÓZA
  // ════════════════════════════════════════════════

  {
    id: 'bprs',
    zkratka: 'BPRS',
    nazev: 'Stručná psychiatrická hodnotící škála',
    kategorie: 'psychoza',
    popis: 'Klinická škála hodnocení psychopatologie. 18 položek, každá 1–7. Citlivá na změnu při léčbě. Původně 16 položek (Overall & Gorham 1962).',
    casNaplneni: '20–30 min (klinické interview)',
    pocetOtazek: 18,
    castoU: ['F20', 'F21', 'F22', 'F23', 'F25', 'F31.2'],
    zdroj: 'Overall JE, Gorham DR (1962). Volně dostupné (public domain).',
    instrukce: 'Hodnotí klinický pracovník. Každá položka na stupnici 1 (nepřítomno) až 7 (extrémně závažné).',
    otazky: [
      { id: 1,  text: 'Somatické starosti (přehnaný zájem o tělesné zdraví)', odpovedi: [{label:'1 – Nepřítomno',hodnota:1},{label:'2 – Velmi mírné',hodnota:2},{label:'3 – Mírné',hodnota:3},{label:'4 – Střední',hodnota:4},{label:'5 – Středně závažné',hodnota:5},{label:'6 – Závažné',hodnota:6},{label:'7 – Extrémní',hodnota:7}] },
      { id: 2,  text: 'Úzkost (obavy, strach, přehnaná starostlivost)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 3,  text: 'Emoční stažení (nedostatek spontánního kontaktu)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 4,  text: 'Konceptuální dezorganizace (myšlenkové poruchy)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 5,  text: 'Vina (sebeobviňování, lítost)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 6,  text: 'Napětí (fyzický a motorický neklid)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 7,  text: 'Manierismus a pozy (neobvyklé, nepřirozené pohyby)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 8,  text: 'Grandiosita (přeceňování schopností, bohatství, identity)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 9,  text: 'Depresivní nálada (smutek, beznaděj)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 10, text: 'Hostilita (animozita, pohrdání, výbuchy vzteku)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 11, text: 'Podezíravost (přesvědčení o pronásledování)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 12, text: 'Halucinatorní chování (vjemy bez zevního podnětu)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 13, text: 'Motorická retardace (pomalé pohyby a řeč)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 14, text: 'Nespolupráce (odpor k vyšetření)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 15, text: 'Neobvyklý obsah myšlenek (bizarní, prapodivné myšlenky)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 16, text: 'Oploštělý afekt (snížená emoční reaktivita)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 17, text: 'Excitace (zvýšená nálada, agilnost, neklid)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
      { id: 18, text: 'Dezorientace (zmatenost ohledně místa, času, osoby)', odpovedi: [{label:'1',hodnota:1},{label:'2',hodnota:2},{label:'3',hodnota:3},{label:'4',hodnota:4},{label:'5',hodnota:5},{label:'6',hodnota:6},{label:'7',hodnota:7}] },
    ],
    skoring: {
      rozsah: [18, 126],
      interpretace: [
        { od: 18, do: 30, label: 'Minimální psychopatologie', barva: 'green'  },
        { od: 31, do: 40, label: 'Mírná',                     barva: 'yellow' },
        { od: 41, do: 52, label: 'Střední',                   barva: 'orange' },
        { od: 53, do: 126,label: 'Závažná',                   barva: 'red'    },
      ],
    },
    poznamka: 'Hodnotí klinický pracovník, ne samohodnotící nástroj.',
  },

  {
    id: 'cgi',
    zkratka: 'CGI',
    nazev: 'Klinický globální dojem',
    kategorie: 'obecne',
    popis: 'CGI je klinická škála pro globální hodnocení závažnosti (CGI-S) a změny (CGI-I) stavu pacienta. Používá se napříč diagnózami.',
    casNaplneni: '2–5 min (klinické hodnocení)',
    pocetOtazek: 2,
    castoU: ['F20', 'F32', 'F31', 'F41'],
    zdroj: 'Guy W (1976). NIMH – public domain.',
    instrukce: 'Hodnotí klinický pracovník na základě celkového klinického dojmu.',
    otazky: [
      {
        id: 1,
        text: 'CGI-S: Závažnost onemocnění (jak závažný je stav pacienta v porovnání s jinými pacienty s danou diagnózou?)',
        odpovedi: [
          { label: '1 – Normální, vůbec nemocný', hodnota: 1 },
          { label: '2 – Hraniční duševní nemoc', hodnota: 2 },
          { label: '3 – Mírně nemocný', hodnota: 3 },
          { label: '4 – Středně nemocný', hodnota: 4 },
          { label: '5 – Závažně nemocný', hodnota: 5 },
          { label: '6 – Jeden z nejtěžších případů', hodnota: 6 },
          { label: '7 – Extrémně nemocný', hodnota: 7 },
        ],
      },
      {
        id: 2,
        text: 'CGI-I: Globální zlepšení (jak se stav pacienta změnil oproti baseline?)',
        odpovedi: [
          { label: '1 – Velmi výrazné zlepšení', hodnota: 1 },
          { label: '2 – Výrazné zlepšení', hodnota: 2 },
          { label: '3 – Mírné zlepšení', hodnota: 3 },
          { label: '4 – Beze změny', hodnota: 4 },
          { label: '5 – Mírné zhoršení', hodnota: 5 },
          { label: '6 – Výrazné zhoršení', hodnota: 6 },
          { label: '7 – Velmi výrazné zhoršení', hodnota: 7 },
        ],
      },
    ],
    skoring: {
      rozsah: [1, 7],
      interpretace: [
        { od: 1, do: 2, label: 'Žádná nebo minimální závažnost', barva: 'green'  },
        { od: 3, do: 4, label: 'Mírná až střední závažnost',     barva: 'yellow' },
        { od: 5, do: 6, label: 'Závažné onemocnění',             barva: 'orange' },
        { od: 7, do: 7, label: 'Extrémně závažné onemocnění',    barva: 'red'    },
      ],
    },
    poznamka: 'CGI-S a CGI-I jsou hodnoceny nezávisle. CGI-I vyžaduje referenční hodnocení (baseline). Škálu hodnotí klinický pracovník.',
  },

  // ════════════════════════════════════════════════
  // OCD
  // ════════════════════════════════════════════════

  {
    id: 'ocir',
    zkratka: 'OCI-R',
    nazev: 'Revidovaný inventář obsesí-kompulzí',
    kategorie: 'ocd',
    popis: '18-položkový sebehodnotící nástroj pro hodnocení symptomů OCD. 6 subškál: hromadění, kontrolování, neutralizace, posedlost, pořádkumilovnost, mytí.',
    casNaplneni: '5 min',
    pocetOtazek: 18,
    castoU: ['F42', 'F42.2', 'F60.5'],
    zdroj: 'Foa EB et al. (2002). Volně dostupné pro klinické a výzkumné použití.',
    instrukce: 'Níže je uveden seznam zkušeností, které lidé někdy mají. Označte prosím, jak moc vás každá zkušenost v posledním měsíci obtěžovala.',
    otazky: [
      { id: 1,  text: 'Hromadil/a jsem věci do té míry, že mi překážely' },
      { id: 2,  text: 'Kontroloval/a jsem věci (plyn, vodu, zámky apod.) vícekrát, než bylo nutné' },
      { id: 3,  text: 'Sbíral/a jsem věci, které jiní lidé vyhodili' },
      { id: 4,  text: 'Kontroloval/a jsem věci vícekrát, než jsem zamýšlel/a' },
      { id: 5,  text: 'Obtěžovaly mě nepříjemné myšlenky, které se mi vtíraly do mysli a nešlo se jich zbavit' },
      { id: 6,  text: 'Myslel/a jsem, že se mi může přihodit katastrofa, protože jsem nebyl/a dostatečně opatrný/á' },
      { id: 7,  text: 'Cítil/a jsem se nucen/a mytí nebo umývání věcí, i když jsem věděl/a, že jsou čisté' },
      { id: 8,  text: 'Cítil/a jsem potřebu opakovat určité čísla' },
      { id: 9,  text: 'Přišlo mi těžké dotknout se předmětů, kdy se jich dotkli cizí lidé' },
      { id: 10, text: 'Obtěžovaly mě myšlenky na to, zda jsem udělal/a správnou věc' },
      { id: 11, text: 'Rozrušovaly mě nepříjemné myšlenky proti své vůli' },
      { id: 12, text: 'Nemohl/a jsem se zbavit pocitu, i když jsem věděl/a, že je to iracionální' },
      { id: 13, text: 'Cítil/a jsem potřebu opakovat určité činy (mytí, kontrolování apod.)' },
      { id: 14, text: 'Potřeboval/a jsem mít věci naskládané v určitém pořadí' },
      { id: 15, text: 'Cítil/a jsem se nucen/a říkat, ptát se nebo přiznávat věci' },
      { id: 16, text: 'Cítil/a jsem se znečištěn/a, i když jsem se dotkl/a věcí, které ostatní považují za bezpečné' },
      { id: 17, text: 'Obtěžovaly mě myšlenky na sexuální, násilné nebo jiné nepříjemné téma' },
      { id: 18, text: 'Myslel/a jsem na to, že jsem mohl/a ublížit sobě nebo někomu jinému' },
    ].map(q => ({
      ...q,
      odpovedi: [
        { label: '0 – Vůbec ne', hodnota: 0 },
        { label: '1 – Trochu', hodnota: 1 },
        { label: '2 – Středně', hodnota: 2 },
        { label: '3 – Hodně', hodnota: 3 },
        { label: '4 – Velmi mnoho', hodnota: 4 },
      ],
    })),
    skoring: {
      rozsah: [0, 72],
      cutoff: 21,
      interpretace: [
        { od: 0,  do: 20, label: 'Pod klinickým cut-off', barva: 'green',  popis: 'OCD méně pravděpodobné.' },
        { od: 21, do: 72, label: 'Klinicky významné OCD', barva: 'red',    popis: 'Cut-off ≥21 pro pravděpodobné OCD; nutné klinické vyhodnocení.' },
      ],
    },
  },

  // ════════════════════════════════════════════════
  // ALKOHOL / LÁTKY
  // ════════════════════════════════════════════════

  {
    id: 'audit',
    zkratka: 'AUDIT',
    nazev: 'Test identifikace poruch způsobených alkoholem',
    kategorie: 'alkohol',
    popis: '10-položkový screeningový test WHO pro identifikaci rizikového nebo škodlivého pití alkoholu.',
    casNaplneni: '3–5 min',
    pocetOtazek: 10,
    castoU: ['F10', 'F10.1', 'F10.2'],
    zdroj: 'Saunders JB et al. (1993). WHO – volně dostupné.',
    url: 'https://www.who.int/publications/i/item/audit-the-alcohol-use-disorders-identification-test',
    instrukce: 'Odpovězte na otázky o konzumaci alkoholu v posledním roce.',
    otazky: [
      { id: 1,  text: 'Jak často pijete alkohol?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Jednou za měsíc nebo méně',hodnota:1},{label:'2 – Dvakrát až čtyřikrát za měsíc',hodnota:2},{label:'3 – Dvakrát až třikrát za týden',hodnota:3},{label:'4 – Čtyřikrát a vícekrát za týden',hodnota:4}]},
      { id: 2,  text: 'Kolik standardních alkoholových nápojů vypijete v den, kdy pijete?', odpovedi: [
        {label:'0 – 1 nebo 2',hodnota:0},{label:'1 – 3 nebo 4',hodnota:1},{label:'2 – 5 nebo 6',hodnota:2},{label:'3 – 7, 8 nebo 9',hodnota:3},{label:'4 – 10 nebo více',hodnota:4}]},
      { id: 3,  text: 'Jak často jste v jedné příležitosti vypil/a 6 nebo více standardních nápojů?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Méně než jednou za měsíc',hodnota:1},{label:'2 – Jednou za měsíc',hodnota:2},{label:'3 – Jednou za týden',hodnota:3},{label:'4 – Každý den nebo téměř každý den',hodnota:4}]},
      { id: 4,  text: 'Jak často jste za posledních 12 měsíců zjistil/a, že nejste schopen/schopna přestat pít, jakmile jste začal/a?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Méně než jednou za měsíc',hodnota:1},{label:'2 – Jednou za měsíc',hodnota:2},{label:'3 – Jednou za týden',hodnota:3},{label:'4 – Každý den nebo téměř každý den',hodnota:4}]},
      { id: 5,  text: 'Jak často jste za posledních 12 měsíců v důsledku pití alkoholu nesplnil/a to, co se od vás normálně očekávalo?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Méně než jednou za měsíc',hodnota:1},{label:'2 – Jednou za měsíc',hodnota:2},{label:'3 – Jednou za týden',hodnota:3},{label:'4 – Každý den nebo téměř každý den',hodnota:4}]},
      { id: 6,  text: 'Jak často jste za posledních 12 měsíců potřeboval/a nápoj po předchozím nadměrném pití ráno, abyste se „dal/a dohromady"?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Méně než jednou za měsíc',hodnota:1},{label:'2 – Jednou za měsíc',hodnota:2},{label:'3 – Jednou za týden',hodnota:3},{label:'4 – Každý den nebo téměř každý den',hodnota:4}]},
      { id: 7,  text: 'Jak často jste za posledních 12 měsíců cítil/a výčitky svědomí nebo se cítil/a provinile po pití alkoholu?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Méně než jednou za měsíc',hodnota:1},{label:'2 – Jednou za měsíc',hodnota:2},{label:'3 – Jednou za týden',hodnota:3},{label:'4 – Každý den nebo téměř každý den',hodnota:4}]},
      { id: 8,  text: 'Jak často jste za posledních 12 měsíců nedokázal/a si vzpomenout na to, co se stalo předchozí noc, protože jste pil/a?', odpovedi: [
        {label:'0 – Nikdy',hodnota:0},{label:'1 – Méně než jednou za měsíc',hodnota:1},{label:'2 – Jednou za měsíc',hodnota:2},{label:'3 – Jednou za týden',hodnota:3},{label:'4 – Každý den nebo téměř každý den',hodnota:4}]},
      { id: 9,  text: 'Zranil/a jste sebe nebo někoho jiného v důsledku svého pití?', odpovedi: [
        {label:'0 – Ne',hodnota:0},{label:'2 – Ano, ale ne za posledních 12 měsíců',hodnota:2},{label:'4 – Ano, za posledních 12 měsíců',hodnota:4}]},
      { id: 10, text: 'Měl přátel, příbuzný, lékař nebo jiný zdravotní pracovník zájem o vaše pití nebo vám navrhoval, abyste omezil/a pití?', odpovedi: [
        {label:'0 – Ne',hodnota:0},{label:'2 – Ano, ale ne za posledních 12 měsíců',hodnota:2},{label:'4 – Ano, za posledních 12 měsíců',hodnota:4}]},
    ],
    skoring: {
      rozsah: [0, 40],
      interpretace: [
        { od: 0,  do: 7,  label: 'Nízké riziko',              barva: 'green',  popis: 'Bez nebo minimální riziko problémového pití.' },
        { od: 8,  do: 15, label: 'Rizikové pití',             barva: 'yellow', popis: 'Doporučena krátká intervence (brief counselling).' },
        { od: 16, do: 19, label: 'Škodlivé pití',             barva: 'orange', popis: 'Doporučena krátká intervence + sledování.' },
        { od: 20, do: 40, label: 'Závislost na alkoholu',     barva: 'red',    popis: 'Doporučeno odborné vyšetření a léčba závislosti.' },
      ],
    },
  },

  {
    id: 'cage',
    zkratka: 'CAGE',
    nazev: 'CAGE dotazník pro alkohol',
    kategorie: 'alkohol',
    popis: '4-položkový rychlý screening závislosti na alkoholu. Zkratka z: Cut down, Annoyed, Guilty, Eye-opener.',
    casNaplneni: '< 1 min',
    pocetOtazek: 4,
    castoU: ['F10', 'F10.2'],
    zdroj: 'Mayfield D, McLeod G, Hall P (1974). Volně dostupné (public domain).',
    instrukce: 'Odpovězte ANO nebo NE na každou otázku.',
    otazky: [
      { id: 1, text: 'Měl/a jste kdy pocit, že byste měl/a omezit (Cut down) pití?' },
      { id: 2, text: 'Rozčiloval/a (Annoyed) vás kdy někdo tím, že kritizoval vaše pití?' },
      { id: 3, text: 'Cítil/a jste se kdy špatně nebo vinně (Guilty) kvůli svému pití?' },
      { id: 4, text: 'Pil/a jste někdy ráno jako první věc (Eye-opener), abyste zklidnil/a nervy nebo zbavil/a kocoviny?' },
    ].map(q => ({
      ...q,
      odpovedi: [
        { label: 'Ano', hodnota: 1 },
        { label: 'Ne', hodnota: 0 },
      ],
    })),
    skoring: {
      rozsah: [0, 4],
      cutoff: 2,
      interpretace: [
        { od: 0, do: 1, label: 'Nízké riziko',    barva: 'green',  popis: 'Nízká pravděpodobnost problémů s alkoholem.' },
        { od: 2, do: 4, label: 'Screening pozitivní', barva: 'red', popis: '≥2 odpovědi ANO jsou klinicky signifikantní; doporučeno podrobnější vyšetření.' },
      ],
    },
  },

  // ════════════════════════════════════════════════
  // SPÁNEK
  // ════════════════════════════════════════════════

  {
    id: 'isi',
    zkratka: 'ISI',
    nazev: 'Index závažnosti nespavosti',
    kategorie: 'spanek',
    popis: '7-položkový nástroj pro hodnocení závažnosti nespavosti a jejího dopadu na fungování.',
    casNaplneni: '3–5 min',
    pocetOtazek: 7,
    castoU: ['F51.0', 'F32', 'F41.1', 'F43.1'],
    zdroj: 'Morin CM (1993). Volně dostupné.',
    instrukce: 'U každé z níže uvedených otázek prosím vyberte odpověď, která nejlépe popisuje váš spánek za posledních 2 týdny.',
    otazky: [
      { id: 1, text: 'Závažnost problémů s usínáním', odpovedi: [
        {label:'0 – Žádné',hodnota:0},{label:'1 – Mírné',hodnota:1},{label:'2 – Středně závažné',hodnota:2},{label:'3 – Závažné',hodnota:3},{label:'4 – Velmi závažné',hodnota:4}]},
      { id: 2, text: 'Závažnost problémů s udržením spánku', odpovedi: [
        {label:'0 – Žádné',hodnota:0},{label:'1 – Mírné',hodnota:1},{label:'2 – Středně závažné',hodnota:2},{label:'3 – Závažné',hodnota:3},{label:'4 – Velmi závažné',hodnota:4}]},
      { id: 3, text: 'Závažnost problémů s příliš časným probouzením', odpovedi: [
        {label:'0 – Žádné',hodnota:0},{label:'1 – Mírné',hodnota:1},{label:'2 – Středně závažné',hodnota:2},{label:'3 – Závažné',hodnota:3},{label:'4 – Velmi závažné',hodnota:4}]},
      { id: 4, text: 'Spokojenost s aktuálním spánkovým vzorcem', odpovedi: [
        {label:'0 – Spokojený/á',hodnota:0},{label:'1 – Poněkud spokojený/á',hodnota:1},{label:'2 – Neutrální',hodnota:2},{label:'3 – Poněkud nespokojený/á',hodnota:3},{label:'4 – Velmi nespokojený/á',hodnota:4}]},
      { id: 5, text: 'Nakolik je vaše nespavost patrná ostatním (zhoršená kvalita života, únava apod.)?', odpovedi: [
        {label:'0 – Vůbec ne patrná',hodnota:0},{label:'1 – Trochu',hodnota:1},{label:'2 – Středně',hodnota:2},{label:'3 – Hodně',hodnota:3},{label:'4 – Extrémně patrná',hodnota:4}]},
      { id: 6, text: 'Jak moc vás trápí (znepokojuje) vaše nespavost?', odpovedi: [
        {label:'0 – Vůbec ne',hodnota:0},{label:'1 – Trochu',hodnota:1},{label:'2 – Středně',hodnota:2},{label:'3 – Hodně',hodnota:3},{label:'4 – Velmi',hodnota:4}]},
      { id: 7, text: 'V jaké míře zasahuje vaše nespavost do každodenního fungování (únava, schopnost fungovat, koncentrace, paměť, nálada apod.)?', odpovedi: [
        {label:'0 – Vůbec nezasahuje',hodnota:0},{label:'1 – Trochu',hodnota:1},{label:'2 – Středně',hodnota:2},{label:'3 – Hodně',hodnota:3},{label:'4 – Velmi silně zasahuje',hodnota:4}]},
    ],
    skoring: {
      rozsah: [0, 28],
      interpretace: [
        { od: 0,  do: 7,  label: 'Žádná klinicky závažná nespavost', barva: 'green'  },
        { od: 8,  do: 14, label: 'Subklinická nespavost',            barva: 'yellow', popis: 'Mírné příznaky; monitorovat.' },
        { od: 15, do: 21, label: 'Klinická nespavost (střední)',     barva: 'orange', popis: 'Doporučena intervence (KBT-I nebo farmakoterapie).' },
        { od: 22, do: 28, label: 'Klinická nespavost (těžká)',       barva: 'red',    popis: 'Intenzivní léčba.' },
      ],
    },
  },

  {
    id: 'ess',
    zkratka: 'ESS',
    nazev: 'Epworthova škála spavosti',
    kategorie: 'spanek',
    popis: '8-položkový nástroj pro hodnocení denní spavosti. Hodnotí pravděpodobnost podřimování v různých situacích.',
    licencniUpozorneni: '© Epworth Sleep Centre, M.W. Johns. Škála je volně dostupná pro nekomerční klinické použití. Komerční využití vyžaduje licenci.',
    casNaplneni: '3–5 min',
    pocetOtazek: 8,
    castoU: ['F51.1', 'F51'],
    zdroj: 'Johns MW (1991). © Epworth Sleep Centre. Volně dostupné pro klinické nekomerční použití.',
    instrukce: 'Jak pravděpodobné je, že byste se podřimoval/a nebo usnul/a v následujících situacích, na rozdíl od pouhé únavy? I když jste v poslední době žádnou z těchto situací nezažil/a, zkuste odhadnout, jak by na vás zapůsobily.',
    otazky: [
      { id: 1, text: 'Sezení a čtení' },
      { id: 2, text: 'Sledování televize' },
      { id: 3, text: 'Sezení nečinně na veřejném místě (divadlo, schůze)' },
      { id: 4, text: 'Jako spolujezdec v autě jedoucím hodinu bez přestávky' },
      { id: 5, text: 'Ležení k odpočinku odpoledne, pokud to situace dovoluje' },
      { id: 6, text: 'Sezení a povídání s někým' },
      { id: 7, text: 'Tiché sezení po obědě bez alkoholu' },
      { id: 8, text: 'V autě, při zastavení v dopravní zácpě na několik minut' },
    ].map(q => ({
      ...q,
      odpovedi: [
        { label: '0 – Nikdy bych nedřím', hodnota: 0 },
        { label: '1 – Malá pravděpodobnost podřimování', hodnota: 1 },
        { label: '2 – Střední pravděpodobnost podřimování', hodnota: 2 },
        { label: '3 – Vysoká pravděpodobnost podřimování', hodnota: 3 },
      ],
    })),
    skoring: {
      rozsah: [0, 24],
      interpretace: [
        { od: 0,  do: 10, label: 'Normální spavost',           barva: 'green'  },
        { od: 11, do: 12, label: 'Mírná nadměrná spavost',     barva: 'yellow' },
        { od: 13, do: 15, label: 'Střední nadměrná spavost',   barva: 'orange', popis: 'Zvážit vyšetření spánkovou laboratoří.' },
        { od: 16, do: 24, label: 'Těžká nadměrná spavost',     barva: 'red',    popis: 'Urgentní vyšetření, možná narkolepsie nebo spánková apnoe.' },
      ],
    },
  },

  // ════════════════════════════════════════════════
  // POHODA
  // ════════════════════════════════════════════════

  {
    id: 'who5',
    zkratka: 'WHO-5',
    nazev: 'Index pohody WHO (WHO-5)',
    kategorie: 'obecne',
    popis: '5-položkový krátký dotazník měřící subjektivní psychickou pohodu. Výsledné skóre 0–100. Skóre ≤ 50 % naznačuje depresi.',
    casNaplneni: '< 2 min',
    pocetOtazek: 5,
    castoU: ['F32', 'F33', 'F41', 'F34.1'],
    zdroj: 'WHO Regional Office for Europe (1998). Volně dostupné.',
    url: 'https://www.psykiatri-regionh.dk/who-5/Pages/default.aspx',
    instrukce: 'Prosím označte pro každé z níže uvedených tvrzení, jak dobře popisuje, jak jste se cítil/a za posledních 14 dní.',
    otazky: [
      { id: 1, text: 'Byl/a jsem veselý/á a dobré nálady', odpovedi: [
        {label:'5 – Po celou dobu',hodnota:5},{label:'4 – Většinu doby',hodnota:4},{label:'3 – Více než polovinu doby',hodnota:3},{label:'2 – Méně než polovinu doby',hodnota:2},{label:'1 – Občas',hodnota:1},{label:'0 – Vůbec ne',hodnota:0}]},
      { id: 2, text: 'Cítil/a jsem se klidný/á a vyrovnaný/á', odpovedi: [
        {label:'5 – Po celou dobu',hodnota:5},{label:'4 – Většinu doby',hodnota:4},{label:'3 – Více než polovinu doby',hodnota:3},{label:'2 – Méně než polovinu doby',hodnota:2},{label:'1 – Občas',hodnota:1},{label:'0 – Vůbec ne',hodnota:0}]},
      { id: 3, text: 'Cítil/a jsem se aktivní/á a energický/á', odpovedi: [
        {label:'5 – Po celou dobu',hodnota:5},{label:'4 – Většinu doby',hodnota:4},{label:'3 – Více než polovinu doby',hodnota:3},{label:'2 – Méně než polovinu doby',hodnota:2},{label:'1 – Občas',hodnota:1},{label:'0 – Vůbec ne',hodnota:0}]},
      { id: 4, text: 'Ráno jsem se probouzel/a svěží/á a odpočatý/á', odpovedi: [
        {label:'5 – Po celou dobu',hodnota:5},{label:'4 – Většinu doby',hodnota:4},{label:'3 – Více než polovinu doby',hodnota:3},{label:'2 – Méně než polovinu doby',hodnota:2},{label:'1 – Občas',hodnota:1},{label:'0 – Vůbec ne',hodnota:0}]},
      { id: 5, text: 'Můj každodenní život byl plný věcí, které mě zajímají', odpovedi: [
        {label:'5 – Po celou dobu',hodnota:5},{label:'4 – Většinu doby',hodnota:4},{label:'3 – Více než polovinu doby',hodnota:3},{label:'2 – Méně než polovinu doby',hodnota:2},{label:'1 – Občas',hodnota:1},{label:'0 – Vůbec ne',hodnota:0}]},
    ],
    skoring: {
      rozsah: [0, 25],
      nasobitel: 4, // výsledek × 4 = 0–100 %
      interpretace: [
        { od: 0,  do: 12, label: 'Nízká pohoda – možná deprese', barva: 'red',    popis: 'Skóre ≤ 50 % (≤12 bodů) → doporučen screening deprese (PHQ-9).' },
        { od: 13, do: 17, label: 'Středně nízká pohoda',         barva: 'yellow' },
        { od: 18, do: 25, label: 'Dobrá psychická pohoda',        barva: 'green'  },
      ],
    },
    poznamka: 'Skóre 0–25 bodů → vynásobit 4 pro procenta (0–100 %). Skóre ≤ 50 % (≤12) → doporučen PHQ-9.',
  },
]

export default SKALY
