'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './page.module.css';

type ResearchResult = {
  topic: string;
  research: string;
  summary: string;
};

type AgentPillProps = {
  icon: string;
  name: string;
  file: string;
  task: string;
  active: boolean;
  done: boolean;
};

type FormattedOutputProps = {
  text: string;
};

function ResearchApp() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState('');
  const [phase, setPhase] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

  const handleSubmit = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    setPhase('Dispatching Research Analyst...');

    try {
      setTimeout(() => setPhase('Gathering intelligence...'), 2000);
      setTimeout(() => setPhase('Content Writer crafting summary...'), 6000);

      const res = await fetch(`${apiUrl}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error((err as { detail?: string }).detail ?? 'Something went wrong');
      }

      const data = (await res.json()) as ResearchResult;
      setResult(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
      setPhase('');
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.container}>

        <header className={styles.header}>
          <div className={styles.badge}>
            <span className={styles.dot} />
            crewai_tiny · 2 agents · sequential
          </div>
          <h1 className={styles.title}>
            CREW<span className={styles.accent}>AI</span>
          </h1>
          <p className={styles.subtitle}>Research Analyst → Content Writer</p>
        </header>

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
              className={styles.button}
              onClick={handleSubmit}
              disabled={loading || !topic.trim()}
            >
              {loading ? <span className={styles.spinner} /> : 'Run →'}
            </button>
          </div>
        </div>

        <div className={styles.pipeline}>
          <AgentPill
            icon="🔍"
            name="Research Analyst"
            file="agents.py"
            task="5 key facts"
            active={loading && (phase.includes('Research') || phase.includes('Gathering'))}
            done={result !== null}
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
            done={result !== null}
          />
        </div>

        {loading && <p className={styles.phaseText}>{phase}</p>}

        {error && (
          <div className={styles.errorCard}>
            <span className={styles.errorIcon}>!</span>
            <div>
              <p className={styles.errorTitle}>Error</p>
              <p className={styles.errorMsg}>{error}</p>
            </div>
          </div>
        )}

        {result !== null && (
          <div className={styles.results}>
            <div className={styles.topicTag}>
              <span className={styles.topicFile}>main.py → run()</span>
              <strong>&quot;{result.topic}&quot;</strong>
            </div>
            <div className={styles.cards}>
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

function FormattedOutput({ text }: FormattedOutputProps) {
  if (!text) return null;
  const lines = text.split('\n').filter(Boolean);
  const isBullet = (l: string) => /^[-•*]/.test(l.trim());
  return (
    <ul className={styles.bulletList}>
      {lines.map((line, i) => (
        <li
          key={i}
          className={`${styles.bulletItem} ${isBullet(line) ? styles.bulletReal : styles.bulletPlain}`}
        >
          {isBullet(line) ? line.replace(/^[-•*]\s*/, '') : line}
        </li>
      ))}
    </ul>
  );
}

function AgentPill({ icon, name, file, task, active, done }: AgentPillProps) {
  return (
    <div className={`${styles.agentPill} ${active ? styles.agentActive : ''} ${done ? styles.agentDone : ''}`}>
      <div className={styles.agentIconWrap}>
        {done
          ? <span className={styles.agentCheck}>✓</span>
          : active
            ? <span className={styles.pulse} />
            : <span className={styles.agentIconStatic}>{icon}</span>
        }
      </div>
      <div>
        <p className={styles.agentName}>{name}</p>
        <p className={styles.agentMeta}><code>{file}</code> · {task}</p>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ResearchApp), { ssr: false });
