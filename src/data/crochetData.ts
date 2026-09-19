import { ServiceItem, Employee, CustomerReview, TransformationItem } from '../types';

export const STUDIO_INFO = {
  name: 'Crochet City',
  tagline: 'The Sacred Art of Pristine, Neat & Clean Dreadlocks',
  slogan: 'Zero Wax. Instant Interlock. Royal Afro Crowns.',
  owner: 'P The dread genius',
  ownerTitle: 'Master Loctician & Pioneer of Pain-Free Needle Crochet',
  ownerShortBio: 'Renowned as East Africa’s dreadlock virtuoso, P The dread genius transformed loc care by banishing sticky waxes, burning gels, and dirty residue. Using precision micro-crochet needles (0.5mm - 0.75mm), he sculpts dense, neat, feather-light locs that hold firm through workouts, showers, and months of growth.',
  address: 'Woodvale Grove, Sound Plaza 3rd Floor, Westlands, Nairobi, Kenya',
  phone: '+254 748 805 190',
  mpesaNumber: '0748805190',
  ownerMpesa: '0748805190',
  founderMpesa: '0115540711',
  mpesaTill: '894210',
  mpesaPaybill: '522522',
  mpesaAccount: 'CROCHETCITY',
  hours: 'Mon – Sat: 7:30 AM – 8:30 PM | Sun: 9:00 AM – 6:00 PM',
  instagram: '@crochetcity_dreadgenius',
  tiktok: '@p_thedreadgenius',
  whatsapp: '+254748805190',
  stats: {
    happyClients: '9,400+',
    yearsMastery: '14 Years',
    cleanRating: '4.98 / 5.0',
    waxUsed: '0% (Always Pure & Organic)',
  }
};

export const COMMISSION_CONFIG = {
  enabled: true,
  ownerName: 'P The dread genius (Crochet City Owner)',
  ownerMpesa: '0748805190',
  ownerPercent: 90, // 90% goes directly to salon owner / locticians
  founderName: 'Platform Creator & Technology Founder',
  founderMpesa: '0115540711',
  founderPercent: 10, // 10% platform founder commission
  darajaMethod: 'Safaricom B2C Split & Instant LNMO',
  description: 'Automated 90/10 split on every booking & transaction via Safaricom Daraja API'
};

export function calculateCommissionSplit(totalAmount: number): {
  totalAmountKsh: number;
  ownerAmountKsh: number;
  ownerPercent: number;
  ownerPhone: string;
  founderAmountKsh: number;
  founderPercent: number;
  founderPhone: string;
  splitDescription: string;
} {
  const safeTotal = Math.max(0, totalAmount);
  const founderAmount = Math.round(safeTotal * (COMMISSION_CONFIG.founderPercent / 100));
  const ownerAmount = safeTotal - founderAmount;
  return {
    totalAmountKsh: safeTotal,
    ownerAmountKsh: ownerAmount,
    ownerPercent: COMMISSION_CONFIG.ownerPercent,
    ownerPhone: COMMISSION_CONFIG.ownerMpesa,
    founderAmountKsh: founderAmount,
    founderPercent: COMMISSION_CONFIG.founderPercent,
    founderPhone: COMMISSION_CONFIG.founderMpesa,
    splitDescription: `${COMMISSION_CONFIG.ownerPercent}% to Owner (${COMMISSION_CONFIG.ownerMpesa}) + ${COMMISSION_CONFIG.founderPercent}% to Founder (${COMMISSION_CONFIG.founderMpesa})`
  };
}

export const EMPLOYEES: Employee[] = [
  {
    id: 'emp-p-genius',
    name: 'P The dread genius',
    moniker: 'The Master Loctician',
    role: 'Founder & Lead Artisan',
    title: 'P The dread genius',
    experienceYears: 14,
    bio: 'Founder of Crochet City and the originator of the high-speed organic crochet technique in Nairobi. Specializes in instant starter locs, master root interlocking, and salvaging damaged or thinning dreadlocks without cutting.',
    specialties: ['Instant Starter Crochet', 'Root Restoration & Micro-Welding', 'Ultra-Neat Grid Partings', 'Wick Lock Maintenance'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    availableToday: true,
    rating: 5.0,
    completedHeads: 4200,
    quote: 'A clean loc is a crown of dignity. No glue, no dirty wax, no shortcuts—only pure craftsmanship that breathes.',
    instagram: '@p_thedreadgenius',
    isOwner: true,
  },
  {
    id: 'emp-ras-keffa',
    name: 'Ras Keffa Mwamba',
    moniker: 'The Interlock King',
    role: 'Senior Loctician',
    title: 'Senior Crochet Loctician',
    experienceYears: 8,
    bio: 'Trained under P The dread genius for 5 years, Ras Keffa is famous for feather-light touch, painless root tightening, and maintaining thick, luscious freeform-turned-neat locs.',
    specialties: ['Painless Crochet Retwist', 'Root Thickening', 'Long Locs Interlocking', 'Rasta Spiritual Loc Care'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    availableToday: true,
    rating: 4.97,
    completedHeads: 1850,
    quote: 'Your roots are your connection to the earth. When we crochet them neat, your presence commands respect.',
    instagram: '@keffa_loccraft',
  },
  {
    id: 'emp-amina-locqueen',
    name: 'Amina Wanjiku',
    moniker: 'Amina Loc Queen',
    role: 'Micro-Loc & Sisterlocks Lead',
    title: 'Sisterlocks & Micro-loc Artisan',
    experienceYears: 7,
    bio: 'Nairobi’s premier specialist in Sisterlocks, microlocs, and precision geometric parting (triangle, diamond, brick). Known for creating immaculate scalp symmetry and ultra-clean hair separation.',
    specialties: ['Sisterlocks Interlocking', 'Micro Crochet Locs', 'Scalp Pattern Parting', 'Kids & Sensitive Scalp Care'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    availableToday: true,
    rating: 4.99,
    completedHeads: 1420,
    quote: 'Perfection is in the millimeter lines. Clean scalp, neat parts, and zero stress on the follicles.',
    instagram: '@amina_locqueen',
  },
  {
    id: 'emp-brian-blocs',
    name: 'Brian Ochieng',
    moniker: 'B-Locs Structural',
    role: 'Loc Extensions & Repairs Specialist',
    title: 'Extensions & Reconstruction Lead',
    experienceYears: 6,
    bio: 'The surgeon of dreadlocks. Brian flawlessly attaches 100% human afro hair loc extensions with undetectable seams and rebuilds locs on the verge of snapping.',
    specialties: ['Seamless Loc Extensions', 'Thinning Loc Surgery', 'Combining & Splitting Locs', 'Bleach Damage Rescue'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    availableToday: false,
    rating: 4.95,
    completedHeads: 1100,
    quote: 'Never cut your locs out of frustration. Bring them to Crochet City—there is no loc too damaged to be saved.',
    instagram: '@blocs_crochetsurgeon',
  },
  {
    id: 'emp-zahra-mwangi',
    name: 'Zahra Mwangi',
    moniker: 'The Scalp Healer',
    role: 'Herbal Detox & Scalp Therapist',
    title: 'Organic Cleanse & Detox Specialist',
    experienceYears: 5,
    bio: 'Certified trichologist and herbal dreadlock therapist. Formulates Crochet City’s signature organic Apple Cider Vinegar, baking soda, lemon, and tea tree soak that pulls out years of embedded lint and old wax.',
    specialties: ['Deep ACV Dread Detox', 'Lint Extraction Therapy', 'Anti-Dandruff & Itch Treatment', 'Hot Oil Scalp Infusion'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    availableToday: true,
    rating: 4.98,
    completedHeads: 980,
    quote: 'True neatness starts with cleanliness. When your locs are light as air and smell fresh, you walk differently.',
    instagram: '@zahra_locdetox',
  },
  {
    id: 'emp-kevo-dreadsmith',
    name: 'Kevo Dreadsmith',
    moniker: 'The Dread Barber',
    role: 'Barber & Style Sculptor',
    title: 'Precision Fade & Styling Artist',
    experienceYears: 5,
    bio: 'Masters the fusion of sharp geometric barbering and artistic dread styling. Known for crispy drop fades, beard trims, double-strand barrel rolls, and petal updos that stay pristine for weeks.',
    specialties: ['Crisp Dread Tapers & Fades', 'Barrel Twists & Crown Weaves', 'Petal Buns & Rope Twists', 'Beard & Loc Co-Styling'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    availableToday: true,
    rating: 4.96,
    completedHeads: 1250,
    quote: 'A crisp hairline paired with freshly crocheted locs is the ultimate statement of luxury and pride.',
    instagram: '@kevo_dreadsmith',
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'serv-crochet-retwist',
    name: 'Instant Needle Crochet Retwist & Interlock',
    category: 'crochet',
    duration: '1.5 – 2.5 hrs',
    priceKsh: 2500,
    priceUsd: 20,
    description: 'Our signature wax-free needle crochet technique. Eliminates fuzzy flyaways, gathers all new growth firmly into the loc shaft, and creates neat, defined scalp parting without burning gel or scalp tension.',
    benefits: ['Zero sticky wax or lint traps', 'Holds neat through gym & wash', 'Scalp breathes freely', 'Lasts 6 to 10 weeks'],
    isPopular: true,
    tag: 'Studio Bestseller',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-starter-locs',
    name: 'Instant Crochet Starter Locs (From Afro)',
    category: 'starter',
    duration: '3.5 – 5.0 hrs',
    priceKsh: 6500,
    priceUsd: 50,
    description: 'Walk in with an afro or loose hair, walk out with fully locked, mature-looking, neat dreadlocks on day one! Using P The dread genius’s micro-interlocking system, no awkward unfurling phase occurs.',
    benefits: ['Instant solid loc structure', 'No unraveling when washing', 'Choice of parting (Diamond/Brick/Triangle)', 'Includes starter care kit'],
    isPopular: true,
    tag: '1-Day Transformation',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-deep-detox',
    name: 'Royal ACV & Herbal Deep Cleanse Detox',
    category: 'detox',
    duration: '1.5 hrs',
    priceKsh: 2000,
    priceUsd: 16,
    description: 'A luxurious bubbling bath of organic Apple Cider Vinegar, pure baking soda, fresh lemon juice, and tea tree/rosemary oils. Strips away years of trapped white buildup, lint, dead skin, and old waxes.',
    benefits: ['Locs feel 40% lighter', 'Completely odor-free & fresh', 'Reveals true rich loc color', 'Scalp detox & itch relief'],
    isPopular: false,
    tag: 'Ultimate Cleanliness',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-loc-repair',
    name: 'Loc Reconstruction, Weak Root & Snapping Repair',
    category: 'repair',
    duration: '2 – 3 hrs',
    priceKsh: 3500,
    priceUsd: 28,
    description: 'Surgical precision crochet repair for thinning roots, dangling locs, holes, or split dreads. We reinforce the core with matching 100% human afro hair using micro-crochet weaving.',
    benefits: ['Prevents loc detachment', 'Restores natural thickness', 'Undetectable seamless repair', 'Saves your years of growth'],
    isPopular: false,
    tag: 'Emergency Rescue',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-loc-extensions',
    name: '100% Human Hair Permanent Loc Extensions',
    category: 'extensions',
    duration: '5 – 7 hrs',
    priceKsh: 12000,
    priceUsd: 95,
    description: 'Instant length and royal fullness! Handcrafted pure human afro kinky dreadlock extensions attached seamlessly with needle crochet. Can be bleached, dyed, washed, and styled just like your natural hair.',
    benefits: ['Indistinguishable from real locs', 'Zero glue or thread used', 'Lifetime durability', 'Custom diameter & shade'],
    isPopular: true,
    tag: 'Luxury Full Set',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-artistic-styling',
    name: 'Signature Dreadlock Styling (Barrels / Petals / Buns)',
    category: 'styling',
    duration: '45 mins – 1.5 hrs',
    priceKsh: 1800,
    priceUsd: 14,
    description: 'Turn your clean dreadlocks into an architectural masterpiece. From double rope twists and interlocking barrel braids to high crown petal buns and red-carpet gala weaves.',
    benefits: ['Protective neat styling', 'Comfortable & zero scalp pulling', 'Lasts up to 4 weeks', 'Custom beads & gold rings included'],
    isPopular: false,
    tag: 'Artistic Craft',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-microlocs',
    name: 'Sisterlocks & Micro-loc Precision Maintenance',
    category: 'crochet',
    duration: '3 – 4 hrs',
    priceKsh: 4500,
    priceUsd: 36,
    description: 'Dedicated 4-point rotation needle tightening for fine micro-locs and Sisterlocks. Flawless symmetry, ultra-clean grids, and meticulous care for delicate hairline zones.',
    benefits: ['Preserves delicate hairline', 'Uniform grid alignment', 'Certified rotation technique', 'Gentle on fine hair'],
    isPopular: false,
    tag: 'Sisterlocks Care',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'serv-barber-fade',
    name: 'Executive Fade, Sharp Edge-Up & Beard Carve',
    category: 'barber',
    duration: '45 mins',
    priceKsh: 1200,
    priceUsd: 10,
    description: 'The finishing touch that makes dreadlocks pop. Crisp razor hairline finish, drop fade or temple taper, hot towel steam, and precision beard grooming with organic oils.',
    benefits: ['Razor sharp line-up', 'Seamless blend into dreads', 'Hot towel relaxing treatment', 'Organic beard oil hydration'],
    isPopular: false,
    tag: 'Dreadlock Combo',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
  }
];

export const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'trans-shake-test',
    title: 'The Master P "Shake-Test" Transformation',
    clientName: 'Junior & Parent, Nairobi',
    service: 'Instant Needle Crochet Retwist & Root Alignment',
    loctician: 'P The dread genius',
    duration: '1 hr 45 mins',
    beforeDescription: 'Unkept 3+ months root regrowth, messy flyaway halo, lost grid definition, and loose stray hairs around the hairline.',
    afterDescription: 'Flawless square grid scalp rows, each loc consolidated with a 0.5mm micro-needle, 100% wax-free, passing the dynamic "Loc Shake Test" immediately without tension or pain.',
    beforeImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    neatnessKeyFactors: [
      'Painless 0.5mm micro-needle interlocking',
      'Sharp geometric scalp grid (zero loose fuzz)',
      'Dynamic Shake Test passed: 100% flexible & lightweight',
      'Zero wax, zero sticky residues, zero burning gels'
    ],
    shakeTestPassed: true,
    videoTitle: 'Live Video: "Shake Tena!" - Full Mobility Shake Test',
    videoCaption: 'Watch the young client vigorously shaking their head immediately after the needle crochet session. The locs bounce freely with zero scalp pull or stiffness.',
    beforeTraits: [
      'Overgrown fuzzy roots merging between locs',
      'Scalp lines completely obscured by loose new growth',
      'Frayed loc shaft with stray hair halo'
    ],
    afterTraits: [
      'Defined rectangular & diamond scalp channels',
      'Solid, compact cylindrical loc shaft',
      'Immediate pain-free movement & bouncy flexibility'
    ]
  },
  {
    id: 'trans-outdoor-mature',
    title: 'Scenic Hillside Sculpting: Thick Mature Locs Restored',
    clientName: 'David K., Nairobi Outskirts',
    service: 'Heavy Mature Locs Re-interlocking & Root Reconstruction',
    loctician: 'P The dread genius',
    duration: '2 hrs 30 mins',
    beforeDescription: 'Dense, mature thick locs with 4+ months of heavy unparted root matting, uneven base distribution, and wild loose flyaways.',
    afterDescription: 'Sculpted root architecture standing firm from the scalp in open sunlight, razor-neat square blocks, pristine sheen with botanical oils.',
    beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    neatnessKeyFactors: [
      'Root-to-tip micro-crochet reinforcement',
      'Even weight redistribution preventing follicle pull',
      'High-definition outdoor sunlight clarity',
      '100% Pure organic jojoba & tea tree finish'
    ],
    shakeTestPassed: true,
    videoTitle: 'Live Video: Master P Sculpting Mature Locs in Nature',
    videoCaption: 'Master P demonstrates rapid-fire needle technique on heavy mature dreadlocks outdoors. Each root is sculpted into an architectural column.',
    beforeTraits: [
      'Thick matted roots collapsing into one another',
      'Loss of scalp boundary definition',
      'Bulbous, irregular shaft thickness'
    ],
    afterTraits: [
      'Sculpted roots standing firm from follicle base',
      'Crisp geometric boundary per dreadlock',
      'Glossy, breathable, wax-free natural luster'
    ]
  },
  {
    id: 'trans-pink-towel-crown',
    title: 'Royal Crown Diamond-Grid Micro-Welding',
    clientName: 'Faith W., Westlands',
    service: 'Sisterlocks & Precision Geometric Scalp Interlock',
    loctician: 'P The dread genius',
    duration: '2 hrs 15 mins',
    beforeDescription: 'Unkept, fuzzy crown roots with stray hairs straying across neighboring parts, causing fuzziness and friction.',
    afterDescription: 'Masterpiece scalp symmetry: diamond grid partings, 100% of stray hairs tucked into the loc core, completely clean scalp paths.',
    beforeImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    neatnessKeyFactors: [
      'Micro-welding needle technique',
      'Symmetrical diamond scalp grid parting',
      'Clean follicle pathways allowing air circulation',
      'Zero scalp pulling or migraine-inducing tightness'
    ],
    shakeTestPassed: true,
    videoTitle: 'Live Video: Crown Symmetry & Diamond Grid Inspection',
    videoCaption: 'A close-up 360-degree scalp walkthrough revealing how every loc emerges from an immaculate geometric base without stray hairs.',
    beforeTraits: [
      'Scalp fuzz creating messy cloudy crown',
      'Roots merging and tangling at the base',
      'Weakening hair shaft from lack of compaction'
    ],
    afterTraits: [
      'Immaculate diamond grid parting visible from all angles',
      '100% compact cylindrical dread core',
      'Zero wax residue: scalp breathes freely'
    ]
  },
  {
    id: 'trans-emergency-repair',
    title: 'Thinning Root Rescue & Loc Shaft Reconstruction',
    clientName: 'Brian M., Kilimani',
    service: 'Loc Reconstruction & Snapping Root Repair',
    loctician: 'P The dread genius',
    duration: '2 hrs 45 mins',
    beforeDescription: 'Three heavy locs dangling on 3–4 fragile hair strands due to prior over-twisting with harsh chemical gel.',
    afterDescription: 'Reinforced internally using 100% human afro hair and micro-crochet mesh. Thick, resilient root base perfectly matched in color and density.',
    beforeImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    neatnessKeyFactors: [
      'Seamless structural core reinforcement',
      'Weight-bearing root distribution',
      'Zero glue or artificial threads',
      'Permanent strength under tension'
    ],
    shakeTestPassed: true,
    videoTitle: 'Live Video: Micro-Needle Root Reconstruction in Action',
    videoCaption: 'Watch P surgically reconstruct a snapping dreadlock with zero glue or threads, restoring full weight-bearing capacity.',
    beforeTraits: [
      'Snapping roots hanging by thin strands',
      'Holes and weak spots along the loc cylinder',
      'Painful uneven scalp weight'
    ],
    afterTraits: [
      'Reinforced uniform root thickness',
      'Smooth cylindrical core with matching density',
      '100% permanent load-bearing strength'
    ]
  },
  {
    id: 'trans-instant-starter',
    title: 'Day-One Instant Mature Starter Locs (From Loose Afro)',
    clientName: 'Kevin O., Nairobi CBD',
    service: 'Instant Needle Starter Locs',
    loctician: 'P The dread genius',
    duration: '4 hrs 30 mins',
    beforeDescription: '4 inches of loose natural 4C afro hair prone to daily tangling and uneven growth.',
    afterDescription: 'Full crown of instant cylindrical mature dreadlocks with immaculate bricklayer scalp grids. 100% water-ready on day one.',
    beforeImg: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&q=80',
    afterImg: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
    neatnessKeyFactors: [
      'Zero awkward unfurling or unravelling stage',
      'Instant wash & shower safety',
      'Crisp brick-pattern scalp channels',
      'Consistent diameter from root to tip'
    ],
    shakeTestPassed: true,
    videoTitle: 'Live Video: Day-One Instant Starter Locs Shower Test',
    videoCaption: 'Proving needle starter locs can be washed immediately without unraveling into loose hair.',
    beforeTraits: [
      'Loose unstructured afro hair',
      'Daily comb manipulation breakage',
      'No loc definition'
    ],
    afterTraits: [
      'Firm mature cylindrical dreadlocks on day one',
      'Even bricklayer parting grid',
      'Washable and gym-ready immediately'
    ]
  }
];

export const NEATNESS_CRITERIA = {
  title: 'How to Know: Before (Unkept) vs After (Neat & Kept)',
  subtitle: 'The Anatomy of True Craftsmanship by P The Dread Genius',
  categories: [
    {
      id: 'scalp-parting',
      title: '1. Scalp Parting & Root Grid',
      beforeLabel: 'BEFORE (Unkept)',
      beforeDescription: 'Parting lines have vanished under overgrown fuzz. New hair growth weaves across adjacent locs (inter-loc webbing), causing uneven tension and tangles.',
      afterLabel: 'AFTER (Neat & Kept)',
      afterDescription: 'Sharp, visible geometric grids (Square, Diamond, or Brick). Every single loc possesses its own dedicated scalp territory, allowing healthy follicle circulation.',
      icon: 'Grid'
    },
    {
      id: 'loc-shaft',
      title: '2. Loc Shaft & The "Halo" Effect',
      beforeLabel: 'BEFORE (Unkept)',
      beforeDescription: 'A cloudy, frizzy halo of loose hairs surrounds each dreadlock. Shafts feel spongy, with irregular bumps, thinning sections, or uncontained coils.',
      afterLabel: 'AFTER (Neat & Kept)',
      afterDescription: 'Smooth, uniform cylindrical density. 100% of loose fibers are woven into the internal core with a 0.5mm needle—not glued down or shellacked.',
      icon: 'Scissors'
    },
    {
      id: 'residue-test',
      title: '3. The Cleanliness & Residue Test',
      beforeLabel: 'BEFORE (Unkept)',
      beforeDescription: 'Sticky, waxy feel from heavy salon beeswax or black gel. Traps grey lint, city dust, and turns white or smells musty when damp.',
      afterLabel: 'AFTER (Neat & Kept)',
      afterDescription: 'Zero wax, zero gels, zero artificial binders. Hydrated exclusively with organic rosewater and botanical oils. Feather-light and fresh.',
      icon: 'Sparkles'
    },
    {
      id: 'shake-test',
      title: '4. The Dynamic "Loc Shake Test"',
      beforeLabel: 'BEFORE (Unkept)',
      beforeDescription: 'Stiff or painful pulling caused by overtight twisting, or conversely loose and unraveling the moment it touches water or workouts.',
      afterLabel: 'AFTER (Neat & Kept)',
      afterDescription: 'Instant pain-free mobility! The client can shake their head vigorously immediately after the appointment—firm, locked, yet bouncy and light.',
      icon: 'RefreshCw'
    }
  ]
};

export const FEATURED_VIDEOS = [
  {
    id: 'vid-shake-test',
    title: 'The Legendary Loc Shake Test ("Shake Tena!")',
    tag: 'Dynamic Motion Proof',
    duration: '0:45',
    loctician: 'P The dread genius',
    description: 'Watch the young client shake their newly crocheted dreadlocks with full joyful freedom. Proves needle crochet provides instant lightness with zero headache or scalp pulling.',
    badge: '100% Pain-Free',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-shaking-her-curly-hair-41444-large.mp4'
  },
  {
    id: 'vid-needle-speed',
    title: 'Master P High-Speed Micro-Crochet (0.5mm Needle)',
    tag: 'Artisan Technique',
    duration: '1:15',
    loctician: 'P The dread genius',
    description: 'Close-up camera work capturing the surgical hand motion of Master P interlocking root flyaways in seconds, turning messy fuzz into tight royal cylinders.',
    badge: 'Zero Wax',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-african-american-man-posing-outdoors-42289-large.mp4'
  },
  {
    id: 'vid-outdoor-sculpting',
    title: 'Scenic Kenya Hillside: Restoring Heavy Mature Locs',
    tag: 'Loc Architecture',
    duration: '1:30',
    loctician: 'P The dread genius',
    description: 'Outdoor loc session in natural sunlight. Master P sculpts dense, mature dreadlocks into clean, upright columns that stay firm through any weather.',
    badge: 'Crown Mastery',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-sun-41372-large.mp4'
  },
  {
    id: 'vid-starter-locs',
    title: 'Instant Needle Starter Locs Day One Proof',
    tag: 'Instant Locking',
    duration: '1:05',
    loctician: 'P The dread genius',
    description: 'Demonstrating how 4C afro hair is locked instantly with the micro-needle. Clean partings and solid cylindrical cylinders ready for immediate washing.',
    badge: 'Instant Results',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-with-afro-hair-smiling-41480-large.mp4'
  },
  {
    id: 'vid-diamond-grid',
    title: 'Diamond Scalp Grid 360° Inspection',
    tag: 'Grid Precision',
    duration: '0:50',
    loctician: 'P The dread genius',
    description: 'A 360-degree panoramic camera sweep of the scalp showing razor-sharp diamond partings with every root standing free and neat.',
    badge: 'Razor-Neat Parting',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-with-curls-41443-large.mp4'
  },
  {
    id: 'vid-acv-detox',
    title: 'Organic Apple Cider Vinegar & Herbal Detox Bubbles',
    tag: 'Deep Cleanse',
    duration: '1:20',
    loctician: 'Amina & P',
    description: 'Deep fizzing ACV and baking soda soak releasing years of trapped white salon wax and lint, leaving dreadlocks 40% lighter.',
    badge: 'Lint-Free Locs',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-water-bubbles-rising-in-slow-motion-41352-large.mp4'
  }
];

export const REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Otieno Collins',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    locAge: '5 Years Loc’d',
    serviceType: 'Instant Needle Crochet Retwist',
    locticianName: 'P The dread genius',
    rating: 5,
    date: '3 days ago',
    title: 'P truly is the Dread Genius! Neatest locs in Kenya.',
    comment: 'I have tried salons in Nairobi CBD and Kilimani for 5 years. Every place applied sticky beeswax or black gel that turned whitish under the sun. P worked on my head with just a 0.5mm needle and pure rosewater. My locs look like fine tuned timber—not a single hair out of place! Two weeks later, after 4 gym sessions, it is still immaculate. Worth every single cent.',
    verified: true,
    helpfulCount: 38
  },
  {
    id: 'rev-2',
    author: 'Faith Muthoni',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    locAge: 'Sisterlocks (3 Years)',
    serviceType: 'Sisterlocks & Micro-loc Precision Maintenance',
    locticianName: 'Amina Wanjiku',
    rating: 5,
    date: '1 week ago',
    title: 'Amina’s parting lines are pure geometry art',
    comment: 'My Sisterlocks have never looked so symmetrical and neat. Amina has super gentle hands, no pulling or headache afterward. She explained every step of the rotation. The studio vibe with the reggae and clean luxury aesthetic made the 3 hours fly by. The M-Pesa till payment was instant and smooth.',
    verified: true,
    helpfulCount: 29
  },
  {
    id: 'rev-3',
    author: 'Captain Derrick Biko',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    locAge: '7 Years Loc’d',
    serviceType: 'Loc Repair & Beard Edge-Up',
    locticianName: 'Brian Ochieng & Kevo Dreadsmith',
    rating: 5,
    date: '2 weeks ago',
    title: 'Saved my dreads from snapping before my wedding',
    comment: 'Three of my front locs were dangerously thin and about to break off. Brian reconstructed them so cleanly you can’t tell where my hair ends and the reinforcement starts. Then Kevo gave me the sharpest hairline taper. Everyone at my wedding was complimenting my locs. Professionalism at its peak.',
    verified: true,
    helpfulCount: 45
  },
  {
    id: 'rev-4',
    author: 'Sipho Ndlovu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    locAge: 'Starter Locs (Day 1)',
    serviceType: 'Instant Starter Crochet Locs',
    locticianName: 'P The dread genius',
    rating: 5,
    date: '3 weeks ago',
    title: 'Started my loc journey with zero ugly phase!',
    comment: 'I walked in with 4 inches of afro and walked out with mature, tight, neat dreadlocks. People kept asking me how my starter locs look like they are 1 year old already. No unraveling, no mess. P The dread genius is in a league of his own. If you want dreadlocks that command respect in corporate or street, come here.',
    verified: true,
    helpfulCount: 52
  },
  {
    id: 'rev-5',
    author: 'Mercy Achieng',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    locAge: '4 Years Loc’d',
    serviceType: 'Royal ACV Detox & Herbal Soak',
    locticianName: 'Zahra Mwangi',
    rating: 5,
    date: 'Last month',
    title: 'The detox pulled out so much hidden gunk',
    comment: 'I was horrified and amazed by what came out during Zahra’s ACV detox bath! Years of trapped hair oils, dust, and old waxes floated to the surface. When my hair dried, my locs felt light like feathers and smelled like tea tree and peppermint. My scalp itch has vanished completely.',
    verified: true,
    helpfulCount: 31
  },
  {
    id: 'rev-6',
    author: 'Juma Khamis',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    locAge: '2 Years Loc’d',
    serviceType: 'Signature Barrel Styling & Retwist',
    locticianName: 'Ras Keffa',
    rating: 5,
    date: 'Last month',
    title: 'Ras Keffa’s barrels lasted 5 full weeks neat!',
    comment: 'Cleanest barrel weave I have ever worn. Not tight on the scalp, but locked in firmly. Ras Keffa has that patient, steady hand. Plus, paying through the M-Pesa STK push took literally 5 seconds while sitting in the chair.',
    verified: true,
    helpfulCount: 22
  }
];

export const CARE_RULES = [
  {
    number: '01',
    title: 'Ban All Waxes & Heavy Petroleum Gels',
    description: 'Wax does not lock hair; it seals lint, dust, and moisture rot inside your loc core. Pure needle crochet creates instant mechanical locking without a drop of chemical adhesive.',
    icon: 'ShieldAlert'
  },
  {
    number: '02',
    title: 'Night Protection With Silk / Satin Bonnet',
    description: 'Cotton pillowcases act as lint magnets and leech moisture from your dreadlocks. Wrap your crown in a breathable satin scarf or dread sock every night to preserve crisp neatness.',
    icon: 'Moon'
  },
  {
    number: '03',
    title: 'Lightweight Plant Hydration (Rosewater & Aloe)',
    description: 'Keep your locs soft and elastic by misting 2-3 times a week with pure distilled rosewater infused with cold-pressed jojoba oil. Heavy crèmes cause build-up; pure liquids absorb instantly.',
    icon: 'Droplets'
  },
  {
    number: '04',
    title: 'Quarterly Herbal Detox Wash',
    description: 'Every 3 to 4 months, indulge your locs in our signature ACV + baking soda + lemon soak to flush environmental pollutants, gym sweat, and hard water minerals.',
    icon: 'Sparkles'
  },
  {
    number: '05',
    title: 'Crochet Maintenance Every 6 to 8 Weeks',
    description: 'Do not wait until your roots become unmanageable birds nests. Regular needle sessions keep your parting grids sharp, prevent thinning, and maintain uniform dreadlock diameter.',
    icon: 'CheckCircle2'
  }
];
