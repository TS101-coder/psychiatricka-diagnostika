// Unifikovaná taxonomie příznaků — mapuje strojové klíče na lidsky čitelné texty.
// Klíče jsou stabilní identifikátory nezávislé na konkrétní formulaci v diagnózách.
export const SLOVNIK_PRIZNAKU = {
  // Organické poruchy a demence
  cognitive_decline:         'Globální kognitivní pokles / deteriorace',
  memory_short_term:         'Porucha krátkodobé paměti (vštípivosti)',
  memory_long_term:          'Porucha dlouhodobé paměti (retrográdní amnézie)',
  aphasia:                   'Afázie (porucha řeči a vyjadřování)',
  apraxia:                   'Apraxie (ztráta schopnosti vykonávat koordinované pohyby)',
  agnosia:                   'Agnosie (neschopnost rozpoznávat známé předměty)',
  insidious_onset:           'Plíživý, pomalý a nenápadný začátek',
  abrupt_onset:              'Náhlý, skokový nebo stupňovitý začátek',
  emotional_lability:        'Emoční labilita a inkontinence',
  focal_neurology:           'Fokální neurologické příznaky (parézy, reflexy)',
  ct_mri_ischemia:           'Průkaz cévního poškození na CT nebo MRI mozku',
  fluctuating_course:        'Kolísající průběh s výkyvy bdělosti',
  consciousness_impaired:    'Porucha vědomí nebo pozornosti (zmatenost)',

  // Schizofrenie a psychózy
  delusions_paranoid:        'Paranoidní a perzekuční bludy',
  delusions_somatic:         'Tělesné nebo nihilistické bludy',
  hallucinations_auditory:   'Sluchové halucinace (hlasy, komentování)',
  hallucinations_visual:     'Zrakové halucinace',
  disorganized_speech:       'Dezorganizovaná řeč a myšlení (inkoherence)',
  negative_symptoms:         'Negativní příznaky (oploštělá afektivita, apatie, abulie)',
  catatonia:                 'Katatonní chování (stupor, flexibilitas cerea)',
  social_dysfunction:        'Výrazný sociální a pracovní úpadek',
  thought_insertion:         'Vkládání nebo odnímání myšlenek (passivita)',

  // Afektivní poruchy (deprese / mánie)
  depressed_mood:            'Patologicky pokleslá, depresivní nálada',
  anhedonia:                 'Anhedonie (neschopnost prožívat radost)',
  loss_of_energy:            'Ztráta energie, zvýšená únavnost',
  suicidal_ideation:         'Suicidální úvahy, plány nebo pokusy',
  sleep_disturbance_insomnia:'Insomnie (typicky předčasné ranní probouzení)',
  sleep_disturbance_hypersomnia: 'Hypersomnie (nadměrná spavost)',
  psychomotor_agitation:     'Psychomotorický neklid / agitovanost',
  psychomotor_retardation:   'Psychomotorické utlumení / zpomalení',
  elevated_mood:             'Exaltovaná, expanzivní nebo podrážděná nálada',
  grandiosity:               'Grandiózní bludy, velikášství, snížená potřeba spánku',
  flight_of_ideas:           'Myšlenkový trysk (logorea, překotné myšlení)',
  risky_behavior:            'Rizikové chování (neuvážené investice, hazard, hypersexualita)',
  guilt_worthlessness:       'Nepřiměřené pocity viny nebo bezcennosti',
  concentration_impaired:    'Snížená koncentrace a schopnost rozhodování',

  // Úzkostné poruchy
  anxiety_general:           'Generalizovaná úzkost a tenze',
  panic_attacks:             'Záchvaty paniky (palpitace, dyspnoe, strach ze smrti)',
  phobic_avoidance:          'Vyhýbavé chování z důvodu strachu',
  obsessions:                'Vtíravé, nežádoucí myšlenky (obsese)',
  compulsions:               'Nutkavé rituály ke snížení úzkosti (kompulze)',
  worry_excessive:           'Nadměrné, nekontrolovatelné obavy o více témat',
  somatic_anxiety:           'Tělesné příznaky úzkosti (napětí svalů, třes, pocení)',
  hypervigilance:            'Hypervigilance, přehnaná úleková reakce',
  derealization:             'Derealizace nebo depersonalizace',

  // Poruchy příjmu potravy
  restriction_eating:        'Výrazné omezení příjmu potravy',
  fear_weight_gain:          'Intenzivní strach z přibývání na váze',
  body_image_distortion:     'Narušené vnímání vlastního těla (dysmorfofóbie)',
  binge_eating:              'Opakované záchvaty přejídání',
  purging:                   'Kompenzační chování (zvracení, laxativa, cvičení)',
  low_bmi:                   'Výrazně nízká tělesná hmotnost (BMI < 17,5)',

  // Poruchy osobnosti
  identity_instability:      'Nestabilní sebeobraz a identita',
  impulsivity:               'Impulzivita a sebepoškozování',
  intense_relationships:     'Intenzivní, nestabilní mezilidské vztahy',
  emptiness:                 'Chronický pocit prázdnoty',
  dissociation:              'Disociativní epizody (depersonalizace, amnézie)',
  grandiose_self:            'Grandiózní sebepojetí a potřeba obdivu',
  lack_empathy:              'Nedostatek empatie',
  exploitative:              'Vykořisťující mezilidské chování',
}

// Kategorie pro přehledné zobrazení v UI
export const KATEGORIE_PRIZNAKU = {
  'Kognitivní a organické': [
    'cognitive_decline','memory_short_term','memory_long_term',
    'aphasia','apraxia','agnosia','consciousness_impaired','fluctuating_course',
  ],
  'Nástup a průběh': ['insidious_onset','abrupt_onset'],
  'Neurologické': ['focal_neurology','ct_mri_ischemia'],
  'Psychotické': [
    'delusions_paranoid','delusions_somatic','hallucinations_auditory',
    'hallucinations_visual','disorganized_speech','negative_symptoms',
    'catatonia','thought_insertion','social_dysfunction',
  ],
  'Depresivní': [
    'depressed_mood','anhedonia','loss_of_energy','suicidal_ideation',
    'sleep_disturbance_insomnia','sleep_disturbance_hypersomnia',
    'psychomotor_retardation','guilt_worthlessness','concentration_impaired',
  ],
  'Manické': [
    'elevated_mood','grandiosity','flight_of_ideas',
    'risky_behavior','psychomotor_agitation',
  ],
  'Úzkostné': [
    'anxiety_general','panic_attacks','phobic_avoidance',
    'obsessions','compulsions','worry_excessive',
    'somatic_anxiety','hypervigilance','derealization',
  ],
}
