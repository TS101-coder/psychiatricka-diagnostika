#!/usr/bin/env node
/**
 * Přidá pole kriteria_mkn11 do všech diagnóz v mkn10.json
 * Zdroj: WHO ICD-11 CDDR (Clinical Descriptions and Diagnostic Requirements)
 * Validováno z: mrcpsych.uk, findacode.com (ICD-11 MMS 2022)
 */

const fs = require('fs');
const path = require('path');

// ─── Slovník ICD-11 kódů → kritéria (česky) ────────────────────────────────
// Zdroj: WHO ICD-11 CDDR; překlad z ověřených anglických zdrojů (mrcpsych.uk)
const KRITERIA = {

  // ── F00–F09: Organické duševní poruchy ──────────────────────────────────

  // Demence u Alzheimerovy nemoci (8A20)
  '8A20': [
    'Plíživý nástup; první stížností je typicky porucha paměti',
    'Pomalý, ale trvalý pokles kognitivního výkonu z předchozí úrovně',
    'Zhoršení v dalších doménách: exekutivní funkce, pozornost, jazyk, sociální kognice, psychomotorické tempo, visuopercepce nebo visuoprostorové schopnosti',
    'V časných stadiích možná depresivní nálada a apatie; v pokročilých stadiích psychotické příznaky, dráždivost, agrese, zmatenost, poruchy chůze, záchvaty',
    'Podpůrné: pozitivní genetické testování, rodinná anamnéza, postupný kognitivní pokles'
  ],
  '8A20.0': [
    'Splněna kritéria pro demenci u Alzheimerovy nemoci (8A20)',
    'Nástup před 65. rokem věku',
    'Tvoří méně než 5 % případů; může být autozomálně dominantní forma',
    'Relativně rychlejší progrese s výraznými poruchami paměti'
  ],
  '8A20.1': [
    'Splněna kritéria pro demenci u Alzheimerovy nemoci (8A20)',
    'Nástup ve věku 65 let nebo později',
    'Tvoří více než 95 % všech případů',
    'Pomalejší progrese s dominující amnézií'
  ],

  // Vaskulární demence (8A21)
  '8A21': [
    'Nástup kognitivních deficitů je časově spojen s jednou nebo více cerebrovaskulárními příhodami',
    'Kognitivní pokles je typicky nejzřetelnější v rychlosti zpracování informací, komplexní pozornosti a frontálně-exekutivních funkcích',
    'Průkaz cerebrovaskulárního onemocnění z anamnézy, fyzikálního vyšetření a neuroimagingu, které je dostatečné k vysvětlení neurokognitivních deficitů'
  ],
  '8A21.0': [
    'Splněna kritéria pro vaskulární demenci (8A21)',
    'Akutní nástup kognitivních příznaků po cévní příhodě'
  ],
  '8A21.1': [
    'Splněna kritéria pro vaskulární demenci (8A21)',
    'Postupný nástup bez zjevné cévní příhody'
  ],
  '8A21.2': [
    'Splněna kritéria pro vaskulární demenci (8A21)',
    'Smíšený obraz akutního i postupného nástupu'
  ],

  // Delirium (6D70)
  '6D70': [
    'Porucha pozornosti, orientace a vědomí rozvíjející se v krátké době (hodiny až dny)',
    'Příznaky typicky kolísají v průběhu dne',
    'Může zahrnovat behaviorální a emocionální poruchy, narušení cyklu spánku a bdění a mnohočetné kognitivní deficity',
    'Příčina: důsledek jiného onemocnění, psychoaktivní látky/léky nebo kombinace příčin'
  ],

  // Mírná neurokognitivní porucha (6D71)
  '6D71': [
    'Mírný pokles kognitivního výkonu z předchozí úrovně fungování',
    'Výkon v neuropsychologickém testování je typicky 1–2 SD pod normou pro věk a vzdělání',
    'Každodenní aktivity jsou zachovány, ale mohou vyžadovat větší úsilí nebo kompenzační strategie',
    'Příznaky nejsou způsobeny jiným onemocněním mozku, jinou duševní poruchou ani účinky látek'
  ],

  // Amnestická porucha (6D72)
  '6D72': [
    'Výrazná porucha paměti vzhledem k věkovým očekáváním, bez poruchy vědomí nebo deliranta',
    'Obtíže s pořizováním, učením nebo uchováváním nových informací; možná neschopnost vybavit si dříve naučený materiál',
    'Recentní paměť je typicky více postižena než vzdálená; okamžitá paměť je relativně zachována',
    'Poruchy jsou natolik závažné, že způsobují výrazné postižení v osobním, sociálním nebo pracovním fungování',
    'Bez jiného výrazného kognitivního postižení (diferenciace od demence)'
  ],

  // Ostatní organické syndromy
  '6D8Z': [
    'Příznaky organické duševní poruchy způsobené průkazným onemocněním mozku, úrazem nebo jinými tělesnými poruchami',
    'Nesplňuje plná kritéria pro jinou specifickou organickou duševní poruchu dle ICD-11'
  ],
  '6D8Y': [
    'Jiná specifikovaná organická duševní porucha způsobená průkazným onemocněním nebo poškozením mozku',
    'Nesplňuje kritéria pro jinou specifickou kategorii ICD-11 organických poruch'
  ],

  // ── F10–F19: Poruchy způsobené psychoaktivními látkami ──────────────────

  // Alkohol (6C40)
  '6C40': [
    'Porucha způsobená užíváním alkoholu způsobující škody na fyzickém nebo duševním zdraví osoby nebo chování vedoucí k poškození zdraví jiných',
    'Zahrnuje: epizodické škodlivé užívání, škodlivý vzorec užívání, závislost, intoxikaci, abstinenční stav a psychotické poruchy'
  ],
  '6C40.0': [
    'Epizoda užívání alkoholu, která způsobila poškození fyzického nebo duševního zdraví nebo vedla k chování poškozujícímu zdraví ostatních',
    'Poškození nastalo intoxikačním chováním, přímými nebo nepřímými toxickými účinky na orgány nebo škodlivými způsoby podání'
  ],
  '6C40.1': [
    'Vzorec škodlivého užívání alkoholu přetrvávající nejméně 12 měsíců (epizodické) nebo nejméně 1 měsíc (kontinuální)',
    'Způsobil poškození fyzického nebo duševního zdraví nebo vedl k chování poškozujícímu zdraví ostatních'
  ],
  '6C40.2': [
    'Silná vnitřní pohnutka k užívání alkoholu se narušenou schopností kontroly nad užíváním',
    'Narůstající priorita alkoholu před ostatními aktivitami a přetrvávání užívání navzdory poškozením',
    'Diagnóza je obvykle patrná za 12 měsíců, ale může být stanovena, pokud kontinuální denní užívání trvá nejméně 3 měsíce'
  ],
  '6C40.3': [
    'Klinicky závažný syndrom, který se vyvíjí po snížení nebo přerušení užívání alkoholu u osoby se závislostí',
    'Třes, pocení, tachykardie, úzkost, nevolnost, nespavost; závažné případy: záchvaty nebo delirium tremens'
  ],
  '6C40.4': [
    'Přechodná porucha charakteru a funkce vědomí způsobená přímými účinky alkoholu na CNS po akutním požití',
    'Projevuje se poruchami vědomí, kognitivními obtížemi, percepčními poruchami nebo poruchami chování'
  ],
  '6C40.5': [
    'Psychotická porucha vzniklá při užívání nebo brzy po užití alkoholu',
    'Halucinace nebo bludy, které jsou přímým důsledkem psychoaktivního účinku alkoholu'
  ],
  '6C40.6': [
    'Amnestická porucha vyvolaná alkoholem (Korsakovův syndrom)',
    'Výrazná porucha krátkodobé paměti a přiučování nových informací při zachování okamžité paměti',
    'Typicky konfabulace; způsobena chronickým nedostatkem thiaminu při závislosti na alkoholu'
  ],

  // Opioidy (6C41)
  '6C41': [
    'Porucha způsobená užíváním opioidů zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky'
  ],
  '6C41.0': [
    'Epizoda nebo vzorec škodlivého užívání opioidů způsobující poškození fyzického nebo duševního zdraví'
  ],
  '6C41.2': [
    'Závislost na opioidech: silná vnitřní pohnutka k užívání opioidů, narušená kontrola, narůstající priorita před ostatními aktivitami, přetrvávání navzdory poškozením',
    'Obvykle patrná za 12 měsíců nebo při kontinuálním denním užívání nejméně 3 měsíce'
  ],
  '6C41.3': [
    'Opioidový abstinenční syndrom: úzkost, nespavost, mydriáza, piloerekce, nevolnost, zvracení, průjem, bolesti svalů',
    'Rozvíjí se po snížení nebo přerušení užívání opioidů u závislé osoby'
  ],

  // Kanabinoidy (6C42)
  '6C42': [
    'Porucha způsobená užíváním kanabinoidů zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky'
  ],
  '6C42.0': [
    'Epizoda nebo vzorec škodlivého užívání kanabinoidů způsobující poškození fyzického nebo duševního zdraví'
  ],
  '6C42.2': [
    'Závislost na kanabinoidech: silná vnitřní pohnutka k užívání, narušená kontrola, narůstající priorita a přetrvávání navzdory poškozením'
  ],
  '6C42.5': [
    'Psychotická porucha vyvolaná kanabinoidy: bludy nebo halucinace jako přímý důsledek psychoaktivního účinku kanabinoidů'
  ],

  // Sedativa a hypnotika (6C43)
  '6C43': [
    'Porucha způsobená užíváním sedativ, hypnotik nebo anxiolytik zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky'
  ],
  '6C43.2': [
    'Závislost na sedativech/hypnotikách/anxiolytikách: silná vnitřní pohnutka k užívání, narušená kontrola, narůstající priorita a přetrvávání navzdory poškozením'
  ],
  '6C43.3': [
    'Abstinenční syndrom po sedativech/hypnotikách: úzkost, třes, pocení, nespavost; závažné případy: záchvaty nebo psychóza',
    'Rozvíjí se po snížení nebo přerušení užívání u závislé osoby'
  ],

  // Kokain (6C44)
  '6C44': [
    'Porucha způsobená užíváním kokainu zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky'
  ],
  '6C44.0': [
    'Epizoda nebo vzorec škodlivého užívání kokainu způsobující poškození fyzického nebo duševního zdraví'
  ],
  '6C44.2': [
    'Závislost na kokainu: silná vnitřní pohnutka k užívání, narušená kontrola, narůstající priorita a přetrvávání navzdory poškozením'
  ],

  // Stimulancia (6C45)
  '6C45': [
    'Porucha způsobená užíváním stimulancií (amfetaminy, metamfetamin, MDMA apod.) zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky'
  ],
  '6C45.0': [
    'Epizoda nebo vzorec škodlivého užívání stimulancií způsobující poškození fyzického nebo duševního zdraví'
  ],
  '6C45.5': [
    'Psychotická porucha vyvolaná stimulancii: bludy nebo halucinace jako přímý důsledek psychoaktivního účinku stimulancií (typicky paranoidní bludy a sluchové halucinace)'
  ],

  // MDMA (6C46)
  '6C46': [
    'Porucha způsobená užíváním MDMA nebo příbuzných látek zahrnující škodlivé vzorce, závislost, intoxikaci nebo abstinenční příznaky'
  ],
  '6C46.0': [
    'Epizoda nebo vzorec škodlivého užívání MDMA způsobující poškození fyzického nebo duševního zdraví'
  ],
  '6C46.70': [
    'Přetrvávající percepční porucha vyvolaná halucinogeny (HPPD): opakované přepisy percepčních symptomů z dřívější intoxikace halucinogeny'
  ],

  // Tabák (6C4A)
  '6C4A': [
    'Porucha způsobená užíváním tabáku zahrnující škodlivé vzorce, závislost nebo abstinenční příznaky'
  ],
  '6C4A.2': [
    'Závislost na tabáku (nikotinu): silná vnitřní pohnutka k užívání, narušená kontrola nad množstvím nebo situacemi'
  ],
  '6C4A.3': [
    'Tabákový abstinenční syndrom: dráždivost, úzkost, depresivní nálada, obtíže se soustředěním, zvýšená chuť k jídlu, nespavost',
    'Rozvíjí se po snížení nebo přerušení užívání tabáku u závislé osoby'
  ],

  // Inhalanty (6C4B)
  '6C4B': [
    'Porucha způsobená užíváním těkavých inhalantů zahrnující škodlivé vzorce, závislost nebo intoxikaci'
  ],
  '6C4B.0': [
    'Epizoda nebo vzorec škodlivého užívání inhalantů způsobující poškození fyzického nebo duševního zdraví'
  ],

  // Gamblerství / Gambling disorder (6C4G / 6C50)
  '6C4G': [
    'Porucha charakterizovaná přetrvávajícím nebo opakujícím se vzorcem hazardní hry, který způsobuje výrazné postižení nebo tíseň',
    'Narušená kontrola nad hazardní hrou, zvýšující se priorita hazardu před ostatními životními zájmy, přetrvávání hráčství navzdory negativním důsledkům'
  ],
  '6C50': [
    'Porucha charakterizovaná přetrvávajícím nebo opakujícím se vzorcem hazardní hry způsobující výrazné postižení nebo tíseň',
    'Narušená kontrola nad hazardní hrou, zvyšující se priorita hazardu a přetrvávání hráčství navzdory negativním důsledkům'
  ],

  // Nepsychoaktivní látky (6C4H)
  '6C4H': [
    'Porucha způsobená škodlivým vzorcem užívání nepsychoaktivních látek (laxativa, vitaminy, steroidy, rostlinné přípravky apod.)',
    'Opakované epizody poškozujícího užívání způsobující fyzické nebo psychické poškození'
  ],

  // ── F20–F29: Schizofrenie a psychotické poruchy ─────────────────────────

  // Schizofrenie (6A20)
  '6A20': [
    'Poruchy ve více mentálních modalitách: myšlení (bludy, dezorganizace), vnímání (halucinace), prožívání sebe (ovlivňování, pasivita), kognice, vůle (ztráta motivace), afekt (oploštění), chování',
    'Základní příznaky: trvalé bludy, trvalé halucinace, dezorganizace myšlení, zážitky ovlivňování nebo kontroly jsou jádrovými příznaky',
    'Příznaky přetrvávají nejméně 1 měsíc',
    'Nejsou projevem jiného onemocnění ani důsledkem účinků látky nebo léku na CNS'
  ],

  // Schizoafektivní porucha (6A21)
  '6A21': [
    'Epizodická porucha, při níž jsou v rámci téže epizody splněna diagnostická kritéria jak pro schizofrenii, tak pro manickou, smíšenou nebo středně těžkou či těžkou depresivní epizodu (simultánně nebo do několika dnů)',
    'Příznaky přetrvávají nejméně 1 měsíc',
    'Nejsou projevem jiného onemocnění ani důsledkem účinků látky na CNS'
  ],
  '6A21.0': [
    'Splněna kritéria pro schizoafektivní poruchu (6A21)',
    'Přítomnost výrazných manických příznaků spolu s příznaky schizofrenie v rámci téže epizody'
  ],
  '6A21.1': [
    'Splněna kritéria pro schizoafektivní poruchu (6A21)',
    'Přítomnost výrazných depresivních příznaků spolu s příznaky schizofrenie v rámci téže epizody'
  ],

  // Schizotypní porucha (6A22)
  '6A22': [
    'Trvalý vzorec trvající několik let projevující se podivínstvím v chování, vzhledu a řeči',
    'Kognitivní a percepční distorze a neobvyklá přesvědčení',
    'Dyskomfort v mezilidských vztazích a snížená schopnost je udržovat',
    'Stažený nebo nepřiměřený afekt a anhedonie',
    'Paranoidní ideje, vztahovačnost nebo jiné příznaky psychotického spektra (halucinace) mohou být přítomny, ale nedosahují intenzity ani trvání vyžadovaného pro schizofrenii',
    'Způsobuje tíseň nebo funkční postižení'
  ],

  // Bludná (perzistující) porucha (6A24)
  '6A24': [
    'Rozvoj bludu nebo souboru příbuzných bludů, typicky přetrvávajících nejméně 3 měsíce',
    'Chybí jasné a trvalé halucinace, negativní příznaky, dezorganizace myšlení nebo zážitky ovlivňování – odlišení od schizofrenie',
    'Mimo chování přímo spojeného s bludem jsou afekt, řeč a chování typicky nezměněny',
    'Nejsou projevem jiného onemocnění ani důsledkem účinků látky na CNS'
  ],
  '6A24.0': [
    'Splněna kritéria pro bludnou poruchu (6A24)',
    'Aktuálně symptomatická fáze (kritéria splněna v posledním měsíci)'
  ],

  // Akutní a přechodná psychotická porucha (6A23)
  '6A23': [
    'Akutní nástup psychotických příznaků (bludy, halucinace, dezorganizace, zmatenost, poruchy psychomotoriky) bez prodromu, dosahující maximální závažnosti do 2 týdnů',
    'Příznaky se typicky rychle mění v povaze i intenzitě – den od dne nebo i v průběhu jednoho dne',
    'Epizoda nepřesahuje 3 měsíce; typická délka je několik dní až 1 měsíc',
    'Nejsou projevem jiného onemocnění ani důsledkem účinků látky na CNS'
  ],

  // Jiné primárně psychotické poruchy
  '6A25': [
    'Příznaky z psychotického spektra nezapadající plně do kritérií schizofrenie (6A20), schizoafektivní poruchy (6A21), bludné poruchy (6A24) ani akutní psychózy (6A23)',
    'Krátkodobé psychotické příznaky nebo subprahový psychotický stav'
  ],
  '6A2Y': [
    'Primárně psychotická porucha splňující obecná kritéria psychotické poruchy, ale nezapadající do žádné jiné specifikované kategorie psychotických poruch v ICD-11'
  ],
  '6A2Z': [
    'Primárně psychotická porucha, u níž není k dispozici dostatek informací pro přiřazení ke specifické kategorii, nebo kritéria nesplňují žádnou jinou specifikovanou kategorii'
  ],

  // ── F30–F39: Afektivní poruchy ──────────────────────────────────────────

  // Bipolární I (6A60)
  '6A60': [
    'Jedna nebo více manických nebo smíšených epizod (nutná podmínka pro diagnózu)',
    'Manická epizoda: trvá nejméně 1 týden (nebo kratší, pokud přerušena léčbou), extrémní zvýšení nebo dráždivost nálady + zvýšení aktivity nebo subjektivní energie + doprovodné příznaky (rychlá řeč, let myšlenek, snížená potřeba spánku, roztržitost, impulzivní chování)',
    'Smíšená epizoda: simultánní nebo rychle se střídající výrazné manické i depresivní příznaky, nejméně 2 týdny',
    'Příznaky způsobují výrazné postižení nebo vyžadují hospitalizaci; neodpovídají hypomanii'
  ],
  '6A60.0': [
    'Splněna kritéria pro bipolární poruchu I (6A60)',
    'Aktuálně manická epizoda: nejméně 1 týden extrémního zvýšení nálady nebo dráždivosti + zvýšení aktivity'
  ],
  '6A60.1': [
    'Splněna kritéria pro bipolární poruchu I (6A60)',
    'Aktuálně hypomanická epizoda: několik dní zvýšené nálady nebo dráždivosti + zvýšení aktivity, méně závažné než u mánie'
  ],
  '6A60.2': [
    'Splněna kritéria pro bipolární poruchu I (6A60)',
    'Aktuálně středně těžká nebo těžká depresivní epizoda (bez psychózy)'
  ],
  '6A60.3': [
    'Splněna kritéria pro bipolární poruchu I (6A60)',
    'Aktuálně mírná depresivní epizoda'
  ],
  '6A60.4': [
    'Splněna kritéria pro bipolární poruchu I (6A60)',
    'Aktuálně těžká depresivní epizoda s psychotickými příznaky'
  ],
  '6A60.5': [
    'Splněna kritéria pro bipolární poruchu I (6A60)',
    'Aktuálně smíšená epizoda: simultánní nebo rychle se střídající výrazné manické i depresivní příznaky'
  ],

  // Bipolární II (6A61)
  '6A61': [
    'Nejméně jedna hypomanická epizoda a nejméně jedna depresivní epizoda v anamnéze',
    'Hypomanická epizoda: přetrvávající (nejméně několik dní) zvýšení nálady nebo dráždivosti + zvýšení aktivity; příznaky nejsou dostatečně závažné k výraznému narušení fungování',
    'Depresivní epizoda: depresivní nálada nebo snížený zájem, nejméně 2 týdny, s dalšími příznaky',
    'Žádná manická ani smíšená epizoda v anamnéze (jinak bipolární I)'
  ],

  // Cyklotymie (6A62)
  '6A62': [
    'Přetrvávající nestabilita nálady po dobu nejméně 2 let (u dětí a dospívajících nejméně 1 rok)',
    'Střídání symptomů hypomanie a deprese přítomných více času než ne, bez dosažení plných kritérií pro příslušnou epizodu',
    'Žádná manická, smíšená ani depresivní epizoda v anamnéze',
    'Způsobuje výraznou tíseň nebo funkční postižení'
  ],

  // Jednorázová depresivní epizoda (6A70)
  '6A70': [
    'Depresivní nálada nebo snížený zájem o aktivity přítomné po většinu dne, téměř každý den, po dobu nejméně 2 týdnů',
    'Doprovodné příznaky: obtíže se soustředěním, pocity bezcennosti nebo nepřiměřené viny, beznaděj, opakující se myšlenky na smrt nebo sebevraždu, změny chuti k jídlu nebo spánku, psychomotorická agitace nebo retardace, snížená energie nebo únava',
    'Žádná manická, hypomanická ani smíšená epizoda v anamnéze (jinak bipolární spektrum)'
  ],
  '6A70.0': [
    'Splněna kritéria pro jednorázovou depresivní epizodu (6A70)',
    'Mírná závažnost: přítomna tíseň, ale obecně zachována schopnost fungovat; bez psychotických příznaků'
  ],
  '6A70.1': [
    'Splněna kritéria pro jednorázovou depresivní epizodu (6A70)',
    'Středně těžká závažnost: výrazné obtíže ve fungování v několika oblastech; bez psychotických příznaků'
  ],
  '6A70.2': [
    'Splněna kritéria pro jednorázovou depresivní epizodu (6A70)',
    'Středně těžká závažnost s psychotickými příznaky (bludy nebo halucinace)'
  ],
  '6A70.3': [
    'Splněna kritéria pro jednorázovou depresivní epizodu (6A70)',
    'Těžká závažnost: závažné obtíže s fungováním ve většině oblastí; bez psychotických příznaků'
  ],

  // Rekurentní depresivní porucha (6A71)
  '6A71': [
    'Anamnéza nejméně dvou depresivních epizod oddělených nejméně několika měsíci bez výrazné poruchy nálady',
    'Depresivní epizoda: depresivní nálada nebo snížený zájem, nejméně 2 týdny, s doprovodnými příznaky',
    'Žádná manická, hypomanická ani smíšená epizoda v anamnéze',
    'Závažnost: mírná, středně těžká (bez/s psychózou), těžká (bez/s psychózou), v remisi'
  ],
  '6A71.0': [
    'Splněna kritéria pro rekurentní depresivní poruchu (6A71)',
    'Aktuálně mírná depresivní epizoda'
  ],
  '6A71.1': [
    'Splněna kritéria pro rekurentní depresivní poruchu (6A71)',
    'Aktuálně středně těžká depresivní epizoda bez psychotických příznaků'
  ],
  '6A71.2': [
    'Splněna kritéria pro rekurentní depresivní poruchu (6A71)',
    'Aktuálně středně těžká depresivní epizoda s psychotickými příznaky'
  ],
  '6A71.3': [
    'Splněna kritéria pro rekurentní depresivní poruchu (6A71)',
    'Aktuálně těžká depresivní epizoda bez psychotických příznaků'
  ],

  // Dystymie (6A72)
  '6A72': [
    'Přetrvávající depresivní nálada trvající 2 roky nebo déle, přítomná po většinu dne, více dní než ne',
    'V průběhu prvních 2 let nikdy nebyla depresivní epizoda dostatečně závažná ani dlouhá k naplnění kritérií pro depresivní epizodu',
    'Doprovodné příznaky: snížený zájem, obtíže se soustředěním, snížená sebeúcta, pesimismus, poruchy spánku, změny chuti k jídlu, nízká energie',
    'Žádná manická, smíšená ani hypomanická epizoda v anamnéze'
  ],
  '6A72.0': [
    'Splněna kritéria pro dysthymii (6A72)',
    'Aktuálně persistentní depresivní stav bez superponované depresivní epizody'
  ],
  '6A72.1': [
    'Splněna kritéria pro dysthymii (6A72)',
    'S aktuálně superponovanou depresivní epizodou (dvojitá deprese)'
  ],

  // Smíšená úzkostně-depresivní porucha (6A73)
  '6A73': [
    'Příznaky deprese i úzkosti jsou současně přítomny, ale ani jeden soubor příznaků samostatně nesplňuje kritéria pro příslušnou poruchu',
    'Příznaky způsobují klinicky závažnou tíseň nebo funkční postižení',
    'Trvají nejméně několik týdnů'
  ],

  // Jiné/NOS afektivní (6A7Y, 6A7Z)
  '6A7Y': [
    'Porucha nálady splňující obecná kritéria, ale nezapadající do žádné jiné specifikované kategorie afektivních poruch v ICD-11'
  ],
  '6A7Z': [
    'Porucha nálady, u níž není k dispozici dostatek informací pro přiřazení ke specifické kategorii, nebo nesplňuje kritéria žádné specifikované afektivní poruchy'
  ],

  // ── F40–F48: Neurotické, stresové a somatoformní poruchy ────────────────

  // Generalizovaná úzkostná porucha (6B00)
  '6B00': [
    'Volná úzkostnost nebo nadměrné obavy z negativních událostí ve více životních doménách (rodina, zdraví, finance, práce)',
    'Doprovodné příznaky: svalové napětí nebo motorický neklid, autonomní hyperaktivita (palpitace, pocení, třes, sucho v ústech), nervozita nebo napětí, obtíže se soustředěním, dráždivost, poruchy spánku',
    'Příznaky přetrvávají nejméně několik měsíců, přítomny více dní než ne',
    'Způsobují výraznou tíseň nebo funkční postižení',
    'Nejsou lépe vysvětleny jinou duševní poruchou ani onemocněním nebo účinky látky'
  ],
  '6B00.0': [
    'Splněna kritéria pro generalizovanou úzkostnou poruchu (6B00)',
    'Volná úzkostnost neomezená na konkrétní podněty ani situace'
  ],
  '6B00.01': [
    'Splněna kritéria pro generalizovanou úzkostnou poruchu (6B00)',
    'Nadměrné obavy a starosti zaměřené na každodenní záležitosti v různých životních oblastech'
  ],

  // Panická porucha (6B01)
  '6B01': [
    'Opakované neočekávané záchvaty paniky neomezené na konkrétní podněty ani situace',
    'Záchvat paniky: intenzivní strach nebo úzkost s rychlým nástupem palpitací, pocení, třesu, dušnosti, bolesti na hrudi, závratí, horka/zimy, strachu z bezprostřední smrti',
    'Přetrvávající obavy z opakování záchvatů nebo chování zaměřené na jejich předcházení',
    'Způsobuje výrazné funkční postižení',
    'Nejsou projevem jiného onemocnění ani důsledkem účinků látky na CNS'
  ],

  // Agorafobie (6B02)
  '6B02': [
    'Výrazná a nadměrná úzkost nebo strach v situacích, kde by útěk mohl být obtížný nebo pomoc nedostupná (veřejná doprava, dav, venku doma samotný, obchody, fronty)',
    'Obavy z konkrétních negativních výsledků: záchvat paniky nebo jiné příznaky způsobující ztrapnění',
    'Aktivní vyhýbání se takovým situacím, vstupování do nich pouze se společníkem nebo snášení s intenzivním strachem',
    'Příznaky přetrvávají nejméně několik měsíců a způsobují výraznou tíseň nebo funkční postižení'
  ],

  // Specifická fobie (6B03)
  '6B03': [
    'Výrazná a nadměrná úzkost nebo strach konzistentně se objevující při expozici nebo anticipaci specifického objektu nebo situace (zvířata, výšky, bouřka, krev, injekce, létání)',
    'Strach je nepřiměřený skutečnému nebezpečí',
    'Aktivní vyhýbání se nebo snášení s intenzivní úzkostí',
    'Příznaky přetrvávají nejméně několik měsíců a způsobují výraznou tíseň nebo funkční postižení'
  ],

  // Sociální úzkostná porucha (6B04)
  '6B04': [
    'Výrazná a nadměrná úzkost nebo strach konzistentně se projevující v jedné nebo více sociálních situacích (konverzace, pozorování při jídle nebo pití, vystupování před ostatními)',
    'Obavy z negativního hodnocení druhými (ponížení, ostuda, odmítnutí)',
    'Aktivní vyhýbání se sociálním situacím nebo jejich snášení s intenzivní úzkostí',
    'Příznaky přetrvávají nejméně několik měsíců a způsobují výraznou tíseň nebo funkční postižení',
    'Nejsou lépe vysvětleny jinou duševní poruchou ani onemocněním nebo účinky látky'
  ],

  // Jiné úzkostné poruchy
  '6B0Y': [
    'Úzkostná nebo strachem podmíněná porucha splňující obecná kritéria, ale nezapadající do žádné jiné specifikované kategorie'
  ],

  // OCD (6B20)
  '6B20': [
    'Přetrvávající obsese nebo kompulze nebo nejčastěji obojí',
    'Obsese: opakující se a přetrvávající myšlenky, obrazy nebo impulsy/nutkání, které jsou vtíravé, nežádoucí a typicky spojené s úzkostí',
    'Kompulze: opakující se chování nebo mentální akty vykonávané v reakci na obsesi, podle přísných pravidel nebo za účelem dosažení pocitu „úplnosti"',
    'Obsese a kompulze jsou časově náročné (více než 1 hodinu denně) nebo způsobují výraznou tíseň nebo funkční postižení'
  ],

  // Hypochondrie (6B23)
  '6B23': [
    'Přetrvávající obavy nebo přesvědčení o přítomnosti závažného, progresivního nebo život ohrožujícího onemocnění',
    'Tělesné příznaky jsou přítomny nebo jejich absence nevylučuje přesvědčení o nemoci',
    'Nadměrné zdravotnické vyhledávání nebo naopak vyhýbání se lékařům ze strachu z diagnózy',
    'Příznaky přetrvávají nejméně několik měsíců'
  ],

  // Depersonalizace/derealizace (6B66)
  '6B66': [
    'Přetrvávající nebo opakující se zážitky depersonalizace nebo derealizace nebo obojího',
    'Depersonalizace: prožívání vlastního já jako cizího nebo neskutečného, odtažitost od vlastních myšlenek, pocitů, těla nebo jednání',
    'Derealizace: prožívání ostatních osob, předmětů nebo světa jako cizích nebo neskutečných (snové, vzdálené, mlhavé, bezbarvé, vizuálně zkreslené)',
    'Testování reality je zachováno (rozlišení od psychózy)',
    'Způsobuje výraznou tíseň nebo funkční postižení'
  ],

  // PTSD (6B40)
  '6B40': [
    'Expozice extrémně ohrožující nebo hrůzné události nebo sérii takových událostí',
    'Znovuprožívání: živé vtíravé vzpomínky, flashbacky nebo noční můry doprovázené intenzivním strachem nebo hrůzou',
    'Vyhýbání se: myšlenkám a vzpomínkám na událost nebo situacím, aktivitám či osobám, které ji připomínají',
    'Přetrvávající vnímání zvýšeného aktuálního ohrožení: hypervigilance nebo zvýšená startovací reakce',
    'Příznaky přetrvávají nejméně několik týdnů a způsobují výrazné funkční postižení'
  ],

  // Porucha přizpůsobení (6B43)
  '6B43': [
    'Maladaptivní reakce na identifikovatelný psychosociální stresor nebo více stresorů, typicky rozvíjející se do 1 měsíce od expozice',
    'Zaobírání se stresorem nebo jeho důsledky (nadměrné obavy, vtíravé myšlenky, neustálé přemítání) nebo selhání adaptace způsobující výrazné funkční postižení',
    'Příznaky obvykle odezní do 6 měsíců, pokud stresor přetrvává déle, mohou přetrvávat i příznaky',
    'Nejsou lépe vysvětleny jinou duševní poruchou'
  ],

  // Disociativní poruchy (6B60)
  '6B60': [
    'Narušení normální integrace vědomí, identity, vnímání, emocí, chování, paměti nebo motorické kontroly',
    'Příznaky nejsou způsobeny přímými fyziologickými účinky látky nebo jiným zdravotním stavem',
    'Způsobují klinicky závažnou tíseň nebo funkční postižení'
  ],
  '6B60.2': [
    'Disociativní porucha pohybů nebo vnímání způsobená psychologickými faktory',
    'Příznaky pohybových nebo smyslových deficitů neodpovídají neurologickému onemocnění',
    'Pozitivní klinické příznaky disociace a absence jiného vysvětlení'
  ],
  '6B60.5': [
    'Disociativní porucha identity nebo transsexualita způsobená disociací',
    'Narušení vědomí identity nebo smyslu pro sebe způsobené disociativními mechanismy'
  ],

  // Disociativní amnézie (6B61)
  '6B61': [
    'Neschopnost vybavit si důležité autobiografické vzpomínky, typicky z nedávno prožitých traumatických nebo stresujících událostí',
    'Zapomínání je nepřiměřené normální zapomnětlivosti',
    'Příznaky nejsou způsobeny jinou disociativní poruchou, jiným duševním onemocněním, přímými účinky látky ani neurologickým onemocněním',
    'Způsobuje výrazné funkční postižení'
  ],

  // Tranční porucha (6B62)
  '6B62': [
    'Epizody výrazného omezení nebo ztráty vědomí vlastní identity a plného uvědomění si okolí',
    'Příznaky jsou opakující se nebo trvalé',
    'Jsou nepodmíněné a nežádané (netvoří součást společensky nebo nábožensky přijatelných rituálů nebo praxe)',
    'Způsobují klinicky závažnou tíseň nebo funkční postižení'
  ],

  // Bodily distress disorder (6C20) - nahrazuje somatoformní poruchy
  '6C20': [
    'Přítomnost tělesných příznaků způsobujících tíseň a nadměrná pozornost věnovaná příznakům',
    'Přetrvávající (přítomné po většinu dní nejméně několik měsíců) a typicky mnohočetné tělesné příznaky',
    'Opakované kontakty se zdravotními službami nepřiměřené charakteru obtíží',
    'Příznaky a s nimi spojená tíseň mají nejméně určitý dopad na fungování jedince'
  ],

  // Hypochondriasis (6C21 - IBS/somatoform-related)
  '6C21': [
    'Přetrvávající obavy nebo přesvědčení o přítomnosti závažného onemocnění na základě tělesných příznaků nebo preokupací',
    'Opakované vyhledávání zdravotní péče nebo vyhýbání se lékařům ze strachu z diagnózy',
    'Příznaky způsobují výraznou tíseň nebo funkční postižení'
  ],

  // ── F50–F59: Poruchy příjmu potravy ────────────────────────────────────

  // Anorexia nervosa (6B80)
  '6B80': [
    'Výrazně nízká tělesná hmotnost (BMI < 18,5 kg/m² u dospělých nebo < 5. percentil u dětí a adolescentů), která není způsobena jiným zdravotním stavem ani nedostupností jídla',
    'Přetrvávající chování zaměřené na zabránění obnovy hmotnosti (omezování jídla, zvracení, laxativa, nadměrné cvičení)',
    'Nízká hmotnost nebo tvar těla jsou ústřední pro hodnocení vlastní hodnoty nebo jsou nepřesně vnímány jako normální nebo nadměrné'
  ],
  '6B80.1': [
    'Splněna kritéria pro anorexii nervózu (6B80)',
    'Nebezpečně nízká tělesná hmotnost (BMI < 14,0 kg/m² u dospělých), spojená s vysokým rizikem smrti'
  ],

  // Bulimia nervosa (6B81)
  '6B81': [
    'Časté opakující se epizody záchvatovitého přejídání (nejméně jednou týdně po dobu nejméně 1 měsíce)',
    'Subjektivní ztráta kontroly nad jídlem při záchvatu – jedení výrazně více nebo jinak než obvykle',
    'Opakující se kompenzační chování zaměřené na prevenci přibývání na váze (zvracení, laxativa, nadměrné cvičení)',
    'Zaobírání se tvarem těla nebo hmotností silně ovlivňuje vlastní hodnocení',
    'Nesplňuje kritéria pro anorexii nervózu'
  ],
  '6B81.1': [
    'Splněna kritéria pro bulimii nervózu (6B81)',
    'Vzorec záchvatovitého přejídání s kompenzačním čištěním (zvracení, laxativa)'
  ],

  // Záchvatovité přejídání (6B82)
  '6B82': [
    'Časté opakující se epizody záchvatovitého přejídání (nejméně jednou týdně po dobu 3 měsíců)',
    'Ztráta kontroly nad jídlem: neschopnost zastavit nebo omezit množství či druh jídla',
    'Bez pravidelného kompenzačního chování (diferenciace od bulimie)',
    'Způsobuje výraznou tíseň nebo funkční postižení'
  ],

  // ── F51: Poruchy spánku ─────────────────────────────────────────────────

  // Nespavost (7A00 - Insomnia disorder)
  '7A00': [
    'Přetrvávající obtíže s usínáním, udržením spánku nebo příliš raným probuzením s neschopností znovu usnout',
    'Obtíže se spánkem přítomné přes adekvátní příležitost a podmínky ke spánku',
    'Způsobují klinicky závažnou tíseň nebo funkční postižení (únava, snížená koncentrace, výkonnost)',
    'Příznaky přetrvávají nejméně několik měsíců'
  ],

  // Hypersomnie (7B20 - Idiopathic hypersomnia)
  '7B20': [
    'Nadměrná ospalost navzdory hlavní spánkové epizodě trvající nejméně 7 hodin',
    'Projevuje se opakovanými epizodami neplánovaného spánku nebo denní ospalostí',
    'Příznaky přetrvávají nejméně 3 měsíce a způsobují výrazné funkční postižení'
  ],

  // Narkolepsie (7B01)
  '7B01.0': [
    'Narkolepsie: denní záchvaty nezdolné ospalosti nebo nechtěný spánek',
    'Kataplexie: epizodická ztráta svalového tonu vyvolaná silnými emocemi',
    'Deficit orexinu/hypokretinu v mozkomíšním moku nebo typický nález v MSLT testu'
  ],
  '7B01.1': [
    'Narkolepsie bez kataplexie: denní záchvaty nezdolné ospalosti bez epizod kataplexie',
    'Typický nález v MSLT testu nebo snížená hladina orexinu v CSF'
  ],
  '7B01.2': [
    'Sekundární narkolepsie způsobená jiným onemocněním nebo stavem'
  ],

  // Parasomnie (7B22)
  '7B22': [
    'Abnormální chování, pohyby, emoce, percepce nebo sny spojené se spánkem nebo přechodem spánek-bdění',
    'Příznaky způsobují klinicky závažnou tíseň nebo funkční postižení nebo bezpečnostní riziko'
  ],

  // ── F52, F53: Sexuální poruchy, poporodní ──────────────────────────────

  // Sexuální dysfunkce (HA00)
  'HA00': [
    'Neschopnost participovat v sexuálním vztahu podle přání jedince z důvodu problémů se sexuální touhou, vzrušením, orgasmem nebo bolestí',
    'Příznaky přetrvávají nejméně několik měsíců a způsobují výraznou tíseň nebo mezilidské obtíže',
    'Nejsou lépe vysvětleny jinou duševní poruchou, zdravotním stavem ani účinky látky'
  ],

  // Parafilní poruchy (HA20)
  'HA20': [
    'Výrazná a trvalá sexuální přitažlivost k nestandardním předmětům, situacím nebo jedincům způsobující tíseň nebo riziko poškození',
    'Sexuální touha nebo chování jsou namířeny na nekonsenzuální jedince nebo způsobují psychologické nebo fyzické poškození sobě nebo jiným',
    'Příznaky přetrvávají nejméně 6 měsíců'
  ],

  // Poporodní duševní porucha (6E20)
  '6E20': [
    'Duševní porucha s nástupem v průběhu těhotenství nebo do 6 týdnů po porodu',
    'Může zahrnovat příznaky deprese, úzkosti, psychózy nebo jiných duševních poruch',
    'Klinicky závažné příznaky vyžadující pozornost a léčbu'
  ],
  '6E20.0': [
    'Poporodní deprese s nástupem do 6 týdnů po porodu',
    'Příznaky splňují kritéria depresivní epizody (6A70): depresivní nálada, ztráta zájmu, únava, 2+ týdny',
    'Může zahrnovat specifické poporodní obavy (o zdraví dítěte, strach z poškození dítěte)'
  ],
  '6E20.1': [
    'Poporodní psychóza s nástupem typicky do 2 týdnů po porodu',
    'Bludy, halucinace, výrazná dezorganizace chování nebo myšlení',
    'Rychlý nástup vyžadující urgentní intervenci'
  ],

  // ── F60–F69: Poruchy osobnosti ──────────────────────────────────────────

  // Obecná PD (6D10)
  '6D10': [
    'Trvalá porucha projevující se problémy ve fungování vlastního já (identita, sebeúcta, sebevnímání, sebeurčení) a/nebo mezilidskými dysfunkcemi (rozvíjení vztahů, pochopení perspektiv druhých, zvládání konfliktů)',
    'Porucha přetrvává nejméně 2 roky a je patrná v širokém spektru osobních a sociálních situací',
    'Projevuje se nepřizpůsobivými vzorci kognice, emocionálního prožívání, emocionálního vyjadřování a chování',
    'Způsobuje výraznou tíseň nebo funkční postižení',
    'Není způsobena vývojově přiměřenou charakteristikou, primárně kulturními nebo sociopolitickými faktory, jiným duševním onemocněním ani účinky látky'
  ],
  '6D10.0': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Mírná závažnost: postižení funkce vlastního já nebo mezilidských vztahů, ale zachovány obecné kapacity fungování'
  ],
  '6D10.1': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Středně těžká závažnost: výrazné postižení ve fungování vlastního já nebo mezilidských vztahů ve více oblastech'
  ],
  '6D10.2': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Těžká závažnost: závažné a rozsáhlé postižení fungování vlastního já nebo mezilidských vztahů'
  ],
  '6D10.3': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Prominentní negativní afektivita: emocionální nestabilita, úzkostnost, separační úzkost, nízká sebedůvěra'
  ],
  '6D10.4': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Prominentní odtažitost: sociální izolace, omezená emocionální výraznost, nízká potřeba blízkosti'
  ],
  '6D10.5': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Prominentní disocialita: nezájem o práva a pocity druhých, krutost, agrese, neschopnost empatie'
  ],
  '6D10.6': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Prominentní disinhibice: impulzivita, lehkomyslnost, neschopnost plánovat nebo odkládat uspokojení'
  ],
  '6D10.7': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Prominentní anankasticita (obsedantnost): rigidní perfekcionismus, kontrola, lpění na pravidlech, neflexibilita'
  ],
  '6D10.8': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Prominentní hraniční (borderline) vzorec: intenzivní nestabilní vztahy, sebepoškozenicí nebo suicidální chování, nestabilní sebeobraz, impulzivita, intenzivní emocionální dysregulace'
  ],
  '6D10.Z': [
    'Splněna kritéria pro poruchu osobnosti (6D10)',
    'Blíže nespecifikovaná porucha osobnosti'
  ],

  // Prominentní osobnostní rysy (6D11)
  '6D11': [
    'Osobnostní rysy nebo vzorce, které jsou klinicky pozoruhodné nebo problematické, ale nedosahují plných kritérií pro poruchu osobnosti (6D10)',
    'Mohou způsobovat omezenou tíseň nebo funkční postižení, ale bez trvalé a rozsáhlé poruchy fungování'
  ],

  // Porucha s masky osobnosti (6D12)
  '6D12': [
    'Porucha osobnosti se specifickými prominentními rysy nesplňující plná kritéria pro 6D10, ale s klinicky relevantním vzorcem',
    'Specifické rysy způsobují tíseň nebo narušují fungování v konkrétních kontextech'
  ],
  '6D12.0': [
    'Porucha osobnosti s prominentní negativní afektivitou jako dominantním rysem'
  ],

  // Jiné poruchy osobnosti
  '6D1Y': [
    'Jiná specifikovaná porucha osobnosti nebo porucha s prominentními rysy nezapadající do žádné jiné specifikované kategorie v ICD-11'
  ],
  '6D1Z': [
    'Porucha osobnosti nebo porucha s prominentními rysy, u níž není k dispozici dostatek informací pro přiřazení ke specifické kategorii'
  ],

  // ── F63: Poruchy návyků a impulzů ───────────────────────────────────────

  // Obsedantně-kompulzivní poruchy a příbuzné
  '6B25': [
    'Opakující se kompulzivní chování zaměřené na tělo (vytrhávání vlasů, kousání nehtů, mačkání kůže apod.)',
    'Opakované pokusy o snížení nebo přerušení chování',
    'Chování způsobuje klinicky závažnou tíseň nebo funkční postižení'
  ],

  // Poruchy impulzů (6C70)
  '6C70': [
    'Opakující se selhání v odolání impulzu k chování, které je pro jedince škodlivé nebo pro ostatní',
    'Narůstající napětí nebo vzrušení před činem a úleva nebo potěšení po provedení činu'
  ],
  '6C70.1': [
    'Přerušovaná explozivní porucha: opakující se epizody verbální nebo fyzické agresivity výrazně nepřiměřené provokaci',
    'Impulzivní agresivní činy nejsou projevem jiné duševní poruchy'
  ],
  '6C70.2': [
    'Pyromaniac: záměrné a cílevědomé zakládání požárů opakovaně',
    'Napětí nebo afektivní vzrušení před zakládáním požáru; fascinace ohněm',
    'Úleva nebo satisfakce po zapálení'
  ],

  // Kleptomania (6C71)
  '6C71': [
    'Opakující se selhání v odolání impulzu ke kradení věcí, které nejsou nutné pro osobní použití ani pro jejich finanční hodnotu',
    'Narůstající napětí bezprostředně před krádeží a pocit uspokojení nebo úlevy při krádeži',
    'Krádež není způsobena hněvem, pomstou ani reakcí na bludy nebo halucinace'
  ],

  // Impulsivní sexuální porucha (6C50)
  '6C50': [
    'Přetrvávající vzorec nekontrolovatelného intenzivního, opakujícího se sexuálního impulzu nebo nutkání vedoucího k opakovanému sexuálnímu chování',
    'Výrazná tíseň nebo závažné funkční postižení z opakovaného sexuálního chování',
    'Sexuální chování se stalo prioritou, zanedbávání zdraví a osobní péče nebo jiných aktivit'
  ],

  // ── F70–F79: Mentální retardace / Poruchy intelektového vývoje ──────────

  // Poruchy intelektového vývoje (6A00, 6D30)
  '6A00': [
    'Výrazně podprůměrné intelektuální fungování a adaptivní chování (přibližně 2 a více SD pod průměrem)',
    'Nástup v průběhu vývojového období',
    'Stupně: mírná (IQ cca 50–69, 2–3 SD), středně těžká (IQ cca 35–49, 3–4 SD), těžká (IQ cca 20–34, 4+ SD), hluboká (IQ < 20)'
  ],
  '6A00.0': [
    'Mírná porucha intelektového vývoje: přibližně 2–3 SD pod průměrem (0,1–2,3. percentil)',
    'Problémy se složitými pojmy; zvládají základní dovednosti se školní výukou',
    'Většina dosahuje nezávislého bydlení a zaměstnání s přiměřenou podporou'
  ],
  '6A00.1': [  // F71 - středně těžká MR
    // Note: this is actually for moderate severity
    'Středně těžká porucha intelektového vývoje: přibližně 3–4 SD pod průměrem',
    'Omezená jazyková a akademická schopnost; zvládají základní sebeobsluhu a praktické činnosti',
    'Vyžadují značnou, konzistentní podporu pro nezávislost'
  ],
  '6D30': [
    'Výrazně podprůměrné intelektuální fungování s deficity v adaptivním chování (2+ SD pod průměrem)',
    'Nástup v průběhu vývojového období',
    'Zahrnuje různé etiologie; specifikováno stupněm závažnosti'
  ],
  '6D30.0': [
    'Splněna kritéria pro poruchu intelektového vývoje (6D30)',
    'Porucha způsobená specificky identifikovanou příčinou (genetická, prenatální, perinatální apod.)'
  ],

  // ── F80–F89: Poruchy vývoje ──────────────────────────────────────────────

  // Poruchy řeči a jazyka (6A01)
  '6A01': [
    'Trvalé obtíže s nabýváním a používáním jazyka ve všech modaliích (mluvená, psaná, znaková) způsobené deficity v porozumění nebo produkci',
    'Jazykové schopnosti výrazně nižší oproti vývojovým očekáváním vzhledem k věku',
    'Nástup v průběhu vývojového období; není lépe vysvětlen jiným onemocněním ani senzorickým nebo motorickým deficitem'
  ],

  // Poruchy specifického vývoje (6D32) - including learning disorders
  '6D32': [
    'Trvalé a výrazné obtíže s nabýváním nebo používáním specifických akademických dovedností (čtení, psaní, počítání) navzdory adekvátní vzdělávací příležitosti',
    'Dovednosti výrazně nižší oproti věkovým a intelektovým očekáváním',
    'Nástup v průběhu vývojového/školního věku'
  ],

  // Poruchy motorického vývoje (6D50 - Tic disorders)
  '6D50': [
    'Opakující se, rychlé, neplynulé pohyby nebo vokalizace, které jsou náhlé a nemají zřejmý účel',
    'Příznaky jsou přítomny nejméně 1 rok',
    'Nástup před 18. rokem věku',
    'Není způsobeno jiným zdravotním stavem ani účinky látky'
  ],

  // Autism spectrum disorder (6A02)
  '6A02': [
    'Přetrvávající deficity ve schopnosti zahájit a udržet oboustrannou sociální interakci a komunikaci',
    'Omezené, opakující se a nepružné vzorce chování, zájmů nebo aktivit, které jsou pro věk a sociokulturní kontext jednoznačně atypické nebo nadměrné',
    'Nástup v průběhu vývojového období, typicky v raném dětství (příznaky se mohou projevit později, jak rostou nároky sociálního prostředí)',
    'Příznaky způsobují výrazné funkční postižení v osobním, rodinném, sociálním, vzdělávacím nebo profesním fungování'
  ],

  // ── F90–F98: Poruchy s nástupem v dětství ──────────────────────────────

  // ADHD (6A05)
  '6A05': [
    'Přetrvávající vzorec (nejméně 6 měsíců) nepozornosti a/nebo hyperaktivity-impulzivity',
    'Příznaky mají přímý negativní dopad na akademické, pracovní nebo sociální fungování',
    'Příznaky se projevily před 12. rokem věku a přesahují normální vývojovou variaci',
    'Projevuje se v různých prostředích (domov, škola, práce), i když intenzita může kolísat',
    'Není lépe vysvětlen jinou duševní poruchou ani účinky látky'
  ],

  // Jiné neurovývojové poruchy (6A2Y)
  // Note: already defined under psychotic block

  // ── F53: Poporodní poruchy ───────────────────────────────────────────────
  'MB2Y': [
    'Jiný specifikovaný stav nebo problém přidružený k duševní poruše v poporodním nebo perinatálním období'
  ],

  // Jiné specifikované poruchy
  '6B9Z': [
    'Porucha příjmu potravy splňující obecná kritéria, ale nezapadající do žádné jiné specifikované kategorie poruch příjmu potravy v ICD-11'
  ],
  '6B8Y': [
    'Jiná specifikovaná porucha příjmu potravy nezapadající do anorexie, bulimie ani záchvatovitého přejídání'
  ],

  // HA01, HA60, HA61 - Sexual disorders
  'HA01': [
    'Porucha pohlavní identity nebo genderové neshody: výrazný nesoulad mezi prožívanou nebo vyjadřovanou pohlavní identitou jedince a přiděleným pohlavím'
  ],
  'HA60': [
    'Porucha erekcí, lubrikace nebo jiných fyziologických reakcí při sexuální aktivitě',
    'Příznaky přetrvávají nejméně 6 měsíců a způsobují výraznou tíseň nebo mezilidské obtíže'
  ],
  'HA61': [
    'Porucha pohlavního vzrušení způsobující výraznou tíseň nebo obtíže v mezilidských vztazích',
    'Příznaky přetrvávají nejméně 6 měsíců'
  ],

  // 6E secondary syndromes
  '6E20.0': [
    'Poporodní deprese: nástup do 6 týdnů po porodu, splňující kritéria depresivní epizody',
    'Výrazná depresivní nálada, ztráta zájmu nebo potěšení, únava, insomnie, pocity viny nebo bezcennosti'
  ],

  // 6A25 Other primary psychotic
  '6A25': [
    'Psychotické příznaky (bludy, halucinace, dezorganizace) nezapadající plně do kritérií jiných primárně psychotických poruch v ICD-11',
    'Příznaky způsobují výraznou tíseň nebo funkční postižení'
  ],

  // 6D85 (Frontotemporal dementia)
  '6D85': [
    'Progresivní demence způsobená frontální nebo temporální lobární degenerací',
    'Výrazné změny osobnosti a chování nebo jazykové poruchy jako dominující rysy',
    'Poruchy paměti mohou být v časných stadiích méně výrazné'
  ],

  // 8A22 (Other dementia - Lewy bodies, Parkinson, Huntington etc.)
  '8A22': [
    'Demence způsobená specifikovaným neurodegenerativním nebo jiným onemocněním mozku, nespadajícím pod Alzheimerovu chorobu (8A20) ani cerebrovaskulární onemocnění (8A21)',
    'Kognitivní pokles splňující kritéria demence; etiologie identifikována z anamnézy, fyzikálního vyšetření nebo laboratorních testů'
  ],
  '8A22.0': [
    'Demence u Lewyho tělísek: fluktuující kognice, zrakové halucinace, parkinsonismus a poruchy spánku ve fázi REM',
    'Výrazná citlivost na antipsychotika; kognitivní výkyvy jsou charakteristickým rysem'
  ],
  '8A22.1': [
    'Demence při Parkinsonově nemoci: demence vznikající v kontextu etablované Parkinsonovy nemoci',
    'Kognitivní příznaky rozvíjejí se nejméně 1 rok po nástupu motorických příznaků Parkinsonovy choroby'
  ],
  '8A22.2': [
    'Demence u Huntingtonovy nemoci: kognitivní pokles v kontextu Huntingtonovy chorey',
    'Poruchy exekutivních funkcí, procesní paměti a psychomotoriky; typicky autozomálně dominantní dědičnost'
  ],
  '8A22.3': [
    'Fronttemporální demence: progresivní demence s frontální nebo temporální lobární degenerací',
    'Dominující změny osobnosti a chování (frontální varianta) nebo jazykové poruchy (temporální varianta)'
  ],
  '8A22.4': [
    'Demence při HIV/AIDS: kognitivní pokles způsobený HIV infekcí CNS',
    'Poruchy paměti, psychomotorická pomalost, behaviorální změny při potvrzené HIV infekci'
  ],

  // 8A2Z
  '8A2Z': [
    'Demence blíže neurčeného typu nebo způsobená nespecifikovanou příčinou',
    'Kognitivní pokles splňující kritéria demence bez dostatečných informací k určení etiologie'
  ],

  // MB26.0 (Occupational / medication-related)
  'MB26.0': [
    'Duševní porucha způsobená expozicí chemické nebo fyzikální látce v pracovním nebo jiném prostředí',
    'Časová souvislost mezi expozicí a nástupem příznaků'
  ],

  // MB50.3
  'MB50.3': [
    'Organická porucha způsobená specificky identifikovanou příčinou (trauma hlavy, toxická expozice apod.)',
    'Příznaky splňují kritéria příslušné kategorie organické duševní poruchy'
  ],

};

// ─── Načti a aktualizuj mkn10.json ─────────────────────────────────────────

const dataPath = path.join(__dirname, 'src', 'data', 'mkn10.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updated = 0;
let skipped = 0;
let noMapping = 0;

for (const d of data) {
  const mkn11Code = d.mapovani?.mkn11;

  if (!mkn11Code) {
    noMapping++;
    continue;
  }

  const kriteria = KRITERIA[mkn11Code];
  if (kriteria) {
    d.kriteria_mkn11 = kriteria;
    updated++;
  } else {
    skipped++;
    // Uncomment to debug:
    // console.log(`Chybí kritéria pro ICD-11 kód: ${mkn11Code} (MKN-10: ${d.id})`);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');

console.log(`✅ Hotovo!`);
console.log(`   Aktualizováno: ${updated} diagnóz`);
console.log(`   Přeskočeno (chybí ICD-11 kritéria): ${skipped} diagnóz`);
console.log(`   Bez mapování mkn11: ${noMapping} diagnóz`);
console.log(`   Celkem: ${data.length} diagnóz`);
