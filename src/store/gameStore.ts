import { create } from 'zustand'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Point = { x: number; y: number }

interface GameState {
  snake: Array<Point>
  direction: Direction
  food: Point
  score: number
  highScore: number
  isGameOver: boolean
  isPaused: boolean
  setDirection: (dir: Direction) => void
  moveSnake: () => void
  restart: () => void
  pause: () => void
  resume: () => void
}

const GRID_SIZE = 20

function getRandomPoint(): Point {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
}

export const useGameStore = create<GameState>((set, get) => ({
  snake: [
    { x: 8, y: 8 },
    { x: 7, y: 8 },
  ] as Array<Point>,
  direction: 'RIGHT',
  food: getRandomPoint(),
  score: 0,
  highScore: Number(localStorage.getItem('highScore')) || 0,
  isGameOver: false,
  isPaused: false,
  setDirection: (dir) => set({ direction: dir }),
  moveSnake: () => {
    const { snake, direction, food, score, isGameOver, isPaused, highScore } =
      get()
    if (isGameOver || isPaused) return
    const head = { ...snake[0] }
    if (direction === 'UP') head.y -= 1
    if (direction === 'DOWN') head.y += 1
    if (direction === 'LEFT') head.x -= 1
    if (direction === 'RIGHT') head.x += 1
    // Check wall collision
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      set({ isGameOver: true })
      return
    }
    // Check self collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      set({ isGameOver: true })
      return
    }
    const newSnake = [head, ...snake]
    let newFood = food
    let newScore = score
    let newHighScore = highScore
    if (head.x === food.x && head.y === food.y) {
      newFood = getRandomPoint()
      newScore += 1
      if (newScore > highScore) {
        newHighScore = newScore
        localStorage.setItem('highScore', String(newHighScore))
      }
    } else {
      newSnake.pop()
    }
    set({
      snake: newSnake,
      food: newFood,
      score: newScore,
      highScore: newHighScore,
    })
  },
  restart: () =>
    set((state) => ({
      snake: [
        { x: 8, y: 8 },
        { x: 7, y: 8 },
      ],
      direction: 'RIGHT',
      food: getRandomPoint(),
      score: 0,
      highScore: state.highScore, // preserve highScore
      isGameOver: false,
      isPaused: false,
    })),
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
}))
