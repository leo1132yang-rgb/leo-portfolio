'use client';
import { useLanguage } from '@/components/LanguageProvider';
import { worldIntroCopy, worldName } from '@/data/worldCopy';
import styles from './OtherSideEntry.module.css';
export function WorldInvitation({ onEnter, prompt, waiting = false, embedded = false }: {
  onEnter: () => void; prompt?: string; waiting?: boolean; embedded?: boolean;
}) {
  const { language } = useLanguage();
  const copy = worldIntroCopy[language];
  const Title = embedded ? 'h2' : 'h1';
  return <section className={styles.content} aria-labelledby="world-welcome-title">
    <p className={styles.eyebrow}>{worldName.en}</p>
    <Title id="world-welcome-title" className={styles.title}>{copy.title}</Title>
    <div className={styles.copy}>{copy.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    <div className={styles.actions}>
      <button type="button" className={styles.enter} onClick={onEnter} disabled={waiting} aria-busy={waiting}>
        <span aria-live="polite">{prompt || copy.enter}</span>{!waiting && <span aria-hidden="true"> →</span>}
      </button>
      <a className={styles.feedback} href="mailto:leoyang1132@outlook.com">{copy.feedback} ↗</a>
    </div>
  </section>;
}
