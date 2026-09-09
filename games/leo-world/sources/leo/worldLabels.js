import * as THREE from 'three/webgpu';

// Replace baked lettering while retaining the upstream boards, transforms and handlers.
function lettering(lines, width, height) {
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=height;
  const ctx=canvas.getContext('2d');ctx.fillStyle='#fff2d3';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.font=`600 ${width}px "Microsoft YaHei", sans-serif`;
  lines.forEach((line,i)=>ctx.fillText(line,512,(i+.5)*height/lines.length,960));
  const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
  return new THREE.MeshBasicNodeMaterial({map,transparent:true,depthWrite:false,side:THREE.DoubleSide});
}
function label(mesh,text){
  const geometry=mesh.geometry.clone(),uv=geometry.getAttribute('uv');
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  for(let i=0;i<uv.count;i++){minX=Math.min(minX,uv.getX(i));maxX=Math.max(maxX,uv.getX(i));minY=Math.min(minY,uv.getY(i));maxY=Math.max(maxY,uv.getY(i));}
  for(let i=0;i<uv.count;i++)uv.setXY(i,(uv.getX(i)-minX)/(maxX-minX),1-(uv.getY(i)-minY)/(maxY-minY));
  mesh.geometry=geometry;mesh.material=lettering([text],190,256);mesh.castShadow=false;mesh.userData.leoTranslated=true;
}
export function localizeWorldLabels(game){
  const projects=game.world.areas.projects;
  for(const [name,item] of Object.entries(projects.attributes.items))item.group.traverse(mesh=>{
    if(mesh.isMesh&&mesh.name.startsWith('refel'))label(mesh,{role:'职责',at:'阶段',with:'协作'}[name]||'关于');
  });
  for(const object of projects.objects.items)object.visual?.object3D.traverse(mesh=>{
    if(mesh.isMesh&&mesh.name.startsWith('refel')&&!mesh.userData.leoTranslated)label(mesh,'创作足迹');
  });
  for(const area of [projects,game.world.areas.lab]){
    for(const [key,lines] of [
      ['labelsMouseKeyboard',['下一项 →','上一项 ←','打开 ↵','返回 Esc']],
      ['labelsGamepadXbox',['切换 ← →','打开 A','返回 B']],
      ['labelsGamepadPlaystation',['切换 ← →','打开 ×','返回 ○']]
    ]){
      const mesh=area.blackBoard[key];mesh.geometry.computeBoundingBox();const box=mesh.geometry.boundingBox;
      const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
      mesh.geometry=new THREE.PlaneGeometry(size.x,size.z).rotateX(-Math.PI/2).translate(center.x,center.y,center.z);
      mesh.material=lettering(lines,108,1024);mesh.castShadow=false;
    }
  }
}
