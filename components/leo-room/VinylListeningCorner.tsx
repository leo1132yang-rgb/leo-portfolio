"use client";
import { vinylTracks } from '@/data/vinylTracks';
import { useGlobalAudio } from '@/hooks/useGlobalAudio';
import { useLanguage } from '@/components/LanguageProvider';
import styles from './VinylListeningCorner.module.css';
const time=(n:number)=>`${Math.floor(n/60).toString().padStart(2,'0')}:${Math.floor(n%60).toString().padStart(2,'0')}`;
export function VinylListeningCorner({onClose}:{onClose:()=>void}){
 const audio=useGlobalAudio(),{language}=useLanguage(),cn=language==='cn';
 const status=audio.vinylStatus==='error'?(cn?'暂时无法播放':'Unavailable'):audio.vinylStatus==='blocked'?(cn?'点击播放继续':'Press play to listen'):!audio.isEnabled?(cn?'声音已关闭':'SOUND OFF'):audio.vinylIsPlaying?(cn?'正在播放':'NOW PLAYING'):audio.vinylStatus==='loading'?(cn?'载入中':'LOADING'):(cn?'已暂停':'PAUSED');
 return <aside className={styles.corner} aria-label={cn?'私人黑胶聆听角':'Vinyl listening corner'} onPointerDown={e=>e.stopPropagation()} onClick={e=>e.stopPropagation()}>
  <section className={styles.now} aria-label={cn?'当前歌曲':'Current track'}>
   <button className={styles.close} onClick={onClose} aria-label={cn?'收起歌单':'Close playlist'}>×</button>
   <small aria-live="polite">{status}</small><strong>{audio.vinylTrack.title}</strong><span>{audio.vinylTrack.artist}</span>
   <div className={styles.transport}><button onClick={audio.toggleVinyl} aria-label={audio.vinylWantsPlay?(cn?'暂停':'Pause'):(cn?'播放':'Play')}>{audio.vinylWantsPlay?'Ⅱ':'▷'} <span>{audio.vinylWantsPlay?(cn?'暂停':'Pause'):(cn?'播放':'Play')}</span></button><time>{time(audio.vinylTime)} / {time(audio.vinylDuration)}</time></div>
   <input aria-label={cn?'播放进度':'Playback position'} type="range" min={0} max={audio.vinylDuration||1} step={.1} value={Math.min(audio.vinylTime,audio.vinylDuration||1)} disabled={!audio.vinylDuration} onChange={e=>audio.seekVinyl(Number(e.currentTarget.value))}/>
  </section>
  <section className={styles.favorites} aria-label={cn?'我喜欢的歌':'Favorite tracks'}>
   <h2>{cn?'我喜欢的歌':'FAVORITE TRACKS'}<span>01—07</span></h2>
   <ol>{vinylTracks.map((track,i)=><li key={track.id}><button onClick={()=>audio.selectVinyl(track.id)} aria-label={`${track.title} / ${track.artist}`} aria-current={track.id===audio.vinylTrack.id?'true':undefined}>
    <small>{String(i+1).padStart(2,'0')}</small><span><b>{track.title}</b><em>{track.artist}{audio.vinylErrors[track.id]?(cn?' · 暂时无法播放':' · Unavailable'):''}</em></span><i aria-hidden="true">{track.id===audio.vinylTrack.id?(audio.vinylIsPlaying?'•':'—'):''}</i>
   </button></li>)}</ol>
  </section>
 </aside>;
}
