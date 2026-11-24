# MindBloom 🌿 — Mental Health Sanctuary for East African Youth

> **"Polepole, your pace. A little breathing room, a little more belonging."**

MindBloom is a compassionate, stigma-free digital mental health sanctuary crafted specifically for youth and young adults (teens to late twenties) across Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and beyond. Designed around gentle check-ins, culturally resonant companions, localized dialects (English, Kiswahili, and Sheng), and private reflective spaces, MindBloom meets young people where they are without judgment, clinical coldness, or intrusive data collection.

---

## 🌟 What MindBloom Does

MindBloom reimagines mental wellness support through warm, culturally grounded interactions:

### 1. Culturally Attuned Onboarding & Intentional Personalization
- **Safe & Anonymous Account Creation**: Fast guest exploration or seamless authentication powered by Supabase and local storage (`@react-native-async-storage/async-storage`).
- **Country & Dialect Selection**: Immediate adaptation to regional crisis helplines and language preferences (e.g., Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and international support).
- **Relatable Companions**: Users choose a gentle companion mascot (like **Taz** the patient turtle, **Noodle** the mindful sloth, or **Kiko**) who stays by their side with comforting notes throughout the day.
- **Root Focus Areas**: Gentle selection of what's currently heavy on the heart (academic stress, loneliness, anxiety, burnout, relationship turbulence).
- **Youth Passion & Interest Selection**: Selection of up to 5 genuine youth passions (Afrobeats & Drill, street photography, streetwear thrifting, gaming, creative writing, spoken word, anime, sports). This pairs members into safe, intimate community pods (capped at 12 members) with shared lived experiences and hobbies.

### 2. The Sanctuary (Home & Daily Check-Ins)
- **"How's Your Heart Today?"**: Stigma-free daily emotional check-in with 5 gentle states (*Low*, *Anxious*, *Okay*, *Calm*, *Great*) and contextual tags (*Sleep*, *Studies/Work*, *Solitude*, *Small win*).
- **Personalized Companion Encouragement**: Companions dynamically respond to the user's logged emotions with gentle affirmations.
- **Dynamic User Recognition**: Real names or chosen aliases sync across every screen dynamically without hardcoded placeholders.
- **Instant Emergency Access**: Discreet one-tap access to 24/7 verified local hotlines (e.g., Befrienders Kenya, Mental Health Uganda Lifeline, Tanzania Lifeline) tailored to the user's selected country.

### 3. Journal & Quiet Reflections
- **Private Thought Canvas**: Encrypted local journal sanctuary supporting rich emotional reflections, gratitude logs, and uncensored thoughts.
- **Audio & Voice Reflections**: Voice recordings and soundscape integration for when words feel too difficult to type.
- **Discreet Privacy Shield**: Instant masking toggle that disguises titles and notifications when using the app in public spaces, shared dorms, or matatus.
- **Spark Banners & Prompts**: Culturally relatable reflection starters ("What gave you peace today?", "A small win no one else saw").

### 4. Interactive Sanctuary & Tools
- **Blooms Arcade**: Mini micro-interventions and interactive grounding exercises designed to de-escalate anxiety and sensory overload gently.
- **Chill & Soundscapes**: Soothing ambient audio environments (rainfall, Nairobi night ambience, gentle acoustic chords, ocean breeze).
- **Aurora AI Guide**: Compassionate AI confidant providing non-judgmental active listening, grounding prompts, and cognitive reframing.
- **Community Baraza**: Safe, moderated micro-spaces (affinity pods capped at 12 peers) matching users based on age band, shared challenges, and common creative interests.

### 5. Profile & Comfort Sanctuary
- **Sanctuary Hero Card**: Clean, affirming profile card highlighting the user's chosen avatar mascot, bio motto, and streak without diagnostic labels.
- **Full Settings Customization**: Live modal controls for changing companion mascots, updating dialects/regions, fine-tuning gentle notifications, and toggling dark/light sanctuary themes.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) with [Expo SDK 52](https://expo.dev/) (Managed Workflow) |
| **Platforms** | Android, iOS, and Web (`react-native-web`) |
| **Navigation** | React Navigation v7 (Native Stack + Bottom Tabs) |
| **UI & Styling** | Custom Design System inspired by warm African earthy palettes (`#FAF6EF`, `#4A283D`, `#5B8A72`, `#E07A5F`) |
| **Icons** | `lucide-react-native` & SVG vector graphics |
| **State & Storage** | React State, Context API (`ThemeContext`, `I18nProvider`), and `@react-native-async-storage/async-storage` |
| **Audio & Media** | `expo-av`, `expo-linear-gradient`, `expo-haptics` |
| **Backend Integration**| Node.js / Express REST API, Prisma ORM, Supabase PostgreSQL with PgBouncer connection pooling |

---

## 📁 Project Architecture

```
frontend/
├── assets/                       # Mascot images, cutouts, fonts, and ambient soundscapes
├── src/
│   ├── assets/                   # Vector SVGs, icons, and illustration assets
│   ├── components/               # Cross-app reusable components
│   │   ├── arcade/               # Grounding minigame widgets
│   │   ├── auth/                 # Form inputs and authentication UI
│   │   └── navigation/           # Tab bars, top headers, and side drawer components
│   ├── constants/                # Companion configs, regional helplines, dialects, passions
│   ├── core/                     # API client (`apiClient.js`), safety protocols, storage keys
│   ├── hooks/                    # `useResponsiveLayout`, `useTheme`, `useAuth`
│   ├── navigation/               # Stack and Tab route definitions (`AppNavigator.jsx`)
│   ├── screens/
│   │   ├── arcade/               # Blooms Arcade games & interactive grounding
│   │   ├── aurora/               # Aurora AI chat interface
│   │   ├── auth/                 # Sign In, Sign Up, and Forgot Password
│   │   ├── chill/                # Soothing soundscapes and breathing timers
│   │   ├── home/                 # The Sanctuary Dashboard & Mood Check-In
│   │   ├── journal/              # Journal editor, archive modals, and privacy masks
│   │   ├── onboarding/           # Welcome, Country/Dialect, Companions, Passions, & Rhythms
│   │   └── profile/              # Sanctuary profile card, modals, and localized comfort settings
│   ├── services/                 # AuthService, I18n translation engine, journal storage
│   └── theme/                    # Color tokens, typography, spacing, and dark/light palettes
├── App.js                        # Top-level providers (SafeArea, I18n, Theme, Navigation)
├── index.js                      # Expo entry point
├── app.json                      # Expo configuration & app metadata
└── package.json                  # Dependencies and execution scripts
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) on your mobile device (iOS / Android) or Google Chrome / Edge for web testing

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   # Run with cleared cache on Web
   npm run web

   # Or run interactive Expo CLI
   npm start
   ```

4. **Running on Physical Devices**:
   - Open Expo Go on Android or the Camera app on iOS and scan the QR code displayed in your terminal.

---

## 🌍 Localization & Regional Dialects

MindBloom is built for cultural comfort:
- **Kenya**: English, Kiswahili, and modern street Sheng. Localized emergency contact defaults to Befrienders Kenya (`+254 722 178 177`).
- **Uganda**: English and Luganda support. Emergency contact defaults to Mental Health Uganda Lifeline (`0800 212 121`).
- **Tanzania**: Swahili-first experience with localized helpline directory.
- **Rwanda & Ethiopia**: Regional references and international emotional safety nets.

---

## 🤝 Contributing & Jira Workflow

MindBloom follows Jira-driven branch conventions:
- `KAN-4-home-make-wellbeing-options-easy-to-find`: Home sanctuary and onboarding enhancements.
- `KAN-15-profile-screen`: Profile screen, comfort settings, and hero card refinements.
- `KAN-16-journal-screen`: Journaling tools, entry archiving, and privacy shielding.
- `KAN-8-community-peer-features-spaces`: Community pods and peer baraza (under active development).

### Commit Convention
```
KAN-<IssueNumber> <FeatureName> - <imperative summary of change>
# Example:
git commit -m "KAN-15 Profile - update profile screen and clean up hero card"
```

---

## 🛡️ Safety & Privacy First
MindBloom is **not a replacement for emergency clinical care**. If a user indicates crisis or acute distress, discreet and supportive crisis modals surface verified, toll-free hotlines for immediate professional care. All reflections and notes are private to the user's sanctuary.
