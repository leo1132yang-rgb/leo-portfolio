export type TransportState = { key: string; status: 'idle'|'loading'|'playing'|'paused'|'blocked'|'error'; time: number; duration: number };

/** One media element for the existing global SOUND provider. No Web Audio context. */
export class AudioTransport {
  private key = '';
  private src = '';
  private wanted = false;
  private generation = 0;
  private positions = new Map<string,number>();
  private resumeAt = 0;
  private status: TransportState['status'] = 'idle';
  private handlers: [string, EventListener][] = [];
  constructor(private audio: HTMLAudioElement, private publish: (state:TransportState)=>void, private ended: (key:string)=>void) {
    const on=(type:string,fn:()=>void)=>{this.handlers.push([type,fn]);audio.addEventListener(type,fn);};
    on('loadedmetadata',()=>{if(!this.matches())return; if(this.resumeAt>0)audio.currentTime=Math.min(this.resumeAt,Number.isFinite(audio.duration)?audio.duration:this.resumeAt);this.resumeAt=0;this.emit();});
    on('durationchange',()=>this.emit());
    on('timeupdate',()=>{if(this.matches()){this.positions.set(this.key,audio.currentTime);this.emit();}});
    on('playing',()=>{if(!this.wanted){audio.pause();return;}this.status='playing';this.emit();});
    on('pause',()=>{if(this.status!=='error'&&this.status!=='blocked')this.status='paused';this.emit();});
    on('waiting',()=>{if(this.wanted)this.status='loading';this.emit();});
    on('error',()=>{if(this.matches()){this.status='error';this.emit();console.warn('[Vinyl / SOUND] Cannot play local source:',this.src);}});
    on('ended',()=>{if(!this.wanted||!this.matches())return;this.positions.set(this.key,0);this.status='paused';this.emit();this.ended(this.key);});
  }
  private matches(){return !this.audio.currentSrc || decodeURI(this.audio.currentSrc).endsWith(decodeURI(this.src));}
  private emit(){this.publish({key:this.key,status:this.status,time:this.audio.currentTime||0,duration:Number.isFinite(this.audio.duration)?this.audio.duration:0});}
  configure(key:string,src:string,playing:boolean,volume:number,loop:boolean){
    const changed=key!==this.key || src!==this.src;
    if(changed){
      if(this.key)this.positions.set(this.key,this.audio.currentTime||this.resumeAt);
      ++this.generation;this.wanted=false;this.audio.pause();
      this.key=key;this.src=src;this.resumeAt=this.positions.get(key)??0;
      this.audio.src=src;this.audio.loop=loop;this.audio.load();this.status='paused';
    }
    this.audio.volume=Math.max(0,Math.min(1,volume));
    if(!playing){this.wanted=false;++this.generation;this.audio.pause();if(this.status!=='error')this.status='paused';this.emit();return;}
    if(this.wanted&&!changed&&(this.status==='playing'||this.status==='loading'))return;
    this.wanted=true;const token=++this.generation;this.status='loading';this.emit();
    void this.audio.play().then(()=>{
      if(token!==this.generation)return;
      this.status=this.audio.paused?'paused':'playing';this.emit();
    }).catch((error:unknown)=>{
      if(token!==this.generation)return;
      const name=(error as {name?:string})?.name;
      if(name==='AbortError')return;
      this.status=name==='NotAllowedError'?'blocked':'error';this.emit();
    });
  }
  seek(time:number){if(!Number.isFinite(time))return;const duration=this.audio.duration;this.audio.currentTime=Math.max(0,Math.min(time,Number.isFinite(duration)?duration:time));this.positions.set(this.key,this.audio.currentTime);this.emit();}
  restart(key:string){this.positions.delete(key);if(key===this.key)this.seek(0);}
  dispose(){++this.generation;this.wanted=false;for(const [type,fn] of this.handlers)this.audio.removeEventListener(type,fn);this.handlers=[];this.audio.pause();this.audio.removeAttribute('src');this.audio.load();}
}
