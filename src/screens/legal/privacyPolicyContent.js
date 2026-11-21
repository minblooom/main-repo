// src/screens/legal/privacyPolicyContent.js
// Youth & privacy-protective Privacy Policy covering COPPA, GDPR-K, and the Kenya Data Protection Act 2019.

export const PRIVACY_SUMMARY = [
  {
    icon: '🔒',
    title: 'On-Device Privacy First',
    text: 'Your journal reflections and mood logs are encrypted and saved locally on your device sandbox. We believe your thoughts belong to you.',
  },
  {
    icon: '🚫',
    title: 'Zero Third-Party Advertising',
    text: 'We never sell your personal information, build advertising profiles, or track your activity across other apps or websites.',
  },
  {
    icon: '🛡️',
    title: 'Special Protections for Minors (13–17)',
    text: 'Additional safety filters, no behavioral profiling, strict data minimization, and simplified privacy notices designed for young minds.',
  },
  {
    icon: '📦',
    title: 'Full Data Control & Export',
    text: 'You can export all your reflections in JSON format or wipe your entire sanctuary history at any time with one tap.',
  },
];

export const PRIVACY_SECTIONS = [
  {
    id: 'info_we_collect',
    title: '1. What Information We Collect',
    content: `We collect only what is strictly necessary to provide your personalized sanctuary:

• Account Information: Chosen nickname, contact detail (email or phone), and hashed password.
• Sanctuary Preferences: Selected companion (Taz, Noodle, Kiko, Kovu), selected focus areas (e.g. Anxiety, Sleep, Academic Pressure), and chosen reflection rhythms.
• Self-Reflection Logs: Mood ratings, timestamps, and optional journal entries created by you.
• Arcade Progress: Game achievements, seeds earned, and unlocked levels.`,
  },
  {
    id: 'how_we_use',
    title: '2. How We Use Your Information',
    content: `Your information is processed solely for:
• Powering your personalized home greeting and companion interactions.
• Tracking your self-care streaks and seed growth rewards.
• Calibrating soothing soundscapes and mindful breathwork exercises.
• Ensuring technical reliability and detecting unauthorized access.

We NEVER use your journal entries or emotions for commercial marketing or ad targeting.`,
  },
  {
    id: 'minors_privacy',
    title: '3. Protections for Minors (Ages 13–17)',
    content: `MindBloom takes special care with adolescent data in accordance with youth privacy standards (including COPPA, GDPR-K, and the Kenya Data Protection Act 2019):

• Parental Guidance: We encourage parents and guardians to discuss healthy digital habits and emotional self-care with their teens.
• No Profiling: We do not profile minors for commercial gain.
• Crisis Safety Safeguards: In the rare event that user input suggests imminent risk of self-harm, automated assistance displays local crisis support resources (such as the Kenya Red Cross Hotline 1199).
• Age Gate: Registration is restricted to individuals 13 years of age and older.`,
  },
  {
    id: 'storage_security',
    title: '4. Storage, Encryption & Security',
    content: `• Local Sandbox Storage: Your reflective entries are saved in private device storage inaccessible to other apps.
• Secure Transmission: Network communications utilize industry-standard Transport Layer Security (TLS/HTTPS).
• Discreet Privacy Shield: When enabled in Profile settings, sensitive words are automatically masked with dots when opening the app in public spaces.`,
  },
  {
    id: 'data_sharing',
    title: '5. Sharing & Third Parties',
    content: `MindBloom does not sell, rent, or lease your personal information to third parties. We may disclose information only in narrow legal circumstances:
• To comply with a valid court order or lawful legal process.
• To protect the physical safety of a user or the public where imminent threat of serious bodily harm exists.`,
  },
  {
    id: 'your_rights',
    title: '6. Your Rights & Data Freedom',
    content: `You possess complete sovereignty over your wellness data:
• Access & Export: Export your reflections and settings at any time via Profile > Privacy & Data > Export My Data.
• Correction: Edit your nickname, bio, focus areas, and companion anytime.
• Erasure (Right to Be Forgotten): Delete your account and all stored history immediately from the app.
• Cache Clearing: Clear temporary media caches without losing your saved moments or journal logs.`,
  },
  {
    id: 'contact_privacy',
    title: '7. Privacy Officer Contact',
    content: `For privacy questions, parental inquiries, or data protection concerns:
Data Protection Officer: privacy@mindbloom.app
Physical Location: Nairobi, Kenya · East Africa`,
  },
];
