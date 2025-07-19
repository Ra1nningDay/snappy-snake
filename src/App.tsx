import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGameStore } from './store/gameStore'

const GRID_SIZE = 20

function App() {
  const {
    player,
    bot,
    food,
    highScore,
    isGameOver,
    isPaused,
    playerWins,
    playerLosses,
    botWins,
    botLosses,
    setPlayerDirection,
    setBotDirection,
    moveSnakes,
    restart,
    pause,
    resume,
    resetStats,
  } = useGameStore()

  // Setup screen state
  const [setup, setSetup] = useState(true)
  const [playerName, setPlayerName] = useState('Player1')
  const [botName, setBotName] = useState('Player2')
  const [playerColor, setPlayerColor] = useState('#22c55e') // Tailwind green-500
  const [botColor, setBotColor] = useState('#3b82f6') // Tailwind blue-500
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (setup) return
    const handleKey = (e: KeyboardEvent) => {
      // Player controls
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')
        setPlayerDirection('UP')
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S')
        setPlayerDirection('DOWN')
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        setPlayerDirection('LEFT')
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        setPlayerDirection('RIGHT')
      // Bot controls (for testing, you can add keys for bot direction)
      if (e.key === 'i') setBotDirection('UP')
      if (e.key === 'k') setBotDirection('DOWN')
      if (e.key === 'j') setBotDirection('LEFT')
      if (e.key === 'l') setBotDirection('RIGHT')
      if (e.key === 'r' || e.key === 'R') restart()
      if (e.key === ' ') {
        if (isPaused) resume()
        else pause()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [
    setPlayerDirection,
    setBotDirection,
    restart,
    pause,
    resume,
    isPaused,
    setup,
  ])

  useEffect(() => {
    if (setup) return
    if (isGameOver || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => moveSnakes(), 120)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [moveSnakes, isGameOver, isPaused, setup])

  if (setup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-8">Snappy Snake - Setup</h1>
        <div className="flex gap-12 mb-8">
          <div className="flex flex-col items-center">
            <label className="mb-2 font-bold">Player 1 Name</label>
            <input
              className="px-3 py-1 border-2  rounded text-white mb-2"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={12}
            />
            <label className="mb-2 font-bold">Color</label>
            <input
              type="color"
              value={playerColor}
              onChange={(e) => setPlayerColor(e.target.value)}
              className="w-12 h-12 rounded-full border-2 border-gray-400"
            />
          </div>
          <div className="flex flex-col items-center">
            <label className="mb-2 font-bold">Player 2 Name</label>
            <input
              className="px-3 py-1 border-2 rounded text-white mb-2"
              value={botName}
              onChange={(e) => setBotName(e.target.value)}
              maxLength={12}
            />
            <label className="mb-2 font-bold">Color</label>
            <input
              type="color"
              value={botColor}
              onChange={(e) => setBotColor(e.target.value)}
              className="w-12 h-12 rounded-full border-2 border-gray-400"
            />
          </div>
        </div>
        <button
          className="px-6 py-2 cursor-pointer rounded bg-green-600 hover:bg-green-700 text-white text-xl font-bold"
          onClick={() => setSetup(false)}
        >
          Start Game
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Snappy Snake</h1>
      <div className="mb-5 text-2xl">
        {playerName} Score: {player.score} | {botName} Score: {bot.score}
      </div>
      <div className="mb-3 text-lg flex gap-8">
        <div>
          <span className="font-bold" style={{ color: playerColor }}>
            {playerName}
          </span>{' '}
          <br />
          Win: <span className="text-green-300">{playerWins}</span> / Loss:{' '}
          <span className="text-red-400">{playerLosses}</span>
        </div>
        <div>
          <span className="font-bold" style={{ color: botColor }}>
            {botName}
          </span>{' '}
          <br />
          Win: <span className="text-green-300">{botWins}</span> / Loss:{' '}
          <span className="text-red-400">{botLosses}</span>
        </div>
        <button
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-800 text-white border border-gray-500"
          onClick={resetStats}
        >
          Reset Stats
        </button>
      </div>
      <span className=" text-yellow-400 mb-7 text-2xl">
        High Score: {highScore}
      </span>
      <div
        className="grid bg-gray-800 p-2 rounded"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 600px)',
          aspectRatio: '1',
        }}
      >
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, idx) => {
          const x = idx % GRID_SIZE
          const y = Math.floor(idx / GRID_SIZE)
          const isPlayer = player.body.some((seg) => seg.x === x && seg.y === y)
          const isPlayerHead = player.body[0].x === x && player.body[0].y === y
          const isBot = bot.body.some((seg) => seg.x === x && seg.y === y)
          const isBotHead = bot.body[0].x === x && bot.body[0].y === y
          const isFood = food.some((f) => f.x === x && f.y === y)
          let cellClass = 'bg-gray-900'
          if (isFood) cellClass = 'bg-red-500'
          else if (isPlayerHead) cellClass = ''
          else if (isPlayer) cellClass = ''
          else if (isBotHead) cellClass = ''
          else if (isBot) cellClass = ''
          // Custom color rendering
          const style: any = { aspectRatio: '1' }
          if (isPlayerHead) style.background = playerColor
          else if (isPlayer) style.background = playerColor + '99'
          else if (isBotHead) style.background = botColor
          else if (isBot) style.background = botColor + '99'
          else if (isFood) style.background = '#ef4444'
          else style.background = '#1f2937'
          return (
            <div
              key={idx}
              className={`border border-gray-700 w-full h-full ${cellClass}`}
              style={style}
            />
          )
        })}
      </div>
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10,
              fontFamily: 'serif',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              style={{
                color: '#800000',
                fontSize: '5rem',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                textShadow: '0 0 20px #800000',
              }}
            >
              YOU DIED
            </motion.span>
            <span className="mt-8 text-lg text-gray-300">
              Press R to restart.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      {isPaused && !isGameOver && (
        <div className="text-xl text-blue-400 absolute">Paused</div>
      )}
    </div>
  )
}

export default App
