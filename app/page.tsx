'use client';
import data from './questions.json';
import { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [time, setTime] = useState(2700);
  const [score, setScore] = useState(0);
  const [activeSection, setActiveSection] = useState('math');
  const [showResults, setShowResults] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const sections = [
    { title: 'Toán', key: 'math', icon: '🧮', color: '#6366f1' },
    { title: 'Tiếng Việt', key: 'vi', icon: '📖', color: '#ec4899' },
    { title: 'Tiếng Anh', key: 'eng', icon: '🇬🇧', color: '#14b8a6' },
    { title: 'Logic', key: 'logic', icon: '🧠', color: '#f59e0b' },
  ];

  useEffect(() => {
    if (submitted) return;
    if (time <= 0) { submit(); return; }
    const t = setInterval(() => setTime(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [time, submitted]);

  const submit = () => {
    let correct = 0;
    sections.forEach(sec => {
      (data as any)[sec.key].forEach((q: any, i: number) => {
        if (answers[sec.key + i] === q.a) correct++;
      });
    });
    setScore(correct);
    setSubmitted(true);
    setTimeout(() => setShowResults(true), 100);
  };

  const format = (t: number) =>
    `${Math.floor(t / 60).toString().padStart(2, '0')}:${(t % 60).toString().padStart(2, '0')}`;

  const isUrgent = time < 300;

  const getProgress = () => {
    const total = sections.reduce((acc, sec) => acc + (data as any)[sec.key].length, 0);
    return (Object.keys(answers).length / total) * 100;
  };

  const getSectionProgress = (key: string) => {
    const qs = (data as any)[key];
    const answered = qs.filter((_: any, i: number) => answers[key + i] !== undefined).length;
    return Math.round((answered / qs.length) * 100);
  };

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    sectionRefs.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="quiz-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0d0f14;
          --surface: #161922;
          --surface2: #1e2230;
          --border: rgba(255,255,255,0.07);
          --text: #e8eaf0;
          --muted: #6b7280;
          --accent: #6366f1;
          --green: #10b981;
          --red: #ef4444;
          --amber: #f59e0b;
          --radius: 14px;
          --font: 'Sora', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }

        body { background: var(--bg); color: var(--text); font-family: var(--font); }

        .quiz-root {
          min-height: 100vh;
          background: var(--bg);
          background-image:
            radial-gradient(ellipse 80% 50% at 20% -20%, rgba(99,102,241,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 110%, rgba(236,72,153,0.08) 0%, transparent 60%);
        }

        /* HEADER */
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(13,15,20,0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          padding: 0 clamp(16px, 4vw, 48px);
        }
        .header-inner {
          max-width: 900px;
          margin: 0 auto;
          height: 64px;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .logo {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          flex-shrink: 0;
        }
        .header-divider {
          width: 1px;
          height: 20px;
          background: var(--border);
          flex-shrink: 0;
        }
        .progress-bar-wrap {
          flex: 1;
          height: 6px;
          background: var(--surface2);
          border-radius: 99px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          border-radius: 99px;
          transition: width 0.4s ease;
        }
        .timer {
          font-family: var(--mono);
          font-size: 15px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 8px;
          border: 1px solid;
          flex-shrink: 0;
          transition: all 0.3s;
        }
        .timer.normal { color: #a78bfa; border-color: rgba(99,102,241,0.3); background: rgba(99,102,241,0.08); }
        .timer.urgent { color: var(--red); border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); animation: pulse 1s infinite; }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* NAV TABS */
        .section-nav {
          position: sticky;
          top: 64px;
          z-index: 90;
          background: rgba(13,15,20,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
          padding: 0 clamp(16px, 4vw, 48px);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .section-nav::-webkit-scrollbar { display: none; }
        .section-nav-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          gap: 4px;
          padding: 10px 0;
        }
        .nav-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: var(--muted);
          font-family: var(--font);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          position: relative;
        }
        .nav-tab:hover { color: var(--text); background: var(--surface); }
        .nav-tab.active { color: var(--text); background: var(--surface2); }
        .nav-badge {
          font-size: 10px;
          font-weight: 700;
          font-family: var(--mono);
          padding: 2px 6px;
          border-radius: 99px;
          background: var(--surface);
          color: var(--muted);
        }
        .nav-tab.active .nav-badge {
          background: rgba(99,102,241,0.2);
          color: #a78bfa;
        }

        /* MAIN CONTENT */
        .main {
          max-width: 900px;
          margin: 0 auto;
          padding: clamp(24px, 4vw, 48px) clamp(16px, 4vw, 48px);
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* SECTION */
        .section-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--border);
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: -0.3px;
        }
        .section-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          background: var(--surface2);
        }
        .section-stat {
          font-size: 12px;
          font-family: var(--mono);
          color: var(--muted);
          font-weight: 400;
        }
        .mini-progress {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--muted);
          font-family: var(--mono);
        }
        .mini-bar {
          width: 80px;
          height: 4px;
          background: var(--surface2);
          border-radius: 99px;
          overflow: hidden;
        }
        .mini-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.4s ease;
        }

        /* QUESTION CARD */
        .question-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: clamp(16px, 3vw, 24px);
          transition: border-color 0.2s;
        }
        .question-card:hover { border-color: rgba(255,255,255,0.12); }
        .question-card.answered { border-color: rgba(99,102,241,0.2); }
        .question-card.correct { border-color: rgba(16,185,129,0.3); background: rgba(16,185,129,0.04); }
        .question-card.wrong { border-color: rgba(239,68,68,0.2); background: rgba(239,68,68,0.03); }

        .q-number {
          font-size: 11px;
          font-family: var(--mono);
          color: var(--muted);
          font-weight: 600;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .q-text {
          font-size: clamp(14px, 2vw, 15px);
          font-weight: 500;
          line-height: 1.6;
          margin-bottom: 16px;
          color: var(--text);
        }

        /* OPTIONS GRID */
        .options-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        @media (max-width: 500px) {
          .options-grid { grid-template-columns: 1fr; }
        }

        .option-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface2);
          cursor: pointer;
          transition: all 0.15s;
          font-size: 13px;
          line-height: 1.5;
          color: var(--text);
        }
        .option-label:hover:not(.disabled) {
          border-color: rgba(99,102,241,0.4);
          background: rgba(99,102,241,0.08);
        }
        .option-label.selected {
          border-color: rgba(99,102,241,0.5);
          background: rgba(99,102,241,0.12);
          color: #c4b5fd;
        }
        .option-label.correct-opt {
          border-color: rgba(16,185,129,0.5);
          background: rgba(16,185,129,0.1);
          color: #6ee7b7;
        }
        .option-label.wrong-opt {
          border-color: rgba(239,68,68,0.4);
          background: rgba(239,68,68,0.08);
          color: #fca5a5;
        }
        .option-label.disabled { cursor: default; }

        .option-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid currentColor;
          flex-shrink: 0;
          margin-top: 1px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.5;
          transition: all 0.15s;
        }
        .option-label.selected .option-dot,
        .option-label.correct-opt .option-dot,
        .option-label.wrong-opt .option-dot {
          opacity: 1;
        }
        .option-label.selected .option-dot::after,
        .option-label.correct-opt .option-dot::after,
        .option-label.wrong-opt .option-dot::after {
          content: '';
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }

        .hidden-radio { position: absolute; opacity: 0; pointer-events: none; }

        /* EXPLANATION */
        .explanation {
          margin-top: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          background: var(--surface2);
          border-left: 3px solid;
          font-size: 12px;
          line-height: 1.6;
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .explanation.ok { border-color: var(--green); color: #a7f3d0; }
        .explanation.err { border-color: var(--red); color: #fecaca; }
        .exp-icon { flex-shrink: 0; font-size: 14px; }

        /* SUBMIT BUTTON */
        .submit-wrap {
          position: sticky;
          bottom: 0;
          z-index: 80;
          background: linear-gradient(to top, var(--bg) 60%, transparent);
          padding: 24px clamp(16px, 4vw, 48px);
          margin: 0 calc(-1 * clamp(16px, 4vw, 48px));
        }
        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 16px 32px;
          background: linear-gradient(135deg, #6366f1, #818cf8);
          color: white;
          font-family: var(--font);
          font-size: 15px;
          font-weight: 600;
          border: none;
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: -0.2px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.3);
        }
        .submit-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.4);
        }
        .submit-btn:active { transform: translateY(0); }

        /* RESULTS PANEL */
        .results-panel {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: clamp(24px, 4vw, 48px);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .results-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #ec4899, #14b8a6, #f59e0b);
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .score-circle {
          width: clamp(100px, 20vw, 140px);
          height: clamp(100px, 20vw, 140px);
          border-radius: 50%;
          background: conic-gradient(#6366f1 0%, #a78bfa calc(var(--pct) * 1%), var(--surface2) calc(var(--pct) * 1%));
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .score-circle-inner {
          width: 75%;
          height: 75%;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .score-num {
          font-size: clamp(22px, 5vw, 32px);
          font-weight: 800;
          letter-spacing: -1px;
          font-family: var(--mono);
          background: linear-gradient(135deg, #6366f1, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .score-denom {
          font-size: 11px;
          color: var(--muted);
          font-family: var(--mono);
        }
        .results-title {
          font-size: clamp(20px, 4vw, 28px);
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .results-subtitle {
          font-size: 14px;
          color: var(--muted);
          max-width: 300px;
        }
        .results-breakdown {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 400px;
        }
        @media (min-width: 500px) {
          .results-breakdown { grid-template-columns: repeat(4, 1fr); }
        }
        .breakdown-item {
          background: var(--surface2);
          border-radius: 10px;
          padding: 12px;
          text-align: center;
        }
        .breakdown-icon { font-size: 20px; margin-bottom: 4px; }
        .breakdown-score {
          font-size: 18px;
          font-weight: 700;
          font-family: var(--mono);
          color: var(--text);
        }
        .breakdown-label {
          font-size: 11px;
          color: var(--muted);
          margin-top: 2px;
        }
      `}</style>

      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <span className="logo">Lea QZZ</span>
          <div className="header-divider" />
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${getProgress()}%` }} />
          </div>
          <div className={`timer ${isUrgent ? 'urgent' : 'normal'}`}>
            {isUrgent ? '⚠️ ' : '⏱ '}{format(time)}
          </div>
        </div>
      </header>

      {/* SECTION NAV */}
      {!submitted && (
        <nav className="section-nav">
          <div className="section-nav-inner">
            {sections.map(sec => (
              <button
                key={sec.key}
                className={`nav-tab ${activeSection === sec.key ? 'active' : ''}`}
                onClick={() => scrollToSection(sec.key)}
              >
                <span>{sec.icon}</span>
                <span>{sec.title}</span>
                <span className="nav-badge">{getSectionProgress(sec.key)}%</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* MAIN */}
      <main className="main">
        {/* RESULTS */}
        {submitted && (
          <div className="results-panel" style={{ '--pct': (score / 80) * 100 } as any}>
            <div className="score-circle">
              <div className="score-circle-inner">
                <div className="score-num">{score}</div>
                <div className="score-denom">/ 80</div>
              </div>
            </div>
            <div>
              <div className="results-title">
                {score >= 64 ? '🎉 Xuất sắc!' : score >= 48 ? '👍 Tốt lắm!' : score >= 32 ? '📚 Cần cố gắng' : '💪 Tiếp tục nỗ lực'}
              </div>
              <div className="results-subtitle" style={{ marginTop: 8 }}>
                Bạn trả lời đúng {score} trên 80 câu hỏi
              </div>
            </div>
            <div className="results-breakdown">
              {sections.map(sec => {
                const qs = (data as any)[sec.key];
                const correct = qs.filter((q: any, i: number) => answers[sec.key + i] === q.a).length;
                return (
                  <div className="breakdown-item" key={sec.key}>
                    <div className="breakdown-icon">{sec.icon}</div>
                    <div className="breakdown-score">{correct}/{qs.length}</div>
                    <div className="breakdown-label">{sec.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {sections.map(sec => (
          <div
            key={sec.key}
            className="section-block"
            ref={el => { sectionRefs.current[sec.key] = el; }}
          >
            <div className="section-header">
              <div className="section-title">
                <div className="section-icon">{sec.icon}</div>
                <span>{sec.title}</span>
                <span className="section-stat">20 câu</span>
              </div>
              <div className="mini-progress">
                <div className="mini-bar">
                  <div
                    className="mini-bar-fill"
                    style={{ width: `${getSectionProgress(sec.key)}%`, background: sec.color }}
                  />
                </div>
                <span>{getSectionProgress(sec.key)}%</span>
              </div>
            </div>

            {(data as any)[sec.key].map((q: any, i: number) => {
              const key = sec.key + i;
              const userAns = answers[key];
              const isCorrect = userAns === q.a;
              let cardClass = 'question-card';
              if (submitted) cardClass += isCorrect ? ' correct' : ' wrong';
              else if (userAns) cardClass += ' answered';

              return (
                <div key={i} className={cardClass}>
                  <div className="q-number">Câu {i + 1}</div>
                  <p className="q-text">{q.q.replace(/^\[.*?\]\s*/, '')}</p>

                  <div className="options-grid">
                    {q.options.map((opt: string, j: number) => {
                      let cls = 'option-label';
                      if (submitted) {
                        if (opt === q.a) cls += ' correct-opt';
                        else if (opt === userAns) cls += ' wrong-opt';
                        cls += ' disabled';
                      } else {
                        if (opt === userAns) cls += ' selected';
                      }

                      return (
                        <label key={j} className={cls}>
                          <input
                            type="radio"
                            className="hidden-radio"
                            name={key}
                            disabled={submitted}
                            checked={userAns === opt}
                            onChange={() => setAnswers({ ...answers, [key]: opt })}
                          />
                          <div className="option-dot" />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div className={`explanation ${isCorrect ? 'ok' : 'err'}`}>
                      <span className="exp-icon">{isCorrect ? '✅' : '❌'}</span>
                      <span>{q.exp}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* SUBMIT */}
        {!submitted && (
          <div className="submit-wrap">
            <button className="submit-btn" onClick={submit}>
              <span>Nộp bài</span>
              <span style={{ opacity: 0.7, fontSize: 13 }}>
                ({Object.keys(answers).length}/80 câu đã trả lời)
              </span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
