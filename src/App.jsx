import { useState } from 'react'

const QUESTIONS = [
  {
    id: 1,
    text: 'Potraty by měly zůstat legální a dostupné v rámci zákonných limitů.',
    leftLabel: 'Spíše proti legalitě',
    rightLabel: 'Spíše pro legalitu',
  },
  {
    id: 2,
    text: 'Homosexuální páry by měly mít stejné právo na manželství jako heterosexuální páry.',
    leftLabel: 'Spíše proti',
    rightLabel: 'Spíše pro',
  },
  {
    id: 3,
    text: 'V konfliktu Izrael vs Palestina mám celkově blíž spíše k izraelské straně.',
    leftLabel: 'Spíše Palestina',
    rightLabel: 'Spíše Izrael',
  },
  {
    id: 4,
    text: 'Stát by měl více regulovat ceny bydlení a nájmy ve velkých městech.',
    leftLabel: 'Spíše proti regulaci',
    rightLabel: 'Spíše pro regulaci',
  },
  {
    id: 5,
    text: 'Mělo by se výrazně více investovat do klimatických opatření i za cenu vyšších daní.',
    leftLabel: 'Spíše proti',
    rightLabel: 'Spíše pro',
  },
  {
    id: 6,
    text: 'Sociální sítě by měly nést přísnější odpovědnost za dezinformace a nenávistný obsah.',
    leftLabel: 'Spíše proti',
    rightLabel: 'Spíše pro',
  },
  {
    id: 7,
    text: 'EU by měla přijímat více společných rozhodnutí i za cenu menší národní autonomie.',
    leftLabel: 'Více národní autonomie',
    rightLabel: 'Více společné EU',
  },
]

const LABELS = [
  'Silně vlevo',
  'Spíše vlevo',
  'Neutrální',
  'Spíše vpravo',
  'Silně vpravo',
]

const DOT_COLORS = [
  'bg-red-500 border-red-400',
  'bg-red-300 border-red-200',
  'bg-gray-400 border-gray-300',
  'bg-blue-300 border-blue-200',
  'bg-blue-500 border-blue-400',
]

const DOT_COLORS_RESULT = [
  'bg-red-500',
  'bg-red-300',
  'bg-gray-400',
  'bg-blue-300',
  'bg-blue-500',
]

const POSITION_LABELS = [
  'Silně vlevo',
  'Spíše vlevo',
  'Střed',
  'Spíše vpravo',
  'Silně vpravo',
]

const POSITION_DESCRIPTIONS = [
  'Ve většině témat volíte levý pól škály.',
  'Častěji volíte levý pól, ale ne extrémně.',
  'Nejčastěji zaujímáte středovou pozici.',
  'Častěji volíte pravý pól, ale ne extrémně.',
  'Ve většině témat volíte pravý pól škály.',
]

function getOverallResult(answers) {
  const values = Object.values(answers)
  if (values.length === 0) {
    return null
  }

  const average = values.reduce((sum, val) => sum + val, 0) / values.length
  const index = Math.max(0, Math.min(4, Math.round(average)))

  return {
    average,
    index,
    label: POSITION_LABELS[index],
    description: POSITION_DESCRIPTIONS[index],
  }
}

function openResultsWindow(answers, overallResult) {
  const popup = window.open('', '_blank', 'width=960,height=900')
  if (!popup) {
    return
  }

  const rows = QUESTIONS.map((q, idx) => {
    const selected = answers[q.id]
    const dots = [0, 1, 2, 3, 4]
      .map((i) => (i === selected ? '●' : '○'))
      .join(' ')

    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${q.text}</td>
        <td>${q.leftLabel}</td>
        <td class="scale">${dots}</td>
        <td>${q.rightLabel}</td>
      </tr>
    `
  }).join('')

  popup.document.write(`
    <!doctype html>
    <html lang="cs">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vysledky pruzkumu</title>
        <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
        <style>
          body {
            margin: 0;
            padding: 24px;
            font-family: Arial, sans-serif;
            background: #f1f5f9;
            color: #0f172a;
          }

          .wrap {
            max-width: 980px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 12px;
            padding: 20px;
          }

          h1 {
            margin: 0 0 6px 0;
            font-size: 26px;
          }

          .meta {
            margin: 0 0 18px 0;
            color: #475569;
            font-size: 14px;
          }

          .result {
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            padding: 12px;
            margin-bottom: 16px;
            background: #f8fafc;
          }

          .result strong {
            font-size: 20px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          th, td {
            border: 1px solid #cbd5e1;
            padding: 8px;
            vertical-align: top;
            font-size: 14px;
            text-align: left;
          }

          th:nth-child(1), td:nth-child(1) {
            width: 38px;
            text-align: center;
          }

          th:nth-child(3), td:nth-child(3),
          th:nth-child(5), td:nth-child(5) {
            width: 140px;
            font-size: 12px;
          }

          th:nth-child(4), td:nth-child(4) {
            width: 110px;
            text-align: center;
          }

          td.scale {
            letter-spacing: 1px;
            font-size: 18px;
            line-height: 1;
            white-space: nowrap;
          }

          .actions {
            display: flex;
            gap: 10px;
            margin-top: 16px;
          }

          .btn {
            border: 1px solid #1d4ed8;
            background: #2563eb;
            color: #fff;
            border-radius: 8px;
            padding: 10px 14px;
            font-weight: 700;
            text-decoration: none;
            cursor: pointer;
            display: inline-block;
          }

          .btn.secondary {
            border-color: #334155;
            background: #475569;
          }

          @media print {
            body {
              background: #fff;
              padding: 0;
            }

            .wrap {
              border: none;
              border-radius: 0;
              padding: 0;
            }

            .actions {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div id="export-area">
            <h1>Spolecensky nazorovy pruzkum</h1>
            <p class="meta">Prehled odpovedi</p>
            <div class="result">
              <div>Kam podle vysledku spadas:</div>
              <strong>${overallResult ? overallResult.label : 'N/A'}</strong>
              <div>Prumerna pozice: ${overallResult ? overallResult.average.toFixed(2) : '0.00'} / 4.00</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Otazka</th>
                  <th>Levy pol</th>
                  <th>Skala</th>
                  <th>Pravy pol</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>

          <div class="actions">
            <button class="btn" onclick="downloadVisualPdf()">Uložit PDF</button>
            <button class="btn secondary" onclick="window.print()">Tisk </button>
          </div>
        </div>
        <script>
          async function downloadVisualPdf() {
            const area = document.getElementById('export-area')
            const { jsPDF } = window.jspdf

            const canvas = await window.html2canvas(area, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff',
            })

            const imageData = canvas.toDataURL('image/png')
            const pdf = new jsPDF('p', 'mm', 'a4')
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()
            const margin = 8
            const contentWidth = pageWidth - margin * 2
            const imgWidth = contentWidth
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            let heightLeft = imgHeight
            let positionY = margin

            pdf.addImage(imageData, 'PNG', margin, positionY, imgWidth, imgHeight)
            heightLeft -= (pageHeight - margin * 2)

            while (heightLeft > 0) {
              pdf.addPage()
              positionY = margin - (imgHeight - heightLeft)
              pdf.addImage(imageData, 'PNG', margin, positionY, imgWidth, imgHeight)
              heightLeft -= (pageHeight - margin * 2)
            }

            pdf.save('vysledky-pruzkum.pdf')
          }
        </script>
      </body>
    </html>
  `)
  popup.document.close()
}

function ScaleRow({ question, value, onChange }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-300 bg-white p-4">
      <p className="text-left text-base font-semibold text-slate-900">{question.text}</p>
      <div className="grid grid-cols-[96px_1fr_96px] items-center gap-3 md:grid-cols-[140px_1fr_140px]">
        {/* Left anchor */}
        <div className="w-full">
          <span className="block text-left text-[11px] font-semibold text-rose-700 leading-tight">{question.leftLabel}</span>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 md:gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => onChange(question.id, i)}
              title={LABELS[i]}
              className={`
                h-7 w-7 rounded-full border-2 cursor-pointer
                ${value === i
                  ? `${DOT_COLORS[i]}`
                  : 'bg-slate-100 border-slate-300'
                }
              `}
            />
          ))}
        </div>

        {/* Right anchor */}
        <div className="w-full">
          <span className="block text-right text-[11px] font-semibold text-sky-700 leading-tight">{question.rightLabel}</span>
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
          <div key={q.id} className="rounded-xl border border-slate-300 bg-white p-4">
            <p className="mb-3 text-left font-semibold text-slate-900">{q.text}</p>
            {answered ? (
              <div className="grid grid-cols-[100px_1fr_100px] items-center gap-2 md:grid-cols-[150px_1fr_150px] md:gap-3">
                <span className="text-left text-[11px] font-semibold leading-tight text-rose-700">{q.leftLabel}</span>
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-6 w-6 rounded-full border-2 ${
                        val === i
                          ? `${DOT_COLORS_RESULT[i]} border-slate-500`
                          : 'bg-slate-100 border-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-right text-[11px] font-semibold leading-tight text-sky-700">{q.rightLabel}</span>
              </div>
            ) : (
              <p className="text-sm italic text-slate-500">Nezodpovězeno</p>
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
  const overallResult = getOverallResult(answers)

  const handleReset = () => {
    setAnswers({})
    setShowSummary(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 rounded-2xl border border-slate-300 bg-slate-50 p-4 md:p-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="mb-1 text-3xl font-bold text-slate-900">Společenský názorový průzkum</h1>
          <p className="text-sm text-slate-600">Vyberte postoj ke každému tématu na škále 1 až 5</p>
          <div className="mt-2 flex justify-center gap-2 text-xs text-slate-500">
            <span className="text-rose-700">levá strana = nesouhlas / alternativa A</span>
            <span>·</span>
            <span className="text-sky-700">pravá strana = souhlas / alternativa B</span>
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
            <div className="mt-2 flex flex-col items-center gap-3 rounded-xl border border-slate-300 bg-white p-4">
              <p className="text-sm text-slate-600">
                Zodpovězeno: <span className="font-semibold text-slate-900">{answeredCount}</span> / {QUESTIONS.length}
              </p>
              <div className="h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${(answeredCount / QUESTIONS.length) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setShowSummary(true)}
                disabled={!allAnswered}
                className={`mt-2 rounded-lg px-8 py-3 text-base font-semibold text-white ${
                  allAnswered
                    ? 'cursor-pointer bg-blue-600 hover:bg-blue-700'
                    : 'cursor-not-allowed bg-slate-300 text-slate-500'
                }`}
              >
                Zobrazit výsledky
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="mb-1 text-2xl font-bold text-slate-900">Váš přehled odpovědí</h2>
              <p className="text-sm text-slate-600">Zde jsou vaše vybrané postoje ke všem otázkám</p>
            </div>

            {overallResult && (
              <div className="rounded-xl border border-slate-300 bg-white p-4">
                <p className="text-sm font-semibold text-slate-500">Kam podle výsledků spadáš</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{overallResult.label}</p>
                <p className="mt-1 text-sm text-slate-600">{overallResult.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Průměrná pozice na škále: {overallResult.average.toFixed(2)} / 4.00
                </p>
              </div>
            )}

            <Summary answers={answers} />

            <button
              onClick={() => openResultsWindow(answers, overallResult)}
              className="mx-auto cursor-pointer rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Otevřít výsledky v PDF
            </button>

            <button
              onClick={handleReset}
              className="mx-auto mt-2 cursor-pointer rounded-lg bg-slate-700 px-8 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Resetovat a vyplnit znovu
            </button>
          </>
        )}
      </div>
    </div>
  )
}
