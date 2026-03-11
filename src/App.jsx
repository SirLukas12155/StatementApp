import { useState } from 'react'

const QUESTIONS = [
  { id: 1, text: 'Kdo je zodpovědný za vypuknutí války na Ukrajině?' },
  { id: 2, text: 'Jak hodnotíte reakci mezinárodního společenství na ruskou invazi?' },
  { id: 3, text: 'Měl by Západ dodávat Ukrajině zbraně?' },
  { id: 4, text: 'Je možné diplomatické řešení konfliktu?' },
  { id: 5, text: 'Jak vnímáte mediální pokrytí tohoto konfliktu?' },
  { id: 6, text: 'Měly by být uvaleny přísnější sankce na Rusko?' },
  { id: 7, text: 'Jak hodnotíte působení NATO v tomto konfliktu?' },
]

const LABELS = [
  'Silně pro Ukrajinu',
  'Spíše pro Ukrajinu',
  'Neutrální',
  'Spíše pro Rusko',
  'Silně pro Rusko',
]

const DOT_COLORS = [
  'bg-blue-500 border-blue-400',
  'bg-blue-300 border-blue-200',
  'bg-gray-400 border-gray-300',
  'bg-red-300 border-red-200',
  'bg-red-500 border-red-400',
]

const DOT_COLORS_RESULT = [
  'bg-blue-500',
  'bg-blue-300',
  'bg-gray-400',
  'bg-red-300',
  'bg-red-500',
]

function ScaleRow({ question, value, onChange }) {
  return (
    <div className="flex flex-col gap-3 bg-white/5 border border-white/10 rounded-2xl p-5">
      <p className="text-center text-white font-medium text-base">{question.text}</p>
      <div className="flex items-center justify-between gap-2">
        {/* Ukraine flag */}
        <div className="flex flex-col items-center gap-1 min-w-[56px]">
          <span className="text-4xl">🇺🇦</span>
          <span className="text-[10px] text-blue-300 font-semibold text-center leading-tight">Spíše<br/>Ukrajina</span>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => onChange(question.id, i)}
              title={LABELS[i]}
              className={`
                rounded-full border-2 transition-all duration-200 cursor-pointer
                ${value === i
                  ? `${DOT_COLORS[i]} w-8 h-8 shadow-lg scale-110`
                  : 'bg-white/10 border-white/20 w-6 h-6 hover:scale-110 hover:bg-white/20'
                }
              `}
            />
          ))}
        </div>

        {/* Russia flag */}
        <div className="flex flex-col items-center gap-1 min-w-[56px]">
          <span className="text-4xl">🇷🇺</span>
          <span className="text-[10px] text-red-300 font-semibold text-center leading-tight">Spíše<br/>Rusko</span>
        </div>
      </div>
    </div>
  )
}

function Summary({ answers }) {
  return (
    <div className="flex flex-col gap-4">
      {QUESTIONS.map((q) => {
        const val = answers[q.id]
        const answered = val !== undefined
        return (
          <div key={q.id} className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-white font-medium mb-3">{q.text}</p>
            {answered ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇺🇦</span>
                <div className="flex items-center gap-3 flex-1 justify-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`rounded-full border-2 transition-all ${
                        val === i
                          ? `${DOT_COLORS_RESULT[i]} border-white/60 w-8 h-8`
                          : 'bg-white/10 border-white/20 w-5 h-5'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl">🇷🇺</span>
                <span className="ml-3 text-sm text-gray-300 min-w-[140px]">{LABELS[val]}</span>
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">Nezodpovězeno</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function App() {
  const [answers, setAnswers] = useState({})
  const [showSummary, setShowSummary] = useState(false)

  const handleChange = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val }))
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === QUESTIONS.length

  const handleReset = () => {
    setAnswers({})
    setShowSummary(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Politický názorový průzkum</h1>
          <p className="text-gray-400 text-sm">Označte svůj postoj k jednotlivým otázkám</p>
          <div className="flex justify-center gap-2 mt-2 text-xs text-gray-500">
            <span className="text-blue-400">🇺🇦 levá strana = pro Ukrajinu</span>
            <span>·</span>
            <span className="text-red-400">pravá strana = pro Rusko 🇷🇺</span>
          </div>
        </div>

        {!showSummary ? (
          <>
            {/* Questions */}
            {QUESTIONS.map((q) => (
              <ScaleRow
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={handleChange}
              />
            ))}

            {/* Progress */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <p className="text-gray-400 text-sm">
                Zodpovězeno: <span className="text-white font-semibold">{answeredCount}</span> / {QUESTIONS.length}
              </p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setShowSummary(true)}
                disabled={!allAnswered}
                className={`mt-2 px-8 py-3 rounded-xl font-semibold text-white text-base transition-all duration-200 ${
                  allAnswered
                    ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-lg shadow-blue-900/40'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                Zobrazit výsledky
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-1">Váš přehled odpovědí</h2>
              <p className="text-gray-400 text-sm">Zde jsou vaše vybrané postoje ke všem otázkám</p>
            </div>

            <Summary answers={answers} />

            <button
              onClick={handleReset}
              className="mx-auto mt-2 px-8 py-3 rounded-xl font-semibold text-white bg-gray-700 hover:bg-gray-600 cursor-pointer transition-all"
            >
              Resetovat a vyplnit znovu
            </button>
          </>
        )}
      </div>
    </div>
  )
}
