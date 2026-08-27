"use client";

import { useState } from "react";
import { audioTracks } from "@/components/audio/GlobalAudioProvider";
import { useLanguage } from "@/components/LanguageProvider";
import { useGlobalAudio } from "@/hooks/useGlobalAudio";

export function SoundToggle() {
  const { language } = useLanguage();
  const { currentTrack, isEnabled, isPlaying, toggleAudio, volume, setVolume } = useGlobalAudio();
  const [open, setOpen] = useState(false);
  const cn = language === "cn";
  const buttonLabel = isEnabled ? (cn ? "开启声音" : "SOUND ON") : (cn ? "关闭声音" : "SOUND OFF");
  const statusLabel = isEnabled ? (cn ? "声音已开启" : "Sound On") : (cn ? "声音已关闭" : "Sound Off");
  const volumeLabel = cn ? "音量" : "Volume";

  return (
    <aside
      className={`sound-toggle${open ? " is-open" : ""}${isEnabled ? " is-enabled" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      aria-label="Global sound control"
    >
      <button
        type="button"
        className="sound-toggle__button"
        onClick={() => {
          toggleAudio();
          setOpen(true);
        }}
        aria-pressed={isEnabled}
      >
        <span aria-hidden="true">{isEnabled && isPlaying ? "●" : "○"}</span>
        {buttonLabel}
      </button>

      <div className="sound-toggle__panel" aria-hidden={!open}>
        <div>
          <small>{statusLabel}</small>
          <b>{audioTracks[currentTrack].label}</b>
        </div>
        <label>
          <span>{volumeLabel}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(event) => setVolume(Number(event.currentTarget.value))}
          />
        </label>
      </div>
    </aside>
  );
}
