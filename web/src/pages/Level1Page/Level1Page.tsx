// web/src/pages/Level1Page/Level1Page.tsx
import { useEffect, useState, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
  isLevelUnlocked,
} from 'src/lib/levelHelpers'

// ---------- Question Bank (same as before) ----------
const QUESTIONS = [
  {
    text: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    correct: 2,
  },
  {
    text: 'Which planet is known as the Red Planet?',
    options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    correct: 0,
  },
  {
    text: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Rembrandt'],
    correct: 2,
  },
  {
    text: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct: 3,
  },
  {
    text: 'Which year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correct: 2,
  },
  {
    text: 'What is the square root of 64?',
    options: ['6', '7', '8', '9'],
    correct: 2,
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: [
      'Charles Dickens',
      'Jane Austen',
      'Mark Twain',
      'William Shakespeare',
    ],
    correct: 3,
  },
  {
    text: 'What is the hardest natural substance?',
    options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
    correct: 2,
  },
  {
    text: 'Which country gifted the Statue of Liberty to the USA?',
    options: ['England', 'Spain', 'France', 'Germany'],
    correct: 2,
  },
  {
    text: 'What is the fastest land animal?',
    options: ['Lion', 'Cheetah', 'Leopard', 'Tiger'],
    correct: 1,
  },
]

const LEVEL_NUMBER = 1
const WIN_SCORE = 200

const Level1Page = () => {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(5)
  const [gameActive, setGameActive] = useState(true)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)
  const [questionTimer, setQuestionTimer] = useState<NodeJS.Timeout | null>(
    null
  )
  const [showCashoutModal, setShowCashoutModal] = useState(false)
  const [newBalanceAfterWin, setNewBalanceAfterWin] = useState(0)

  // Betting: store the original balance before deduction
  const originalBalanceRef = useRef<number>(0)

  // ------------------- Betting logic on mount -------------------
  useEffect(() => {
    // Check prerequisites
    const wallet = getWalletBalance()
    const unlocked = isLevelUnlocked(LEVEL_NUMBER)
    if (wallet <= 0) {
      alert('You need funds to play. Please add funds.')
      navigate(routes.home())
      return
    }
    if (!unlocked) {
      alert(`Level ${LEVEL_NUMBER} is locked. Complete previous level first.`)
      navigate(routes.home())
      return
    }

    // Prevent double deduction on page refresh
    const sessionKey = `level_${LEVEL_NUMBER}_bet_deducted`
    if (sessionStorage.getItem(sessionKey)) {
      // Bet already deducted for this session – just continue
      originalBalanceRef.current = wallet * 2 // recover original? Actually we need to know original. We'll store it.
      // Better: store original balance in sessionStorage too
      const storedOriginal = sessionStorage.getItem(
        `level_${LEVEL_NUMBER}_original_balance`
      )
      if (storedOriginal)
        originalBalanceRef.current = parseFloat(storedOriginal)
      return
    }

    // Deduct half of current balance as bet
    const currentBalance = wallet
    const bet = currentBalance / 2
    const newBalance = currentBalance - bet
    setWalletBalance(newBalance)
    originalBalanceRef.current = currentBalance

    // Store in sessionStorage to prevent re-deduction on refresh
    sessionStorage.setItem(sessionKey, 'true')
    sessionStorage.setItem(
      `level_${LEVEL_NUMBER}_original_balance`,
      currentBalance.toString()
    )
  }, [])

  // ------------------- Win handler -------------------
  const handleWin = () => {
    if (!gameActive) return
    setGameActive(false)

    // Calculate winnings: we add back the bet + the original balance
    const original = originalBalanceRef.current
    const current = getWalletBalance() // should be half of original after deduction
    const winnings = original // because current is half, we need to add original to double
    // Actually: current = original/2. To reach original*2, we add (original*1.5)
    // But simpler: set new balance = original * 2
    const newBalance = original * 2
    setWalletBalance(newBalance)
    setNewBalanceAfterWin(newBalance)

    // Unlock next level (Level 2)
    if (getUnlockedLevel() < LEVEL_NUMBER + 1) {
      setUnlockedLevel(LEVEL_NUMBER + 1)
    }

    // Clear session storage so that next level can deduct properly
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_bet_deducted`)
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_original_balance`)

    setShowCashoutModal(true)
  }

  const handleCashout = () => {
    setShowCashoutModal(false)
    navigate(routes.home())
  }

  const handleContinue = () => {
    setShowCashoutModal(false)
    navigate(routes.level2())
  }

  // ------------------- Lose handler -------------------
  const handleLose = () => {
    if (!gameActive) return
    setGameActive(false)

    // On loss, the deducted half is already lost; no further action
    // Clear session storage to allow retry
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_bet_deducted`)
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_original_balance`)

    setTimeout(() => navigate(routes.home()), 2000)
  }

  // ------------------- Game logic (unchanged) -------------------
  const updateHealth = (delta: number) => {
    if (!gameActive) return
    const newHealth = Math.max(0, Math.min(5, health - delta))
    setHealth(newHealth)
    if (newHealth <= 0) handleLose()
  }

  const updateScore = (points: number) => {
    if (!gameActive) return
    const newScore = score + points
    setScore(newScore)
    if (newScore >= WIN_SCORE) handleWin()
  }

  const nextQuestion = () => {
    setSelectedAnswer(null)
    setFeedback('')
    if (questionTimer) clearTimeout(questionTimer)
    setTimeLeft(10)
    const nextIndex = (currentQuestion + 1) % QUESTIONS.length
    setCurrentQuestion(nextIndex)
  }

  const handleAnswer = (optionIndex: number) => {
    if (!gameActive || selectedAnswer !== null) return
    setSelectedAnswer(optionIndex)
    if (questionTimer) clearTimeout(questionTimer)

    const isCorrect = optionIndex === QUESTIONS[currentQuestion].correct
    if (isCorrect) {
      updateScore(10)
      setFeedback('Correct! +10 points')
    } else {
      updateHealth(1)
      const correctAnswer =
        QUESTIONS[currentQuestion].options[QUESTIONS[currentQuestion].correct]
      setFeedback(`Wrong! The correct answer was: ${correctAnswer}. -1 health`)
    }
    setTimeout(() => {
      if (!gameActive) return
      nextQuestion()
    }, 1500)
  }

  useEffect(() => {
    if (!gameActive) return
    if (selectedAnswer !== null) return
    const timer = setTimeout(() => {
      if (!gameActive || selectedAnswer !== null) return
      updateHealth(1)
      setFeedback(
        `Time's up! Correct answer: ${QUESTIONS[currentQuestion].options[QUESTIONS[currentQuestion].correct]}. -1 health`
      )
      setSelectedAnswer(-1)
      setTimeout(() => {
        if (gameActive) nextQuestion()
      }, 1500)
    }, 10000)
    setQuestionTimer(timer)
    return () => clearTimeout(timer)
  }, [currentQuestion, gameActive, selectedAnswer])

  useEffect(() => {
    if (!gameActive || selectedAnswer !== null) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [currentQuestion, gameActive, selectedAnswer])

  useEffect(() => {
    setTimeLeft(10)
  }, [currentQuestion])

  const question = QUESTIONS[currentQuestion]

  // ------------------- Render -------------------
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header stats */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-2 md:p-4 flex flex-wrap justify-between gap-2 text-white font-mono text-sm md:text-lg border-b border-gray-700">
        <div className="bg-gray-800 px-2 md:px-4 py-1 rounded-full">
          Score: {score} / {WIN_SCORE}
        </div>
        <div className="bg-gray-800 px-2 md:px-4 py-1 rounded-full">
          Health: {health}
        </div>
        <div className="bg-gray-800 px-2 md:px-4 py-1 rounded-full">
          Time: {timeLeft}s
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center justify-center p-3 md:p-6">
        <div className="bg-gray-800 rounded-2xl p-4 md:p-6 w-full max-w-full md:max-w-2xl shadow-2xl border border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center break-words">
            {question.text}
          </h2>
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null || !gameActive}
                className={`py-2 md:py-3 px-3 md:px-4 rounded-lg text-left transition-all text-sm md:text-base ${selectedAnswer === null && gameActive ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer' : 'bg-gray-600 cursor-not-allowed opacity-70'} text-white font-medium break-words`}
              >
                <span className="font-bold">
                  {String.fromCharCode(65 + idx)}.
                </span>{' '}
                {opt}
              </button>
            ))}
          </div>
          {feedback && (
            <div
              className={`mt-4 md:mt-6 p-2 md:p-3 rounded-lg text-center font-semibold text-sm md:text-base ${feedback.startsWith('Correct') ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}
            >
              {feedback}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 p-2 md:p-3 text-center text-gray-300 text-xs md:text-sm border-t border-gray-700">
        Answer correctly to earn 10 points. Wrong answer or timeout loses 1
        health. First to {WIN_SCORE} points wins!
      </div>

      {/* Cashout / Continue Modal */}
      {showCashoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold text-white text-center mb-4">
              Level {LEVEL_NUMBER} Complete!
            </h3>
            <p className="text-gray-300 text-center mb-4">
              Your balance doubled to{' '}
              <span className="text-green-400 font-bold">
                ₦{newBalanceAfterWin.toLocaleString()}
              </span>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCashout}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
              >
                Cashout
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
              >
                Continue to Level 2
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game over overlay */}
      {!gameActive && !winMessage && health <= 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center text-red-500 text-xl md:text-2xl font-bold bg-gray-900 p-6 md:p-8 rounded-2xl border border-red-500 mx-4">
            GAME OVER
            <br />
            Returning to dashboard...
          </div>
        </div>
      )}
    </div>
  )
}

export default Level1Page
