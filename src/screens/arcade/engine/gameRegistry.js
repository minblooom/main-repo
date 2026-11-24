// src/screens/arcade/engine/gameRegistry.js
// Centralized game catalog for MindBloom Blooms Arcade
// Exactly 6 universal arcade games common across all users:
//   1. Bubble Pop · Tulia Float
//   2. Bloom Crush · Match-3
//   3. Canopy Run · Savanna Dash
//   4. Companion Memory Match
//   5. Stack Attack · Tower Builder
//   6. Bloom Blocks · Grid Puzzle
// Plus scientifically curated, evidence-based therapeutic tools tailored ONLY to what the user is navigating.

export const GAME_CATEGORIES = [
  { id: 'all',         label: 'All games' },
  { id: 'therapeutic', label: '🌿 For My Focus' },
  { id: 'arcade',      label: '🚀 Arcade' },
  { id: 'puzzle',      label: '🧩 Puzzle' },
  { id: 'action',      label: '⚡ Action' },
  { id: 'relax',       label: '🌙 Relax' },
  { id: 'strategy',    label: '🎯 Strategy' },
];

export const QUICK_TAGS = [
  { id: 'under_5',    label: '⏱ Under 5 min' },
  { id: 'gentle',     label: '🌿 Gentle & Calming' },
  { id: 'reframing',  label: '🧠 Thought Reframing' },
  { id: 'focus',      label: '🎯 High Score & Combos' },
  { id: 'infinite',   label: '♾️ Endless & Free' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 1. THE 6 UNIVERSAL ARCADE GAMES (PRESENT FOR ALL USERS)
// ═══════════════════════════════════════════════════════════════════════════════

export const UNIVERSAL_ARCADE_GAMES = [
  {
    id: 'bubble_pop',
    slug: 'bubble-pop',
    title: 'Bubble Pop · Tulia Float',
    shortDesc: 'Pop all ceiling bubble clusters to advance across ascending tranquil realms.',
    fullDesc: 'Aim-and-shoot bubble puzzle. Aim your launcher, match 3 or more clusters, and clear every single bubble from the ceiling to conquer the level and advance!',
    category: 'arcade',
    categoryLabel: 'ARCADE',
    mood: 'Relax',
    duration: '2-3 min',
    difficulty: 'Gentle',
    themeColor: '#3A1448',
    accentColor: '#E8D5FF',
    bgGradient: ['#280B35', '#4A1D5E'],
    coverImage: require('../images/bubblepop.jpg'),
    badge: 'COMMUNITY FAVOURITE',
    isPlayable: true,
    isUniversal: true,
    isDailyEligible: true,
    instructions: [
      'Tap any column to launch your bubble toward the ceiling clusters.',
      'Connect 3 or more of the same color to pop the cluster and drop floating bubbles.',
      'Pop every single bubble on the board to complete the level and advance!',
    ],
  },
  {
    id: 'colour_crush',
    slug: 'colour-crush',
    title: 'Bloom Crush · Match-3',
    shortDesc: 'Complete specific botanical missions (Farm Heroes style) to advance levels.',
    fullDesc: 'Swap adjacent blossoms, gems, and sun seeds to harvest specific botanical quotas before moves run out to complete missions and level up!',
    category: 'puzzle',
    categoryLabel: 'PUZZLE',
    mood: 'Challenge',
    duration: '3-5 min',
    difficulty: 'Medium',
    themeColor: '#1A234E',
    accentColor: '#90CAF9',
    bgGradient: ['#121838', '#23326A'],
    coverImage: require('../images/blossomgame.jpg'),
    badge: 'NEW & POPULAR',
    isPlayable: true,
    isUniversal: true,
    isDailyEligible: true,
    instructions: [
      'Check your harvest mission goals at the top (e.g. 12 Blossoms 🌸, 10 Gems 💎).',
      'Swap adjacent tiles to match 3 or more and harvest those items.',
      'Complete the entire mission before running out of moves to advance!',
    ],
  },
  {
    id: 'canopy_runner',
    slug: 'canopy-runner',
    title: 'Canopy Run · Savanna Dash',
    shortDesc: 'Dodge obstacles, leap over sleepy branches, and gather golden stardust.',
    fullDesc: 'Fast, thrilling, and endlessly replayable. Guide Kiko the swift companion across a scrolling twilight savanna canopy. Jump over sleepy logs and rocks while collecting glowing stars.',
    category: 'action',
    categoryLabel: 'ACTION',
    mood: 'Excitement',
    duration: '3 min',
    difficulty: 'Exciting',
    themeColor: '#4A2810',
    accentColor: '#FFE082',
    bgGradient: ['#351A08', '#5E3416'],
    coverImage: require('../images/cannopyrun.jpg'),
    badge: 'FAST PACED',
    isPlayable: true,
    isUniversal: true,
    isDailyEligible: true,
    instructions: [
      'Tap the Jump button or anywhere on screen to leap over obstacles.',
      'Collect glowing golden stars and seeds along the savanna canopy path.',
      'Gentle recovery if you stumble — beat your personal distance record!',
    ],
  },
  {
    id: 'memory_match',
    slug: 'memory-match',
    title: 'Companion Memory Match',
    shortDesc: 'Flip illustrated tiles, harmonize MindBloom companions, and test recall.',
    fullDesc: 'Flip illustrated cards featuring Taz the turtle, Noodle the sloth, Kiko the fox, Kovu the lion, and mindful acacia blossoms. Match every pair on the board to advance to larger grids!',
    category: 'puzzle',
    categoryLabel: 'PUZZLE',
    mood: 'Focus',
    duration: '3-5 min',
    difficulty: 'Medium',
    themeColor: '#2B1E4A',
    accentColor: '#D1C4E9',
    bgGradient: ['#1F1436', '#3A2862'],
    coverImage: require('../images/memory.jpg'),
    isPlayable: true,
    isUniversal: true,
    isDailyEligible: true,
    instructions: [
      'Tap two cards to flip them over and reveal their hidden companion.',
      'Find and harmonize every twin pair on the board.',
      'Only after matching all pairs will you advance to the next level!',
    ],
  },
  {
    id: 'stack_attack',
    slug: 'stack-attack',
    title: 'Stack Attack · Tower Builder',
    shortDesc: 'Time your taps to stack moving slabs and build sky-high crystal spires.',
    fullDesc: 'Watch luminous slabs glide across the sky. Tap to drop them onto your tower. Perfect alignments trigger harmonic scale chimes, while overhangs are sliced off!',
    category: 'arcade',
    categoryLabel: 'ARCADE',
    mood: 'Challenge',
    duration: '2-4 min',
    difficulty: 'Exciting',
    themeColor: '#31104D',
    accentColor: '#F59E0B',
    bgGradient: ['#1E1B4B', '#3730A3'],
    coverImage: require('../images/stackem.jpg'),
    badge: 'HIGH SCORE HIT',
    isPlayable: true,
    isUniversal: true,
    isDailyEligible: true,
    instructions: [
      'Watch the luminous slab slide back and forth across the tower top.',
      'Tap anywhere to place the slab down on the tower.',
      'Align perfectly to chain combo streaks, or overhangs will be sliced off!',
    ],
  },
  {
    id: 'block_puzzle',
    slug: 'block-puzzle',
    title: 'Bloom Blocks · Grid Puzzle',
    shortDesc: 'Place wooden crystal polyominoes into the 8x8 grid to clear full lines.',
    fullDesc: 'Inspired by Tetris and Blockudoku. Strategically fit distinct geometric shapes into the grid. Clear entire horizontal rows or vertical columns to earn points and calming chimes.',
    category: 'strategy',
    categoryLabel: 'STRATEGY',
    mood: 'Focus',
    duration: '5 min',
    difficulty: 'Medium',
    themeColor: '#1A332E',
    accentColor: '#80CBC4',
    bgGradient: ['#0E201D', '#23443D'],
    coverImage: require('../images/puzzleblock.jpg'),
    badge: 'BRAIN WORKOUT',
    isPlayable: true,
    isUniversal: true,
    isDailyEligible: true,
    instructions: [
      'Pick one of the 3 available shape blocks displayed at the bottom.',
      'Tap an empty spot on the 8x8 board where the piece fits.',
      'Complete full horizontal rows or vertical columns to clear them and score big combos!',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 2. EVIDENCE-BASED THERAPEUTIC GAMES (SHOWN ONLY IF USER CHOSE RELEVANT ISSUES)
// ═══════════════════════════════════════════════════════════════════════════════

export const THERAPEUTIC_EVIDENCE_GAMES = [
  {
    id: 'bubble_breathing',
    slug: 'bubble-breathing',
    title: 'Bubble Breathing Sanctuary 🫧',
    shortDesc: 'Follow expanding clay auras with 4-4-4 pacing to reset your vagus nerve.',
    fullDesc: 'Clinically validated diaphragmatic breathwork. Watch the glowing bubble expand on inhale, hold gently, and release softly to discharge physical tension from your chest and shoulders.',
    category: 'therapeutic',
    categoryLabel: 'EVIDENCE-BASED CBT',
    mood: 'Relax',
    duration: '2-3 min',
    difficulty: 'Gentle',
    themeColor: '#1A3A3A',
    accentColor: '#80CBC4',
    bgGradient: ['#0E2424', '#204A4A'],
    coverImage: require('../images/bubblepop.jpg'),
    badge: 'VAGUS NERVE RESET',
    isPlayable: true,
    isTherapeutic: true,
    isDailyEligible: true,
    issues: ['anxiety', 'burnout', 'sleep', 'feeling_off'],
    interests: ['music', 'mindfulness', 'podcasts', 'deep_talks'],
    clinicalGoal: 'Resets sympathetic nervous system arousal via paced vagal stimulation.',
    instructions: [
      'Inhale deeply through your nose as the glowing bubble expands (4s).',
      'Hold your breath softly at the peak without straining (4s).',
      'Exhale slowly through your mouth as the bubble releases (4s).',
    ],
    companionChatPrompt: 'I just completed Bubble Breathing to calm my nervous system. Can we talk about staying grounded when overwhelm hits?',
    companionCheer: 'Hongera sana! 🌸 Your nervous system has found its calm rhythm. Take this gentleness with you.',
  },
  {
    id: 'worry_tree',
    slug: 'worry-tree',
    title: 'The Acacia Worry Tree 🌳',
    shortDesc: 'Sort worries: plant what you can act on, let uncontrollables drift in the wind.',
    fullDesc: 'Based on Acceptance & Commitment Therapy (ACT) spheres of control. Sort intrusive thoughts: plant actionable steps into rich soil, and release uncontrollable weight to flutter away with the savanna wind.',
    category: 'therapeutic',
    categoryLabel: 'EVIDENCE-BASED ACT',
    mood: 'Relax',
    duration: '3 min',
    difficulty: 'Gentle',
    themeColor: '#3E2723',
    accentColor: '#D7CCC8',
    bgGradient: ['#271815', '#4E342E'],
    coverImage: require('../images/cannopyrun.jpg'),
    badge: 'ACT DEFUSION',
    isPlayable: true,
    isTherapeutic: true,
    isDailyEligible: true,
    issues: ['burnout', 'anxiety', 'strong_one', 'self_doubt', 'relationships'],
    interests: ['outdoors', 'mindfulness', 'crafts', 'cooking'],
    clinicalGoal: 'Interrupts chronic over-responsibility by separating actionable control from emotional rumination.',
    instructions: [
      'Read the incoming thought or worry card on screen.',
      'Tap "In My Hands" if it is something you can directly take a small step on today.',
      'Tap "In The Wind" to release what is outside your control and watch it drift away.',
    ],
    companionChatPrompt: 'I just sorted my worries under the Acacia tree. Can we talk about letting go of what I cannot control?',
    companionCheer: 'Mti mkuu haulali kwa upepo. 🌿 You don’t have to carry the whole world today.',
  },
  {
    id: 'thought_detective',
    slug: 'thought-detective',
    title: 'Thought Detective 🕵️‍♂️',
    shortDesc: 'Catch harsh cognitive distortions and reframe automatic negative thoughts.',
    fullDesc: 'Based on Cognitive Behavioral Therapy (CBT). You are the detective investigating the "Unreliable Narrator" in your head. Spot catastrophizing, mind-reading, and harsh self-talk, and stamp them with grounded truths.',
    category: 'therapeutic',
    categoryLabel: 'EVIDENCE-BASED CBT',
    mood: 'Focus',
    duration: '3-4 min',
    difficulty: 'Medium',
    themeColor: '#1A237E',
    accentColor: '#C5CAE9',
    bgGradient: ['#0D1342', '#283593'],
    coverImage: require('../images/puzzleblock.jpg'),
    badge: 'CBT RESTRUCTURING',
    isPlayable: true,
    isTherapeutic: true,
    isDailyEligible: true,
    issues: ['self_doubt', 'anxiety', 'low_mood', 'trauma', 'isolation', 'emptiness'],
    interests: ['writing', 'books', 'tech', 'gaming', 'podcasts'],
    clinicalGoal: 'Builds cognitive restructuring skills to dispute catastrophizing and all-or-nothing self-criticism.',
    instructions: [
      'Inspect the automatic negative thought displayed on the suspect card.',
      'Identify the distortion: Catastrophizing, Mind-Reading, or Harsh Self-Blame.',
      'Select the balanced, realistic truth card to close the investigation!',
    ],
    companionChatPrompt: 'I just solved a case in Thought Detective! Can we talk about how to catch harsh self-criticism in daily life?',
    companionCheer: 'Case closed! 🔍 You proved that thoughts are just thoughts—not absolute facts.',
  },
  {
    id: 'grounding_54321',
    slug: 'grounding-sensory',
    title: 'Savanna Grounding · 5-4-3-2-1 🌿',
    shortDesc: 'Anchor runaway thoughts to physical reality through 5 sensory checkpoints.',
    fullDesc: 'Clinically proven 5-4-3-2-1 somatic grounding. When racing thoughts, panic, or past trauma triggers take over, anchor yourself to the solid savanna soil by observing 5 sights, 4 physical textures, 3 ambient sounds, 2 scents, and 1 centering affirmation.',
    category: 'therapeutic',
    categoryLabel: 'SOMATIC GROUNDING',
    mood: 'Relax',
    duration: '2-4 min',
    difficulty: 'Gentle',
    themeColor: '#1B382B',
    accentColor: '#A7F3D0',
    bgGradient: ['#0F241B', '#274B39'],
    coverImage: require('../images/cannopyrun.jpg'),
    badge: 'PANIC & TRAUMA ANCHOR',
    isPlayable: true,
    isTherapeutic: true,
    isDailyEligible: true,
    issues: ['trauma', 'anxiety', 'feeling_off', 'body', 'low_mood', 'grief'],
    interests: ['art', 'photography', 'outdoors', 'fitness', 'sports'],
    clinicalGoal: 'Rapidly reduces fight-or-flight hyperarousal by redirecting cognitive focus to immediate physical sensory inputs.',
    instructions: [
      'Tap 5 visible stars or sights around you to anchor your eyes.',
      'Touch and acknowledge 4 physical textures in your space.',
      'Listen for 3 gentle sounds in your surroundings.',
      'Notice 2 comforting scents, and take 1 deep breath of self-kindness.',
    ],
    companionChatPrompt: 'I just completed the 5-4-3-2-1 Grounding exercise. Can you help me stay grounded when intrusive thoughts feel intense?',
    companionCheer: 'Uko salama hapa. 🌿 You are rooted in this present moment, and your body is safe right now.',
  },
  {
    id: 'night_stargazer',
    slug: 'night-stargazer',
    title: 'Night Stargazer · 4-7-8 Winddown ✨',
    shortDesc: 'Calm a racing mind with 4-7-8 rhythms while connecting savanna constellations.',
    fullDesc: 'Evidence-based sleep medicine. Using Dr. Andrew Weil’s 4-7-8 parasympathetic breathing, gently draw and connect soothing starlight constellations against a tranquil midnight sky.',
    category: 'therapeutic',
    categoryLabel: 'SLEEP MEDICINE',
    mood: 'Relax',
    duration: '3 min',
    difficulty: 'Gentle',
    themeColor: '#0F172A',
    accentColor: '#93C5FD',
    bgGradient: ['#070D1B', '#1E293B'],
    coverImage: require('../images/memory.jpg'),
    badge: 'DEEP SLEEP INDUCTION',
    isPlayable: true,
    isTherapeutic: true,
    isDailyEligible: true,
    issues: ['sleep', 'burnout', 'emptiness'],
    interests: ['books', 'music', 'tech', 'mindfulness'],
    clinicalGoal: 'Slows cardiac rhythm and stimulates parasympathetic tone to quiet racing late-night insomnia thoughts.',
    instructions: [
      'Inhale quietly through your nose as the star brightens (4s).',
      'Hold the breath gently without tension (7s).',
      'Exhale completely through your mouth with a soft whoosh (8s) to link the constellation line!',
    ],
    companionChatPrompt: 'I just finished Night Stargazer breathing. My mind was racing before bed—can we talk about winding down peacefully?',
    companionCheer: 'Lala salama. 🌙 The night is here to hold you, not to be solved. Rest well.',
  },
  {
    id: 'small_sparks',
    slug: 'small-sparks',
    title: 'Small Sparks · Gentle Energy 🔥',
    shortDesc: 'Overcome numbness and inertia with tiny, zero-pressure momentum sparks.',
    fullDesc: 'Based on CBT Behavioral Activation. When emotional exhaustion makes everything feel heavy and impossible, don’t climb a mountain. Ignite tiny 30-second micro-sparks of comfort, warm sips of water, and gentle sunlight.',
    category: 'therapeutic',
    categoryLabel: 'BEHAVIORAL ACTIVATION',
    mood: 'Focus',
    duration: '2-3 min',
    difficulty: 'Gentle',
    themeColor: '#3C2314',
    accentColor: '#FED7AA',
    bgGradient: ['#23140A', '#4D2F1D'],
    coverImage: require('../images/stackem.jpg'),
    badge: 'MOMENTUM SPARK',
    isPlayable: true,
    isTherapeutic: true,
    isDailyEligible: true,
    issues: ['low_mood', 'emptiness', 'burnout', 'isolation', 'grief'],
    interests: ['cooking', 'fashion', 'crafts', 'art', 'music'],
    clinicalGoal: 'Interrupts depressive inertia and learned helplessness using low-friction micro-actions.',
    instructions: [
      'Choose one tiny, effortless spark card that feels gentle enough for your energy right now.',
      'Tap to ignite the warm ember and read its quiet permission.',
      'Collect 3 sparks to fill your warm hearth jar with soft savanna light.',
    ],
    companionChatPrompt: 'I played Small Sparks because I felt depleted and empty. Can we talk about building gentle routines without burning out?',
    companionCheer: 'Kidogo kidogo hujaza kibaba. 🔥 Even a tiny spark brings warmth. Be so proud of yourself for showing up today.',
  },
];

export const ALL_AVAILABLE_GAMES = [...UNIVERSAL_ARCADE_GAMES, ...THERAPEUTIC_EVIDENCE_GAMES];

/**
 * Returns the exact tailored catalog for a specific user:
 * - The 6 Universal Arcade Games (always identical for every user)
 * - PLUS only the evidence-based therapeutic games relevant to the user's focus areas!
 */
export const getCatalogForUser = (userFocusAreas = [], userInterests = []) => {
  if (!userFocusAreas || userFocusAreas.length === 0) {
    return UNIVERSAL_ARCADE_GAMES;
  }
  const normalizedAreas = userFocusAreas.map((a) => String(a).toLowerCase().trim());
  const normalizedInterests = (userInterests || []).map((i) => String(i).toLowerCase().trim());

  // 1. Filter therapeutic games that address the user's active focus areas
  const matchedIssuesGames = THERAPEUTIC_EVIDENCE_GAMES.filter((game) =>
    game.issues?.some((issue) =>
      normalizedAreas.some((userFocus) =>
        userFocus === issue ||
        userFocus.includes(issue) ||
        issue.includes(userFocus)
      )
    )
  );

  // 2. Score, align, and prioritize games by the user's selected passions & hobbies
  const rankedTherapeutic = matchedIssuesGames.map((game) => {
    const matchedInterests = (game.interests || []).filter((interest) =>
      normalizedInterests.some((userInterest) =>
        userInterest === interest ||
        userInterest.includes(interest) ||
        interest.includes(userInterest)
      )
    );
    const isInterestAligned = matchedInterests.length > 0;
    return {
      ...game,
      matchedInterests,
      isInterestAligned,
      affinityScore: (matchedInterests.length * 3) + 1,
      interestBadge: isInterestAligned
        ? `ALIGNED WITH YOUR PASSIONS · ${matchedInterests[0].toUpperCase()}`
        : game.badge,
    };
  }).sort((a, b) => b.affinityScore - a.affinityScore);

  return [...rankedTherapeutic, ...UNIVERSAL_ARCADE_GAMES];
};

export const GAMES_CATALOG = ALL_AVAILABLE_GAMES;

export const getGameById = (gameId) => {
  return ALL_AVAILABLE_GAMES.find((g) => g.id === gameId) || UNIVERSAL_ARCADE_GAMES[0];
};
