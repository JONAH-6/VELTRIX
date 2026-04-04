// web/src/pages/Level3Page/Level3Page.tsx

import { useEffect, useState, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'

// -------- VERY HARD QUESTION BANK (tricky, options related to each other) --------
const QUESTIONS = [
  {
    text: 'Which of these is NOT a primary color?',
    options: ['Red', 'Yellow', 'Blue', 'Green'],
    correct: 3, // Green
  },
  {
    text: 'What is the smallest country in the world by area?',
    options: ['Monaco', 'San Marino', 'Vatican City', 'Malta'],
    correct: 2, // Vatican City
  },
  {
    text: 'Which planet has the most moons?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    correct: 1, // Saturn (as of recent count)
  },
  {
    text: "Who wrote 'The Odyssey'?",
    options: ['Sophocles', 'Euripides', 'Homer', 'Aristophanes'],
    correct: 2, // Homer
  },
  {
    text: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2, // Au
  },
  {
    text: 'Which of these is a mammal?',
    options: ['Penguin', 'Ostrich', 'Dolphin', 'Shark'],
    correct: 2, // Dolphin
  },
  {
    text: 'What is the longest bone in the human body?',
    options: ['Femur', 'Tibia', 'Fibula', 'Humerus'],
    correct: 0, // Femur
  },
  {
    text: 'Which language has the most native speakers?',
    options: ['English', 'Spanish', 'Mandarin Chinese', 'Hindi'],
    correct: 2, // Mandarin Chinese
  },
  {
    text: "Who painted 'Starry Night'?",
    options: ['Picasso', 'Van Gogh', 'Monet', 'Rembrandt'],
    correct: 1, // Van Gogh
  },
  {
    text: 'What is the capital of Canada?',
    options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'],
    correct: 3, // Ottawa
  },
  {
    text: 'Which of these is not a type of cloud?',
    options: ['Cumulus', 'Stratus', 'Nimbus', 'Tornadus'],
    correct: 3, // Tornadus (made up)
  },
  {
    text: 'What is the square root of 144?',
    options: ['11', '12', '13', '14'],
    correct: 1, // 12
  },
  {
    text: 'Who discovered penicillin?',
    options: [
      'Marie Curie',
      'Alexander Fleming',
      'Louis Pasteur',
      'Edward Jenner',
    ],
    correct: 1, // Fleming
  },
  {
    text: 'Which country is known as the Land of the Rising Sun?',
    options: ['China', 'Korea', 'Japan', 'Thailand'],
    correct: 2, // Japan
  },
  {
    text: 'What is the main ingredient in hummus?',
    options: ['Lentils', 'Chickpeas', 'Black beans', 'Soybeans'],
    correct: 1, // Chickpeas
  },
]

const Level3Page = () => {
  const [score, setScore] = useState(0)
  const [health, setHealth] = useState(5)
  const [gameActive, setGameActive] = useState(true)
  const [winMessage, setWinMessage] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState(6) // 6 seconds per question (very hard)
  const [questionTimer, setQuestionTimer] = useState<NodeJS.Timeout | null>(
    null
  )

  const WIN_SCORE = 200 // same target, but harder to achieve
  const START_HEALTH = 5

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
      `Level 3 Complete! Money doubled: ₦${newBalance.toLocaleString()}`
    )
    setTimeout(() => navigate(routes.level4()), 2000)
  }

  const handleLose = () => {
    if (!gameActive) return
    setGameActive(false)
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
    setTimeLeft(6)
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

  // Timer per question (6 seconds)
  useEffect(() => {
    if (!gameActive) return
    if (selectedAnswer !== null) return

    const timer = setTimeout(() => {
      if (!gameActive || selectedAnswer !== null) return
      updateHealth(1)
      setFeedback(
        `Time's up! The correct answer was: ${QUESTIONS[currentQuestion].options[QUESTIONS[currentQuestion].correct]}. -1 health`
      )
      setSelectedAnswer(-1)
      setTimeout(() => {
        if (!gameActive) return
        nextQuestion()
      }, 1500)
    }, 6000) // 6 seconds
    setQuestionTimer(timer)
    return () => clearTimeout(timer)
  }, [currentQuestion, gameActive, selectedAnswer])

  // Timer countdown display
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
    setTimeLeft(6)
  }, [currentQuestion])

  const question = QUESTIONS[currentQuestion]

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Header stats - responsive */}
      <div className="bg-black bg-opacity-50 backdrop-blur-sm p-2 md:p-4 flex flex-wrap justify-between gap-2 text-white font-mono text-sm md:text-lg border-b border-gray-700">
        <div className="bg-gray-800 px-2 md:px-4 py-1 rounded-full text-xs md:text-base">
          Score: {score} / {WIN_SCORE}
        </div>
        <div className="bg-gray-800 px-2 md:px-4 py-1 rounded-full text-xs md:text-base">
          Health: {health}
        </div>
        <div className="bg-gray-800 px-2 md:px-4 py-1 rounded-full text-xs md:text-base">
          Time: {timeLeft}s
        </div>
      </div>

      {/* Question area - fully responsive */}
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
                className={`
                  py-2 md:py-3 px-3 md:px-4 rounded-lg text-left transition-all text-sm md:text-base
                  ${
                    selectedAnswer === null && gameActive
                      ? 'bg-gray-700 hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-600 cursor-not-allowed opacity-70'
                  }
                  text-white font-medium break-words
                `}
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

      {/* Bottom info - responsive */}
      <div className="bg-gray-800 p-2 md:p-3 text-center text-gray-300 text-xs md:text-sm border-t border-gray-700">
        Extreme difficulty! 6 seconds per question. Options are tricky. Correct
        = +10 points. Wrong or timeout = -1 health. First to {WIN_SCORE} points
        wins!
      </div>

      {/* Win/Lose overlays */}
      {winMessage && (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center text-white text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 p-6 md:p-8 rounded-2xl shadow-2xl mx-4">
            {winMessage}
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
