# Copilot Instructions for Snappy Snake

## 🏗️ Architecture Overview

- **React** (Vite) SPA with modular components
- **Zustand** for global state (game, player/bot, stats)
- **Tailwind CSS** for styling
- **framer-motion** for UI/game over animation
- Game logic in Zustand store (`src/store/gameStore.ts`)
- Player/bot setup (name, color) before game start
- Win/loss stats and high score saved in localStorage
- Multiple food items supported

## 🧑‍💻 Workflows

- Game starts with a setup screen for name/color selection
- Main game loop runs via interval in `App.tsx`, calls `moveSnakes` in store
- Keyboard controls for player, optional bot controls for testing
- Game over triggers animated overlay (Dark Souls style)
- Stats and high score persist across sessions
- Reset stats button available in UI

## 📝 Conventions

- Use Zustand for all game state and mutations
- Use Tailwind for all styling (no CSS files)
- Use functional React components
- Use TypeScript for all code
- Use framer-motion for UI transitions/animations
- All new features should be modular and easy to extend
- Store player/bot names and colors in local state (can be extended to persist)
- All UI text and labels should be easy to localize

## 🔗 Integration Points

- To add LLM-powered bot, integrate API call in store before bot moves
- To add new features (power-ups, themes, multiplayer), create new Zustand state/actions and modular components
- For mobile/touch support, add event listeners and UI controls

## 🛡️ Testing & Quality

- Use Vitest for unit tests (if adding new logic)
- Use ESLint/Prettier for code style
- All new code should be type-safe and follow project conventions

## 🚦 Quick Reference

- Main game logic: `src/store/gameStore.ts`
- Main UI: `src/App.tsx`
- Player/bot setup: local state in `App.tsx`
- Stats/high score: localStorage
- UI: Tailwind + framer-motion

---

> For all AI coding agents: Follow the above architecture, workflows, and conventions. Keep code modular, readable, and easy to extend. Document new features in README and update this file as needed.
