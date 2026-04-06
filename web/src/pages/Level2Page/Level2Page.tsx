// web/src/pages/Level2Page/Level2Page.tsx
import { useEffect, useState, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
  isLevelUnlocked,
  MIN_BALANCE_TO_PLAY, // still 2500, but we will override for Level 2
} from 'src/lib/levelHelpers'

// Minimum balance required for Level 2
const MIN_BALANCE_LEVEL_2 = 5000

// Harder question bank
const QUESTIONS = [
  {
    text: 'What is the first step to becoming a pilot?',
    options: [
      'Learning basic aviation theory',
      'Flying solo',
      'Passing a medical exam',
      'Buying a plane',
    ],
    correct: 0,
  },
  {
    text: 'What license do beginners usually start with?',
    options: [
      'Private Pilot License (PPL)',
      'Commercial Pilot License (CPL)',
      'Airline Transport Pilot License (ATPL)',
      'Student Pilot Permit',
    ],
    correct: 0,
  },
  {
    text: 'What is a PPL?',
    options: [
      'A license that allows you to fly for personal use',
      'A type of aircraft',
      'A flight simulator',
      'An air traffic control certificate',
    ],
    correct: 0,
  },
  {
    text: 'What subject teaches how planes fly?',
    options: ['Aerodynamics', 'Meteorology', 'Navigation', 'Aircraft systems'],
    correct: 0,
  },
  {
    text: 'What must you pass before flying solo?',
    options: [
      'Ground school exams',
      'A checkride',
      'A night flight',
      'Instrument rating',
    ],
    correct: 0,
  },
  {
    text: 'What is ground school?',
    options: [
      'Classroom training about aviation',
      'Practical flying lessons',
      'Simulator training',
      'Aircraft maintenance course',
    ],
    correct: 0,
  },
  {
    text: 'What is the minimum age to start pilot training (in many countries)?',
    options: ['Around 16–18 years', '14 years', '21 years', '25 years'],
    correct: 0,
  },
  {
    text: 'What medical check is required?',
    options: [
      'Aviation medical exam',
      'General physical',
      'Eye test only',
      'Blood test',
    ],
    correct: 0,
  },
  {
    text: 'Who conducts flight training?',
    options: [
      'A certified flight instructor',
      'Air traffic controller',
      'Airline captain',
      'Mechanic',
    ],
    correct: 0,
  },
  {
    text: 'What is the first thing you learn in flight?',
    options: [
      'Basic aircraft control',
      'Navigation',
      'Emergency procedures',
      'Crosswind landings',
    ],
    correct: 0,
  },
  {
    text: 'What is “taxiing”?',
    options: [
      'Moving the plane on the ground',
      'Taking off',
      'Landing',
      'Climbing to altitude',
    ],
    correct: 0,
  },
  {
    text: 'What is takeoff?',
    options: [
      'Lifting the plane into the air',
      'Parking the aircraft',
      'Engine start',
      'Taxiing to runway',
    ],
    correct: 0,
  },
  {
    text: 'What is landing?',
    options: [
      'Bringing the plane safely back to ground',
      'Taking off',
      'Cruising',
      'Descending',
    ],
    correct: 0,
  },
  {
    text: 'What is a pre-flight check?',
    options: [
      'Inspecting the aircraft before flying',
      'Checking weather',
      'Filing a flight plan',
      'Passenger briefing',
    ],
    correct: 0,
  },
  {
    text: 'Why are pre-flight checks important?',
    options: [
      'To ensure safety',
      'To save fuel',
      'To reduce noise',
      'To comply with regulations',
    ],
    correct: 0,
  },
  {
    text: 'What is the cockpit?',
    options: [
      'Where the pilot controls the plane',
      'Passenger cabin',
      'Cargo hold',
      'Engine compartment',
    ],
    correct: 0,
  },
  {
    text: 'What does the control yoke or stick do?',
    options: [
      'Controls pitch and roll',
      'Controls yaw',
      'Controls throttle',
      'Controls flaps',
    ],
    correct: 0,
  },
  {
    text: 'What do rudder pedals control?',
    options: ['Yaw (left and right movement)', 'Pitch', 'Roll', 'Brakes'],
    correct: 0,
  },
  {
    text: 'What is throttle?',
    options: [
      'Controls engine power',
      'Controls direction',
      'Controls altitude',
      'Controls speed brakes',
    ],
    correct: 0,
  },
  {
    text: 'What is a checklist?',
    options: [
      'Step-by-step safety procedure',
      'Aircraft registration',
      'Flight log',
      'Maintenance record',
    ],
    correct: 0,
  },
  {
    text: 'What is “solo flight”?',
    options: [
      'First time flying alone',
      'Flying with an instructor',
      'Night flight',
      'Cross‑country flight',
    ],
    correct: 0,
  },
  {
    text: 'When can a student fly solo?',
    options: [
      'After instructor approval',
      'After passing a written test',
      'After 10 hours of flight',
      'At age 18',
    ],
    correct: 0,
  },
  {
    text: 'What is flight time?',
    options: [
      'Hours spent flying',
      'Time on the ground',
      'Time in simulator',
      'Time in briefings',
    ],
    correct: 0,
  },
  {
    text: 'How many hours are needed for PPL (approx)?',
    options: ['About 40–50 hours', '10–20 hours', '100 hours', '200 hours'],
    correct: 0,
  },
  {
    text: 'What is navigation training?',
    options: [
      'Learning how to find your way in the air',
      'Learning how to land',
      'Learning emergency procedures',
      'Learning aircraft systems',
    ],
    correct: 0,
  },
  {
    text: 'What tools help navigation?',
    options: [
      'Maps, GPS, instruments',
      'Radar',
      'ATC',
      'Visual references only',
    ],
    correct: 0,
  },
  {
    text: 'What is airspace?',
    options: [
      'Controlled areas in the sky',
      'Aircraft parking areas',
      'Runway zones',
      'Weather zones',
    ],
    correct: 0,
  },
  {
    text: 'What is ATC?',
    options: [
      'Air Traffic Control',
      'Automatic Terminal Control',
      'Aircraft Tracking Computer',
      'Altitude Control',
    ],
    correct: 0,
  },
  {
    text: 'What does ATC do?',
    options: [
      'Guides aircraft safely',
      'Sells tickets',
      'Maintains planes',
      'Provides weather forecasts',
    ],
    correct: 0,
  },
  {
    text: 'What is radio communication?',
    options: [
      'Talking with ATC and other pilots',
      'Listening to music',
      'Broadcasting weather',
      'Navigation using radio beacons',
    ],
    correct: 0,
  },
  {
    text: 'What is a flight plan?',
    options: [
      'Planned route before flying',
      'Aircraft log',
      'Maintenance schedule',
      'Passenger manifest',
    ],
    correct: 0,
  },
  {
    text: 'What is weather briefing?',
    options: [
      'Checking weather before flight',
      'Briefing passengers',
      'Aircraft inspection',
      'Flight plan filing',
    ],
    correct: 0,
  },
  {
    text: 'Why is weather important?',
    options: [
      'It affects safety',
      'It determines fuel stops',
      'It changes flight time',
      'It affects passenger comfort',
    ],
    correct: 0,
  },
  {
    text: 'What is visibility?',
    options: [
      'How far you can see',
      'How high you can fly',
      'How fast you can go',
      'How clear the air is',
    ],
    correct: 0,
  },
  {
    text: 'What is turbulence?',
    options: [
      'Unstable air movement',
      'Engine vibration',
      'Wing stall',
      'Runway roughness',
    ],
    correct: 0,
  },
  {
    text: 'What is stall training?',
    options: [
      'Learning how to recover from loss of lift',
      'Learning how to land',
      'Learning how to take off',
      'Learning how to taxi',
    ],
    correct: 0,
  },
  {
    text: 'What is emergency training?',
    options: [
      'Handling dangerous situations',
      'Normal takeoff procedures',
      'Passenger service',
      'Fuel management',
    ],
    correct: 0,
  },
  {
    text: 'What is engine failure practice?',
    options: [
      'Training for engine stopping mid‑air',
      'Engine start procedures',
      'Oil change',
      'Throttle calibration',
    ],
    correct: 0,
  },
  {
    text: 'What is crosswind landing?',
    options: [
      'Landing with side wind',
      'Landing with headwind',
      'Landing with tailwind',
      'Landing on a wet runway',
    ],
    correct: 0,
  },
  {
    text: 'What is night flying?',
    options: [
      'Flying after sunset',
      'Flying in clouds',
      'Flying at high altitude',
      'Flying without instruments',
    ],
    correct: 0,
  },
  {
    text: 'What is instrument flying?',
    options: [
      'Flying using instruments only',
      'Flying with a GPS',
      'Flying in good weather',
      'Flying manually',
    ],
    correct: 0,
  },
  {
    text: 'What license comes after PPL?',
    options: [
      'Commercial Pilot License (CPL)',
      'Airline Transport Pilot License (ATPL)',
      'Instrument Rating (IR)',
      'Multi‑engine Rating',
    ],
    correct: 0,
  },
  {
    text: 'What is CPL?',
    options: [
      'License to earn money flying',
      'License to fly at night',
      'License to fly internationally',
      'License to fly jets',
    ],
    correct: 0,
  },
  {
    text: 'What is simulator training?',
    options: [
      'Practice using flight simulators',
      'Actual aircraft training',
      'Ground school',
      'Emergency drills',
    ],
    correct: 0,
  },
  {
    text: 'Why use simulators?',
    options: [
      'Safe and realistic training',
      'Cheaper than real aircraft',
      'No fuel costs',
      'All of the above',
    ],
    correct: 0,
  },
  {
    text: 'What is logbook?',
    options: [
      'Record of flight hours',
      'Aircraft manual',
      "Pilot's diary",
      'Maintenance log',
    ],
    correct: 0,
  },
  {
    text: 'What is checkride?',
    options: [
      'Final test with examiner',
      'Aircraft inspection',
      'Pre‑flight check',
      'Medical exam',
    ],
    correct: 0,
  },
  {
    text: 'What must you pass to get a license?',
    options: [
      'Written + flight exam',
      'Only flight exam',
      'Only written exam',
      'Medical exam',
    ],
    correct: 0,
  },
  {
    text: 'What skill is most important for pilots?',
    options: [
      'Decision‑making',
      'Physical strength',
      'Good memory',
      'Fast reflexes',
    ],
    correct: 0,
  },
  {
    text: 'What is the final goal of pilot training?',
    options: [
      'Safe and confident flying',
      'Earning a lot of money',
      'Flying fast jets',
      'Travelling the world',
    ],
    correct: 0,
  },
]
const LEVEL_NUMBER = 2
const WIN_SCORE = 200
const QUESTION_TIME_SEC = 8 // 8 seconds per question

const Level2Page = () => {
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

  // ------------------- Betting logic on mount -------------------
  useEffect(() => {
    const wallet = getWalletBalance()
    const unlocked = isLevelUnlocked(LEVEL_NUMBER)

    // Minimum balance check for Level 2
    if (wallet < MIN_BALANCE_LEVEL_2) {
      alert(
        `Level 2 requires at least ₦${MIN_BALANCE_LEVEL_2.toLocaleString()}. Please play Level 1 or add more funds.`
      )
      navigate(routes.home())
      return
    }
    if (!unlocked) {
      alert(`Level ${LEVEL_NUMBER} is locked. Complete Level 1 first.`)
      navigate(routes.home())
      return
    }

    // Prevent double deduction on refresh
    const sessionKey = `level_${LEVEL_NUMBER}_bet_deducted`
    if (sessionStorage.getItem(sessionKey)) {
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
    navigate(routes.level3())
  }

  // ------------------- Lose handler -------------------
  const handleLose = () => {
    if (!gameActive) return
    setGameActive(false)
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_bet_deducted`)
    sessionStorage.removeItem(`level_${LEVEL_NUMBER}_original_balance`)
    setTimeout(() => navigate(routes.home()), 2000)
  }

  // ------------------- Game logic -------------------
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

  // Timer per question (8 seconds)
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
    setTimeLeft(QUESTION_TIME_SEC)
  }, [currentQuestion])

  const question = QUESTIONS[currentQuestion]

  // ------------------- Render -------------------
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
        Harder questions! {QUESTION_TIME_SEC} seconds per question. Correct =
        +10 points. Wrong or timeout = -1 health. First to {WIN_SCORE} points
        wins!
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
                Continue to Level 3
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

export default Level2Page
