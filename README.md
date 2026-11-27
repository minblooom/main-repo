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
- [Node.js](https://nodejs.org/) (20.19.4+, 22.13.0+, or 24.3.0+)
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
   - For local API access, keep the phone and development computer on the same network and configure the API URL for that device. The default `localhost` / `10.0.2.2` addresses are intended for web/iOS simulator and Android emulator development.

### Backend configuration

The app uses `EXPO_PUBLIC_API_URL` for its production backend URL. Vercel and EAS are configured to use the Render API at `https://mainrepo-backend.onrender.com/api/v1` by default. Local development uses `http://localhost:5000/api/v1` on web/iOS and `http://10.0.2.2:5000/api/v1` on the Android emulator.

Authentication, profile, mood check-in, arcade sync, community, and Aurora requests require the backend. Signup currently creates a session without email or phone ownership verification; password-reset OTP still depends on email delivery. Aurora's normal chat requests go through Render to Gemini when `GEMINI_API_KEY` is configured on the backend. The current message and up to 6 recent messages are sent to Google; never put the Gemini key in this frontend.

---

## 🌍 Localization & Regional Dialects

MindBloom is built for cultural comfort:
- **Kenya**: English, Kiswahili, and modern street Sheng. Localized emergency contact defaults to Befrienders Kenya (`+254 722 178 177`).
- **Uganda**: English and Luganda support. Emergency contact defaults to Mental Health Uganda Lifeline (`0800 212 121`).
- **Tanzania**: Swahili-first experience with localized helpline directory.
- **Rwanda & Ethiopia**: Regional references and international emotional safety nets.

---

## 🛡️ Safety & Privacy First
MindBloom is **not a replacement for emergency clinical care**. If a user indicates crisis or acute distress, discreet and supportive crisis modals surface local support resources. Storage and transmission vary by feature; see the data-flow notes below.

### Actual data storage and AI flow

- Journal text and saved Aurora conversation history are encrypted in local storage: native apps use XChaCha20-Poly1305 with a key in `expo-secure-store`; web uses AES-GCM with a non-extractable key in IndexedDB. Native voice-note audio is stored locally but is not protected by the journal encryption wrapper.
- Aurora sends the current message and up to 6 recent messages through the backend to Google Gemini for a reply. The backend does not persist Aurora transcripts in the account database; Google's processing and retention follow its applicable API terms.
- Account/profile preferences, mood check-ins, community messages/posts, and some game progress are stored by backend services. They are not end-to-end encrypted by MindBloom.
- Web speech dictation uses the browser's speech-recognition service and may process audio outside MindBloom. Web auth tokens use browser AsyncStorage and are readable by same-origin JavaScript; native tokens use SecureStore.
- The web journal export is unencrypted plain text and excludes voice notes. Full account export, in-app account deletion, and cache-clearing controls are not currently implemented.

---

## 🌐 External APIs & Endpoints Used

Some features use external services. Availability and responses depend on those providers; offline fallbacks are feature-specific and do not guarantee that every network-backed feature works offline.

1. **Open-Meteo Weather API** (Ambient Weather & Hydration Prompts — [weatherService.js](src/services/weatherService.js))
   - `GET https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`
   - No API key required; zero tracking of exact user coordinates.
2. **The Holistic Care Mindfulness API** (Therapeutic Mini-Games & CBT Scenarios — [arcadeApiService.js](src/services/arcadeApiService.js))
   - `GET https://api.theholisticcare.com/v1/mindfulness-games`
   - `GET https://api.theholisticcare.com/v1/mindfulness-games/feelings-detective`
3. **Quotable API** (Post-Game Reflection Prompts — [arcadeApiService.js](src/services/arcadeApiService.js))
   - `GET https://api.quotable.io/random?tags=wisdom|mindfulness`
4. **MindBloom Backend REST API** (Auth, Profile, Mood Check-Ins, Arcade, Community, Aurora)
   - Production: `https://mainrepo-backend.onrender.com/api/v1` (override with `EXPO_PUBLIC_API_URL`)
   - Local web/iOS: `http://localhost:5000/api/v1`
   - Local Android emulator: `http://10.0.2.2:5000/api/v1`

---

## Validation notes and limitations

- Run `npx expo export --platform web` to verify that Metro can bundle the web app. This checks bundling/syntax, not every runtime flow.
- This frontend is JavaScript/JSX; it currently has no TypeScript project config or installed ESLint dependency, so the existing `typecheck` and `lint` scripts are not usable static checks.
- A successful bundle export does not prove that authenticated backend flows, external providers, or every screen have been exercised end to end.
- The `expo-audio` plugin configures microphone access and background playback. Changes to native plugin settings require a new native build; recording and playback still need verification on physical iOS and Android devices.
- Do not treat this README or automated checks as confirmation that every feature is complete. Test the actual deployed app and review provider configuration and logs for network-backed features.
