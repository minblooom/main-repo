// Seed data for stories, memes, and events

export const initialStories = [
  {
    id: 's1',
    authorName: 'Anonymous',
    authorEmoji: '🌊',
    location: 'Nairobi Central · 2h ago',
    tag: '⚓ Strong One Burden',
    title: 'Carrying the family at 22 — anyone else?',
    excerpt:
      'First born, best performer in school. Now working entry-level while my siblings need school fees. Nobody asks if I am okay.',
    likes: 147,
    reflections: [
      {
        id: 'r1',
        author: 'Amina · Karen',
        text: 'You are not alone. Being the first born in an African household is a full-time job nobody pays you for.',
      },
      {
        id: 'r2',
        author: 'Brian · Roysambu',
        text: 'Sending you strength. Remember you are allowed to set small boundaries and still love your family.',
      },
    ],
    isLiked: false,
    isSaved: false,
  },
  {
    id: 's2',
    authorName: 'Zawadi',
    authorEmoji: '🌸',
    location: 'Kilimani · Yesterday',
    tag: '🌱 Therapy Journey',
    title: 'Therapy helped me. I was terrified to try it.',
    excerpt:
      'In our community mental health is hushed. Walking into my first session at Chiromo was terrifying, but my therapist understood African family dynamics.',
    likes: 89,
    reflections: [
      {
        id: 'r3',
        author: 'Wanjiku · Westlands',
        text: 'Thank you for sharing this. I have been postponing my first booking for 3 months.',
      },
    ],
    isLiked: false,
    isSaved: true,
  },
  {
    id: 's3',
    authorName: 'Kev',
    authorEmoji: '🦁',
    location: 'Westlands · 3d ago',
    tag: '💼 Work & Hustle',
    title: 'Saying NO to Sunday Overtime',
    excerpt:
      'My boss expects 24/7 replies on WhatsApp. Turning off notifications felt terrifying, but waking up rested on Monday was worth every heartbeat of fear.',
    likes: 95,
    reflections: [
      {
        id: 'r4',
        author: 'Njeri · South B',
        text: 'Archiving work WhatsApp chats on Friday at 5pm saved my sanity!',
      },
    ],
    isLiked: true,
    isSaved: false,
  },
];

export const featuredStory = {
  id: 'aberdare-mist',
  emoji: '🌿',
  title: 'The Aberdare Morning Mist',
  author: 'Narrated by Dr. Amara Kinuthia',
  duration: '14 mins',
  body: 'Close your eyes. Let your shoulders drop away from your ears. Imagine the cool, damp highland air rising from the bamboo forests of the Aberdares. As the first rays of morning light pierce the emerald canopy, you are invited to release everything you have been carrying for the past 48 hours. Breathe in slowly for four counts, hold gently for four, and exhale as the mist lifts across the ridge.',
};

export const initialMemes = [
  {
    id: 'm1',
    badge: 'Nairobi Survival',
    badgeEmoji: '🦁',
    content: 'Going to Karura for 30m to heal inner child 🌿\n\nMy 14 deadlines & rent: 👁️👄👁️',
    reactions: 412,
    reactionEmoji: '😂',
  },
  {
    id: 'm2',
    badge: 'Sheng Therapy',
    badgeEmoji: '🐢',
    hasSubBox: true,
    subBoxEmoji: '🚌',
    subBoxTitle: 'Thika Rd Commute',
    content: 'Traffic jam breathing: Inhale on Thika Rd, hold at Pangani, exhale at Museum Hill.',
    reactions: 328,
    reactionEmoji: '😮‍💨',
  },
  {
    id: 'm3',
    badge: 'Midnight Brain',
    badgeEmoji: '🦉',
    content: 'Brain at 3pm: tired, zero thoughts\n\nBrain at 2:47am: "Let us review every awkward handshake from 2018" 🧠💀',
    reactions: 285,
    reactionEmoji: '😂',
  },
  {
    id: 'm4',
    badge: 'Tulivu Zebra',
    badgeEmoji: '🦓',
    content: 'Therapist: "And what boundary did you set?"\n\nMe: "I left them on delivered for 14 minutes" 😌💅',
    reactions: 519,
    reactionEmoji: '😂',
  },
];

export const initialEvents = [
  {
    id: 'ev1',
    emoji: '🫁',
    emojiBg: '#FCEFE9',
    title: 'Anxiety & Breathing Circle',
    host: 'Dr. Aisha Kimani',
    description: 'Guided group breathing for anxiety management. Open to all students & professionals.',
    dateStr: 'Thu, Nov 12 · 8:45 AM',
    joinedCount: 14,
    capacity: 30,
    extraNote: '',
    isLive: false,
    isGoing: false,
  },
  {
    id: 'ev2',
    emoji: '🕊️',
    emojiBg: '#F7F3FB',
    title: 'Grief Support Group — East Africa',
    host: 'Grace Uwimana',
    description: 'A safe space to process loss with others who understand. Swahili & English discussions.',
    dateStr: 'In progress',
    joinedCount: 8,
    capacity: 20,
    extraNote: ' · Drop-in open now',
    isLive: true,
    isGoing: true,
  },
  {
    id: 'ev3',
    emoji: '🌿',
    emojiBg: '#EAF2E8',
    title: 'Karura Forest Mindful Walk',
    host: 'Tulia Sanctuary & Befrienders KE',
    description: 'Mindful nature immersion, sound bathing, and collective breathwork under tree canopy.',
    dateStr: 'Sat, Nov 15 · 9:00 AM',
    joinedCount: 22,
    capacity: 30,
    extraNote: '',
    isLive: false,
    isGoing: false,
  },
];