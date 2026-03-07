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

## Typography

- Font: Satoshi (Regular, Medium, Bold, Black, Light)
- Loaded via local TTF files in `assets/fonts/`
- Loaded with expo-font in `_layout.tsx`

## Color Palette

- Dark mode: Background `#141414`, Cards `#1E1E1E`, Text `#F0F0F0`
- Light mode: Background `#F5F5F5`, Cards `#FFFFFF`, Text `#111111`
- Accent: `colors.text` (white in dark, near-black in light) — monochrome design
- Destructive: `#CC3333` / `#E05252`

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
