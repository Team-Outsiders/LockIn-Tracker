# Lock In - AI Personalized Study Planner

A mobile app built with Expo (React Native) and Express backend.

## Architecture

- **Frontend**: Expo Router (file-based routing), React Native
- **Backend**: Express.js (port 5000), serves API and landing page
- **State**: AsyncStorage for local persistence, React Context for shared state
- **Styling**: StyleSheet + expo-linear-gradient, light/dark theme support

## Screens

- `app/index.tsx` — Landing/Home page with features showcase and "Get Started" button
- `app/(tabs)/index.tsx` — Today's study sessions dashboard
- `app/(tabs)/planner.tsx` — AI Study Plan generator
- `app/(tabs)/progress.tsx` — Weekly activity chart and subject progress
- `app/(tabs)/settings.tsx` — Theme toggle, app stats, data management

## Contexts

- `contexts/ThemeContext.tsx` — Light/Dark/System theme with AsyncStorage persistence
- `contexts/StudyContext.tsx` — Study sessions, plans, streak, weekly stats

## Color Palette

- Primary: `#14B8A6` (teal)
- Accent: `#00D4AA`
- Dark BG: `#0A0E1A`
- Light BG: `#F0F4F8`

## Key Features

- AI-generated study plans (local algorithm based on subject/duration/days preferences)
- Session completion tracking with haptic feedback
- Weekly activity bar chart
- Subject-level progress tracking
- Day streak counter
- Full light/dark/system theme support
- Landing page with hero section and "Get Started" CTA

## Running

- Backend: `npm run server:dev` (port 5000)
- Frontend: `npm run expo:dev` (port 8081)
