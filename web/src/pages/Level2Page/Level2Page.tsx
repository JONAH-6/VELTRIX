// web/src/pages/Level2Page/Level2Page.tsx

import { useEffect, useState, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'

const Level2Page = () => {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(5)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(true)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [targetVisible, setTargetVisible] = useState(false)
  const [targetX, setTargetX] = useState(0)
  const [targetY, setTargetY] = useState(0)
  const [isFake, setIsFake] = useState(false) // track if current target is fake

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Level 2 parameters (harder than Level 1)
  const WIN_SCORE = 250
  const TARGET_DISPLAY_TIME = 700 // ms
  const PENALTY_MISS = 2
  const FAKE_PROBABILITY = 0.25 // 25% chance to spawn a fake target

  const getActualWallet = () =>
    parseFloat(localStorage.getItem('veltrix_wallet_balance') || '0')
  const setActualWallet = (val: number) =>
    localStorage.setItem('veltrix_wallet_balance', val.toString())

  const handleWin = () => {
    if (!gameActive) return
    setGameActive(false)
    const newBalance = getActualWallet() * 2
    setActualWallet(newBalance)
    setWinMessage(
      `Level 2 Complete! Money doubled: ₦${newBalance.toLocaleString()}`
    )
    setTimeout(() => navigate(routes.level3()), 2000)
  }

  const handleLose = (reason?: string) => {
    if (!gameActive) return
    setGameActive(false)
    if (reason === 'fake') {
      setWinMessage('You clicked the fake target! Game over.')
    }
    setTimeout(() => navigate(routes.home()), 2000)
  }

  const showTarget = () => {
    if (!gameActive) return
    const container = document.getElementById('game-container-level2')
    if (!container) return
    const rect = container.getBoundingClientRect()
    const size = 70
    const maxX = rect.width - size - 20
    const maxY = rect.height - size - 20
    const x = Math.random() * maxX + 10
    const y = Math.random() * maxY + 10
    setTargetX(x)
    setTargetY(y)

    // Decide if this target is fake
    const fake = Math.random() < FAKE_PROBABILITY
    setIsFake(fake)
    setTargetVisible(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      if (targetVisible && gameActive) {
        // Miss: lose health
        setHealth((prev) => {
          const newHealth = prev - PENALTY_MISS
          if (newHealth <= 0) handleLose()
          return newHealth
        })
        setTargetVisible(false)
        setTimeout(() => showTarget(), 400)
      }
    }, TARGET_DISPLAY_TIME)
  }

  const handleTargetClick = () => {
    if (!gameActive || !targetVisible) return
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setTargetVisible(false)

    if (isFake) {
      // Clicked fake target -> instant game over
      handleLose('fake')
      return
    }

    // Real target: add points
    setScore((prev) => {
      const newScore = prev + 10
      if (newScore >= WIN_SCORE) handleWin()
      return newScore
    })
    setTimeout(() => showTarget(), 200)
  }

  // Timer countdown
  useEffect(() => {
    if (!gameActive) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          if (score >= WIN_SCORE) handleWin()
          else handleLose()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    intervalRef.current = timer
    return () => clearInterval(timer)
  }, [gameActive, score])

  useEffect(() => {
    showTarget()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (score >= WIN_SCORE && gameActive) handleWin()
    if (health <= 0 && gameActive) handleLose()
  }, [score, health, gameActive])

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-4 flex justify-between text-white font-mono text-lg border-b border-gray-700">
        <div className="bg-gray-800 px-4 py-1 rounded-full">
          Score: {score} / {WIN_SCORE}
        </div>
        <div className="bg-gray-800 px-4 py-1 rounded-full">
          Health: {health}
        </div>
        <div className="bg-gray-800 px-4 py-1 rounded-full">
          Time: {timeLeft}s
        </div>
      </div>

      <div
        id="game-container-level2"
        className="flex-1 relative overflow-hidden"
        style={{
          touchAction: 'none',
          background: 'radial-gradient(circle at center, #1a2a3a, #0a0a1a)',
        }}
      >
        {targetVisible && (
          <div
            onClick={handleTargetClick}
            onTouchStart={handleTargetClick}
            className="absolute cursor-pointer transition-all duration-100 hover:scale-110 active:scale-95 animate-pulse"
            style={{
              left: targetX,
              top: targetY,
              width: 70,
              height: 70,
              borderRadius: '50%',
              background: isFake
                ? 'radial-gradient(circle at 30% 30%, #ef4444, #b91c1c)'
                : 'radial-gradient(circle at 30% 30%, #fbbf24, #d97706)',
              boxShadow: isFake
                ? '0 0 20px rgba(239,68,68,0.8), inset 0 2px 5px rgba(255,255,255,0.6)'
                : '0 0 20px rgba(251,191,36,0.8), inset 0 2px 5px rgba(255,255,255,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              textShadow: '1px 1px 0 #000',
              border: '3px solid #fff',
            }}
          >
            {isFake ? 'FAKE' : 'TAP'}
          </div>
        )}
        {!targetVisible && gameActive && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-xl">
            <div className="bg-gray-800 bg-opacity-70 p-6 rounded-2xl backdrop-blur-sm">
              Get ready...
            </div>
          </div>
        )}
        {winMessage && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
            <div className="text-center text-white text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-2xl shadow-2xl">
              {winMessage}
            </div>
          </div>
        )}
        {!gameActive && !winMessage && health <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
            <div className="text-center text-red-500 text-2xl font-bold bg-gray-900 p-8 rounded-2xl border border-red-500">
              GAME OVER
              <br />
              Returning to dashboard...
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-3 text-center text-gray-300 text-sm border-t border-gray-700">
        Watch out! Some targets are FAKE (red). Tap a fake = instant game over.
        Reach {WIN_SCORE} points to win.
      </div>
    </div>
  )
}

export default Level2Page
