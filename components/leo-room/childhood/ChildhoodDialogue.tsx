import type { DialogueView } from "./dialogue";
import styles from "./childhood.module.css";
export function ChildhoodDialogue({ dialogue, ending, onAdvance }: { dialogue: NonNullable<DialogueView>; ending: boolean; onAdvance: () => void }) {
  return <button type="button" className={`${styles.event} ${styles.dialogue} ${ending ? styles.ending : ""}`} onClick={onAdvance}
    aria-label={dialogue.complete ? "继续对白" : "显示完整对白"}>
    {dialogue.speaker && <small>{dialogue.speaker}</small>}
    <span className={styles.dialogueText} aria-hidden="true"><span className={styles.reserve}>{dialogue.fullText}</span><span className={styles.typed}>{dialogue.text}</span></span>
    <span className={styles.dialogueHint}>{dialogue.complete ? dialogue.canAdvance ? "继续  ▸" : "稍候" : "轻触显示整句"}</span>
    <span className={styles.srOnly} role="status">{dialogue.complete ? `${dialogue.speaker} ${dialogue.fullText}` : ""}</span>
  </button>;
}
