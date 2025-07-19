import { create } from 'zustand'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Point = { x: number; y: number }

export interface Snake {
  body: Array<Point>
  direction: Direction
  alive: boolean
  score: number
}

interface GameState {
  player: Snake
  bot: Snake
  food: Array<Point>
  highScore: number
  isPaused: boolean
  isGameOver: boolean
  playerWins: number
  playerLosses: number
  botWins: number
  botLosses: number
  setPlayerDirection: (dir: Direction) => void
  setBotDirection: (dir: Direction) => void
  moveSnakes: () => void
  restart: () => void
  pause: () => void
  resume: () => void
  resetStats: () => void
}

const GRID_SIZE = 20

function getRandomPoint(): Point {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }
}

function getRandomFoodArray(count: number): Array<Point> {
  const arr: Array<Point> = []
  for (let i = 0; i < count; i++) {
    arr.push(getRandomPoint())
  }
  return arr
}

export const useGameStore = create<GameState>((set, get) => ({
  player: {
    body: [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
    ],
    direction: 'RIGHT',
    alive: true,
    score: 0,
  },
  bot: {
    body: [
      { x: 12, y: 12 },
      { x: 13, y: 12 },
    ],
    direction: 'LEFT',
    alive: true,
    score: 0,
  },
  food: getRandomFoodArray(2), // Default to 3 foods
  highScore: Number(localStorage.getItem('highScore')) || 0,
  isPaused: false,
  isGameOver: false,
  playerWins: Number(localStorage.getItem('playerWins')) || 0,
  playerLosses: Number(localStorage.getItem('playerLosses')) || 0,
  botWins: Number(localStorage.getItem('botWins')) || 0,
  botLosses: Number(localStorage.getItem('botLosses')) || 0,
  setPlayerDirection: (dir) =>
    set((state) => {
      const current = state.player.direction
      // Prevent reversing direction
      if (
        (current === 'UP' && dir === 'DOWN') ||
        (current === 'DOWN' && dir === 'UP') ||
        (current === 'LEFT' && dir === 'RIGHT') ||
        (current === 'RIGHT' && dir === 'LEFT')
      ) {
        return {}
      }
      return { player: { ...state.player, direction: dir } }
    }),
  setBotDirection: (dir) =>
    set((state) => {
      const current = state.bot.direction
      // Prevent reversing direction
      if (
        (current === 'UP' && dir === 'DOWN') ||
        (current === 'DOWN' && dir === 'UP') ||
        (current === 'LEFT' && dir === 'RIGHT') ||
        (current === 'RIGHT' && dir === 'LEFT')
      ) {
        return {}
      }
      return { bot: { ...state.bot, direction: dir } }
    }),
  moveSnakes: () => {
    const {
      player,
      bot,
      food,
      highScore,
      isPaused,
      isGameOver,
      playerWins,
      playerLosses,
      botWins,
      botLosses,
    } = get()
    if (isPaused || isGameOver) return
    // Move player
    const playerHead = { ...player.body[0] }
    if (player.direction === 'UP') playerHead.y -= 1
    if (player.direction === 'DOWN') playerHead.y += 1
    if (player.direction === 'LEFT') playerHead.x -= 1
    if (player.direction === 'RIGHT') playerHead.x += 1
    playerHead.x = (playerHead.x + GRID_SIZE) % GRID_SIZE
    playerHead.y = (playerHead.y + GRID_SIZE) % GRID_SIZE
    // Move bot
    const botHead = { ...bot.body[0] }
    if (bot.direction === 'UP') botHead.y -= 1
    if (bot.direction === 'DOWN') botHead.y += 1
    if (bot.direction === 'LEFT') botHead.x -= 1
    if (bot.direction === 'RIGHT') botHead.x += 1
    botHead.x = (botHead.x + GRID_SIZE) % GRID_SIZE
    botHead.y = (botHead.y + GRID_SIZE) % GRID_SIZE
    // Check collision (player vs bot)
    let playerAlive = player.alive
    let botAlive = bot.alive
    if (player.body.some((seg) => seg.x === botHead.x && seg.y === botHead.y))
      botAlive = false
    if (
      bot.body.some((seg) => seg.x === playerHead.x && seg.y === playerHead.y)
    )
      playerAlive = false
    if (playerHead.x === botHead.x && playerHead.y === botHead.y) {
      playerAlive = false
      botAlive = false
    }
    // Check self collision
    if (
      player.body.some(
        (seg) => seg.x === playerHead.x && seg.y === playerHead.y,
      )
    )
      playerAlive = false
    if (bot.body.some((seg) => seg.x === botHead.x && seg.y === botHead.y))
      botAlive = false
    // Update snake bodies
    const newPlayerBody = [playerHead, ...player.body]
    const newBotBody = [botHead, ...bot.body]
    let newFood = [...food]
    let newPlayerScore = player.score
    let newBotScore = bot.score
    let newHighScore = highScore
    // Eat food (player and bot)
    let playerAte = false
    let botAte = false
    const updatedFood: Array<Point> = []
    for (const f of newFood) {
      if (!playerAte && playerHead.x === f.x && playerHead.y === f.y) {
        playerAte = true
        newPlayerScore += 1
        if (newPlayerScore > highScore) {
          newHighScore = newPlayerScore
          localStorage.setItem('highScore', String(newHighScore))
        }
        continue
      }
      if (!botAte && botHead.x === f.x && botHead.y === f.y) {
        botAte = true
        newBotScore += 1
        if (newBotScore > highScore) {
          newHighScore = newBotScore
          localStorage.setItem('highScore', String(newHighScore))
        }
        continue
      }
      updatedFood.push(f)
    }
    newFood = updatedFood
    // Add new food if eaten
    if (playerAte || botAte) {
      newFood.push(getRandomPoint())
    }
    if (!playerAte) {
      newPlayerBody.pop()
    }
    if (!botAte) {
      newBotBody.pop()
    }
    // Win/loss logic
    let newPlayerWins = playerWins
    let newPlayerLosses = playerLosses
    let newBotWins = botWins
    let newBotLosses = botLosses
    const gameOver = !playerAlive || !botAlive
    if (gameOver) {
      if (!playerAlive && botAlive) {
        newPlayerLosses++
        newBotWins++
      } else if (playerAlive && !botAlive) {
        newPlayerWins++
        newBotLosses++
      } else if (!playerAlive && !botAlive) {
        newPlayerLosses++
        newBotLosses++
      }
      localStorage.setItem('playerWins', String(newPlayerWins))
      localStorage.setItem('playerLosses', String(newPlayerLosses))
      localStorage.setItem('botWins', String(newBotWins))
      localStorage.setItem('botLosses', String(newBotLosses))
    }
    set({
      player: {
        ...player,
        body: newPlayerBody,
        alive: playerAlive,
        score: newPlayerScore,
      },
      bot: { ...bot, body: newBotBody, alive: botAlive, score: newBotScore },
      food: newFood,
      highScore: newHighScore,
      isGameOver: gameOver,
      playerWins: newPlayerWins,
      playerLosses: newPlayerLosses,
      botWins: newBotWins,
      botLosses: newBotLosses,
    })
  },
  restart: () =>
    set((state) => ({
      player: {
        body: [
          { x: 8, y: 8 },
          { x: 7, y: 8 },
        ],
        direction: 'RIGHT',
        alive: true,
        score: 0,
      },
      bot: {
        body: [
          { x: 12, y: 12 },
          { x: 13, y: 12 },
        ],
        direction: 'LEFT',
        alive: true,
        score: 0,
      },
      food: getRandomFoodArray(2),
      highScore: state.highScore,
      isPaused: false,
      isGameOver: false,
      playerWins: state.playerWins,
      playerLosses: state.playerLosses,
      botWins: state.botWins,
      botLosses: state.botLosses,
    })),
  resetStats: () => {
    localStorage.setItem('playerWins', '0')
    localStorage.setItem('playerLosses', '0')
    localStorage.setItem('botWins', '0')
    localStorage.setItem('botLosses', '0')
    set({
      playerWins: 0,
      playerLosses: 0,
      botWins: 0,
      botLosses: 0,
    })
  },
  pause: () => set({ isPaused: true }),
  resume: () => set({ isPaused: false }),
}))
