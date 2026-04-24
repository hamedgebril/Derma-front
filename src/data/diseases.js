/**
 * Disease Database
 * بيانات كل مرض من الـ 6 أمراض اللي الـ Model بيتعرف عليهم
 * DISEASE_CLASSES = ['MF', 'annular lichen', 'healty', 'psoriasis', 'tinea circinata', 'urticaria']
 */

const DISEASES_DATA = {
  'MF': {
    displayName: 'Mycosis Fungoides (MF)',
    about: 'Mycosis Fungoides is the most common type of cutaneous T-cell lymphoma, a rare cancer of the immune system. It primarily affects the skin, causing patches, plaques, and tumors. It progresses slowly over years and is often mistaken for eczema or psoriasis in its early stages.',
    commonSigns: [
      'Flat, scaly patches on sun-protected areas',
      'Itchy, red or pink patches on the skin',
      'Thickened plaques that may crust',
      'Skin tumors in advanced stages',
      'Enlarged lymph nodes (in later stages)',
      'Skin lesions vary in size and shape'
    ],
    recommendations: [
      'Consult a dermatologist or oncologist immediately for proper diagnosis.',
      'A skin biopsy is essential to confirm the diagnosis.',
      'Avoid self-treatment; this condition requires professional medical management.',
      'Follow up regularly with a specialist for monitoring disease progression.'
    ],
    instructions: [
      { title: 'Sun Protection', desc: 'Protect skin from UV exposure; use SPF 50+ sunscreen daily.', icon: 'sun' },
      { title: 'Monitoring', desc: 'Track any new lesions or changes in existing patches.', icon: 'eye' },
      { title: 'Avoid Irritants', desc: 'Use gentle, fragrance-free skincare products.', icon: 'ban' },
      { title: 'Regular Follow-up', desc: 'Schedule regular dermatology appointments every 3 months.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'Topical Corticosteroids (e.g., Betamethasone)',
        type: 'Anti-inflammatory - For early stage patches',
        when: 'Apply in the evening',
        frequency: 'Once daily for 4-6 weeks',
        usage: 'Apply thin layer to affected patches only'
      },
      {
        name: 'Topical Nitrogen Mustard (Mechlorethamine)',
        type: 'Chemotherapy Cream - First-line for MF',
        when: 'Once daily as directed by specialist',
        frequency: 'Daily application for months',
        usage: 'Apply to affected skin areas, avoid healthy skin'
      },
      {
        name: 'Phototherapy (PUVA/NB-UVB)',
        type: 'Light Therapy - Highly effective for patches',
        when: '2-3 sessions per week in clinic',
        frequency: 'As scheduled by dermatologist',
        usage: 'Performed under medical supervision only'
      }
    ]
  },

  'annular lichen': {
    displayName: 'Annular Lichen Planus',
    about: 'Annular Lichen Planus is an inflammatory skin condition that forms ring-shaped (annular) lesions. It is a variant of lichen planus and typically appears on the skin with a central clearing and active border. The exact cause is unknown but is believed to be related to an abnormal immune response.',
    commonSigns: [
      'Ring-shaped (annular) skin lesions',
      'Purple or violet flat-topped bumps',
      'Central clearing with active raised border',
      'Mild to moderate itching',
      'Lesions commonly on genitals, axillae, and extremities',
      'Wickham striae (fine white lines on lesions)'
    ],
    recommendations: [
      'Visit a dermatologist for clinical diagnosis and possible biopsy.',
      'Avoid scratching to prevent secondary infections.',
      'Identify and eliminate potential triggers such as medications.',
      'Use moisturizers regularly to reduce dryness and itching.'
    ],
    instructions: [
      { title: 'Sun Protection', desc: 'UV exposure can worsen lesions; use broad-spectrum sunscreen.', icon: 'sun' },
      { title: 'Monitoring', desc: 'Monitor the spread and size of ring-shaped lesions.', icon: 'eye' },
      { title: 'Avoid Triggers', desc: 'Avoid NSAIDs and certain blood pressure medications if identified as triggers.', icon: 'ban' },
      { title: 'Follow-up', desc: 'Regular check-ups to assess treatment response.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'Clobetasol Propionate 0.05% Cream',
        type: 'Potent Topical Corticosteroid - First-line treatment',
        when: 'Apply twice daily',
        frequency: 'Twice daily for 2-4 weeks',
        usage: 'Apply directly to active ring border, not center'
      },
      {
        name: 'Tacrolimus 0.1% Ointment',
        type: 'Calcineurin Inhibitor - Steroid-sparing option',
        when: 'Morning and evening',
        frequency: 'Twice daily for 3-6 months',
        usage: 'Ideal for sensitive areas and face'
      },
      {
        name: 'Hydroxychloroquine 200mg',
        type: 'Antimalarial - For widespread or resistant cases',
        when: 'Take after meals',
        frequency: 'Once or twice daily as prescribed',
        usage: 'Requires regular eye monitoring'
      }
    ]
  },

  'healty': {
    displayName: 'Healthy Skin',
    about: 'The analysis indicates that your skin appears healthy with no significant signs of disease detected. Healthy skin has an even tone, smooth texture, and no unusual lesions or abnormalities. Maintaining good skin health involves proper hydration, sun protection, and a balanced diet.',
    commonSigns: [
      'Even skin tone and texture',
      'No unusual patches or lesions',
      'Well-hydrated and elastic skin',
      'No excessive redness or irritation',
      'Normal skin barrier function',
      'No signs of active inflammation'
    ],
    recommendations: [
      'Continue your current skincare routine for maintenance.',
      'Apply broad-spectrum SPF 30+ sunscreen daily.',
      'Stay hydrated and maintain a balanced diet rich in antioxidants.',
      'Perform regular self-skin checks and consult a dermatologist annually.'
    ],
    instructions: [
      { title: 'Sun Protection', desc: 'Apply SPF 30+ sunscreen every morning, reapply every 2 hours outdoors.', icon: 'sun' },
      { title: 'Skin Monitoring', desc: 'Check your skin monthly for any new moles or changes.', icon: 'eye' },
      { title: 'Avoid Harsh Products', desc: 'Use gentle, pH-balanced cleansers and moisturizers.', icon: 'ban' },
      { title: 'Annual Check-up', desc: 'Visit a dermatologist once a year for a professional skin exam.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'Broad-Spectrum Sunscreen SPF 50+',
        type: 'Preventive Care - Daily use',
        when: 'Every morning before going out',
        frequency: 'Daily, reapply every 2 hours',
        usage: 'Apply generously to all exposed skin areas'
      },
      {
        name: 'Gentle Moisturizer (Ceramide-based)',
        type: 'Skin Barrier Support - Maintenance',
        when: 'After shower, morning and evening',
        frequency: 'Twice daily',
        usage: 'Apply to slightly damp skin for best absorption'
      },
      {
        name: 'Vitamin C Serum 10-20%',
        type: 'Antioxidant - Skin brightening and protection',
        when: 'Apply in the morning before sunscreen',
        frequency: 'Once daily',
        usage: 'Apply 3-5 drops to clean, dry face'
      }
    ]
  },

  'psoriasis': {
    displayName: 'Psoriasis',
    about: 'Psoriasis is a chronic autoimmune skin condition that causes rapid skin cell turnover, resulting in scaly, thick, red patches covered with silvery scales. It is not contagious and tends to cycle through flares and remissions. It can affect any part of the body and may be associated with psoriatic arthritis.',
    commonSigns: [
      'Red patches covered with thick, silvery-white scales',
      'Dry, cracked skin that may bleed',
      'Itching, burning, or soreness',
      'Thickened, pitted, or ridged nails',
      'Swollen and stiff joints (psoriatic arthritis)',
      'Plaques commonly on elbows, knees, and scalp'
    ],
    recommendations: [
      'Consult a dermatologist for an accurate diagnosis and treatment plan.',
      'Avoid triggers such as stress, smoking, and alcohol.',
      'Keep skin moisturized to reduce scaling and cracking.',
      'Phototherapy may be recommended for moderate to severe cases.'
    ],
    instructions: [
      { title: 'Sun Protection', desc: 'Moderate sun exposure can help, but avoid sunburn which triggers flares.', icon: 'sun' },
      { title: 'Monitoring', desc: 'Track flare-ups and identify personal triggers to manage them.', icon: 'eye' },
      { title: 'Avoid Triggers', desc: 'Stress, alcohol, and certain medications can worsen psoriasis.', icon: 'ban' },
      { title: 'Regular Follow-up', desc: 'Check in with your dermatologist every 3-6 months.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'Calcipotriol 0.005% Cream (Vitamin D analog)',
        type: 'First-line Topical - Reduces cell turnover',
        when: 'Apply in the morning',
        frequency: 'Once or twice daily for 8 weeks',
        usage: 'Apply to plaques only, avoid face and skin folds'
      },
      {
        name: 'Betamethasone Dipropionate 0.05% Cream',
        type: 'Topical Corticosteroid - Anti-inflammatory',
        when: 'Apply in the evening',
        frequency: 'Once daily, max 4 weeks continuously',
        usage: 'Use on thick plaques; taper gradually'
      },
      {
        name: 'Coal Tar Shampoo/Cream 2-5%',
        type: 'Keratolytic - Reduces scaling',
        when: 'During shower or bath',
        frequency: '2-3 times per week',
        usage: 'Leave on for 5-10 minutes before rinsing'
      },
      {
        name: 'Methotrexate 7.5-25mg (if severe)',
        type: 'Systemic Immunosuppressant - For severe cases',
        when: 'Once weekly as prescribed',
        frequency: 'Weekly oral dose',
        usage: 'Requires regular blood tests for liver monitoring'
      }
    ]
  },

  'tinea circinata': {
    displayName: 'Tinea Circinata (Ringworm)',
    about: 'Tinea Circinata, commonly known as ringworm or tinea corporis, is a fungal infection of the skin. Despite its name, it has nothing to do with worms. It causes ring-shaped, scaly patches on the skin and is highly contagious. It is caused by dermatophyte fungi and spreads through direct contact.',
    commonSigns: [
      'Ring-shaped, red, scaly patches',
      'Itchy skin with raised borders',
      'Central clearing as the ring expands',
      'Multiple rings may overlap',
      'Redness and scaling along the border',
      'Can spread to other body parts or people'
    ],
    recommendations: [
      'Apply antifungal cream consistently for the full recommended duration.',
      'Keep the affected area clean and dry at all times.',
      'Avoid sharing personal items such as towels and clothing.',
      'Wash hands thoroughly after touching the affected area.'
    ],
    instructions: [
      { title: 'Keep Dry', desc: 'Moisture promotes fungal growth; keep skin dry especially after bathing.', icon: 'sun' },
      { title: 'Monitor Spread', desc: 'Watch for new rings appearing on other body parts.', icon: 'eye' },
      { title: 'Avoid Contact', desc: 'Avoid skin-to-skin contact with others until fully healed.', icon: 'ban' },
      { title: 'Complete Treatment', desc: 'Continue antifungal treatment for 2 weeks after symptoms clear.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'Clotrimazole 1% Cream',
        type: 'Antifungal - First-line OTC treatment',
        when: 'Apply morning and evening',
        frequency: 'Twice daily for 4 weeks',
        usage: 'Apply 2cm beyond the ring border; rub gently'
      },
      {
        name: 'Terbinafine 1% Cream',
        type: 'Allylamine Antifungal - Fast-acting',
        when: 'Once or twice daily',
        frequency: 'Once daily for 1-2 weeks',
        usage: 'Apply to affected area and surrounding skin'
      },
      {
        name: 'Fluconazole 150mg (if extensive)',
        type: 'Oral Antifungal - For widespread infection',
        when: 'Once weekly as prescribed',
        frequency: '2-4 weeks depending on severity',
        usage: 'Take with or without food; avoid alcohol'
      }
    ]
  },

  'urticaria': {
    displayName: 'Urticaria (Hives)',
    about: 'Urticaria, commonly known as hives, is a skin reaction causing raised, itchy welts (wheals) that appear suddenly on the skin. They can be triggered by allergies, infections, stress, or medications. Acute urticaria resolves within 6 weeks, while chronic urticaria can last longer and may require ongoing treatment.',
    commonSigns: [
      'Raised, red or skin-colored welts (wheals)',
      'Intense itching or burning sensation',
      'Welts that change size and shape rapidly',
      'Swelling of lips, eyes, or throat (angioedema)',
      'Skin that blanches (turns white) when pressed',
      'Symptoms that come and go within 24 hours'
    ],
    recommendations: [
      'Identify and avoid known triggers (foods, medications, stress).',
      'Take antihistamines as directed to control symptoms.',
      'Seek emergency care if swelling affects breathing or throat.',
      'Keep a symptom diary to help identify your personal triggers.'
    ],
    instructions: [
      { title: 'Avoid Heat', desc: 'Heat and sweating can trigger or worsen hives; stay cool.', icon: 'sun' },
      { title: 'Monitor Symptoms', desc: 'Track when hives appear and potential triggers.', icon: 'eye' },
      { title: 'Avoid Triggers', desc: 'Common triggers: shellfish, nuts, NSAIDs, latex, and stress.', icon: 'ban' },
      { title: 'Follow-up', desc: 'If hives persist beyond 6 weeks, consult an allergist.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'Cetirizine 10mg (Zyrtec)',
        type: 'Non-sedating Antihistamine - First-line treatment',
        when: 'Once daily, preferably at night',
        frequency: 'Daily until symptoms resolve',
        usage: 'Take with water; avoid alcohol'
      },
      {
        name: 'Loratadine 10mg (Claritin)',
        type: 'Non-sedating Antihistamine - Daytime use',
        when: 'Once in the morning',
        frequency: 'Daily as needed',
        usage: 'Can be taken with or without food'
      },
      {
        name: 'Fexofenadine 180mg (Allegra)',
        type: 'Non-sedating Antihistamine - Long-acting',
        when: 'Once daily',
        frequency: 'Daily for chronic urticaria',
        usage: 'Do not take with fruit juices (reduces absorption)'
      },
      {
        name: 'Prednisolone 20-40mg (if severe)',
        type: 'Oral Corticosteroid - For acute severe attacks',
        when: 'In the morning with food',
        frequency: '5-7 days short course only',
        usage: 'Do not stop abruptly; taper as directed'
      }
    ]
  }
};

/**
 * Get disease data by disease type from Backend
 */
export const getDiseaseData = (diseaseType) => {
  if (!diseaseType) return DISEASES_DATA['healty'];

  if (DISEASES_DATA[diseaseType]) return DISEASES_DATA[diseaseType];

  const key = Object.keys(DISEASES_DATA).find(
    k => k.toLowerCase() === diseaseType.toLowerCase()
  );

  return key ? DISEASES_DATA[key] : {
    displayName: diseaseType,
    about: `${diseaseType} is a skin condition that requires professional medical evaluation. Please consult a dermatologist for accurate diagnosis and treatment.`,
    commonSigns: ['Skin changes requiring medical evaluation', 'Consult a dermatologist for full assessment'],
    recommendations: ['Consult a dermatologist for proper diagnosis and treatment plan.'],
    instructions: [
      { title: 'Sun Protection', desc: 'Protect affected skin from sun exposure.', icon: 'sun' },
      { title: 'Monitoring', desc: 'Monitor any changes in skin condition.', icon: 'eye' },
      { title: 'Avoid Irritants', desc: 'Use gentle skincare products only.', icon: 'ban' },
      { title: 'Follow-up', desc: 'Regular dermatology appointments recommended.', icon: 'calendar' }
    ],
    medicines: [
      {
        name: 'As prescribed by your dermatologist',
        type: 'Consult a specialist before using any medication',
        when: 'As directed', frequency: 'As directed', usage: 'Do not self-medicate'
      }
    ]
  };
};

export default DISEASES_DATA;