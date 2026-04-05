// web/src/pages/Level3Page/Level3Page.tsx
import { useEffect, useState, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
  isLevelUnlocked,
} from 'src/lib/levelHelpers'

// Minimum balance required for Level 3
const MIN_BALANCE_LEVEL_3 = 10000

// Very hard questions with tricky options
const QUESTIONS = [
  {
    text: 'Which of these is NOT a primary color?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correct: 3,
  },
  {
    text: 'What is the smallest country in the world by area?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Malta'],
    correct: 2,
  },
  {
    text: 'Which planet has the most moons?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 1,
  },
  {
    text: "Who wrote 'The Odyssey'?",
    options: ['Sophocles', 'Euripides', 'Homer', 'Aristophanes'],
    correct: 2,
  },
  {
    text: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
  },
  {
    text: 'Which of these is a mammal?',
    options: ['Penguin', 'Ostrich', 'Dolphin', 'Shark'],
    correct: 2,
  },
  {
    text: 'What is the longest bone in the human body?',
    options: ['Femur', 'Tibia', 'Fibula', 'Humerus'],
    correct: 0,
  },
  {
    text: 'Which language has the most native speakers?',
    options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
    correct: 2,
  },
  {
    text: "Who painted 'Starry Night'?",
    options: ['Picasso', 'Van Gogh', 'Monet', 'Rembrandt'],
    correct: 1,
  },
  {
    text: 'What is the capital of Canada?',
    options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    correct: 3,
  },
  {
    text: 'Which of these is not a type of cloud?',
    options: ['Cumulus', 'Stratus', 'Nimbus', 'Tornadus'],
    correct: 3,
  },
  {
    text: 'What is the square root of 144?',
    options: ['11', '12', '13', '14'],
    correct: 1,
  },
  {
    text: 'Who discovered penicillin?',
    options: [
      'Marie Curie',
      'Alexander Fleming',
      'Louis Pasteur',
      'Edward Jenner',
    ],
    correct: 1,
  },
  {
    text: 'Which country is known as the Land of the Rising Sun?',
    options: ['China', 'Korea', 'Japan', 'Thailand'],
    correct: 2,
  },
  {
    text: 'What is the main ingredient in hummus?',
    options: ['Lentils', 'Chickpeas', 'Black beans', 'Soybeans'],
    correct: 1,
  },
]

const LEVEL_NUMBER = 3
const WIN_SCORE = 200
const QUESTION_TIME_SEC = 6 // Very short time

const Level3Page = () => {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(5)
  const [gameActive, setGameActive] = useState(true)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_SEC)
  const [questionTimer, setQuestionTimer] = useState<NodeJS.Timeout | null>(
    null
  )
  const [showCashoutModal, setShowCashoutModal] = useState(false)
  const [newBalanceAfterWin, setNewBalanceAfterWin] = useState(0)

  const originalBalanceRef = useRef<number>(0)

  // Betting logic on mount
  useEffect(() => {
    const wallet = getWalletBalance()
    const unlocked = isLevelUnlocked(LEVEL_NUMBER)

    if (wallet < MIN_BALANCE_LEVEL_3) {
      alert(
        `Level 3 requires at least ₦${MIN_BALANCE_LEVEL_3.toLocaleString()}. Please play Level 2 or add more funds.`
      )
      navigate(routes.home())
      return
    }
    if (!unlocked) {
      alert(`Level ${LEVEL_NUMBER} is locked. Complete Level 2 first.`)
      navigate(routes.home())
      return
    }

    const sessionKey = `level_${LEVEL_NUMBER}_bet_deducted`
    if (sessionStorage.getItem(sessionKey)) {
      const storedOriginal = sessionStorage.getItem(
        `level_${LEVEL_NUMBER}_original_balance`
      )
      if (storedOriginal)
        originalBalanceRef.current = parseFloat(storedOriginal)
      return
    }

    const currentBalance = wallet
    const bet = currentBalance / 2
    const newBalance = currentBalance - bet
    setWalletBalance(newBalance)
    originalBalanceRef.current = currentBalance

    sessionStorage.setItem(sessionKey, 'true')
    sessionStorage.setItem(
      `level_${LEVEL_NUMBER}_original_balance`,
      currentBalance.toString()
    )
  }, [])

  const handleWin = () => {
    if (!gameActive) return
    setGameActive(false)

    const original = originalBalanceRef.current
    const newBalance = original * 2
    setWalletBalance(newBalance)
    setNewBalanceAfterWin(newBalance)

    if (getUnlockedLevel() < LEVEL_NUMBER + 1) {
      setUnlockedLevel(LEVEL_NUMBER + 1)
    }

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
    navigate(routes.level4())
  }

  const handleLose = () => {
    if (!gameActive) return
    setGameActive(false)
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_bet_deducted`)
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_original_balance`)
    setTimeout(() => navigate(routes.home()), 2000)
  }

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
    setTimeLeft(QUESTION_TIME_SEC)
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
    }, QUESTION_TIME_SEC * 1000)
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
    setTimeLeft(QUESTION_TIME_SEC)
  }, [currentQuestion])

  const question = QUESTIONS[currentQuestion]

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
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
        Extreme difficulty! {QUESTION_TIME_SEC} seconds per question. Tricky
        options. Correct = +10 points. Wrong or timeout = -1 health. First to{' '}
        {WIN_SCORE} points wins!
      </div>

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
                Continue to Level 4
              </button>
            </div>
          </div>
        </div>
      )}

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

export default Level3Page
