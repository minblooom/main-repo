# MindBloom 🌿 — Mental Health Sanctuary for East African Youth

> **"Polepole, your pace. A little breathing room, a little more belonging."**

MindBloom is a compassionate, stigma-free digital mental health sanctuary crafted for youth and young adults (teens `13–17` and young adults `18+`) across Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and beyond. Designed around gentle check-ins, culturally resonant companions, localized dialects (English, Kiswahili, and Sheng), strict age-cohort community isolation, and private reflective spaces, MindBloom meets young people where they are without judgment or clinical coldness.

---

## 🌟 What MindBloom Does

### 1. Culturally Attuned Onboarding & Intentional Personalization
- **Safe & Anonymous Account Creation**: Fast exploration or authentication backed by local persistence (`@react-native-async-storage/async-storage`) and API sync, with onboarding completion gating in `SplashScreen` and `LoginScreen` so incomplete profiles always finish onboarding (`GentleHello` → `ReadyToBloom`).
- **Country & Dialect Selection**: Adaptation to regional crisis helplines and language preferences (Kenya, Uganda, Tanzania, Rwanda, Ethiopia, and international support).
- **Relatable Companions**: Users choose a gentle companion mascot (like **Taz**, **Noodle**, **Pip**, **Sunny**, or **Mochi**) who stays by their side with comforting notes throughout the day.
- **Age-Band & Root Focus Matching**: Users select their age (`13–17`, `18–24`, `25+`), focus areas, and interests—automatically routing them into age-appropriate, cohort-locked Baraza circles.

### 2. Community Baraza & Dedicated `13–17` Teen Space
- **Strict Two-Way Cohort Isolation (`circleMatchingService.js`)**: `normalizeAgeBand()`, `isMinorCohort()`, and `canAccessCircle()` enforce strict separation—`13–17` teens only see and enter teen-only circles, and `18+` adults cannot enter teen circles (and vice versa).
- **`13–17` Teen Sanctuary (`TeenSanctuaryBox` + `CommunityGreeting`)**: Age-locked peer space featuring rotating teen-specific encouragement notes, an interactive companion, and a spotlighted peer circle.
- **Interactive "Drop Your Vibe" Table (`BarazaPresenceBar`)**:
  - **For `13–17` Teens**: 16 vibes across 4 emotional zones (*Heavy*, *Lowkey*, *Steady*, *Hype*) with zone filter tabs, a **Roll vibe 🎲** randomizer, a live **Room Mood Meter**, one-tap peer echo boosts, and **direct deep links into Chill Space** (`Audio Sanctuary`, `Vibes`, or `Stories & Essays`) matched to the teen's selected vibe.
  - **For `18+` Adults**: Classic Baraza lantern table (*Light a lantern*, *Pour chai*, *Leave a flower*, *Hold space*).
- **Header "Today I…" Icon Popover (`CommunityHeader` + `TodayISurvivalBoard`)**: For `13–17` users, a minimal `🕯️` icon next to the `Encrypted` badge pops open (on hover on web, or tap on mobile) an interactive **"Today I…"** card deck with curated anonymous peer moments, **Me too 🫶** reactions, and a curated **+ Add yours** picker (no freetext).
- **Daily Teen Pulse (`TeenDailyPulse`)**: Rotating daily **Question of the Day** with animated peer breakdown bars persisted per day in `AsyncStorage`.
- **Guided Circle Starters (`BarazaGroupChatView`)**: Empty `13–17` circles offer 3 tappable conversation starter chips so teens don't freeze on a blank input box.
- **Tiny Wins & Safe Vent Box (`QuickActionsGrid`, `SmallWinsSection`, `VentBoxSection`)**: Cohort-tailored quick actions for celebrating small wins or releasing emotional weight anonymously.

### 3. The Sanctuary (Home, Journal, Chill Space, Arcade, Aurora)
- **Home & Daily Check-Ins**: Stigma-free daily emotional check-ins (*Low*, *Anxious*, *Okay*, *Calm*, *Great*) with contextual tags and companion encouragement.
- **Journal & Quiet Reflections**: Private local journal sanctuary with voice reflections, reflection prompts, and a discreet privacy mask toggle.
- **Chill Space (`ChillScreen`)**: Interactive sanctuary with **Stories & Essays**, **Audio Sanctuary**, **Vibes**, and **Events** tabs—accepting `initialTab` and `vibeLabel` route params when launched from Baraza's **Drop your vibe**.
- **Blooms Arcade & Aurora AI Guide**: Grounding minigames, sensory exercises, and compassionate AI active listening.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) with [Expo SDK 57](https://expo.dev/) |
| **Platforms** | Android, iOS, and Web (`react-native-web`) |
| **Navigation** | React Navigation v7 (Native Stack + Bottom Tabs) |
| **UI & Styling** | Custom Design System inspired by warm African earthy palettes (`#FAF6EF`, `#4A283D`, `#5B8A72`, `#E07A5F`) |
| **Icons** | `lucide-react-native` & SVG vector graphics |
| **State & Storage** | React State, Context API (`ThemeContext`, `I18nProvider`), and `@react-native-async-storage/async-storage` |
| **Audio & Media** | `expo-audio`, `expo-linear-gradient`, `expo-haptics` |
| **Backend Integration**| Node.js / Express REST API, Prisma ORM, Supabase PostgreSQL with PgBouncer connection pooling |

---

## 📁 Project Architecture

```text
main-repo/
├── assets/
├── src/
│   ├── components/                    # Reusable UI (navigation, companion, voice, auth)
│   ├── constants/                     # Companions, helplines, dialects, passions
│   ├── core/
│   │   ├── api/                       # apiClient.js, authService.js
│   │   └── safety/                    # safetyFilter.js
│   ├── features/
│   │   └── community/
│   │       ├── baraza/                # BarazaPresenceBar, CommunityGreeting, CommunitySpaceCard, BackButton
│   │       ├── circles/               # BarazaGroupChatView, SharingCircleView
│   │       ├── data/                  # communityData, encouragementMessages, resourceItems
│   │       ├── services/              # circleMatchingService (cohort isolation)
│   │       ├── smallWins/             # SmallWinsSection
│   │       ├── store/                 # communityStore (encryptedStorage-backed)
│   │       └── vent/                  # VentBoxSection
│   ├── hooks/                         # useResponsiveLayout, etc.
│   ├── navigation/                    # AppNavigator.jsx
│   ├── screens/
│   │   ├── arcade/                    # Blooms Arcade
│   │   ├── aurora/                    # Aurora AI chat
│   │   ├── auth/                      # Splash, Welcome, Signup, Login, VerifyOtp, ForgotPassword
│   │   ├── chill-space/               # ChillScreen (Stories, Audio Sanctuary, Vibes, Events)
│   │   ├── community/                 # CommunityScreen & components (CommunityHeader, TeenSanctuaryBox, TeenDailyPulse, QuickActionsGrid, CirclesFeedSection)
│   │   ├── home/                      # HomeScreen
│   │   ├── journal/                   # JournalScreen
│   │   ├── onboarding/                # GentleHello -> ReadyToBloom
│   │   └── profile/                   # ProfileScreen & safety resources
│   ├── services/                      # encryptedStorage, onboardingStorage, i18n, voiceNoteService
│   └── theme/                         # Color tokens & dark/light palettes
├── App.js
├── app.json
└── package.json
```

The Expo Audio config plugin enables microphone access for voice notes and background playback for the podcast player. Rebuild native iOS/Android apps after changing these plugin settings.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or v20.x recommended)
- [npm](https://www.npmjs.com/)
- [Expo Go](https://expo.dev/go) (iOS / Android) or a modern browser for web testing

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

## 🛡️ Safety & Privacy First
MindBloom is **not a replacement for emergency clinical care**. If a user indicates crisis or acute distress, discreet and supportive crisis modals surface verified, toll-free hotlines for immediate professional care. All personal journal reflections, Safe Vent posts, and community chat messages are encrypted locally using **XChaCha20-Poly1305** with a 256-bit key stored in `expo-secure-store`, and auth tokens are stored in encrypted device storage on native platforms.

---

## 🌐 External APIs & Endpoints Used

MindBloom integrates external public APIs with `AbortController` timeouts and graceful offline fallbacks:

1. **Open-Meteo Weather API** (Ambient Weather & Hydration Prompts — [weatherService.js](src/services/weatherService.js))
   - `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
   - No API key required; zero tracking of exact user coordinates.
2. **The Holistic Care Mindfulness API** (Therapeutic Mini-Games & CBT Scenarios — [arcadeApiService.js](src/services/arcadeApiService.js))
   - `GET https://api.theholisticcare.com/v1/mindfulness-games`
   - `GET https://api.theholisticcare.com/v1/mindfulness-games/feelings-detective`
3. **Quotable API** (Post-Game Reflection Prompts — [arcadeApiService.js](src/services/arcadeApiService.js))
   - `GET https://api.quotable.io/random?tags=wisdom|mindfulness`
4. **MindBloom Backend REST API** (Auth, Profile, Mood Telemetry, Arcade Checkpoints, Community Small Wins)
   - Base URL: `http://localhost:5000/api/v1` (or `http://10.0.2.2:5000/api/v1` on Android emulator)

---

## 🧩 Challenges & Known Bugs

- **Challenges / Known Bugs:** No unresolved challenges or known bugs at this stage. External API requests use bounded timeouts and automatic offline fallbacks so the app remains responsive even without connectivity.
