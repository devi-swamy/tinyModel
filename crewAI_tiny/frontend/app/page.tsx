'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState('');

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    setPhase('Dispatching Research Analyst...');

    try {
      setTimeout(() => setPhase('Gathering intelligence...'), 2000);
      setTimeout(() => setPhase('Content Writer crafting summary...'), 6000);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Something went wrong');
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setPhase('');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid} aria-hidden />

      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            Sequential Content Intelligence with CrewAI
          </div>
          <h1 className={styles.title}>
            CREW<span className={styles.accent}>AI</span>
          </h1>
          <p className={styles.subtitle}>
            Research Analyst → Content Writer
          </p>
        </header>

        {/* Input */}
        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>⌕</span>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter any topic to research..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleSubmit()}
              disabled={loading}
            />
            <button
              className={`${styles.button} ${loading ? styles.buttonLoading : ''}`}
              onClick={handleSubmit}
              disabled={loading || !topic.trim()}
            >
              {loading ? <span className={styles.spinner} /> : 'Run →'}
            </button>
          </div>
        </div>

        {/* Agent pipeline diagram */}
        <div className={styles.pipeline}>
          <AgentPill
            icon="🔍"
            name="Research Analyst"
            file="agents.py"
            task="5 key facts"
            active={loading && (phase.includes('Research') || phase.includes('Gathering'))}
            done={!!result}
          />
          <div className={styles.pipelineArrow}>
            <span className={styles.arrowLine} />
            <span className={styles.arrowLabel}>context passed</span>
            <span className={styles.arrowLine} />
            →
          </div>
          <AgentPill
            icon="✍️"
            name="Content Writer"
            file="agents.py"
            task="150-word summary"
            active={loading && phase.includes('Writer')}
            done={!!result}
          />
        </div>

        {/* Loading phase text */}
        {loading && (
          <p className={styles.phaseText}>{phase}</p>
        )}

        {/* Error */}
        {error && (
          <div className={styles.errorCard}>
            <span className={styles.errorIcon}>!</span>
            <div>
              <p className={styles.errorTitle}>Error</p>
              <p className={styles.errorMsg}>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className={styles.results}>
            <div className={styles.topicTag}>
              <span className={styles.topicFile}>main.py → run()</span>
              <strong>"{result.topic}"</strong>
            </div>

            <div className={styles.cards}>
              {/* Research output */}
              <div className={`${styles.card} ${styles.cardResearch}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>🔍</span>
                  <div>
                    <p className={styles.cardFile}>tasks.py · research_task</p>
                    <h2 className={styles.cardTitle}>Research Output</h2>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <FormattedOutput text={result.research} />
                </div>
              </div>

              {/* Summary output */}
              <div className={`${styles.card} ${styles.cardSummary}`}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>✍️</span>
                  <div>
                    <p className={styles.cardFile}>tasks.py · write_task</p>
                    <h2 className={styles.cardTitle}>Written Summary</h2>
                  </div>
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.summaryText}>{result.summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* Renders bullet lists nicely if the research output has them */
function FormattedOutput({ text }) {
  if (!text) return null;
  const lines = text.split('\n').filter(Boolean);
  const isBullet = (l) => /^[-•*]/.test(l.trim());

  return (
    <ul className={styles.bulletList}>
      {lines.map((line, i) => (
        <li key={i} className={`${styles.bulletItem} ${isBullet(line) ? styles.bulletReal : styles.bulletPlain}`}>
          {isBullet(line) ? line.replace(/^[-•*]\s*/, '') : line}
        </li>
      ))}
    </ul>
  );
}

function AgentPill({ icon, name, file, task, active, done }) {
  return (
    <div className={`${styles.agentPill} ${active ? styles.agentActive : ''} ${done ? styles.agentDone : ''}`}>
      <div className={styles.agentIconWrap}>
        {done ? <span className={styles.agentCheck}>✓</span> : active ? <span className={styles.pulse} /> : <span className={styles.agentIconStatic}>{icon}</span>}
      </div>
      <div>
        <p className={styles.agentName}>{name}</p>
        <p className={styles.agentMeta}><code>{file}</code> · {task}</p>
      </div>
    </div>
  );
}
