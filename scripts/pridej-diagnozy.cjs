const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/mkn10.json');
const existing = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const existingIds = new Set(existing.map(d => d.id));

const KAT_LATKY = 'F10–F19 Poruchy způsobené psychoaktivními látkami';
const KAT_SCHI  = 'F20–F29 Schizofrenie, schizotypní poruchy a poruchy s bludy';
const KAT_AFF   = 'F30–F39 Afektivní poruchy';
const KAT_NEUR  = 'F40–F48 Neurotické, stresové a somatoformní poruchy';
const KAT_BEH   = 'F50–F59 Behaviorální syndromy spojené s fyziologickými poruchami';
const KAT_OSOB  = 'F60–F69 Poruchy osobnosti a chování u dospělých';
const KAT_MR    = 'F70–F79 Mentální retardace';
const KAT_VYVOJ = 'F80–F89 Poruchy psychického vývoje';
const KAT_DET   = 'F90–F98 Poruchy chování s počátkem v dětství a dospívání';

// ── helper: substance subcodes ──────────────────────────────────────────────
function subLatka(prefix, nazevLatky, podkat, subkody) {
  return subkody.map(s => ({
    id: `${prefix}${s.s}`,
    kod: `${prefix}${s.s}`,
    nazev_cz: `${nazevLatky} – ${s.n}`,
    system: 'MKN-10',
    kategorie: KAT_LATKY,
    podkategorie: podkat,
    popis: s.p,
    diagnosticka_kriteria: s.k,
    priznaky: s.z,
    prubeh: s.pr,
    onset: s.on,
    diferencialni_diagnozy: s.diff || [],
    mapovani: { mkn11: null, dsm5: null }
  }));
}

const SKODLIVE = {
  s: '.1', n: 'škodlivé užívání',
  p: 'Způsob užívání látky poškozující zdraví (fyzické nebo duševní), avšak bez splnění kritérií závislosti.',
  k: ['Průkaz poškození zdraví uživatele', 'Porucha trvá nejméně 1 měsíc nebo opakovaně v posledních 12 měsících', 'Nesplněna kritéria závislosti'],
  z: ['podrážděnost', 'poruchy nálady', 'sociální problémy', 'rizikové chování'],
  pr: 'Může spontánně odeznít nebo přejít v závislost.', on: 'Subakutní.'
};
const ODVYKANI_DELIR = {
  s: '.4', n: 'odvykací stav s deliriem',
  p: 'Odvykací stav komplikovaný deliriem – poruchou vědomí, halucinacemi a autonomní nestabilitou.',
  k: ['Splněna kritéria odvykacího stavu', 'Přítomno delirium: porucha vědomí, dezorientace, halucinace', 'Stav vzniklý po přerušení nebo snížení dávky'],
  z: ['halucinace', 'třes', 'tachykardie', 'pocení', 'dezorientace', 'agitace', 'horečka'],
  pr: 'Akutní, potenciálně ohrožující život.', on: 'Akutní, 1–3 dny po vysazení.'
};
const PSYCHOTICKA = {
  s: '.5', n: 'psychotická porucha',
  p: 'Psychotická porucha vzniklá během užívání nebo do 48 hodin po požití látky.',
  k: ['Psychotické příznaky vznikají v průběhu nebo brzy po užití látky', 'Příznaky přetrvávají déle než přímý účinek látky', 'Nelze lépe vysvětlit primární psychotickou poruchou'],
  z: ['bludy', 'halucinace', 'dezorganizace myšlení', 'agitace', 'emoční labilita'],
  pr: 'Obvykle přechodná, odeznívá s abstinencí.', on: 'Akutní.'
};
const AMNESTICKY = {
  s: '.6', n: 'amnestický syndrom',
  p: 'Chronická porucha paměti způsobená dlouhodobým užíváním látky, bez globální demence.',
  k: ['Výrazná porucha krátkodobé paměti a vštípivosti', 'Zachována bezprostřední paměť', 'Absence globální demence nebo poruchy vědomí'],
  z: ['amnézie', 'konfabulace', 'dezorientace v čase', 'emoční plocha'],
  pr: 'Chronický, může být trvalý.', on: 'Plíživý po letech užívání.'
};
const REZIDUALNI = {
  s: '.7', n: 'reziduální a pozdní psychotická porucha',
  p: 'Porucha kognitivních funkcí nebo chování přetrvávající po odeznění přímého účinku látky.',
  k: ['Příznaky přetrvávají po ukončení přímého účinku látky', 'Příznaky se liší od odvykacího stavu', 'Kauzální role látky pravděpodobná'],
  z: ['flashbacky', 'kognitivní poruchy', 'poruchy nálady', 'poruchy osobnosti'],
  pr: 'Variabilní, může být trvalý.', on: 'Přetrvává po akutní fázi.'
};
const JINE_LATKA = {
  s: '.8', n: 'jiné duševní poruchy',
  p: 'Jiné duševní poruchy způsobené látkou, nespadající do výše uvedených kategorií.',
  k: ['Prokázaná příčinná role látky', 'Nesplňuje kritéria specifičtějších podkategorií'],
  z: ['poruchy nálady', 'úzkost', 'poruchy osobnosti', 'poruchy spánku'],
  pr: 'Variabilní.', on: 'Variabilní.'
};
const NS_LATKA = {
  s: '.9', n: 'NS duševní porucha',
  p: 'Neurčená duševní nebo behaviorální porucha způsobená látkou.',
  k: ['Porucha způsobena užíváním látky', 'Typ poruchy nelze přesněji specifikovat'],
  z: ['různé příznaky dle látky'],
  pr: 'Neurčený.', on: 'Neurčený.'
};

// ── F11 opioidy ──────────────────────────────────────────────────────────────
const f11_chybejici = subLatka('F11', 'Poruchy způsobené užíváním opioidů', 'Opioidy', [
  SKODLIVE,
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F12 kanabinoidy ──────────────────────────────────────────────────────────
const f12_chybejici = subLatka('F12', 'Poruchy způsobené užíváním kanabinoidů', 'Kanabinoidy', [
  SKODLIVE,
  { s: '.3', n: 'odvykací stav',
    p: 'Příznaky po přerušení pravidelného užívání kanabinoidů.',
    k: ['Pravidelné předchozí užívání kanabinoidů', 'Příznaky po přerušení nebo snížení dávky', 'Příznaky způsobují distres nebo funkční omezení'],
    z: ['podrážděnost', 'úzkost', 'poruchy spánku', 'snížená chuť k jídlu', 'neklid', 'depresivní nálada'],
    pr: 'Přechodný, odeznívá v průběhu 1–2 týdnů.', on: 'Akutní, 1–3 dny po vysazení.' },
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F13 sedativa/hypnotika ───────────────────────────────────────────────────
const f13_chybejici = subLatka('F13', 'Poruchy způsobené užíváním sedativ a hypnotik', 'Sedativa a hypnotika', [
  { s: '.0', n: 'akutní intoxikace',
    p: 'Přechodná porucha vědomí a chování po požití sedativa nebo hypnotika.',
    k: ['Důkaz nedávného požití sedativa/hypnotika', 'Příznaky intoxikace: útlum CNS, ataxie, poruchy kognitivních funkcí'],
    z: ['ospalost', 'zmatenost', 'ataxie', 'útlum', 'poruchy paměti', 'dysartrie'],
    pr: 'Přechodný.', on: 'Akutní.' },
  SKODLIVE,
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F14 kokain ───────────────────────────────────────────────────────────────
const f14_chybejici = subLatka('F14', 'Poruchy způsobené užíváním kokainu', 'Kokain', [
  SKODLIVE,
  { s: '.3', n: 'odvykací stav',
    p: 'Příznaky po přerušení nebo snížení dávky kokainu u závislých osob.',
    k: ['Pravidelné předchozí užívání kokainu', 'Příznaky po přerušení: dysforická nálada, únava, poruchy spánku'],
    z: ['dysforická nálada', 'únava', 'zvýšená chuť k jídlu', 'hypersomnie nebo insomnie', 'psychomotorická retardace'],
    pr: 'Přechodný, 1–2 týdny.', on: 'Akutní.' },
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F15 stimulancia ──────────────────────────────────────────────────────────
const f15_chybejici = subLatka('F15', 'Poruchy způsobené užíváním jiných stimulancií', 'Stimulancia', [
  SKODLIVE,
  { s: '.2', n: 'syndrom závislosti',
    p: 'Skupina fyziologických, behaviorálních a kognitivních jevů, při nichž má užívání stimulancií výrazně vyšší prioritu než jiné činnosti.',
    k: ['Silná touha užít látku', 'Obtíže při kontrole užívání', 'Pokračování přes škodlivé následky', 'Tolerance nebo odvykací příznaky'],
    z: ['craving', 'tolerance', 'sociální zanedbávání', 'rizikové chování', 'poruchy spánku'],
    pr: 'Chronický, relabující.', on: 'Plíživý.' },
  { s: '.3', n: 'odvykací stav',
    p: 'Příznaky po přerušení nebo snížení dávky stimulancií.',
    k: ['Pravidelné předchozí užívání stimulancií', 'Dysforická nálada a únava po vysazení'],
    z: ['únava', 'dysforická nálada', 'hypersomnie', 'zvýšená chuť k jídlu', 'psychomotorická retardace'],
    pr: 'Přechodný.', on: 'Akutní.' },
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F16 halucinogeny ─────────────────────────────────────────────────────────
const f16_chybejici = subLatka('F16', 'Poruchy způsobené užíváním halucinogenů', 'Halucinogeny', [
  SKODLIVE,
  { s: '.2', n: 'syndrom závislosti',
    p: 'Závislost na halucinogenech – relativně vzácná, projevující se zejména psychologickou závislostí.',
    k: ['Silná touha užít halucinogen', 'Pokračování přes psychologické škody', 'Tolerance'],
    z: ['craving', 'sociální izolace', 'zanedbávání povinností'],
    pr: 'Chronický.', on: 'Plíživý.' },
  { s: '.3', n: 'odvykací stav',
    p: 'Příznaky po přerušení chronického užívání halucinogenů.',
    k: ['Pravidelné předchozí užívání', 'Příznaky po vysazení: úzkost, podrážděnost'],
    z: ['úzkost', 'podrážděnost', 'poruchy spánku'],
    pr: 'Mírný, přechodný.', on: 'Akutní.' },
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F17 tabák ────────────────────────────────────────────────────────────────
const f17_chybejici = subLatka('F17', 'Poruchy způsobené užíváním tabáku', 'Tabák', [
  { s: '.0', n: 'akutní intoxikace',
    p: 'Přechodné příznaky po požití nadměrného množství nikotinu (zejm. u nových uživatelů).',
    k: ['Nedávná konzumace tabáku nebo nikotinu', 'Příznaky nikotinové intoxikace'],
    z: ['nevolnost', 'zvracení', 'závratě', 'bledost', 'pocení', 'tachykardie'],
    pr: 'Přechodný.', on: 'Akutní.' },
  SKODLIVE,
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F18 těkavé látky ─────────────────────────────────────────────────────────
const f18_chybejici = subLatka('F18', 'Poruchy způsobené vdecháváním těkavých látek', 'Těkavé látky', [
  SKODLIVE,
  { s: '.2', n: 'syndrom závislosti',
    p: 'Závislost na těkavých látkách (rozpouštědla, lepidla) s výraznými neurologickými komplikacemi.',
    k: ['Silná touha vdechovat látku', 'Tolerance', 'Pokračování přes neurologické poškození'],
    z: ['craving', 'tolerance', 'poruchy paměti', 'neurologické příznaky'],
    pr: 'Chronický, progresivní neurologické poškození.', on: 'Plíživý.' },
  { s: '.3', n: 'odvykací stav',
    p: 'Příznaky po přerušení chronického vdechování těkavých látek.',
    k: ['Chronické předchozí užívání', 'Třes a úzkost po vysazení'],
    z: ['třes', 'nevolnost', 'úzkost', 'podrážděnost'],
    pr: 'Přechodný.', on: 'Akutní.' },
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

// ── F19 více drog ────────────────────────────────────────────────────────────
const f19_chybejici = subLatka('F19', 'Poruchy způsobené užíváním více drog a jiných psychoaktivních látek', 'Více drog', [
  { s: '.0', n: 'akutní intoxikace',
    p: 'Přechodná porucha vědomí a chování po kombinovaném užití více psychoaktivních látek.',
    k: ['Důkaz užití více psychoaktivních látek', 'Příznaky dle kombinace užitých látek', 'Poruchy vědomí nebo chování'],
    z: ['zmatenost', 'poruchy vědomí', 'ataxie', 'útlum nebo agitace', 'dysartrie', 'nystagmus'],
    pr: 'Přechodný.', on: 'Akutní.' },
  SKODLIVE,
  { s: '.2', n: 'syndrom závislosti',
    p: 'Závislost na kombinaci psychoaktivních látek, kde žádná není dominantní.',
    k: ['Splnění kritérií závislosti pro kombinaci látek', 'Žádná jedna látka není jednoznačně preferována'],
    z: ['craving', 'tolerance', 'odvykací příznaky', 'sociální dezintegrace'],
    pr: 'Chronický, relabující.', on: 'Plíživý.' },
  { s: '.3', n: 'odvykací stav',
    p: 'Odvykací příznaky po přerušení kombinovaného užívání více psychoaktivních látek.',
    k: ['Předchozí pravidelné užívání více látek', 'Příznaky po přerušení nebo snížení dávky', 'Kombinace odvykacích příznaků'],
    z: ['třes', 'úzkost', 'pocení', 'podrážděnost', 'poruchy spánku', 'dysforická nálada'],
    pr: 'Přechodný, délka dle kombinace látek.', on: 'Akutní.' },
  { s: '.4', ...ODVYKANI_DELIR },
  PSYCHOTICKA,
  AMNESTICKY,
  REZIDUALNI,
  JINE_LATKA,
  NS_LATKA,
]);

console.log('Část 1 (F11-F19) připravena, počet:', [
  ...f11_chybejici,...f12_chybejici,...f13_chybejici,...f14_chybejici,
  ...f15_chybejici,...f16_chybejici,...f17_chybejici,...f18_chybejici,...f19_chybejici
].length);

// ── Export partial ───────────────────────────────────────────────────────────
module.exports = {
  f11_chybejici, f12_chybejici, f13_chybejici, f14_chybejici,
  f15_chybejici, f16_chybejici, f17_chybejici, f18_chybejici, f19_chybejici,
  existingIds, existing, dataPath
};
