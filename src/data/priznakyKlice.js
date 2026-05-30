// Mapování MKN-10 kódů na klíče z SLOVNIK_PRIZNAKU (symptomTaxonomy.js).
// Každá diagnóza má nejvýše 8 klíčů — nejcharakterističtější příznaky pro DG srovnání.
// Klíče jsou sdíleny přes celou rodinu (F32 = základ, F32.0/F32.1 = specialnější).
const PRIZNAKY_KLICE = {

  // ── F00-F03: Demence ────────────────────────────────────────────
  'F00':   ['cognitive_decline','memory_short_term','insidious_onset','aphasia','apraxia','agnosia'],
  'F00.0': ['cognitive_decline','memory_short_term','insidious_onset','aphasia','apraxia','agnosia'],
  'F00.1': ['cognitive_decline','memory_short_term','insidious_onset','aphasia','apraxia','agnosia'],
  'F00.2': ['cognitive_decline','memory_short_term','insidious_onset','aphasia','apraxia','agnosia'],
  'F00.9': ['cognitive_decline','memory_short_term','insidious_onset'],

  'F01':   ['cognitive_decline','memory_short_term','abrupt_onset','emotional_lability','focal_neurology','ct_mri_ischemia'],
  'F01.0': ['cognitive_decline','memory_short_term','abrupt_onset','emotional_lability','focal_neurology','ct_mri_ischemia'],
  'F01.1': ['cognitive_decline','memory_short_term','abrupt_onset','emotional_lability','focal_neurology','ct_mri_ischemia'],
  'F01.2': ['cognitive_decline','memory_short_term','abrupt_onset','emotional_lability','focal_neurology','ct_mri_ischemia'],
  'F01.3': ['cognitive_decline','memory_short_term','emotional_lability','focal_neurology','ct_mri_ischemia'],

  'F03':   ['cognitive_decline','memory_short_term','insidious_onset'],

  // ── F05: Delirium ───────────────────────────────────────────────
  'F05':   ['consciousness_impaired','fluctuating_course','abrupt_onset','memory_short_term','hallucinations_visual','psychomotor_agitation'],
  'F05.0': ['consciousness_impaired','fluctuating_course','abrupt_onset','memory_short_term','hallucinations_visual'],
  'F05.1': ['consciousness_impaired','fluctuating_course','abrupt_onset','memory_short_term','hallucinations_visual','cognitive_decline'],

  // ── F20-F29: Schizofrenie a příbuzné ────────────────────────────
  'F20':   ['delusions_paranoid','hallucinations_auditory','disorganized_speech','negative_symptoms','social_dysfunction'],
  'F20.0': ['delusions_paranoid','hallucinations_auditory','disorganized_speech','social_dysfunction'],
  'F20.1': ['disorganized_speech','negative_symptoms','social_dysfunction','emotional_lability'],
  'F20.2': ['catatonia','psychomotor_agitation','psychomotor_retardation','disorganized_speech'],
  'F20.3': ['delusions_paranoid','hallucinations_auditory','disorganized_speech','negative_symptoms','psychomotor_agitation'],
  'F20.4': ['depressed_mood','negative_symptoms','social_dysfunction','anhedonia','loss_of_energy'],
  'F20.5': ['negative_symptoms','social_dysfunction','emotional_lability'],
  'F20.6': ['negative_symptoms','social_dysfunction','insidious_onset','cognitive_decline'],
  'F20.8': ['delusions_paranoid','hallucinations_auditory','negative_symptoms','social_dysfunction'],
  'F20.9': ['delusions_paranoid','hallucinations_auditory','negative_symptoms','social_dysfunction'],
  'F21':   ['social_dysfunction','delusions_paranoid','thought_insertion','disorganized_speech'],
  'F22':   ['delusions_paranoid','social_dysfunction'],
  'F22.0': ['delusions_paranoid','social_dysfunction'],
  'F22.8': ['delusions_paranoid','social_dysfunction'],
  'F22.9': ['delusions_paranoid','social_dysfunction'],

  // ── F23: Akutní a přechodné psychotické poruchy ─────────────────
  'F23':   ['abrupt_onset','delusions_paranoid','hallucinations_auditory','disorganized_speech','emotional_lability'],
  'F23.0': ['abrupt_onset','emotional_lability','psychomotor_agitation','disorganized_speech','hallucinations_visual'],
  'F23.1': ['abrupt_onset','delusions_paranoid','hallucinations_auditory','thought_insertion','disorganized_speech','emotional_lability'],
  'F23.2': ['abrupt_onset','delusions_paranoid','hallucinations_auditory','disorganized_speech'],
  'F23.3': ['abrupt_onset','delusions_paranoid','hallucinations_auditory'],
  'F23.8': ['abrupt_onset','delusions_paranoid','hallucinations_auditory'],
  'F23.9': ['abrupt_onset','delusions_paranoid'],

  // ── F24-F29 ───────────────────────────────────────────────────────
  'F24':   ['delusions_paranoid','social_dysfunction'],
  'F25':   ['delusions_paranoid','hallucinations_auditory','depressed_mood','elevated_mood','social_dysfunction'],
  'F25.0': ['delusions_paranoid','hallucinations_auditory','elevated_mood','flight_of_ideas'],
  'F25.1': ['delusions_paranoid','hallucinations_auditory','depressed_mood','psychomotor_retardation'],
  'F25.2': ['delusions_paranoid','hallucinations_auditory','elevated_mood','depressed_mood'],
  'F25.8': ['delusions_paranoid','hallucinations_auditory','elevated_mood','depressed_mood'],
  'F25.9': ['delusions_paranoid','hallucinations_auditory','elevated_mood','depressed_mood'],
  'F28':   ['delusions_paranoid','hallucinations_auditory','disorganized_speech'],
  'F29':   ['delusions_paranoid','hallucinations_auditory'],

  // ── F30-F31: Mánie a bipolární porucha ──────────────────────────
  'F30':   ['elevated_mood','grandiosity','flight_of_ideas','risky_behavior','psychomotor_agitation','sleep_disturbance_insomnia'],
  'F30.0': ['elevated_mood','grandiosity','flight_of_ideas','psychomotor_agitation'],
  'F30.1': ['elevated_mood','grandiosity','flight_of_ideas','risky_behavior','psychomotor_agitation','sleep_disturbance_insomnia'],
  'F30.2': ['elevated_mood','grandiosity','flight_of_ideas','risky_behavior','delusions_paranoid','psychomotor_agitation'],

  'F31':   ['elevated_mood','depressed_mood','grandiosity','flight_of_ideas','anhedonia','suicidal_ideation'],
  'F31.0': ['elevated_mood','grandiosity','flight_of_ideas','psychomotor_agitation'],
  'F31.1': ['elevated_mood','grandiosity','flight_of_ideas','risky_behavior','psychomotor_agitation','sleep_disturbance_insomnia'],
  'F31.2': ['elevated_mood','grandiosity','flight_of_ideas','risky_behavior','delusions_paranoid','psychomotor_agitation'],
  'F31.3': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','concentration_impaired'],
  'F31.4': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','psychomotor_retardation','suicidal_ideation'],
  'F31.5': ['depressed_mood','anhedonia','loss_of_energy','psychomotor_retardation','suicidal_ideation','delusions_paranoid'],

  // ── F32-F33: Depresivní poruchy ─────────────────────────────────
  'F32':   ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia'],
  'F32.0': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','concentration_impaired'],
  'F32.1': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','psychomotor_retardation','suicidal_ideation','guilt_worthlessness'],
  'F32.2': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','psychomotor_retardation','suicidal_ideation','psychomotor_agitation','delusions_paranoid'],
  'F32.3': ['depressed_mood','anhedonia','loss_of_energy','psychomotor_retardation','suicidal_ideation','delusions_paranoid','hallucinations_auditory'],

  'F33':   ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia'],
  'F33.0': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','concentration_impaired'],
  'F33.1': ['depressed_mood','anhedonia','loss_of_energy','sleep_disturbance_insomnia','psychomotor_retardation','suicidal_ideation','guilt_worthlessness'],
  'F33.2': ['depressed_mood','anhedonia','loss_of_energy','psychomotor_retardation','suicidal_ideation','psychomotor_agitation','delusions_paranoid'],

  // ── F34: Trvalé poruchy nálady ───────────────────────────────────
  'F34.0': ['elevated_mood','depressed_mood','grandiosity'],
  'F34.1': ['depressed_mood','anhedonia','loss_of_energy','anxiety_general','concentration_impaired','insidious_onset'],

  // ── F40-F42: Úzkostné, fobické, OCD ────────────────────────────
  'F40':   ['phobic_avoidance','anxiety_general','somatic_anxiety'],
  'F40.0': ['panic_attacks','phobic_avoidance','anxiety_general','derealization','somatic_anxiety'],
  'F40.1': ['phobic_avoidance','anxiety_general','somatic_anxiety'],
  'F40.2': ['phobic_avoidance','anxiety_general','somatic_anxiety'],

  'F41':   ['anxiety_general','somatic_anxiety'],
  'F41.0': ['panic_attacks','anxiety_general','somatic_anxiety','derealization','hypervigilance'],
  'F41.1': ['worry_excessive','anxiety_general','somatic_anxiety','sleep_disturbance_insomnia','concentration_impaired','hypervigilance'],
  'F41.2': ['anxiety_general','depressed_mood','anhedonia','somatic_anxiety','sleep_disturbance_insomnia'],

  'F42':   ['obsessions','compulsions','anxiety_general'],
  'F42.0': ['obsessions','anxiety_general'],
  'F42.1': ['compulsions','anxiety_general'],
  'F42.2': ['obsessions','compulsions','anxiety_general'],

  // ── F43: Reakce na stres a poruchy přizpůsobení ─────────────────
  'F43.0': ['anxiety_general','psychomotor_agitation','consciousness_impaired','derealization'],
  'F43.1': ['hypervigilance','sleep_disturbance_insomnia','anxiety_general','emotional_lability','derealization','phobic_avoidance'],
  'F43.2': ['depressed_mood','anxiety_general','concentration_impaired','emotional_lability'],

  // ── F10-F19: Poruchy způsobené psychoaktivními látkami ──────────
  // Sdílené příznaky závislostí (základní)
  'F10':   ['emotional_lability','cognitive_decline','psychomotor_agitation','anxiety_general'],
  'F10.0': ['consciousness_impaired','psychomotor_agitation','emotional_lability'],
  'F10.2': ['cognitive_decline','memory_short_term','emotional_lability','insidious_onset'],
  'F10.3': ['psychomotor_agitation','anxiety_general','sleep_disturbance_insomnia','hallucinations_visual','consciousness_impaired'],
  'F10.4': ['consciousness_impaired','fluctuating_course','hallucinations_visual','cognitive_decline'],
  'F10.6': ['memory_short_term','memory_long_term','cognitive_decline'],

  'F11':   ['psychomotor_retardation','consciousness_impaired','emotional_lability'],
  'F11.2': ['psychomotor_retardation','social_dysfunction','insidious_onset'],
  'F11.3': ['anxiety_general','psychomotor_agitation','somatic_anxiety','sleep_disturbance_insomnia'],

  'F12':   ['psychomotor_retardation','anxiety_general','derealization'],
  'F12.0': ['psychomotor_retardation','emotional_lability','derealization'],
  'F12.2': ['cognitive_decline','social_dysfunction','insidious_onset'],

  'F14':   ['psychomotor_agitation','elevated_mood','grandiosity'],
  'F14.0': ['psychomotor_agitation','elevated_mood','grandiosity','risky_behavior'],
  'F14.2': ['delusions_paranoid','hallucinations_auditory','psychomotor_agitation','social_dysfunction'],

  'F15':   ['psychomotor_agitation','elevated_mood','sleep_disturbance_insomnia'],
  'F15.0': ['psychomotor_agitation','elevated_mood','risky_behavior','sleep_disturbance_insomnia'],

  'F17':   ['anxiety_general','somatic_anxiety'],
  'F17.2': ['anxiety_general','somatic_anxiety','sleep_disturbance_insomnia','concentration_impaired'],

  'F19':   ['cognitive_decline','emotional_lability','psychomotor_agitation','anxiety_general'],

  // ── F44: Disociativní poruchy ────────────────────────────────────
  'F44':   ['dissociation','derealization'],
  'F44.0': ['memory_short_term','memory_long_term','dissociation'],
  'F44.1': ['memory_short_term','dissociation','identity_instability'],
  'F44.2': ['psychomotor_agitation','emotional_lability','dissociation'],
  'F44.3': ['psychomotor_agitation','emotional_lability','dissociation','catatonia'],
  'F44.4': ['psychomotor_agitation','dissociation','somatic_anxiety'],
  'F44.5': ['somatic_anxiety','dissociation','emotional_lability'],
  'F44.7': ['identity_instability','dissociation','memory_short_term','emotional_lability'],

  // ── F45: Somatoformní poruchy ────────────────────────────────────
  'F45':   ['somatic_anxiety','anxiety_general'],
  'F45.0': ['somatic_anxiety','anxiety_general','concentration_impaired'],
  'F45.1': ['somatic_anxiety','anxiety_general'],
  'F45.2': ['somatic_anxiety','anxiety_general','hypervigilance'],
  'F45.3': ['somatic_anxiety','anxiety_general'],
  'F45.4': ['somatic_anxiety','depressed_mood','anxiety_general'],

  // ── F48: Neurastenie ─────────────────────────────────────────────
  'F48.0': ['loss_of_energy','somatic_anxiety','sleep_disturbance_insomnia','concentration_impaired','anxiety_general'],

  // ── F51: Neorganické poruchy spánku ─────────────────────────────
  'F51':   ['sleep_disturbance_insomnia','sleep_disturbance_hypersomnia'],
  'F51.0': ['sleep_disturbance_insomnia','anxiety_general','somatic_anxiety'],
  'F51.1': ['sleep_disturbance_hypersomnia','loss_of_energy','concentration_impaired'],
  'F51.5': ['sleep_disturbance_insomnia','psychomotor_agitation'],

  // ── F53: Perinatální duševní poruchy ────────────────────────────
  'F53.0': ['depressed_mood','anhedonia','loss_of_energy','anxiety_general','sleep_disturbance_insomnia'],
  'F53.1': ['delusions_paranoid','hallucinations_auditory','depressed_mood','emotional_lability','abrupt_onset'],

  // ── F90: ADHD a hyperkinetické poruchy ──────────────────────────
  'F90':   ['concentration_impaired','impulsivity','psychomotor_agitation'],
  'F90.0': ['concentration_impaired','impulsivity','psychomotor_agitation','risky_behavior'],
  'F90.1': ['concentration_impaired','impulsivity','psychomotor_agitation','risky_behavior','emotional_lability'],

  // ── F84: Poruchy autistického spektra ───────────────────────────
  'F84':   ['social_dysfunction','disorganized_speech','negative_symptoms'],
  'F84.0': ['social_dysfunction','disorganized_speech','negative_symptoms','insidious_onset'],
  'F84.5': ['social_dysfunction','concentration_impaired','anxiety_general','insidious_onset'],

  // ── F50: Poruchy příjmu potravy ──────────────────────────────────
  'F50.0': ['restriction_eating','fear_weight_gain','body_image_distortion','low_bmi'],
  'F50.1': ['restriction_eating','fear_weight_gain','body_image_distortion','low_bmi','psychomotor_agitation'],
  'F50.2': ['binge_eating','purging','fear_weight_gain','body_image_distortion'],
  'F50.3': ['binge_eating','purging','fear_weight_gain'],

  // ── F02: Demence při jiných chorobách ───────────────────────────
  'F02':   ['cognitive_decline','memory_short_term','social_dysfunction'],
  'F02.0': ['cognitive_decline','memory_short_term','emotional_lability','insidious_onset'],
  'F02.1': ['cognitive_decline','memory_short_term','psychomotor_retardation','insidious_onset'],
  'F02.2': ['cognitive_decline','memory_short_term','emotional_lability','abrupt_onset'],
  'F02.3': ['cognitive_decline','memory_short_term','hallucinations_visual','emotional_lability'],
  'F02.4': ['cognitive_decline','memory_short_term','focal_neurology'],

  // ── F06: Organické psychické poruchy ────────────────────────────
  'F06.0': ['hallucinations_auditory','hallucinations_visual','consciousness_impaired'],
  'F06.1': ['delusions_paranoid','hallucinations_auditory','consciousness_impaired'],
  'F06.2': ['delusions_paranoid','hallucinations_auditory','disorganized_speech'],
  'F06.3': ['depressed_mood','anhedonia','loss_of_energy','emotional_lability'],
  'F06.4': ['elevated_mood','grandiosity','psychomotor_agitation','emotional_lability'],
  'F06.5': ['anxiety_general','somatic_anxiety','emotional_lability'],

  // ── F30-F34 varianty NS ──────────────────────────────────────────
  'F30.8': ['elevated_mood','grandiosity','flight_of_ideas'],
  'F30.9': ['elevated_mood','grandiosity'],
  'F31.6': ['depressed_mood','anhedonia','elevated_mood'],
  'F31.7': ['depressed_mood','anhedonia','loss_of_energy'],
  'F31.8': ['elevated_mood','depressed_mood','grandiosity'],
  'F31.9': ['elevated_mood','depressed_mood'],
  'F32.8': ['depressed_mood','anhedonia','loss_of_energy'],
  'F32.9': ['depressed_mood','anhedonia'],
  'F33.3': ['depressed_mood','anhedonia','loss_of_energy','psychomotor_retardation','suicidal_ideation','delusions_paranoid'],
  'F33.4': ['depressed_mood','anhedonia'],
  'F33.8': ['depressed_mood','anhedonia','loss_of_energy'],
  'F33.9': ['depressed_mood','anhedonia'],
  'F34':   ['depressed_mood','elevated_mood'],
  'F34.8': ['depressed_mood','elevated_mood'],
  'F34.9': ['depressed_mood'],
  'F38':   ['depressed_mood','elevated_mood'],
  'F38.0': ['elevated_mood','grandiosity','depressed_mood'],
  'F38.1': ['depressed_mood','anhedonia','loss_of_energy'],
  'F39':   ['depressed_mood','elevated_mood'],

  // ── F40 varianty ─────────────────────────────────────────────────
  'F40.00':['panic_attacks','phobic_avoidance','anxiety_general','derealization'],
  'F40.01':['panic_attacks','phobic_avoidance','anxiety_general','derealization'],
  'F40.8': ['phobic_avoidance','anxiety_general'],
  'F40.9': ['phobic_avoidance','anxiety_general'],
  'F41.3': ['anxiety_general','somatic_anxiety','depressed_mood'],
  'F41.8': ['anxiety_general','somatic_anxiety'],
  'F41.9': ['anxiety_general','somatic_anxiety'],
  'F42.8': ['obsessions','compulsions','anxiety_general'],
  'F42.9': ['obsessions','compulsions','anxiety_general'],

  // ── F43 podkódy ─────────────────────────────────────────────────
  'F43':   ['anxiety_general','emotional_lability'],
  'F43.20':['depressed_mood','anxiety_general','emotional_lability'],
  'F43.21':['depressed_mood','anxiety_general','emotional_lability'],
  'F43.22':['depressed_mood','anxiety_general','emotional_lability'],
  'F43.23':['depressed_mood','anxiety_general','emotional_lability'],
  'F43.24':['depressed_mood','anhedonia','anxiety_general'],
  'F43.25':['anxiety_general','somatic_anxiety'],
  'F43.28':['depressed_mood','anxiety_general'],
  'F43.8': ['anxiety_general','emotional_lability'],
  'F43.9': ['anxiety_general','emotional_lability'],

  // ── F63: Impulzivní poruchy ──────────────────────────────────────
  'F63':   ['impulsivity','risky_behavior'],
  'F63.0': ['impulsivity','risky_behavior','anxiety_general'],
  'F63.1': ['impulsivity','risky_behavior'],
  'F63.2': ['impulsivity','risky_behavior','elevated_mood'],
  'F63.3': ['impulsivity','risky_behavior','emotional_lability'],

  // ── F91-F95: Poruchy chování a emocí v dětství ──────────────────
  'F91':   ['impulsivity','risky_behavior','emotional_lability','social_dysfunction'],
  'F91.0': ['impulsivity','risky_behavior','emotional_lability'],
  'F91.1': ['impulsivity','risky_behavior','social_dysfunction'],
  'F91.2': ['impulsivity','risky_behavior','social_dysfunction'],
  'F91.3': ['impulsivity','risky_behavior','anxiety_general'],
  'F92':   ['impulsivity','depressed_mood','anxiety_general'],
  'F92.0': ['impulsivity','risky_behavior','depressed_mood'],
  'F93':   ['anxiety_general','emotional_lability','phobic_avoidance'],
  'F93.0': ['anxiety_general','phobic_avoidance','somatic_anxiety'],
  'F93.1': ['phobic_avoidance','anxiety_general'],
  'F93.2': ['anxiety_general','emotional_lability','social_dysfunction'],
  'F95':   ['psychomotor_agitation','concentration_impaired'],
  'F95.0': ['psychomotor_agitation','concentration_impaired'],
  'F95.1': ['psychomotor_agitation','concentration_impaired'],
  'F95.2': ['psychomotor_agitation','concentration_impaired','social_dysfunction'],

  // ── F60: Poruchy osobnosti ───────────────────────────────────────
  'F60.0': ['delusions_paranoid','hypervigilance','social_dysfunction'],
  'F60.1': ['negative_symptoms','social_dysfunction'],
  'F60.2': ['impulsivity','risky_behavior','lack_empathy','exploitative'],
  'F60.3': ['identity_instability','impulsivity','intense_relationships','emotional_lability','suicidal_ideation'],
  'F60.30':['identity_instability','impulsivity','intense_relationships','emotional_lability','suicidal_ideation'],
  'F60.31':['identity_instability','impulsivity','intense_relationships','emotional_lability','suicidal_ideation','emptiness','dissociation'],
  'F60.4': ['emotional_lability','intense_relationships','grandiose_self','somatic_anxiety'],
  'F60.5': ['obsessions','compulsions','anxiety_general'],
  'F60.6': ['anxiety_general','phobic_avoidance','somatic_anxiety'],
  'F60.7': ['anxiety_general','phobic_avoidance','depressed_mood'],
  'F60.8': ['emotional_lability','social_dysfunction'],
  'F60.9': ['emotional_lability','social_dysfunction'],
  'F60':   ['emotional_lability','social_dysfunction'],

  // ── NS varianty F01, F02, F05 ────────────────────────────────────
  'F01.8': ['cognitive_decline','memory_short_term','emotional_lability','focal_neurology'],
  'F01.9': ['cognitive_decline','memory_short_term','emotional_lability'],
  'F02.8': ['cognitive_decline','memory_short_term','social_dysfunction'],
  'F05.8': ['consciousness_impaired','fluctuating_course','hallucinations_visual'],
  'F05.9': ['consciousness_impaired','fluctuating_course'],
  'F06':   ['consciousness_impaired','emotional_lability','cognitive_decline'],
  'F06.30':['depressed_mood','anhedonia','loss_of_energy','emotional_lability'],
  'F06.31':['depressed_mood','anhedonia','loss_of_energy','emotional_lability'],
  'F06.32':['depressed_mood','anhedonia','loss_of_energy','emotional_lability'],
  'F06.33':['depressed_mood','anhedonia','loss_of_energy','emotional_lability'],
  'F06.6': ['anxiety_general','somatic_anxiety','emotional_lability'],
  'F06.7': ['cognitive_decline','concentration_impaired'],
  'F06.8': ['consciousness_impaired','emotional_lability'],
  'F06.9': ['consciousness_impaired','emotional_lability'],

  // ── NS varianty závislostí (harmful use, withdrawal, NS) ─────────
  'F10.1': ['emotional_lability','anxiety_general','risky_behavior'],
  'F10.5': ['cognitive_decline','memory_short_term','psychomotor_retardation'],
  'F11.0': ['psychomotor_retardation','consciousness_impaired'],
  'F11.1': ['social_dysfunction','risky_behavior','impulsivity'],
  'F12.1': ['social_dysfunction','risky_behavior','impulsivity'],
  'F14.1': ['risky_behavior','impulsivity','elevated_mood'],
  'F15.1': ['risky_behavior','impulsivity','elevated_mood'],
  'F17.0': ['anxiety_general','somatic_anxiety'],
  'F17.1': ['anxiety_general','somatic_anxiety','risky_behavior'],
  'F19.0': ['consciousness_impaired','psychomotor_agitation'],
  'F19.1': ['social_dysfunction','risky_behavior','impulsivity'],
  'F19.2': ['cognitive_decline','social_dysfunction','emotional_lability'],

  // ── F50 NS, F53 NS ───────────────────────────────────────────────
  'F50':   ['restriction_eating','anxiety_general'],
  'F50.4': ['restriction_eating','somatic_anxiety'],
  'F50.5': ['binge_eating','anxiety_general'],
  'F50.8': ['restriction_eating','binge_eating','anxiety_general'],
  'F50.9': ['restriction_eating','anxiety_general'],
  'F53':   ['depressed_mood','anxiety_general','emotional_lability'],
  'F53.8': ['depressed_mood','anxiety_general'],
  'F53.9': ['depressed_mood','anxiety_general'],

  // ── F38 podkódy ─────────────────────────────────────────────────
  'F38.00':['elevated_mood','grandiosity','depressed_mood'],
  'F38.10':['depressed_mood','anhedonia','loss_of_energy'],
  'F38.80':['depressed_mood','elevated_mood'],

  // ── F44 NS, F45 NS, F48 NS ───────────────────────────────────────
  'F44.6': ['somatic_anxiety','dissociation','emotional_lability'],
  'F44.8': ['dissociation','emotional_lability'],
  'F44.9': ['dissociation','emotional_lability'],
  'F45.8': ['somatic_anxiety','anxiety_general'],
  'F45.9': ['somatic_anxiety','anxiety_general'],
  'F45.30':['somatic_anxiety','anxiety_general'],
  'F45.31':['somatic_anxiety','anxiety_general'],
  'F45.32':['somatic_anxiety','anxiety_general'],
  'F45.33':['somatic_anxiety','anxiety_general'],
  'F45.34':['somatic_anxiety','anxiety_general'],
  'F45.38':['somatic_anxiety','anxiety_general'],
  'F48':   ['loss_of_energy','anxiety_general','somatic_anxiety'],
  'F48.1': ['derealization','anxiety_general','somatic_anxiety'],
  'F48.8': ['anxiety_general','somatic_anxiety'],
  'F48.9': ['anxiety_general','somatic_anxiety'],

  // ── F84 vzácnější varianty ───────────────────────────────────────
  'F84.1': ['social_dysfunction','disorganized_speech','cognitive_decline'],
  'F84.2': ['cognitive_decline','social_dysfunction','disorganized_speech'],
  'F84.3': ['cognitive_decline','social_dysfunction'],
  'F84.4': ['cognitive_decline','social_dysfunction'],
  'F84.8': ['social_dysfunction','disorganized_speech'],
  'F84.9': ['social_dysfunction'],

  // ── F90-F95 NS ───────────────────────────────────────────────────
  'F90.8': ['concentration_impaired','impulsivity','psychomotor_agitation'],
  'F90.9': ['concentration_impaired','impulsivity'],
  'F91.8': ['impulsivity','risky_behavior','emotional_lability'],
  'F91.9': ['impulsivity','risky_behavior'],
  'F92.8': ['impulsivity','depressed_mood','anxiety_general'],
  'F92.9': ['impulsivity','anxiety_general'],
  'F93.3': ['anxiety_general','emotional_lability','social_dysfunction'],
  'F93.8': ['anxiety_general','emotional_lability'],
  'F93.9': ['anxiety_general'],
  'F95.8': ['psychomotor_agitation','concentration_impaired'],
  'F95.9': ['psychomotor_agitation'],
}

export default PRIZNAKY_KLICE
