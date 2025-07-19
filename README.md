# 🐍 Snappy Snake

Snappy Snake is a modern, blazing-fast remake of the classic Snake game — built with **React**, **Zustand**, and **Tailwind CSS**. Designed to be responsive, customizable, and developer-friendly.

> Think Snake... but snappier.

---

## 🚀 Features

- 🎮 Smooth gameplay loop with keyboard input
- 📱 Fully responsive layout (mobile-friendly)
- 🌀 Global state management via Zustand
- ⚡ Styled with Tailwind CSS
- 🧠 Clean and modular React components
- 💾 Local high score saving (via `localStorage`)
- 🧪 Easy to extend — add power-ups, skins, themes

---

## 📦 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 📸 Preview

![Snappy Snake Screenshot](./public/preview.png)

---

## 🧑‍💻 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Ra1nningDay/snappy-snake.git
cd snappy-snake
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

---

## 🎮 Game Controls

| Action       | Key              |
| ------------ | ---------------- |
| Move Up      | ↑ / W            |
| Move Down    | ↓ / S            |
| Move Left    | ← / A            |
| Move Right   | → / D            |
| Pause/Resume | Spacebar         |
| Restart      | R (on game over) |

---

## 📁 Project Structure

```
/src
  /components   → UI elements
  /hooks        → useSnake, useGameLoop
  /store        → Zustand state
  /utils        → movement, collision detection
  /assets       → icons, sounds (optional)
```

---

## 🛣️ Roadmap (Optional Features)

- Touch controls for mobile
- Themes (Dark / Light / Retro)
- Power-ups and obstacles
- Global leaderboard with Firebase or Supabase
- Multiplayer mode (WebSocket-based)

---
