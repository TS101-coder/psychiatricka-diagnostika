#!/usr/bin/env node
/**
 * Doplní chybějící kriteria_mkn11 pro kódy, které nejsou pokryty hlavním skriptem
 * Zdroj: WHO ICD-11 CDDR; mrcpsych.uk
 */

const fs = require('fs');
const path = require('path');

const EXTRA = {

  // ── Alzheimer / vaskulární demence (duplicitní kódy v datech) ─────────
  '6D80': [
    'Plíživý nástup; první stížností je typicky porucha paměti',
    'Pomalý, ale trvalý pokles kognitivního výkonu z předchozí úrovně',
    'Zhoršení v dalších kognitivních doménách: exekutivní funkce, pozornost, jazyk, psychomotorické tempo, vizuální/prostorové schopnosti',
    'V časných stadiích možná depresivní nálada a apatie; v pokročilých stadiích psychotické příznaky, záchvaty',
    'Podpůrné: pozitivní genetické testování, rodinná anamnéza, postupný pokles'
  ],
  '6D81': [
    'Nástup kognitivních deficitů je časově spojen s jednou nebo více cerebrovaskulárními příhodami',
    'Kognitivní pokles nejzřetelnější v rychlosti zpracování informací, komplexní pozornosti a frontálně-exekutivních funkcích',
    'Průkaz cerebrovaskulárního onemocnění z anamnézy, fyzikálního vyšetření a neuroimagingu dostatečného k vysvětlení deficitů'
  ],

  // ── Poruchy intelektového vývoje – těžká a hluboká ───────────────────
  '6A00.2': [
    'Těžká porucha intelektového vývoje: přibližně 4 a více SD pod průměrem (IQ cca 20–34)',
    'Velmi omezená jazyková a akademická kapacita; mohou být přítomny motorické poruchy',
    'Základní dovednosti sebeobsluhy lze naučit intenzivní výukou; vyžadují každodenní dohled'
  ],
  '6A00.3': [
    'Hluboká porucha intelektového vývoje: přibližně 4 a více SD pod průměrem (IQ < 20)',
    'Silně omezená komunikace a akademické dovednosti omezeny na základní konkrétní schopnosti',
    'Mohou být přítomny motorické a senzorické poruchy; vyžadují každodenní dohled a prostředí s výraznou podporou'
  ],
  '6A00.Z': [
    'Porucha intelektového vývoje blíže nespecifikovaná – nedostatek informací ke stanovení stupně závažnosti'
  ],

  // ── Vývojové jazykové poruchy ─────────────────────────────────────────
  '6A01.1': [
    'Vývojová porucha receptivní řeči (porozumění): trvalé obtíže s porozuměním mluvené řeči pod úrovní věkových očekávání',
    'Nástup v průběhu vývojového období; není lépe vysvětlen ztrátou sluchu ani jiným stavem'
  ],
  '6A01.3': [
    'Vývojová fonologická porucha: trvalé obtíže se správnou produkcí hlásek a slabičné struktury',
    'Srozumitelnost řeči je výrazně snížena; nástup v průběhu vývojového období'
  ],
  '6A01.4': [
    'Vývojová porucha plynulosti řeči (koktavost): přerušení normální plynulosti a časování řeči',
    'Opakování hlásek, slabik, slov; prolongace, bloky; trvá nejméně 3 měsíce; způsobuje tíseň nebo funkční postižení'
  ],

  // ── Autismus – specifické subkódy ────────────────────────────────────
  '6A02.2': [
    'Splněna kritéria pro poruchu autistického spektra (6A02)',
    'S poruchou funkčního jazyka: bez funkčního expresivního jazyka nebo výrazně omezený funkční jazyk'
  ],
  '6A02.3': [
    'Splněna kritéria pro poruchu autistického spektra (6A02)',
    'S poruchou intelektového vývoje a poruchou funkčního jazyka'
  ],
  '6A02.5': [
    'Splněna kritéria pro poruchu autistického spektra (6A02)',
    'Bez poruchy intelektového vývoje a s mírně narušeným funkčním jazykem'
  ],
  '6A02.Y': [
    'Splněna kritéria pro poruchu autistického spektra (6A02)',
    'Jiná specifikovaná kombinace kognice a jazykového fungování'
  ],

  // ── Vývojová porucha učení (6A03) ─────────────────────────────────────
  '6A03': [
    'Trvalé a výrazné obtíže s nabýváním nebo používáním specifických akademických dovedností (čtení, psaní, počítání) navzdory adekvátní vzdělávací příležitosti',
    'Dovednosti jsou výrazně nižší oproti věkovým a intelektovým očekáváním',
    'Nástup v průběhu vývojového/školního věku; není lépe vysvětlen poruchou intelektového vývoje ani smyslovým deficitem'
  ],
  '6A03.0': [
    'Vývojová porucha čtení (dyslexie): přesnost a plynulost čtení výrazně pod věkovou normou',
    'Obtíže s dekódováním, rozpoznáváním slov nebo plynulostí čtení; typicky doprovázeno poruchou pravopisu'
  ],
  '6A03.1': [
    'Vývojová porucha psaní (dysortografie/dysgrafie): přesnost a plynulost psaní výrazně pod věkovou normou',
    'Obtíže s pravopisem, gramatickým/interpunkčním vyjádřením nebo organizací psaného projevu'
  ],

  // ── Vývojová porucha motorické koordinace (6A04) ──────────────────────
  '6A04': [
    'Výrazné a trvalé obtíže s nabýváním a prováděním koordinovaných motorických dovedností (dyspraxie)',
    'Dovednosti jsou výrazně nižší oproti věkovým a intelektovým očekáváním',
    'Nástup v průběhu vývojového období; způsobuje výrazné funkční postižení; není lépe vysvětlen jiným neurologickým onemocněním'
  ],

  // ── Jiné neurovývojové poruchy ────────────────────────────────────────
  '6A0Y': [
    'Neurovývojová porucha splňující obecná kritéria, ale nezapadající do žádné jiné specifikované kategorie v ICD-11'
  ],
  '6A0Z': [
    'Neurovývojová porucha, u níž není k dispozici dostatek informací pro přiřazení ke specifické kategorii'
  ],

  // ── Separační úzkostná porucha (6B05) ────────────────────────────────
  '6B05': [
    'Výrazná a nadměrná úzkost nebo strach ze separace od specifických osob citové vazby',
    'U dětí a adolescentů: obavy se týkají pečovatelů, rodičů nebo rodinných příslušníků, přesahují vývojové normy',
    'U dospělých: typicky se zaměřuje na romantického partnera nebo vlastní děti',
    'Projevuje se: myšlenkami na újmu připadajícím osobám citové vazby, odmítáním chodit do školy/práce, výraznou tísní při separaci, odmítáním spát mimo domov, nočními můrami o separaci',
    'Příznaky trvají nejméně několik měsíců a způsobují výraznou tíseň nebo funkční postižení'
  ],
  '6B05.0': [
    'Separační úzkostná porucha s nástupem v dětství a adolescenci'
  ],
  '6B05.1': [
    'Separační úzkostná porucha s nástupem v dospělosti'
  ],

  // ── Selektivní mutismus (6B06) ────────────────────────────────────────
  '6B06': [
    'Konzistentní selektivita v mluvení – dítě mluví v určitých situacích, ale ne v jiných (např. doma mluví, ve škole ne)',
    'Neschopnost mluvit je spojena se sociální úzkostí, ne s absencí znalosti nebo pohodlí s požadovaným jazykem',
    'Přetrvává nejméně 1 měsíc (neomezeno na první měsíc školní docházky)',
    'Způsobuje výrazné omezení vzdělávacích nebo pracovních výsledků nebo sociální komunikace'
  ],
  '6B06.0': [
    'Selektivní mutismus: konzistentní selhání ve mluvení v specifických sociálních situacích navzdory schopnosti mluvit v jiných situacích'
  ],

  // ── Poruchy příchylnosti (6B44, 6B45) ────────────────────────────────
  '6B44': [
    'Hrubě abnormální vzorce připoutání v raném dětství, vznikající v kontextu hrubě nedostatečné péče (zanedbávání, týrání, ústavní deprivace)',
    'Dítě se ani při dostupném pečovateli neuchyluje k pečovateli pro útěchu, podporu nebo výchovu',
    'Zřídka projevuje chování hledající bezpečí u kohokoliv z dospělých a nereaguje na nabízenou útěchu',
    'Lze diagnostikovat pouze u dětí; rysy se rozvíjejí do 5. roku věku; nelze diagnostikovat před 1. rokem věku'
  ],

  // ── Dezinhibiční porucha sociálního chování (6B45) ────────────────────
  '6B45': [
    'Vzorec chování, při němž dítě aktivně přistupuje k dospělým cizincům a projevuje dezinhibované sociální chování',
    'Vzniká v kontextu hrubě nedostatečné péče (zanedbávání, týrání, institucionalizace)',
    'Dítě je nadměrně familiární s neznámými dospělými; chybí přiměřená opatrnost vůči cizím lidem',
    'Lze diagnostikovat pouze u dětí; rozvíjí se do 5. roku věku'
  ],

  // ── Pika (6B84) ───────────────────────────────────────────────────────
  '6B84': [
    'Pravidelná konzumace nenutričních látek (hlína, křída, plast, kov, papír) nebo syrových potravinových přísad (velká množství soli nebo kukuřičné mouky)',
    'Vyskytuje se u jedinců, kteří dosáhli vývojového věku, kdy lze očekávat rozlišování jedlých a nejedlých látek (přibližně 2 roky)',
    'Konzumace je dostatečně přetrvávající nebo závažná, aby vyžadovala klinickou pozornost',
    'Způsobuje poškození zdraví, funkční postižení nebo výrazné riziko z důvodu frekvence, množství nebo povahy požitých látek'
  ],

  // ── Smíšené poruchy chování a emocí (6C93) ───────────────────────────
  '6C93': [
    'Přerušovaná explozivní porucha: opakující se epizody verbální nebo fyzické agresivity výrazně nepřiměřené provokaci nebo spouštěcím environmentálním podnětům',
    'Impulzivní agresivní činy vedou ke způsobení fyzické újmy nebo majetkové škodě nebo verbální agresi',
    'Nejsou projevem jiné duševní poruchy lépe vysvětlující agresivní chování'
  ],

  // ── Opoziční vzdorovitá porucha (6C90) ───────────────────────────────
  '6C90': [
    'Přetrvávající vzorec (nejméně 6 měsíců) výrazně vzdorovitého, neposlušného, provokativního nebo zlostného chování přesahující vývojové normy',
    'Varianta s chronickou dráždivostí: převažující přetrvávající zlostná nebo dráždivá nálada, závažné výbušné reakce nepřiměřené spouštěčům',
    'Varianta bez chronické dráždivosti: paličatost, hádavost a vzdorovité chování bez výrazné přetrvávající zlostné nálady',
    'Způsobuje výrazné funkční postižení; přítomno v různých prostředích'
  ],

  // ── Porucha sociálního chování (6C91) ────────────────────────────────
  '6C91': [
    'Opakující se a přetrvávající vzorec chování, při němž jsou porušována základní práva ostatních nebo hlavní věkově přiměřené společenské normy, pravidla nebo zákony',
    'Zahrnuje: agresi vůči lidem nebo zvířatům, ničení majetku, lest nebo krádeže, závažné porušování pravidel',
    'Vzorec přetrvává nejméně 12 měsíců a způsobuje výrazné funkční postižení'
  ],
  '6C91.0': [
    'Splněna kritéria pro poruchu sociálního chování (6C91)',
    'Začátek v dětství: rysy přítomny před 10. rokem věku'
  ],
  '6C91.1': [
    'Splněna kritéria pro poruchu sociálního chování (6C91)',
    'Začátek v adolescenci: žádné rysy přítomny před 10. rokem věku'
  ],
  '6C91.2': [
    'Splněna kritéria pro poruchu sociálního chování (6C91)',
    'S omezenými prosociálními emocemi: krutost, absence empatie nebo remorse, povrchní emocionální výrazy (přetrvávající nejméně 1 rok)'
  ],
  '6C9Y': [
    'Jiná specifikovaná porucha chování nebo disruptivní porucha nezapadající do žádné jiné specifikované kategorie v ICD-11'
  ],

  // ── Tikové poruchy (8A05) ────────────────────────────────────────────
  '8A05': [
    'Přítomnost motorických nebo vokálních tiků (opakující se, rychlé, neplánované pohyby nebo vokalizace)',
    'Trvají nejméně 1 rok od nástupu první tikvé',
    'Nástup před 18. rokem věku',
    'Nejsou způsobeny jiným zdravotním stavem ani účinky látky'
  ],
  '8A05.00': [
    'Tourettův syndrom: přítomnost jak motorických (nejméně 2 různé), tak vokálních tiků (nemusí být simultánní)',
    'Tiky přetrvávají nejméně 1 rok a nástup je před 18. rokem'
  ],

  // ── Jiné/blíže neurčené ──────────────────────────────────────────────
  '6C00': [
    'Hazardní porucha nebo jiná porucha z návykového chování, specifická příčina identifikována'
  ],
  '6C01': [
    'Porucha z hraní her (gaming disorder): přetrvávající nebo opakující se vzorec herního chování, narušená kontrola, zvyšující se priorita před ostatními aktivitami a přetrvávání navzdory negativním důsledkům',
    'Vzorec způsobuje výrazné postižení; obvykle patrný nejméně 12 měsíců'
  ],
  '6D8Y.0': [
    'Specifikovaná organická porucha osobnosti a chování způsobená přímými fyziologickými účinky onemocnění, úrazu nebo dysfunkce mozku'
  ],
  '6E8Z': [
    'Sekundární duševní nebo behaviorální syndrom blíže neurčeného charakteru, způsobený zdravotním stavem nebo onemocněním klasifikovaným jinde'
  ],
  'MB2Y': [
    'Jiný specifikovaný stav nebo problém přidružený k duševní nebo behaviorální poruše v perinatálním období'
  ],
};

const dataPath = path.join(__dirname, 'src', 'data', 'mkn10.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

let updated = 0;

for (const d of data) {
  const code = d.mapovani?.mkn11;
  if (code && EXTRA[code] && (!d.kriteria_mkn11 || d.kriteria_mkn11.length === 0)) {
    d.kriteria_mkn11 = EXTRA[code];
    updated++;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Doplněno dalších ${updated} diagnóz s kritérii MKN-11`);

// Final stats
const withKrit = data.filter(d => d.kriteria_mkn11 && d.kriteria_mkn11.length > 0);
const withMapping = data.filter(d => d.mapovani?.mkn11);
const still = withMapping.filter(d => !d.kriteria_mkn11 || d.kriteria_mkn11.length === 0);
console.log(`\nFinální stav:`);
console.log(`  Diagnózy s kritérii MKN-11: ${withKrit.length} / ${data.length}`);
console.log(`  S mapováním mkn11: ${withMapping.length}`);
console.log(`  Stále chybí: ${still.length}`);
if (still.length > 0) {
  console.log(`  Zbývající kódy bez kritérií:`, [...new Set(still.map(d => d.mapovani.mkn11))].sort().join(', '));
}
