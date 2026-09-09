import * as THREE from 'three/webgpu';
import { Cars, cars } from './Cars.js';
import { leo } from '../data/leo.js';
import { InteractivePoints } from '../Game/InteractivePoints.js';
import { localizeWorldLabels } from './worldLabels.js';

const locations=[['landing','出发营地','把创意落地，让系统运转。'],['career','成长之路','从江西鹰潭的摄影学习，到品牌、内容与系统建设。'],['projects','作品工坊','开车来看看真实项目：平台、品牌、设计与影像。'],['lab','光影档案','取自 Leo 照片墙的真实照片与旅行记忆。'],['social','联络广场','认识之后，也许可以一起做一点有意思的事。'],['circuit','山地赛道','踩下加速，穿越检查点，刷新本机纪录。'],['bowling','山谷保龄球','用汽车打保龄球？当然可以。'],['cookie','饼干小屋','碰一碰、推一推，看看这里藏了什么。'],['behindTheScene','幕后星空','关于这个世界和它的开源来处。'],['timeMachine','记忆时光机','读一段童年，重访在路上的坐标。']];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};
const read=(k,fallback)=>{try{return JSON.parse(localStorage.getItem(k))||fallback;}catch{return fallback;}};

export class LeoWorld {
  constructor(game){
    this.game=game;this.cars=new Cars(game);this.visited=new Set(read('leo-world-visited',[]));this.lastUpdate=0;this.activeTab='guide';
    this.home=game.menu.items.get('home').contentElement.querySelector('.content-inner');
    this.hud=document.createElement('div');this.hud.className='leo-hud';
    this.hud.innerHTML=`<header><div class="leo-brand"><span class="leo-mark">L</span><div><small>一份可以驾驶的个人履历</small><b>Leo 的开放世界</b></div></div><nav aria-label="世界工具"><a href="/other-side">回到房间 ↗</a><button data-action="garage">车库</button><button data-action="guide">旅行手册</button><button data-action="map">地图</button><button data-action="options">设置</button></nav></header><aside class="leo-trip"><small>今日路线 · 自由探索</small><b data-location>出发营地</b><p data-location-note>把创意落地，让系统运转。</p><button data-action="missions">探索护照 <span data-progress>0 / 10</span> ↗</button></aside><footer><span><kbd>W A S D</kbd> 驾驶　<kbd>⇧</kbd> 加速　<kbd>空格</kbd> 跳跃　<kbd>回车</kbd> 互动</span><div><b data-speed>0</b><small> 千米/时</small><em data-car>电光 · 旅行版</em></div></footer>`;
    document.body.append(this.hud);
    this.hud.addEventListener('click',e=>{const action=e.target.closest('[data-action]')?.dataset.action;if(!action)return;if(action==='map')game.modals.open('map');else if(action==='options')game.menu.open('options');else this.open(action);});
    this.home.addEventListener('click',e=>{
      const button=e.target.closest('button');if(!button)return;
      if(button.dataset.tab)this.render(button.dataset.tab);
      if(button.dataset.car){this.cars.choose(button.dataset.car);this.render('garage');this.hud.querySelector('[data-car]').textContent=cars.find(c=>c.id===this.cars.id).name;}
      if(button.dataset.go){game.menu.close();game.player.respawn(button.dataset.go,()=>{game.view.focusPoint.isTracking=true;});}
      if(button.dataset.photo){const p=leo.photos.find(p=>p.id===button.dataset.photo);this.home.querySelector('.leo-page').innerHTML=`<button data-tab="photos">← 返回光影档案</button><h2>${esc(p.title)}</h2><img class="leo-photo-large" src="${esc(p.previewSrc||p.src)}" alt="${esc(p.title)}"><p>${esc(p.caption)}</p><small>${esc(p.date)} · ${esc(p.location)}</small>`;}
      if(button.dataset.action==='note'){const input=this.home.querySelector('textarea');save('leo-world-note',input.value);game.achievements.setProgress('whisper',1);button.textContent='已保存在这台设备';}
    });
    game.menu.items.get('home').events.on('open',()=>this.render(this.activeTab));
    this.render('guide');this.setSigns();this.setCareer();this.setLocalRace();localizeWorldLabels(game);
    game.ticker.events.on('tick',()=>this.update(),15);
    document.body.dataset.leoReady='true';document.querySelector('.leo-loading')?.remove();
    window.addEventListener('keydown',e=>{if(e.code==='KeyG'&&!/INPUT|TEXTAREA/.test(e.target.tagName)&&!game.inputs.filters.has('intro')){e.preventDefault();this.open('garage');}});
  }
  open(tab){this.activeTab=tab;this.game.world.areas.projects.close();this.game.world.areas.lab.close();this.game.menu.open('home');this.render(tab);}
  render(tab){this.activeTab=tab;
    const tabs=[['guide','出发指南'],['career','我的履历'],['projects','作品'],['photos','光影档案'],['memories','记忆'],['garage','车库'],['missions','探索护照']];
    this.home.innerHTML=`<div class="leo-tabs">${tabs.map(([id,label])=>`<button data-tab="${id}" aria-pressed="${tab===id}">${label}</button>`).join('')}</div><div class="leo-page"></div>`;
    const page=this.home.querySelector('.leo-page');
    if(tab==='guide')page.innerHTML=`<small>你好，我是李阳 / Leo</small><h1>路走远一点，<br>世界就大一点。</h1><p>从摄影和故事出发，走进品牌现场，再把经验变成团队可以使用的系统。这里是我的个人网站，也是你可以随意绕路的小世界。</p><div class="leo-stats"><span><b>500 人</b>企业微信后台架构</span><span><b>${leo.photos.length} 张</b>真实照片与记忆</span><span><b>3 辆</b>不同风格的汽车</span></div><h3>先试着开一圈</h3><p>方向键或 WASD 驾驶，Shift 加速，空格跳跃，B 刹车，R 脱困。拖动鼠标观察世界。手机用单指驾驶、双指调整视角。</p><p>可以参加计时赛、玩保龄球、撞开箱子、寻找瀑布和收集探索成就。地图上的地点可以快速到达。</p><button data-tab="missions">领取探索护照 →</button><h3>带一句话上路</h3><p>「${esc(leo.brandLanguage[4])}」</p><small>世界引擎和基础场景改编自 Bruno Simon Folio 2025（MIT）。Leo 内容、中文界面和车型适配在此基础上制作。车型为自主搭建的风格化模型。</small>`;
    if(tab==='career')page.innerHTML=`<small>真实资料 / 与个人网站同步</small><h1>观察，表达，<br>连接与创造。</h1><div class="leo-timeline">${leo.experiences.map(x=>`<article><time>${esc(x.date.replace('NOW','至今'))}</time><h3>${esc(x.title.cn)}</h3><p>${esc(x.summary.cn)}</p>${x.items.length?`<ul>${x.items.map(i=>`<li>${esc(i.cn)}</li>`).join('')}</ul>`:''}</article>`).join('')}</div>`;
    if(tab==='projects')page.innerHTML=`<small>真实作品 / 六个方向</small><h1>把想法，开到现场。</h1><div class="leo-cards">${leo.projects.map(p=>`<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer"><img loading="lazy" src="${esc(p.images[0])}" alt="${esc(p.title)}"><h3>${esc(p.title)} ↗</h3></a>`).join('')}</div><h3>能力工具箱</h3><div class="leo-tags">${leo.capabilities.map(c=>`<span>${esc(c)}</span>`).join('')}</div>`;
    if(tab==='photos')page.innerHTML=`<small>旅行、摄影与生活</small><h1>那些认真看过的瞬间。</h1><div class="leo-cards">${leo.photos.map(p=>`<button data-photo="${esc(p.id)}"><img loading="lazy" src="${esc(p.thumbnailSrc||p.src)}" alt="${esc(p.title)}"><h3>${esc(p.title)}</h3><small>${esc(p.location)}</small></button>`).join('')}</div>`;
    if(tab==='memories')page.innerHTML=`<small>童年与旅行 / 真实记忆</small><h1>从很小的地方，<br>去很大的世界。</h1><h3>白马李家 · 我的童年</h3>${leo.childhoodStories.map(story=>`<details class="leo-memory"><summary>${esc(story.title)} <small>${esc(story.subtitle)}</small></summary><blockquote>${esc(story.quote)}</blockquote>${story.body.filter(b=>b.type==='paragraph').map(b=>`<p>${esc(b.text)}</p>`).join('')}</details>`).join('')}<h3>在路上的坐标</h3>${leo.travelWorldPlaces.map(place=>`<details class="leo-memory"><summary>${esc(place.nameZh)} <small>${esc(place.date)}</small></summary><p>${esc(place.caption)}</p>${place.photoIds.map(id=>leo.photos.find(p=>p.id===id)).filter(Boolean).map(p=>`<button data-photo="${esc(p.id)}"><img loading="lazy" src="${esc(p.thumbnailSrc)}" alt="${esc(p.title)}"></button>`).join('')}</details>`).join('')}<p><a href="/other-side/world" target="_blank" rel="noopener">打开我的旅行地球 ↗</a> · <a href="/other-side">回房间探索童年世界 ↗</a></p>`;
    if(tab==='garage')page.innerHTML=`<small>车库 / G 随时打开</small><h1>今天，开什么出发？</h1><p>三种车身，三种节奏。换车保留当前位置和探索进度。</p><div class="leo-garage">${cars.map((c,i)=>`<button data-car="${c.id}" aria-pressed="${this.cars.id===c.id}"><div class="leo-car-art ${c.id}" style="--paint:${c.color}"><i></i><i></i></div><small>0${i+1} / ${c.tag}</small><h2>${c.name}</h2><p>${c.description}</p><b>${this.cars.id===c.id?'● 当前驾驶':'换这辆出发 →'}</b></button>`).join('')}</div><small>原创风格化车身；电动轿车参考特斯拉的设计语言，无官方品牌授权或联名关系。</small>`;
    if(tab==='missions')page.innerHTML=`<small>不赶路，也有收获</small><h1>你的探索护照</h1><p>到达不同区域，收集旅途印章。进度保存在这台设备。</p><div class="leo-stamps">${locations.map(([id,title,note],i)=>`<button data-go="${id}" class="${this.visited.has(id)?'visited':''}"><small>${this.visited.has(id)?'✓ 已抵达':String(i+1).padStart(2,'0')}</small><h3>${title}</h3><p>${note}</p><b>前往 →</b></button>`).join('')}</div><h3>本机最佳圈速</h3><p>${read('leo-world-best-lap',null)?read('leo-world-best-lap',0).toFixed(2)+' 秒':'完成一场计时赛后记录，不使用模拟排行榜。'}</p><h3>留一张旅途便签</h3><textarea maxlength="300" aria-label="旅途便签" placeholder="此刻想到了什么？">${esc(read('leo-world-note',''))}</textarea><button data-action="note">保存在这台设备</button>`;
  }
  sign(text,position,width=4){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#f8eccf';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#798775';ctx.lineWidth=8;ctx.strokeRect(14,14,996,228);ctx.fillStyle='#283d35';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 92px "Microsoft YaHei", sans-serif';ctx.fillText(text,512,126,950);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,width/4),new THREE.MeshBasicNodeMaterial({map:texture,side:THREE.DoubleSide}));mesh.position.copy(position);mesh.position.y=2.1;mesh.rotation.y=Math.PI/4;const post=new THREE.Mesh(new THREE.CylinderGeometry(.055,.065,2.15,8),new THREE.MeshStandardNodeMaterial({color:'#4e5944',roughness:.9}));post.position.copy(position);post.position.y=1.05;post.castShadow=true;this.game.scene.add(post);this.game.scene.add(mesh);this.signs??=[];this.signs.push(mesh,post);return mesh;}
  setSigns(){
    const areas=this.game.world.areas;
    // The upstream welcome letters spell the original author's name; replace their visuals.
    for(const ref of areas.landing.references.items.get('letters')||[]){const visual=ref.userData.object?.visual?.object3D;if(visual)visual.visible=false;ref.userData.object?.physical?.body.setEnabled(false);}
    for(const [id,label] of locations){const point=this.game.respawns.getByName(id);if(!point)continue;const pos=point.position.clone();pos.z+=3;pos.x-=5;this.sign(label,pos,id==='landing'?4.8:4.2);}
    const career=this.game.respawns.getByName('career').position.clone();career.y=1.2;
    this.game.interactivePoints.create(career,'阅读 Leo 的履历',InteractivePoints.ALIGN_RIGHT,InteractivePoints.STATE_CONCEALED,()=>this.open('career'),()=>this.game.inputs.interactiveButtons.addItems(['interact']),()=>this.game.inputs.interactiveButtons.removeItems(['interact']));
  }
  setCareer(){const career=this.game.world.areas.career;if(!career)return;career.year.start=2015;
    career.lines.items.forEach((line,i)=>{const entry=leo.experiences[Math.min(i,leo.experiences.length-1)];const c=document.createElement('canvas');c.width=2048;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 88px "Microsoft YaHei", sans-serif';ctx.fillText(entry.title.cn,1024,104,1940);ctx.font='46px "Microsoft YaHei", sans-serif';ctx.fillText(entry.date.replace('NOW','至今'),1024,193);const t=new THREE.CanvasTexture(c);t.flipY=false;line.texture.image=c;line.texture.needsUpdate=true;t.dispose();});
  }
  setLocalRace(){const race=this.game.world.areas.circuit;if(!race)return;const modal=this.game.modals.items.get('circuit-end');modal.events.on('open',()=>{const time=race.timer.elapsedTime;if(Number.isFinite(time)&&time>0){const old=read('leo-world-best-lap',Infinity);if(time<old)save('leo-world-best-lap',time);this.game.achievements.setProgress('circuitLeaderboard',1);}});}
  update(){if(this.game.ticker.elapsed-this.lastUpdate<.25)return;this.lastUpdate=this.game.ticker.elapsed;
    for(const sign of this.signs||[])sign.visible=this.game.reveal.step>=1;
    const p=this.game.player.position;let closest=null,best=Infinity;
    for(const loc of locations){const spawn=this.game.respawns.getByName(loc[0]);if(!spawn)continue;const distance=Math.hypot(p.x-spawn.position.x,p.z-spawn.position.z);if(distance<best){best=distance;closest=loc;}if(distance<13&&!this.visited.has(loc[0])){this.visited.add(loc[0]);save('leo-world-visited',[...this.visited]);}}
    if(closest){this.hud.querySelector('[data-location]').textContent=best<25?closest[1]:'在路上';this.hud.querySelector('[data-location-note]').textContent=best<25?closest[2]:'沿着路走，或者试着绕一点远路。';}
    this.hud.querySelector('[data-progress]').textContent=`${this.visited.size} / ${locations.length}`;this.hud.querySelector('[data-speed]').textContent=Math.round(this.game.physicalVehicle.xzSpeed*3.6);document.body.dataset.worldPosition=`${p.x.toFixed(2)},${p.z.toFixed(2)}`;
  }
}
