import * as THREE from 'three/webgpu';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const cars=[
  {id:'electric',name:'电光 · 旅行版',tag:'特斯拉风格电动轿车',description:'低重心、轻快加速，适合公路与日常探索。',color:'#f3eadb',force:310,boost:38},
  {id:'rally',name:'山野 · 拉力版',tag:'复古双门越野车',description:'宽轮眉、行李架与辅助灯，去山谷里绕一点远路。',color:'#d97b36',force:345,boost:35},
  {id:'tourer',name:'漫游 · 露营版',tag:'双拼色旅行面包车',description:'慢一点也很好。带上相机，在河边停一会儿。',color:'#6b998c',force:260,boost:30},
];
// Original procedural bodywork, fitted to the upstream raycast vehicle's axle spacing.
// Styling references only; these are not licensed manufacturer models.
export class Cars {
  constructor(game){this.game=game;this.visual=game.world.visualVehicle;this.root=new THREE.Group();this.root.name='LeoVehicle';
    for(const c of [...this.visual.parts.chassis.children])if(!this.visual.wheels.items.some(w=>w.container===c))c.visible=false;
    if(this.visual.antenna)this.visual.antenna.head.visible=false;
    for(const w of this.visual.wheels.items){w.container.traverse(m=>{if(m.isMesh)m.material=new THREE.MeshStandardNodeMaterial({color:m.name.startsWith('wheelPainted')?'#a7b3ad':'#222b2b',roughness:.52,metalness:m.name.startsWith('wheelPainted')?.65:.1});});}
    this.visual.parts.chassis.add(this.root);this.choose(localStorage.getItem('leo-world-car')||'electric');
  }
  choose(id){const spec=cars.find(c=>c.id===id)||cars[0];this.id=spec.id;
    this.root.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});this.root.clear();
    const paint=new THREE.MeshPhysicalNodeMaterial({color:spec.color,roughness:.3,metalness:.28,clearcoat:.8});
    const dark=new THREE.MeshStandardNodeMaterial({color:'#18292e',roughness:.27,metalness:.3});
    const rubber=new THREE.MeshStandardNodeMaterial({color:'#22272a',roughness:.85});
    const silver=new THREE.MeshStandardNodeMaterial({color:'#bfc8c3',roughness:.25,metalness:.8});
    const glass=new THREE.MeshPhysicalNodeMaterial({color:'#253e49',roughness:.12,metalness:.3,clearcoat:1});
    const light=new THREE.MeshBasicNodeMaterial({color:'#fff3d2'}),rear=new THREE.MeshBasicNodeMaterial({color:'#e95632'});
    const box=(size,pos,mat,r=.06)=>{const m=new THREE.Mesh(new RoundedBoxGeometry(...size,2,r),mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;this.root.add(m);return m;};
    const profile=(points,width,mat)=>{const sh=new THREE.Shape();points.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:width,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.05,bevelThickness:.04});g.translate(0,0,-width/2);const m=new THREE.Mesh(g,mat);m.castShadow=true;this.root.add(m);return m;};
    box([2.95,.48,1.58],[0,-.05,0],paint,.16);box([2.8,.14,1.53],[0,-.32,0],rubber);
    if(id==='tourer'){
      box([2.3,.94,1.52],[-.22,.57,0],paint,.18);box([2.2,.13,1.55],[-.23,1.08,0],light,.05);
      box([.045,.55,1.25],[.95,.62,0],glass,.01);
      for(const z of [-.776,.776]){box([1.75,.5,.02],[-.24,.7,z],glass,.05);for(const x of [-.6,.1])box([.045,.58,.025],[x,.7,z],silver,.008);}
      box([1.6,.17,.92],[-.25,1.21,0],dark);box([.75,.21,.7],[-.5,1.36,0],paint);
    }else{
      profile([[-1.18,.18],[-.68,.78],[.32,.85],[1.05,.22]],1.3,glass);
      box([1.0,.09,1.25],[-.19,.86,0],id==='electric'?dark:paint,.04);
      for(const z of [-.67,.67]){box([.07,.63,.055],[-.2,.51,z],paint,.015);box([2.08,.09,.05],[-.1,.22,z],paint,.02);}
      box([.68,.1,1.44],[1.08,.22,0],paint,.06);
      if(id==='rally'){
        box([1.15,.1,1.14],[-.23,1.02,0],rubber);for(const z of [-.49,.49])box([1.35,.06,.05],[-.22,1.14,z],silver);
        box([.67,.27,.8],[-.2,1.22,0],paint);box([.11,.22,1.6],[1.5,-.03,0],rubber);
        for(const z of [-.44,0,.44])box([.08,.18,.22],[1.58,.22,z],light,.07);
      }
    }
    for(const z of [-.57,.57]){box([.07,.12,.39],[1.48,.12,z],light,.03);box([.065,.14,.37],[-1.48,.13,z],rear,.025);box([.28,.1,.16],[.46,.51,z>0?.86:-.86],paint,.04);box([.23,.032,.028],[-.2,.15,z>0?.8:-.8],silver,.006);}
    box([.035,.16,.4],[-1.52,-.1,0],light,.01);
    this.game.physicalVehicle.engineForceAmplitude=spec.force;this.game.physicalVehicle.topSpeedBoost=spec.boost;
    localStorage.setItem('leo-world-car',spec.id);document.body.dataset.vehicle=spec.id;
  }
}
