import { useEffect, useRef } from 'react'
import { useGameStore } from './store/gameStore'

const GRID_SIZE = 20

function App() {
  const {
    snake,
    food,
    score,
    highScore,
    isGameOver,
    isPaused,
    setDirection,
    moveSnake,
    restart,
    pause,
    resume,
  } = useGameStore()
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')
        setDirection('UP')
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S')
        setDirection('DOWN')
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A')
        setDirection('LEFT')
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D')
        setDirection('RIGHT')
      if (e.key === 'r' || e.key === 'R') restart()
      if (e.key === ' ') {
        if (isPaused) resume()
        else pause()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setDirection, restart, pause, resume, isPaused])

  useEffect(() => {
    if (isGameOver || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => moveSnake(), 120)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [moveSnake, isGameOver, isPaused])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-2">Snappy Snake</h1>
      <div className="mb-1">
        Score: {score}{' '}
        <span className="ml-4 text-yellow-400">High Score: {highScore}</span>
      </div>
      <div className="mb-2 flex gap-2">
        <button
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => (isPaused ? resume() : pause())}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
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
          const isSnake = snake.some((seg) => seg.x === x && seg.y === y)
          const isHead = snake[0].x === x && snake[0].y === y
          const isFood = food.x === x && food.y === y
          return (
            <div
              key={idx}
              className={`border border-gray-700 w-full h-full ${isFood ? 'bg-red-500' : isHead ? 'bg-green-400' : isSnake ? 'bg-green-700' : 'bg-gray-900'}`}
              style={{ aspectRatio: '1' }}
            />
          )
        })}
      </div>
      {isGameOver && (
        <div className="mt-4 text-xl text-red-400">
          Game Over! Press R to restart.
        </div>
      )}
      {isPaused && !isGameOver && (
        <div className="mt-4 text-xl text-blue-400">Paused</div>
      )}
    </div>
  )
}

export default App
