import { useMemo, useState } from 'react'

interface TrainingCalendarProps {
  /** dates with a session, formatted as 'YYYY-MM-DD' */
  markedDates: string[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function TrainingCalendar({ markedDates, selectedDate, onSelectDate }: TrainingCalendarProps) {
  const today = new Date()
  const initial = selectedDate ? new Date(selectedDate + 'T00:00:00') : today
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())

  const markedSet = useMemo(() => new Set(markedDates), [markedDates])
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate())

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button type="button" onClick={goPrev} style={styles.navBtn} aria-label="Mês anterior">‹</button>
        <span style={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
        <button type="button" onClick={goNext} style={styles.navBtn} aria-label="Próximo mês">›</button>
      </div>

      <div style={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <span key={i} style={styles.weekday}>{w}</span>
        ))}
      </div>

      <div style={styles.grid}>
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />
          const key = toDateKey(viewYear, viewMonth, day)
          const isMarked = markedSet.has(key)
          const isSelected = key === selectedDate
          const isToday = key === todayKey

          return (
            <button
              type="button"
              key={key}
              onClick={() => onSelectDate(key)}
              style={{
                ...styles.day,
                ...(isSelected ? styles.daySelected : {}),
                ...(isToday && !isSelected ? styles.dayToday : {}),
              }}
            >
              {day}
              {isMarked && <span style={{ ...styles.dot, ...(isSelected ? styles.dotSelected : {}) }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '1rem',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  } as React.CSSProperties,
  monthLabel: {
    fontFamily: 'var(--display)',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.03em',
    fontSize: '1rem',
  } as React.CSSProperties,
  navBtn: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    width: '2rem',
    height: '2rem',
    display: 'grid',
    placeItems: 'center',
    color: 'var(--text)',
    fontSize: '1.1rem',
    lineHeight: 1,
    padding: 0,
  } as React.CSSProperties,
  weekRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  weekday: {
    textAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
  } as React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '0.2rem',
  } as React.CSSProperties,
  day: {
    position: 'relative',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    aspectRatio: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--text)',
    fontWeight: 500,
    fontSize: '0.9rem',
    padding: 0,
  } as React.CSSProperties,
  dayToday: {
    border: '1px solid var(--primary)',
  } as React.CSSProperties,
  daySelected: {
    background: 'var(--primary)',
    color: 'white',
    fontWeight: 700,
  } as React.CSSProperties,
  dot: {
    position: 'absolute',
    bottom: '4px',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'var(--accent)',
  } as React.CSSProperties,
  dotSelected: {
    background: 'white',
  } as React.CSSProperties,
}
