# Copilot Instructions for Snappy Snake

## Project Overview

- Snappy Snake is a modern Snake game built with React, Zustand (state), Tailwind CSS (styling), and Vite (build).
- The codebase is modular: UI in `/src/components`, state in `/src/store`, hooks in `/src/hooks`, utilities in `/src/utils`.
- Game logic (movement, collision, score) is handled via custom hooks and utility functions.
- State is managed globally with Zustand; high scores are persisted in `localStorage`.

## Developer Workflows

- **Install:** `npm install` (or `pnpm install`)
- **Start Dev Server:** `npm run dev` (or `pnpm dev`)
- **Build:** `npm run build` (or `pnpm build`)
- **Test:** `npm test` (Vitest)
- **Lint/Format:** `npm run lint`, `npm run format`, `npm run check`

## Key Architectural Patterns

- **Component Structure:** UI is split into small, reusable components in `/src/components`.
- **State Management:** All game state (snake position, direction, score, etc.) is managed in Zustand store (`/src/store`).
- **Hooks:** Game loop and snake logic are implemented as custom hooks (`useGameLoop`, `useSnake` in `/src/hooks`).
- **Styling:** Tailwind CSS is used for all styling; utility classes are preferred over custom CSS.
- **Assets:** Images, icons, and sounds (if any) are placed in `/src/assets`.

## Game Controls

- Arrow keys or WASD for movement
- Spacebar to pause/resume
- R to restart (on game over)

## Conventions & Patterns

- Prefer functional React components and hooks.
- Keep UI logic in components, game logic in hooks/utilities, and state in store.
- Use Tailwind classes for layout and style.
- Extend the game by adding new components, hooks, or store properties.

## Integration Points

- No backend; all logic is client-side. High scores use browser `localStorage`.
- For leaderboard/multiplayer, see roadmap for Firebase/Supabase/WebSocket integration.

## Example Files

- `/src/components/Header.tsx` — UI example
- `/src/hooks/useSnake.ts` — game logic example
- `/src/store/gameStore.ts` — state example

## Roadmap

- Touch controls, themes, power-ups, online leaderboard, multiplayer (see README)

---

For more details, see `README.md` and code comments in each module.
