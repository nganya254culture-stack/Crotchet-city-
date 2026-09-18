export interface LyricLine {
  id: string;
  timeMs: number;
  durationMs: number;
  section: 'intro' | 'verse1' | 'chorus1' | 'verse2' | 'chorus2' | 'bridge' | 'dub' | 'chorus3' | 'outro';
  text: string;
  chords?: string;
  patwaMeaning?: string;
  culturalNote?: string;
}

export interface SongSection {
  id: string;
  title: string;
  bars: number;
  theme: string;
  storyNote: string;
}

export const SONG_METADATA = {
  title: "Never Lose My Identity",
  subtitle: "Rasta Is The Only Currency I Have",
  artist: "Roots & InI Sound",
  genre: "Roots Reggae / One-Drop Dub",
  key: "A Minor (Am)",
  bpm: 74,
  signature: "4/4 One-Drop",
  dedication: "For every brother and sister who walks through systemic rejection, unemployment, and prejudice with their heads held high and their faith unshaken.",
  chordsProgression: [
    { name: "Am", roman: "i", notes: ["A", "C", "E"], description: "The deep contemplative roots home" },
    { name: "F", roman: "VI", notes: ["F", "A", "C"], description: "The sorrow and longing of exile" },
    { name: "C", roman: "III", notes: ["C", "E", "G"], description: "The upliftment and inner sun" },
    { name: "G", roman: "VII", notes: ["G", "B", "D"], description: "The triumph and righteous resolution" },
    { name: "Dm", roman: "iv", notes: ["D", "F", "A"], description: "The heavy road of trial" },
    { name: "Em", roman: "v", notes: ["E", "G", "B"], description: "The spiritual elevation" }
  ]
};

export const SONG_SECTIONS: SongSection[] = [
  {
    id: 'intro',
    title: 'Intro & Reasoning',
    bars: 4,
    theme: 'Invocation of Jah & Grounding',
    storyNote: 'The morning mist clears over the city. A solitary Rasta awakens, ties his locks, and prepares to walk the concrete pavement.'
  },
  {
    id: 'verse1',
    title: 'Verse 1: At The Gate',
    bars: 8,
    theme: 'Employment Rejection & The Crown',
    storyNote: 'Waiting in line at the hiring agency and factory gates. Turned away instantly because of dreadlocks and refusing to compromise sacred identity.'
  },
  {
    id: 'chorus1',
    title: 'Chorus: The Spiritual Currency',
    bars: 8,
    theme: 'The Core Anthem',
    storyNote: 'The supreme declaration: while Babylon measures a man in paper notes that devalue, Rasta identity is eternal gold of the soul.'
  },
  {
    id: 'verse2',
    title: 'Verse 2: The Babylon System',
    bars: 8,
    theme: 'Material Deception vs. Roots Vitality',
    storyNote: 'Exposing the hypocrisy of corporate boardrooms and paper currency worship. Hunger of the belly is nothing compared to starvation of the spirit.'
  },
  {
    id: 'chorus2',
    title: 'Chorus: Unshakable Crown',
    bars: 8,
    theme: 'The Anthem Intensifies',
    storyNote: 'Singing with greater conviction as the horns and organ swell together.'
  },
  {
    id: 'bridge',
    title: 'Bridge: Rust & Gold',
    bars: 8,
    theme: 'Word, Sound & Power Revelation',
    storyNote: 'Biblical and ancestral truth: bank vaults rust and financial markets crash, but InI covenant with the Almighty cannot be broken.'
  },
  {
    id: 'dub',
    title: 'Dub Break & Reasoning',
    bars: 8,
    theme: 'Bass & Drum Meditation',
    storyNote: 'The instruments drop away. Pure sub-bass and Nyabinghi thunder drum echo through space, clearing the mind.'
  },
  {
    id: 'chorus3',
    title: 'Final Chorus: Victory Chant',
    bars: 8,
    theme: 'Triumphant Reclamation',
    storyNote: 'The full sound system roars back in unity. Steadfast, unbowed, victorious.'
  },
  {
    id: 'outro',
    title: 'Outro: Blessings & Livity',
    bars: 4,
    theme: 'Eternal Steadfastness',
    storyNote: 'The tape echo repeats into the horizon. Ever living, ever faithful, ever sure.'
  }
];

export const SONG_LYRICS: LyricLine[] = [
  // INTRO
  {
    id: 'l-intro-1',
    timeMs: 0,
    durationMs: 4000,
    section: 'intro',
    text: "Jah... Rastafari. Selassie I the First.",
    chords: "Am",
    patwaMeaning: "Invocation to the Most High",
    culturalNote: "Grounding the mind before facing the daily trials of the world."
  },
  {
    id: 'l-intro-2',
    timeMs: 4000,
    durationMs: 4500,
    section: 'intro',
    text: "In a world of paper promises... InI stand firm. Listen to the heartbeat.",
    chords: "F - G",
    patwaMeaning: "InI = Oneness of the creator and the human being",
    culturalNote: "The Nyabinghi funde drum mimics the human heartbeat."
  },

  // VERSE 1
  {
    id: 'l-v1-1',
    timeMs: 8500,
    durationMs: 4200,
    section: 'verse1',
    text: "Seven in the morning, dust upon mi feet,",
    chords: "Am",
    patwaMeaning: "Walking the city streets looking for honest labor",
    culturalNote: "The working-class struggle in urban concrete jungles."
  },
  {
    id: 'l-v1-2',
    timeMs: 12700,
    durationMs: 4200,
    section: 'verse1',
    text: "Walking past the high-rise looking for relief.",
    chords: "F",
    patwaMeaning: "High-rise = Babylon corporate towers of power",
    culturalNote: "The stark contrast between towering wealth and street-level hardship."
  },
  {
    id: 'l-v1-3',
    timeMs: 16900,
    durationMs: 4200,
    section: 'verse1',
    text: "Every door is shut tight the moment that they see",
    chords: "C",
    patwaMeaning: "Instant discrimination at reception desks and gates",
    culturalNote: "Systemic bias where natural locks are falsely stigmatized."
  },
  {
    id: 'l-v1-4',
    timeMs: 21100,
    durationMs: 4500,
    section: 'verse1',
    text: "The crown upon mi head, the locks of dignity.",
    chords: "G",
    patwaMeaning: "Dreadlocks are worn as a sacred Nazarite vow and royal crown",
    culturalNote: "Numbers 6:5 - 'No razor shall come upon his head... he shall be holy.'"
  },
  {
    id: 'l-v1-5',
    timeMs: 25600,
    durationMs: 4200,
    section: 'verse1',
    text: "No interview, no welcome, no favour in their scheme,",
    chords: "Am",
    patwaMeaning: "The employment system rejects those who won't conform",
    culturalNote: "Systemic blacklisting of independent, conscious thinkers."
  },
  {
    id: 'l-v1-6',
    timeMs: 29800,
    durationMs: 4200,
    section: 'verse1',
    text: "Dem say cut off your locks if you want to chase the dream.",
    chords: "F",
    patwaMeaning: "Dem = The oppressors / Babylon establishment",
    culturalNote: "The pressure to sell one's cultural identity for corporate survival."
  },
  {
    id: 'l-v1-7',
    timeMs: 34000,
    durationMs: 4200,
    section: 'verse1',
    text: "Dem hand me empty promises written on a page,",
    chords: "C",
    patwaMeaning: "Contracts and applications that lead nowhere",
    culturalNote: "Bureaucracy designed to exhaust the spirit."
  },
  {
    id: 'l-v1-8',
    timeMs: 38200,
    durationMs: 4500,
    section: 'verse1',
    text: "While paying half a copper just to lock you inna cage.",
    chords: "G",
    patwaMeaning: "Half a copper = starvation wages; cage = wage slavery",
    culturalNote: "Refusing exploitation even when hungry."
  },

  // CHORUS 1
  {
    id: 'l-ch1-1',
    timeMs: 42700,
    durationMs: 4200,
    section: 'chorus1',
    text: "I can never lose my Identity,",
    chords: "Am",
    patwaMeaning: "The unbreakable soul declaration",
    culturalNote: "Self-determination and unmovable integrity."
  },
  {
    id: 'l-ch1-2',
    timeMs: 46900,
    durationMs: 4200,
    section: 'chorus1',
    text: "Rasta is the only currency I have,",
    chords: "F",
    patwaMeaning: "True wealth is consciousness, livity, and righteousness",
    culturalNote: "The spiritual economics of Rastafari: righteousness outvalues cash."
  },
  {
    id: 'l-ch1-3',
    timeMs: 51100,
    durationMs: 4200,
    section: 'chorus1',
    text: "I can never lose my Identity,",
    chords: "C",
    patwaMeaning: "Repeating for emphasis to fortify the resolve",
    culturalNote: "Chanting down psychological fear and compromise."
  },
  {
    id: 'l-ch1-4',
    timeMs: 55300,
    durationMs: 4500,
    section: 'chorus1',
    text: "When Babylon system turn dem back and laugh!",
    chords: "G",
    patwaMeaning: "Despite mocking and institutional doors slamming",
    culturalNote: "Righteous joy and pity for those trapped in materialistic arrogance."
  },
  {
    id: 'l-ch1-5',
    timeMs: 59800,
    durationMs: 4200,
    section: 'chorus1',
    text: "I can never lose my Identity,",
    chords: "Am",
    patwaMeaning: "Sovereignty of the spirit",
    culturalNote: "No bank, landlord, or employer owns a free soul."
  },
  {
    id: 'l-ch1-6',
    timeMs: 64000,
    durationMs: 4200,
    section: 'chorus1',
    text: "Pure gold inna mi soul, dem cannot confiscate,",
    chords: "F",
    patwaMeaning: "Inna mi soul = within my very core",
    culturalNote: "Material goods can be stolen; faith and divine consciousness cannot."
  },
  {
    id: 'l-ch1-7',
    timeMs: 68200,
    durationMs: 4200,
    section: 'chorus1',
    text: "Rasta is the only currency I have,",
    chords: "C",
    patwaMeaning: "Holding tight to the Nazarite covenant",
    culturalNote: "The sacred currency that opens the gates of Zion."
  },
  {
    id: 'l-ch1-8',
    timeMs: 72400,
    durationMs: 4500,
    section: 'chorus1',
    text: "Steadfast at the gate!",
    chords: "G",
    patwaMeaning: "Unmoving like Mount Zion",
    culturalNote: "Psalm 125:1 - 'They that trust in the Lord shall be as mount Zion.'"
  },

  // VERSE 2
  {
    id: 'l-v2-1',
    timeMs: 76900,
    durationMs: 4200,
    section: 'verse2',
    text: "Dem judge a man by collar, dem judge a man by tie,",
    chords: "Am",
    patwaMeaning: "Superficial judgements of corporate attire",
    culturalNote: "Critique of how society respects hollow uniforms over moral character."
  },
  {
    id: 'l-v2-2',
    timeMs: 81100,
    durationMs: 4200,
    section: 'verse2',
    text: "Dem worshiping the dollar while the truth is cast aside.",
    chords: "F",
    patwaMeaning: "Idolatry of paper notes and greed",
    culturalNote: "The root cause of inequality and exploitation."
  },
  {
    id: 'l-v2-3',
    timeMs: 85300,
    durationMs: 4200,
    section: 'verse2',
    text: "No corporate favour, no bureaucratic grace,",
    chords: "C",
    patwaMeaning: "Excluded from political and commercial favors",
    culturalNote: "Living as an outcast with an upright spine."
  },
  {
    id: 'l-v2-4',
    timeMs: 89500,
    durationMs: 4500,
    section: 'verse2',
    text: "Cold stares on the corner when they pass my face.",
    chords: "G",
    patwaMeaning: "The suspicious glances of passersby",
    culturalNote: "Enduring the cold shoulder of the metropolis without bitterness."
  },
  {
    id: 'l-v2-5',
    timeMs: 94000,
    durationMs: 4200,
    section: 'verse2',
    text: "Yet hunger cannot break what the Most High sanctify,",
    chords: "Am",
    patwaMeaning: "Physical lack cannot crush divine ordination",
    culturalNote: "Ital food of the spirit sustains when physical food is scarce."
  },
  {
    id: 'l-v2-6',
    timeMs: 98200,
    durationMs: 4200,
    section: 'verse2',
    text: "Roots run deeper than the skyscraper high!",
    chords: "F",
    patwaMeaning: "Ancestral roots outlast modern steel and glass",
    culturalNote: "Ancient African wisdom versus temporary modern buildings."
  },
  {
    id: 'l-v2-7',
    timeMs: 102400,
    durationMs: 4200,
    section: 'verse2',
    text: "Your bank balance crumble when the market fall apart,",
    chords: "C",
    patwaMeaning: "Inflation and financial collapses destroy paper wealth",
    culturalNote: "The fragile nature of capitalist economics."
  },
  {
    id: 'l-v2-8',
    timeMs: 106600,
    durationMs: 4500,
    section: 'verse2',
    text: "My riches is the fire burning in my heart.",
    chords: "G",
    patwaMeaning: "The eternal inner flame of consciousness",
    culturalNote: "The fire of truth that burns down illusions."
  },

  // CHORUS 2
  {
    id: 'l-ch2-1',
    timeMs: 111100,
    durationMs: 4200,
    section: 'chorus2',
    text: "I can never lose my Identity,",
    chords: "Am",
    patwaMeaning: "Re-igniting the anthem",
    culturalNote: "With horns and melodica flying high in dub."
  },
  {
    id: 'l-ch2-2',
    timeMs: 115300,
    durationMs: 4200,
    section: 'chorus2',
    text: "Rasta is the only currency I have,",
    chords: "F",
    patwaMeaning: "The only asset that never loses purchasing power in heaven",
    culturalNote: "Righteous deeds and pure vibrations."
  },
  {
    id: 'l-ch2-3',
    timeMs: 119500,
    durationMs: 4200,
    section: 'chorus2',
    text: "I can never lose my Identity,",
    chords: "C",
    patwaMeaning: "Unconditional self-respect",
    culturalNote: "Resisting all forms of assimilation."
  },
  {
    id: 'l-ch2-4',
    timeMs: 123700,
    durationMs: 4500,
    section: 'chorus2',
    text: "When Babylon system turn dem back and laugh!",
    chords: "G",
    patwaMeaning: "Laugh now, cry later when truth is revealed",
    culturalNote: "Patience of the righteous."
  },

  // BRIDGE
  {
    id: 'l-br-1',
    timeMs: 128200,
    durationMs: 4200,
    section: 'bridge',
    text: "Paper currency fade away into dust,",
    chords: "Dm",
    patwaMeaning: "Fiat money has no lasting substance",
    culturalNote: "Reminding listeners of the temporal nature of wealth."
  },
  {
    id: 'l-br-2',
    timeMs: 132400,
    durationMs: 4200,
    section: 'bridge',
    text: "Silver and gold get eaten by the rust.",
    chords: "Am",
    patwaMeaning: "Physical treasures deteriorate",
    culturalNote: "James 5:3 - 'Your gold and silver is cankered...'"
  },
  {
    id: 'l-br-3',
    timeMs: 136600,
    durationMs: 4200,
    section: 'bridge',
    text: "Can a job buy your soul? Can a paycheck buy your peace?",
    chords: "F",
    patwaMeaning: "The ultimate philosophical challenge to the system",
    culturalNote: "What shall it profit a man to gain the world and lose his soul?"
  },
  {
    id: 'l-br-4',
    timeMs: 140800,
    durationMs: 4500,
    section: 'bridge',
    text: "Jah gave me this crown, I will never take it down!",
    chords: "G",
    patwaMeaning: "Divine coronation over corporate subjugation",
    culturalNote: "The crowning glory of natural African hair and dreadlocks."
  },

  // DUB SECTION
  {
    id: 'l-dub-1',
    timeMs: 145300,
    durationMs: 4500,
    section: 'dub',
    text: "[DUB DROP: Drum & Heavy Bassline Pulsing]",
    chords: "Am (Dub Echo)",
    patwaMeaning: "Dub mixing: strip the riddle down to the foundations",
    culturalNote: "Tubby-style one-drop riddim where silence speaks."
  },
  {
    id: 'l-dub-2',
    timeMs: 149800,
    durationMs: 4500,
    section: 'dub',
    text: "Reasoning: 'A man without identity is a ship without an anchor.'",
    chords: "F (Space Delay)",
    patwaMeaning: "Words of wisdom chanted over dub reverbs",
    culturalNote: "The elder's proverb."
  },
  {
    id: 'l-dub-3',
    timeMs: 154300,
    durationMs: 4500,
    section: 'dub',
    text: "Siren sound! Echoes across the valley! InI dread inna Babylon!",
    chords: "C - G (Dub Filter)",
    patwaMeaning: "Dub siren alarm waking up the sleeping minds",
    culturalNote: "Roots sound system siren signaling spiritual readiness."
  },

  // CHORUS 3
  {
    id: 'l-ch3-1',
    timeMs: 158800,
    durationMs: 4200,
    section: 'chorus3',
    text: "I can never lose my Identity,",
    chords: "Am",
    patwaMeaning: "Climax of the song",
    culturalNote: "All elements reunited in thunderous harmony."
  },
  {
    id: 'l-ch3-2',
    timeMs: 163000,
    durationMs: 4200,
    section: 'chorus3',
    text: "Rasta is the only currency I have,",
    chords: "F",
    patwaMeaning: "My treasure in heaven, my peace on earth",
    culturalNote: "The eternal standard of value."
  },
  {
    id: 'l-ch3-3',
    timeMs: 167200,
    durationMs: 4200,
    section: 'chorus3',
    text: "I can never lose my Identity,",
    chords: "C",
    patwaMeaning: "Never compromise, never surrender",
    culturalNote: "Resolute steadfastness."
  },
  {
    id: 'l-ch3-4',
    timeMs: 171400,
    durationMs: 4500,
    section: 'chorus3',
    text: "Steadfast at the gate, Selassie I elevate!",
    chords: "G",
    patwaMeaning: "Final elevation beyond all downpression",
    culturalNote: "Rising above hardship through faith."
  },

  // OUTRO
  {
    id: 'l-out-1',
    timeMs: 175900,
    durationMs: 5000,
    section: 'outro',
    text: "Ever living, ever faithful, ever sure. Give thanks and praise.",
    chords: "Am - F - C - G",
    patwaMeaning: "Traditional Rastafari closing benediction",
    culturalNote: "Blessing the listener with endurance and dignity."
  }
];
