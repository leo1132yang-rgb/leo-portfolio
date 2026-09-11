"use client";
import type {CSSProperties} from 'react';
import {useGlobalAudio} from '@/hooks/useGlobalAudio';
import {useLanguage} from '@/components/LanguageProvider';
import {vinylTracks} from '@/data/vinylTracks';
import styles from './LoungeMusicPlayer.module.css';

const time=(value:number)=>`${Math.floor(value/60).toString().padStart(2,'0')}:${Math.floor(value%60).toString().padStart(2,'0')}`;

/** A seated view of the existing global transport. No audio element or local playback state. */
export function LoungeMusicPlayer({onStandUp}:{onStandUp:()=>void}){
 const audio=useGlobalAudio(),{language}=useLanguage(),cn=language==='cn';
 const step=(offset:number)=>{const i=vinylTracks.findIndex(t=>t.id===audio.vinylTrack.id);audio.selectVinyl(vinylTracks[(i+offset+vinylTracks.length)%vinylTracks.length].id);};
 const paused=!audio.isEnabled||!audio.vinylWantsPlay||audio.vinylStatus==='blocked'||audio.vinylStatus==='error';
 const play=()=>{if(paused){audio.enableAudio();audio.playVinyl();}else audio.toggleVinyl();};
 const status=audio.vinylStatus==='error'?(cn?'这首歌暂时无法播放，可换一首':'Track unavailable — try another'):!audio.isEnabled?(cn?'点击播放，开启声音':'Press play to enable sound'):audio.vinylStatus==='blocked'?(cn?'点击播放继续':'Press play to continue'):audio.vinylIsPlaying?(cn?'正在播放':'Now playing'):audio.vinylStatus==='loading'?(cn?'正在载入音乐':'Loading music'):(cn?'已暂停':'Paused');
 return <section className={styles.mode} aria-label={cn?'沙发听音乐模式':'Lounge listening mode'} data-lounge-player="true">
  <header className={styles.heading}><span>{cn?'留一点时间，给自己':'A little time to yourself'}</span><h2>{cn?'安静的听听李阳喜欢的音乐':"Take a quiet moment with Li Yang’s favorite music"}</h2><p>{cn?'拖动空白处，坐着看看窗外':'Drag the open space to look around'}</p></header>
  <div className={styles.layout}>
   <section className={styles.playlist} aria-label={cn?'我喜欢的歌':'Favorite tracks'}>
    <h3>{cn?'我的私藏歌单':'Personal collection'} <small>{String(vinylTracks.length).padStart(2,'0')}</small></h3>
    <ol>{vinylTracks.map((track,i)=><li key={track.id}><button onClick={()=>audio.selectVinyl(track.id)} aria-current={track.id===audio.vinylTrack.id?'true':undefined} aria-label={`${track.title} / ${track.artist}`}>
     <small>{String(i+1).padStart(2,'0')}</small><span><b>{track.title}</b><em>{track.artist}</em></span><i aria-hidden="true">{track.id===audio.vinylTrack.id?'•':''}</i>
    </button></li>)}</ol>
   </section>
   <div className={styles.deck} role="img" aria-label={cn?(audio.vinylIsPlaying?'转动中的黑胶唱片':'暂停的黑胶唱片'):(audio.vinylIsPlaying?'Spinning vinyl record':'Paused vinyl record')} data-record-playing={audio.vinylIsPlaying}>
    <div className={styles.platter}><div className={styles.record} style={{animationPlayState:audio.vinylIsPlaying?'running':'paused','--label':audio.vinylTrack.labelColor} as CSSProperties}><div className={styles.label}><span>LEO</span><small>PRIVATE PRESS</small><b>33⅓</b></div></div><i className={styles.spindle}/></div>
    <div className={styles.arm} style={{transform:`rotate(${audio.vinylIsPlaying?24:0}deg)`}}><i/></div><span className={styles.indicator} data-playing={audio.vinylIsPlaying}/><small className={styles.brand}>LEO · SOUND ARCHIVE</small>
   </div>
   <section className={styles.controls} aria-label={cn?'音乐控制':'Playback controls'}>
    <small className={styles.status} aria-live="polite">{status}</small><h3>{audio.vinylTrack.title}</h3><p>{audio.vinylTrack.artist}</p>
    <div className={styles.seek}><input type="range" aria-label={cn?'播放进度':'Playback position'} min={0} max={audio.vinylDuration||1} step={.1} value={Math.min(audio.vinylTime,audio.vinylDuration||1)} disabled={!audio.vinylDuration} onChange={e=>audio.seekVinyl(Number(e.currentTarget.value))}/><div><time>{time(audio.vinylTime)}</time><time>{time(audio.vinylDuration)}</time></div></div>
    <div className={styles.transport}><button onClick={()=>step(-1)} aria-label={cn?'上一首':'Previous track'}>‹</button><button className={styles.play} onClick={play} aria-label={paused?(cn?'播放':'Play'):(cn?'暂停':'Pause')}>{paused?'▷':'Ⅱ'}</button><button onClick={()=>step(1)} aria-label={cn?'下一首':'Next track'}>›</button></div>
    <button className={styles.exit} onClick={onStandUp}>{cn?'起身，返回 Room':'Stand up · Return to Room'} <small>ESC</small></button>
    <small className={styles.note}>{cn?'起身后，音乐仍会陪着你':'The music stays with you when you stand up'}</small>
   </section>
  </div>
 </section>;
}
