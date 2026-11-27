// src/screens/legal/privacyPolicyContent.js
// Privacy disclosures for MindBloom's current local and backend data flows.

export const PRIVACY_SUMMARY = [
  {
    icon: '🔒',
    title: 'Private On-Device History',
    text: 'Journal text and saved Aurora history are encrypted on your device. Aurora sends your message and up to 6 recent messages to Google Gemini to generate a reply.',
  },
  {
    icon: '🚫',
    title: 'Zero Third-Party Advertising',
    text: 'We never sell your personal information, build advertising profiles, or track your activity across other apps or websites.',
  },
  {
    icon: '🛡️',
    title: 'Age-Aware Safety (13–17)',
    text: 'Age-aware safety features and crisis support are provided for younger users. MindBloom is for people aged 13 and older.',
  },
  {
    icon: '📦',
    title: 'Clear Privacy Information',
    text: 'Aurora history can be cleared in the chat. Full account export and temporary-cache clearing are not yet available in the app.',
  },
];

export const PRIVACY_SECTIONS = [
  {
    id: 'info_we_collect',
    title: '1. What Information We Collect',
    content: `MindBloom processes information in different places depending on the feature:

• Account and profile data: Nickname, contact detail, password hash, age band, gender, bio, focus areas, and interests are stored in MindBloom's backend database.
• Mood check-ins: Mood score/label, time, selected triggers and tools, helpfulness rating, and an optional note are sent to and stored by the backend.
• Private writing: Journal text and saved Aurora conversation history are kept in encrypted storage on the user's device and are not written to MindBloom's account database. Native voice-note audio is stored locally but is not protected by the same app-level encryption wrapper.
• Aurora requests: To generate a reply, the current message and up to 6 recent messages are sent through MindBloom's server to Google Gemini. MindBloom does not save the transcript in its account database; Google's processing and retention are governed by the applicable Google API terms.
• Dictation: Web speech-to-text uses the browser's speech-recognition service, which may process audio outside MindBloom. Check the browser provider's terms and privacy settings.
• Community and game activity: Posts/messages in community spaces and account-linked game progress are stored by backend services to provide those features.`,
  },
  {
    id: 'how_we_use',
    title: '2. How We Use Your Information',
    content: `Your information is processed to:
• Power personalized home greetings and companion interactions.
• Track self-care streaks and seed growth rewards.
• Calibrate soothing soundscapes and mindful breathwork exercises.
• Maintain technical reliability and detect unauthorized access.
• Generate Aurora replies through Google Gemini when you choose to use Aurora.

MindBloom does not use journal entries or mood check-ins for advertising. Aurora messages are sent to Google Gemini for response generation, as described below.`,
  },
  {
    id: 'minors_privacy',
    title: '3. Protections for Minors (Ages 13–17)',
    content: `MindBloom is designed for users aged 13 and older and provides age-aware safety features:

• Parental Guidance: We encourage parents and guardians to discuss healthy digital habits and emotional self-care with their teens.
• No commercial profiling: We do not profile minors for commercial gain.
• Crisis Safety Safeguards: In the rare event that user input suggests imminent risk of self-harm, automated assistance displays local crisis support resources (such as the Kenya Red Cross Hotline 1199).
• Age Gate: Registration is restricted to individuals 13 years of age and older.`,
  },
  {
    id: 'storage_security',
    title: '4. Storage, Encryption & Security',
    content: `• Local encryption: Journal text and saved Aurora history are encrypted at rest on the device. Native apps use a key held by the device secure store; web uses AES-GCM with a non-extractable browser key. Native voice-note audio is not protected by this app-level encryption wrapper. Browser encryption does not protect against malicious code running on the MindBloom site or someone using an unlocked browser profile.
• Journal export: The web journal export is plain text, is not encrypted, and does not include voice-note audio.
• Cloud-synced data: Account/profile information, mood check-ins, community content, and some game progress are stored by MindBloom backend services. These records are not end-to-end encrypted by MindBloom.
• Session credentials: Native apps store authentication tokens with SecureStore. Web authentication tokens use browser AsyncStorage and are readable by same-origin JavaScript; they do not use the journal encryption vault.
• Secure transmission: Network communications use TLS/HTTPS.
• Discreet Privacy Shield: When enabled in Profile settings, sensitive words are masked in the app interface. This does not change what is sent to backend services or Google Gemini.`,
  },
  {
    id: 'data_sharing',
    title: '5. Sharing & Third Parties',
    content: `    MindBloom does not sell personal information or use it for third-party advertising. Some features require service providers to process data:
    • Google Gemini receives the current Aurora message and up to 6 recent messages through MindBloom's server to generate a reply. MindBloom does not persist Aurora transcripts in the account database. Review Google's current API terms for its handling and retention practices.
• Hosting, database, and delivery providers process the information needed to run account, community, and notification features.
• We may also disclose information in narrow legal circumstances:
• To comply with a valid court order or lawful legal process.
• To protect the physical safety of a user or the public where imminent threat of serious bodily harm exists.`,
  },
  {
    id: 'your_rights',
    title: '6. Your Rights & Data Freedom',
    content: `You can:
• Correction: Edit your nickname, bio, focus areas, and interests in Profile. Gender and age band are set during onboarding and cannot be changed from Profile.
• Local history: Clear Aurora conversation history from the Aurora screen. Journal entries can be managed in Journal. On web, exporting journal text creates an unencrypted file; native journal export is not currently supported.
• Account data requests: Full in-app account export, account deletion, and temporary-cache clearing are not currently implemented. Contact privacy@mindbloom.app to request access, correction, or deletion of backend account data.`,
  },
  {
    id: 'contact_privacy',
    title: '7. Privacy Contact',
    content: `For privacy questions, parental inquiries, or data protection concerns:
Privacy contact: privacy@mindbloom.app
Physical Location: Nairobi, Kenya · East Africa`,
  },
];
