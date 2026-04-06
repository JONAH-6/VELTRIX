// web/src/pages/Level1Page/Level1Page.tsx
import { useEffect, useState, useRef } from 'react'

import { navigate, routes } from '@redwoodjs/router'

import {
  getWalletBalance,
  setWalletBalance,
  getUnlockedLevel,
  setUnlockedLevel,
  isLevelUnlocked,
  MIN_BALANCE_TO_PLAY,
} from 'src/lib/levelHelpers'

// ---------- Question Bank ----------
const QUESTIONS = [
  {
    text: 'Who achieved the first controlled powered flight (1903)?',
    options: [
      'Otto Lilienthal',
      'The Wright brothers',
      'George Cayley',
      'Alberto Santos-Dumont',
    ],
    correct: 1,
  },
  {
    text: 'What did early pioneers use before engines?',
    options: ['Hot air balloons', 'Gliders', 'Kites', 'Rockets'],
    correct: 1,
  },
  {
    text: 'Who studied bird wings and inspired modern aviation?',
    options: [
      'Leonardo da Vinci',
      'Otto Lilienthal',
      'George Cayley',
      'Wilbur Wright',
    ],
    correct: 1,
  },
  {
    text: "What was the Wrights' first airplane called?",
    options: ['Wright Flyer', 'Kitty Hawk', 'Flyer 1', 'Wright Glider'],
    correct: 0,
  },
  {
    text: 'Which war accelerated early aircraft development?',
    options: ['World War I', 'World War II', 'Korean War', 'Civil War'],
    correct: 0,
  },
  {
    text: 'Which country built the first jet aircraft (1939)?',
    options: ['United States', 'Germany', 'United Kingdom', 'Russia'],
    correct: 1,
  },
  {
    text: 'What is the main function of wings?',
    options: [
      'To produce thrust',
      'To produce lift',
      'To reduce drag',
      'To stabilise the aircraft',
    ],
    correct: 1,
  },
  {
    text: 'What force moves an airplane forward?',
    options: ['Lift', 'Drag', 'Thrust', 'Weight'],
    correct: 2,
  },
  {
    text: 'What is the body of an airplane called?',
    options: ['Cockpit', 'Fuselage', 'Empennage', 'Wingbox'],
    correct: 1,
  },
  {
    text: 'What engines do most modern planes use?',
    options: [
      'Propeller engines',
      'Jet engines',
      'Rocket engines',
      'Electric motors',
    ],
    correct: 1,
  },
  {
    text: 'Who first proposed the modern airplane concept (1799)?',
    options: [
      'George Cayley',
      'Otto Lilienthal',
      'Samuel Langley',
      'John Stringfellow',
    ],
    correct: 0,
  },
  {
    text: 'What early aircraft had no engine but could glide?',
    options: ['Biplane', 'Monoplane', 'Glider', 'Ornithopter'],
    correct: 2,
  },
  {
    text: 'What is the vertical tail fin used for?',
    options: [
      'Stability (yaw control)',
      'Lift generation',
      'Thrust reversal',
      'Fuel storage',
    ],
    correct: 0,
  },
  {
    text: 'What part controls up and down motion?',
    options: ['Aileron', 'Elevator', 'Rudder', 'Flap'],
    correct: 1,
  },
  {
    text: 'What part controls left and right turning?',
    options: ['Aileron', 'Elevator', 'Rudder', 'Spoiler'],
    correct: 2,
  },
  {
    text: 'What is the landing support system called?',
    options: ['Landing gear', 'Undercarriage', 'Both A and B', 'Skids'],
    correct: 2,
  },
  {
    text: 'What type of wing has only one layer?',
    options: ['Biplane', 'Monoplane', 'Triplane', 'Cantilever'],
    correct: 1,
  },
  {
    text: 'What type has two stacked wings?',
    options: ['Monoplane', 'Biplane', 'Triplane', 'Parasol'],
    correct: 1,
  },
  {
    text: 'What is lift?',
    options: [
      'Downward force',
      'Upward force from air',
      'Side force',
      'Forward force',
    ],
    correct: 1,
  },
  {
    text: 'What is drag?',
    options: [
      'Air resistance',
      'Friction with ground',
      'Engine power loss',
      'Weight',
    ],
    correct: 0,
  },
  {
    text: 'What is the opposite force of lift?',
    options: ['Thrust', 'Drag', 'Weight', 'Gravity'],
    correct: 2,
  },
  {
    text: 'What type of engine uses spinning blades?',
    options: ['Jet engine', 'Propeller engine', 'Rocket engine', 'Ramjet'],
    correct: 1,
  },
  {
    text: 'What does a jet engine push out to move forward?',
    options: ['Air', 'Hot gases', 'Water', 'Steam'],
    correct: 1,
  },
  {
    text: 'What aircraft can fly without a pilot onboard?',
    options: ['Glider', 'Drone', 'Helicopter', 'Airship'],
    correct: 1,
  },
  {
    text: 'What is the cockpit?',
    options: [
      'Passenger cabin',
      'Cargo hold',
      'Where the pilot controls the plane',
      'Engine compartment',
    ],
    correct: 2,
  },
  {
    text: 'What material were early planes made from?',
    options: [
      'Metal and plastic',
      'Wood and fabric',
      'Aluminium',
      'Carbon fibre',
    ],
    correct: 1,
  },
  {
    text: 'What material are modern planes mostly made from?',
    options: ['Wood', 'Fabric', 'Metal and composites', 'Glass'],
    correct: 2,
  },
  {
    text: 'What is the main job of the tail?',
    options: [
      'Provide thrust',
      'Store fuel',
      'Stability and control',
      'Reduce weight',
    ],
    correct: 2,
  },
  {
    text: 'What is thrust produced by?',
    options: ['Wings', 'Engines', 'Tail', 'Fuselage'],
    correct: 1,
  },
  {
    text: 'What limits propeller speed?',
    options: ['Engine power', 'Speed of sound', 'Air density', 'Fuel type'],
    correct: 1,
  },
  {
    text: 'What is a jet‑powered passenger aircraft called?',
    options: ['Airliner', 'Cargo plane', 'Fighter', 'Bomber'],
    correct: 0,
  },
  {
    text: 'What is a supersonic plane?',
    options: [
      'Slower than sound',
      'Faster than sound',
      'Equal to sound',
      'Subsonic',
    ],
    correct: 1,
  },
  {
    text: 'What famous supersonic aircraft was retired?',
    options: ['Boeing 747', 'Concorde', 'Airbus A380', 'SR-71'],
    correct: 1,
  },
  {
    text: 'What is fuel burned in jet engines?',
    options: ['Gasoline', 'Diesel', 'Aviation fuel', 'Kerosene'],
    correct: 2,
  },
  {
    text: 'What kind of pollution do planes produce?',
    options: [
      'Carbon emissions',
      'Noise pollution',
      'Both A and B',
      'Water vapour',
    ],
    correct: 2,
  },
  {
    text: 'What lines do planes leave in the sky?',
    options: ['Vapour trails', 'Contrails', 'Both A and B', 'Smoke'],
    correct: 2,
  },
  {
    text: 'What is a flying wing aircraft?',
    options: [
      'Plane with no tail',
      'Plane with almost no body',
      'Plane with two wings',
      'Plane with swept wings',
    ],
    correct: 1,
  },
  {
    text: 'What helps a plane turn left or right smoothly?',
    options: ['Elevator', 'Rudder', 'Ailerons', 'Flaps'],
    correct: 2,
  },
  {
    text: 'What happens during takeoff?',
    options: [
      'Lift becomes greater than weight',
      'Weight becomes greater than lift',
      'Thrust equals drag',
      'Lift equals weight',
    ],
    correct: 0,
  },
  {
    text: 'What happens during landing?',
    options: [
      'Thrust increases',
      'Thrust reduces and plane slows',
      'Lift increases',
      'Drag decreases',
    ],
    correct: 1,
  },
  {
    text: 'What is a turbofan engine?',
    options: [
      'Jet engine with a large fan',
      'Propeller engine',
      'Rocket engine',
      'Ramjet',
    ],
    correct: 0,
  },
  {
    text: 'What is a rocket‑powered plane?',
    options: [
      'Uses onboard fuel and oxidizer',
      'Uses only air',
      'Uses electric power',
      'Uses solar power',
    ],
    correct: 0,
  },
  {
    text: 'What was the first jet airliner (1952)?',
    options: [
      'Boeing 707',
      'Douglas DC-8',
      'de Havilland Comet',
      'Sud Aviation Caravelle',
    ],
    correct: 2,
  },
  {
    text: 'What company made the Boeing 707?',
    options: ['Airbus', 'Lockheed', 'Boeing', 'McDonnell Douglas'],
    correct: 2,
  },
  {
    text: 'What is the role of air traffic control?',
    options: [
      'Guide planes safely',
      'Sell tickets',
      'Maintain engines',
      'Clean planes',
    ],
    correct: 0,
  },
  {
    text: 'What is an airfoil?',
    options: [
      'Wing shape that creates lift',
      'Engine part',
      'Landing gear',
      'Tail fin',
    ],
    correct: 0,
  },
  {
    text: 'What is pitch?',
    options: [
      'Up and down movement',
      'Side to side tilt',
      'Left/right turning',
      'Rolling',
    ],
    correct: 0,
  },
  {
    text: 'What is roll?',
    options: [
      'Up/down',
      'Tilting side to side',
      'Turning left/right',
      'Forward/backward',
    ],
    correct: 1,
  },
  {
    text: 'What is yaw?',
    options: ['Up/down', 'Side tilt', 'Turning left or right', 'Forward speed'],
    correct: 2,
  },
  {
    text: 'What makes airplanes safer than many transports?',
    options: [
      'Strict safety systems and design',
      'Speed',
      'Low cost',
      'Passenger comfort',
    ],
    correct: 0,
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

  const originalBalanceRef = useRef<number>(0)

  // ------------------- Betting logic on mount -------------------
  useEffect(() => {
    const wallet = getWalletBalance()
    const unlocked = isLevelUnlocked(LEVEL_NUMBER)

    // NEW: minimum balance check
    if (wallet < MIN_BALANCE_TO_PLAY) {
      alert(
        `You need at least ₦${MIN_BALANCE_TO_PLAY.toLocaleString()} to play. Please add more funds.`
      )
      navigate(routes.home())
      return
    }
    if (!unlocked) {
      alert(`Level ${LEVEL_NUMBER} is locked. Complete previous level first.`)
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
    navigate(routes.level2())
  }

  // ------------------- Lose handler -------------------
  const handleLose = () => {
    if (!gameActive) return
    setGameActive(false)
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
        Answer correctly to earn 10 points. Wrong answer or timeout loses 1
        health. First to {WIN_SCORE} points wins!
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
                Continue to Level 2
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

export default Level1Page
