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
    text: 'What happens immediately after takeoff?',
    options: [
      'The pilot climbs to a safe altitude',
      'The pilot retracts flaps',
      'The pilot contacts ATC',
      'The pilot increases speed',
    ],
    correct: 0,
  },
  {
    text: 'What is “climb”?',
    options: [
      'Gaining altitude after takeoff',
      'Losing altitude',
      'Maintaining altitude',
      'Turning left',
    ],
    correct: 0,
  },
  {
    text: 'When does a pilot retract landing gear?',
    options: [
      'Shortly after takeoff',
      'During takeoff roll',
      'At cruise altitude',
      'Before landing',
    ],
    correct: 0,
  },
  {
    text: 'Why retract landing gear?',
    options: [
      'To reduce drag',
      'To save fuel',
      'To increase speed',
      'To improve stability',
    ],
    correct: 0,
  },
  {
    text: 'What is flap retraction?',
    options: [
      'Pulling back flaps after takeoff',
      'Extending flaps',
      'Adjusting ailerons',
      'Setting trim',
    ],
    correct: 0,
  },
  {
    text: 'Why are flaps used during takeoff?',
    options: [
      'To increase lift',
      'To decrease lift',
      'To reduce drag',
      'To improve engine performance',
    ],
    correct: 0,
  },
  {
    text: 'What is cruise altitude?',
    options: [
      'Level where plane flies steadily',
      'Maximum altitude',
      'Minimum safe altitude',
      'Takeoff altitude',
    ],
    correct: 0,
  },
  {
    text: 'What is cruising?',
    options: [
      'Flying at constant speed and altitude',
      'Descending',
      'Climbing',
      'Taxiing',
    ],
    correct: 0,
  },
  {
    text: 'What does the autopilot do?',
    options: [
      'Helps control the aircraft automatically',
      'Navigates the aircraft',
      'Communicates with ATC',
      'Monitors engine performance',
    ],
    correct: 0,
  },
  {
    text: 'When is autopilot usually activated?',
    options: [
      'After reaching safe altitude',
      'During takeoff',
      'During landing',
      'Before engine start',
    ],
    correct: 0,
  },
  {
    text: 'What instruments help pilots in the air?',
    options: [
      'Flight instruments',
      'GPS only',
      'Radar only',
      'Visual references',
    ],
    correct: 0,
  },
  {
    text: 'What is altitude?',
    options: [
      'Height above ground',
      'Speed through air',
      'Direction of travel',
      'Distance to destination',
    ],
    correct: 0,
  },
  {
    text: 'What is airspeed?',
    options: [
      'Speed through the air',
      'Speed over ground',
      'Engine speed',
      'Climb rate',
    ],
    correct: 0,
  },
  {
    text: 'What is heading?',
    options: [
      'Direction the plane is going',
      'Altitude',
      'Airspeed',
      'Vertical speed',
    ],
    correct: 0,
  },
  {
    text: 'What is turbulence?',
    options: [
      'Rough air movement',
      'Engine vibration',
      'Wing stall',
      'Runway roughness',
    ],
    correct: 0,
  },
  {
    text: 'What do pilots do in turbulence?',
    options: [
      'Maintain control and reduce speed',
      'Increase speed',
      'Climb higher',
      'Descend quickly',
    ],
    correct: 0,
  },
  {
    text: 'Is turbulence dangerous?',
    options: [
      'Usually not, but uncomfortable',
      'Always dangerous',
      'Only at night',
      'Only over water',
    ],
    correct: 0,
  },
  {
    text: 'What is cabin pressure?',
    options: [
      'Air pressure inside aircraft',
      'Outside air pressure',
      'Fuel pressure',
      'Hydraulic pressure',
    ],
    correct: 0,
  },
  {
    text: 'Why is cabin pressure important?',
    options: [
      'Helps passengers breathe normally',
      'Improves engine performance',
      'Reduces noise',
      'Increases speed',
    ],
    correct: 0,
  },
  {
    text: 'What happens if cabin pressure fails?',
    options: [
      'Oxygen masks deploy',
      'Engines stop',
      'Lights go out',
      'Plane descends automatically',
    ],
    correct: 0,
  },
  {
    text: 'What is a bird strike?',
    options: [
      'Collision between bird and aircraft',
      'Bird flying near airport',
      'Bird ingestion into engine',
      'Bird on runway',
    ],
    correct: 0,
  },
  {
    text: 'When are bird strikes most common?',
    options: [
      'During takeoff and landing',
      'At cruise altitude',
      'At night',
      'In winter',
    ],
    correct: 0,
  },
  {
    text: 'Why are bird strikes dangerous?',
    options: [
      'Can damage engines or windshield',
      'Cause noise',
      'Distract pilots',
      'Reduce visibility',
    ],
    correct: 0,
  },
  {
    text: 'What happens if a bird hits the engine?',
    options: [
      'Engine may lose power or fail',
      'Engine stops immediately',
      'Engine catches fire',
      'Engine over speeds',
    ],
    correct: 0,
  },
  {
    text: 'What must pilots do after a bird strike?',
    options: [
      'Assess damage and possibly land',
      'Continue flight',
      'Declare emergency only if severe',
      'Ignore if minor',
    ],
    correct: 0,
  },
  {
    text: 'Can planes survive bird strikes?',
    options: [
      'Yes, most are designed to',
      'No, always critical',
      'Only small planes',
      'Only large planes',
    ],
    correct: 0,
  },
  {
    text: 'What famous bird strike incident involved water landing?',
    options: [
      'US Airways Flight 1549',
      'TACA Flight 110',
      'Hudson River landing',
      'Miracle on the Hudson',
    ],
    correct: 0,
  },
  {
    text: 'Who safely landed that aircraft?',
    options: [
      'Chesley Sullenberger',
      'Richard Bong',
      'Charles Lindbergh',
      'Amelia Earhart',
    ],
    correct: 0,
  },
  {
    text: 'What is engine failure?',
    options: [
      'Engine stops working',
      'Engine loses power partially',
      'Engine over heats',
      'Engine surges',
    ],
    correct: 0,
  },
  {
    text: 'Can a plane glide without engines?',
    options: ['Yes', 'No', 'Only with tailwind', 'Only at low altitude'],
    correct: 0,
  },
  {
    text: 'What is rain effect on flying?',
    options: [
      'Reduces visibility',
      'Increases speed',
      'Improves engine performance',
      'Reduces drag',
    ],
    correct: 0,
  },
  {
    text: 'Does rain stop planes from flying?',
    options: ['Usually no', 'Yes always', 'Only heavy rain', 'Only at night'],
    correct: 0,
  },
  {
    text: 'What is heavy rain called in aviation concern?',
    options: ['Severe weather', 'Thunderstorm', 'Downpour', 'Monsoon'],
    correct: 0,
  },
  {
    text: 'What is windscreen wiper used for?',
    options: [
      'Clear rain from cockpit window',
      'Clear ice',
      'Clean windshield',
      'Defog windows',
    ],
    correct: 0,
  },
  {
    text: 'What is hydroplaning?',
    options: [
      'Sliding on wet runway',
      'Flying through rain',
      'Engine water ingestion',
      'Wing icing',
    ],
    correct: 0,
  },
  {
    text: 'When does hydroplaning happen?',
    options: [
      'During landing in heavy rain',
      'During takeoff',
      'During taxi',
      'At cruise',
    ],
    correct: 0,
  },
  {
    text: 'What is lightning risk in flight?',
    options: [
      'Aircraft can be struck',
      'Engines may fail',
      'Instruments may fail',
      'Radar may be damaged',
    ],
    correct: 0,
  },
  {
    text: 'Are planes protected from lightning?',
    options: ['Yes', 'No', 'Only metal planes', 'Only composite planes'],
    correct: 0,
  },
  {
    text: 'What happens if lightning hits a plane?',
    options: [
      'Usually no serious damage',
      'Plane crashes',
      'Electronics fail',
      'Engine stops',
    ],
    correct: 0,
  },
  {
    text: 'What is storm avoidance?',
    options: [
      'Flying around bad weather',
      'Flying through storms',
      'Climbing above storms',
      'Descending below storms',
    ],
    correct: 0,
  },
  {
    text: 'What tool helps detect storms?',
    options: ['Weather radar', 'GPS', 'ATC', 'Transponder'],
    correct: 0,
  },
  {
    text: 'What is cloud flying called?',
    options: [
      'Instrument flight',
      'Visual flight',
      'Cloud flying',
      'IMC flying',
    ],
    correct: 0,
  },
  {
    text: 'Why is visibility important in rain?',
    options: [
      'Helps pilots see surroundings',
      'Reduces speed',
      'Increases safety',
      'Improves navigation',
    ],
    correct: 0,
  },
  {
    text: 'What is icing?',
    options: [
      'Ice forming on aircraft',
      'Engine icing',
      'Wing icing',
      'Fuel icing',
    ],
    correct: 0,
  },
  {
    text: 'Why is icing dangerous?',
    options: [
      'Reduces lift',
      'Increases drag',
      'Adds weight',
      'All of the above',
    ],
    correct: 3,
  },
  {
    text: 'How do planes fight icing?',
    options: [
      'De-icing systems',
      'Climbing higher',
      'Descending',
      'Increasing speed',
    ],
    correct: 0,
  },
  {
    text: 'What is descent?',
    options: ['Going down toward landing', 'Climbing', 'Cruising', 'Taxiing'],
    correct: 0,
  },
  {
    text: 'When does descent begin?',
    options: [
      'Before landing',
      'After takeoff',
      'At cruise',
      'During emergency',
    ],
    correct: 0,
  },
  {
    text: 'What is approach?',
    options: [
      'Final path to runway',
      'Takeoff path',
      'Taxi path',
      'Climb path',
    ],
    correct: 0,
  },
  {
    text: 'What is the most important rule in flight?',
    options: ['Safety first', 'Speed', 'Fuel efficiency', 'Passenger comfort'],
    correct: 0,
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
