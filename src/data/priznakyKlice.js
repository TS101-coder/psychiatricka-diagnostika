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
  'F20.5': ['negative_symptoms','social_dysfunction','emotional_lability'],
  'F21':   ['social_dysfunction','delusions_paranoid','thought_insertion','disorganized_speech'],
  'F22':   ['delusions_paranoid','social_dysfunction'],
  'F22.0': ['delusions_paranoid','social_dysfunction'],
  'F25':   ['delusions_paranoid','hallucinations_auditory','depressed_mood','elevated_mood','social_dysfunction'],
  'F25.0': ['delusions_paranoid','hallucinations_auditory','elevated_mood','flight_of_ideas'],
  'F25.1': ['delusions_paranoid','hallucinations_auditory','depressed_mood','psychomotor_retardation'],

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

  // ── F50: Poruchy příjmu potravy ──────────────────────────────────
  'F50.0': ['restriction_eating','fear_weight_gain','body_image_distortion','low_bmi'],
  'F50.1': ['restriction_eating','fear_weight_gain','body_image_distortion','low_bmi','psychomotor_agitation'],
  'F50.2': ['binge_eating','purging','fear_weight_gain','body_image_distortion'],
  'F50.3': ['binge_eating','purging','fear_weight_gain'],

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
}

export default PRIZNAKY_KLICE
