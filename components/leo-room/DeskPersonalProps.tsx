"use client";

import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function labelTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 768; canvas.height = 256;
  const c = canvas.getContext("2d")!;
  c.fillStyle = "#f5f6eb"; c.fillRect(0, 0, 768, 256);
  c.fillStyle = "#096ba8"; c.fillRect(0, 0, 768, 143);
  c.fillStyle = "#24834c"; c.fillRect(0, 0, 768, 13);
  c.beginPath(); c.moveTo(0, 115); c.bezierCurveTo(230, 167, 540, 91, 768, 121); c.lineTo(768, 166); c.bezierCurveTo(530, 127, 230, 193, 0, 160); c.fill();
  c.fillStyle = "#f6f9ed";
  c.beginPath(); c.ellipse(384, 66, 26, 5, 0, 0, Math.PI * 2); c.ellipse(380, 62, 12, 7, 0, 0, Math.PI * 2); c.fill();
  c.fillStyle = "#123829"; c.textAlign = "center";
  c.font = 'bold 54px "Microsoft YaHei", sans-serif'; c.fillText("润田", 384, 206);
  c.font = '17px "Microsoft YaHei", sans-serif'; c.fillText("饮用纯净水", 384, 238);
  c.fillStyle = "#d8efe5"; c.font = "12px Arial"; c.fillText("RUNTIAN", 384, 105);
  // Side/back information stays subordinate; no invented barcode or capacity claim.
  c.fillStyle = "#68766c";
  for (let y = 188; y < 230; y += 9) { c.fillRect(72, y, 105, 2); c.fillRect(588, y, 105, 2); }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace; texture.anisotropy = 4;
  return texture;
}

/** Reuses the source GLB's cap and ribs. Replaces its low water line, symbolic
 * block lettering and plain shell with a reference-shaped PET bottle in metres. */
export function RuntianReferenceModel({ url, height, diameter }: { url: string; height: number; diameter: number }) {
  const { scene } = useGLTF(url);
  const asset = useMemo(() => {
    const group = new THREE.Group();
    const geometries: THREE.BufferGeometry[] = [];
    const texture = labelTexture();
    // Alpha blending avoids a full-scene transmission pass / extra render target.
    const pet = new THREE.MeshPhysicalMaterial({ color: "#d6e7eb", metalness: 0, roughness: .17, clearcoat: .55, clearcoatRoughness: .16, transparent: true, opacity: .12, depthWrite: false, side: THREE.FrontSide });
    const water = new THREE.MeshPhysicalMaterial({ color: "#91bdc8", metalness: 0, roughness: .11, transparent: true, opacity: .085, depthWrite: false, clearcoat: .3 });
    const cap = new THREE.MeshStandardMaterial({ color: "#08783e", roughness: .48, metalness: 0 });
    const label = new THREE.MeshStandardMaterial({ map: texture, roughness: .57, metalness: 0 });
    const add = (geometry: THREE.BufferGeometry, material: THREE.Material, name: string, shadow = false) => {
      geometries.push(geometry); const mesh = new THREE.Mesh(geometry, material);
      mesh.name = name; mesh.castShadow = shadow; mesh.receiveShadow = true; group.add(mesh); return mesh;
    };
    const profile: number[][] = [[0,.005],[.014,.005],[.025,0],[.030,.003],[.032,.010]];
    // Shallow continuous moulded ribs; no pile of disconnected torus rings.
    for (let y = .014; y <= .090; y += .011) profile.push([.0325,y],[.0324,y+.004],[.0307,y+.006],[.0322,y+.008]);
    profile.push([.0325,.098],[.0325,.148],[.032,.155],[.0305,.168],[.026,.181],[.020,.191],[.014,.199],[.014,.204]);
    const shell = new THREE.LatheGeometry(profile.map(([x,y]) => new THREE.Vector2(x,y)), 48);
    const position = shell.attributes.position;
    // Five moulded feet make the PET base sit on the surface, with a raised punt.
    for (let i=0; i<position.count; i++) if (position.getY(i) < .01 && Math.hypot(position.getX(i),position.getZ(i)) > .02) {
      const theta=Math.atan2(position.getX(i),position.getZ(i));
      position.setY(i,position.getY(i) + .0018 * (1-Math.cos(theta*5)));
    }
    shell.computeVertexNormals(); add(shell, pet, "PET moulded shell");
    add(new THREE.LatheGeometry([[0,.008],[.024,.008],[.030,.014],[.030,.147],[.029,.164],[.025,.177],[.021,.186],[0,.186]].map(([x,y]) => new THREE.Vector2(x,y)), 32),water,"Water and meniscus");
    const capParts: THREE.BufferGeometry[] = [];
    scene.updateWorldMatrix(true,true);
    scene.traverse(object => {
      if (!(object instanceof THREE.Mesh) || !object.name.startsWith("Cap_")) return;
      const geometry = object.geometry.clone().applyMatrix4(object.matrixWorld);
      capParts.push(geometry);
    });
    const combined = mergeGeometries(capParts);
    capParts.forEach(g => g.dispose());
    if (combined) add(combined,cap,"Original GLB cap and grip ribs",true);
    const capTop = add(new THREE.CylinderGeometry(.0155,.0155,.001,32),cap,"Closed cap top",true);
    capTop.position.y=.2175;
    const band = add(new THREE.CylinderGeometry(.0328,.0328,.048,48,1,true),label,"Curved printed label",true);
    band.position.y=.122; band.rotation.y=Math.PI;
    const seal=add(new THREE.CylinderGeometry(.0147,.0147,.003,32),cap,"Tamper ring",true);seal.position.y=.200;
    group.scale.set(diameter/.0656,height/.218,diameter/.0656);
    return { group, dispose: () => { geometries.forEach(g=>g.dispose()); [pet,water,cap,label].forEach(m=>m.dispose()); texture.dispose(); } };
  }, [scene, height, diameter]);
  useEffect(() => () => asset.dispose(), [asset]);
  return <primitive object={asset.group} dispose={null} />;
}

/** Small radial contact falloff, never a rectangular image plane or click target. */
export function PropContact({ radius, opacity }: { radius: number; opacity: number }) {
  const geometry = useMemo(() => {
    const vertices:number[]=[], colors:number[]=[], indices:number[]=[];
    for(let ring=0;ring<3;ring++)for(let i=0;i<=32;i++){
      const t=i/32*Math.PI*2, r=radius*[0,.55,1.3][ring];
      vertices.push(Math.cos(t)*r,0,Math.sin(t)*r); colors.push(0,0,0,[opacity,opacity*.5,0][ring]);
    }
    for(let ring=0;ring<2;ring++)for(let i=0;i<32;i++){const a=ring*33+i;indices.push(a,a+1,a+33,a+1,a+34,a+33);}
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));g.setAttribute("color",new THREE.Float32BufferAttribute(colors,4));g.setIndex(indices);return g;
  },[radius,opacity]);
  useEffect(()=>()=>geometry.dispose(),[geometry]);
  return <mesh geometry={geometry} position={[0,.00025,0]} raycast={() => {}}><meshBasicMaterial vertexColors transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} side={THREE.DoubleSide} /></mesh>;
}

/** A small heart-holding PVC Stitch, modelled from the supplied first reference.
 * Static shapes are merged by material: seven draw calls, no downloaded textures. */
export function StitchFigurine() {
  const asset=useMemo(()=>{
    const group=new THREE.Group();
    const palette=["#497eab","#99c8dc","#cb839f","#15232f","#243f61","#e9e5dd","#7199b4"];
    const parts:THREE.BufferGeometry[][]=palette.map(()=>[]);
    const sphere=new THREE.SphereGeometry(1,18,12);
    const put=(g:THREE.BufferGeometry,mat:number,p:number[],s:number[]=[1,1,1],r:number[]=[0,0,0])=>{
      const matrix=new THREE.Matrix4().compose(new THREE.Vector3(...p as [number,number,number]),new THREE.Quaternion().setFromEuler(new THREE.Euler(...r as [number,number,number])),new THREE.Vector3(...s as [number,number,number]));
      const copy = (g.index ? g.toNonIndexed() : g.clone()).applyMatrix4(matrix);
      if (s[0] * s[1] * s[2] < 0) {
        for (const attribute of Object.values(copy.attributes)) {
          const a = attribute as THREE.BufferAttribute;
          for (let vertex = 0; vertex < a.count; vertex += 3) for (let component = 0; component < a.itemSize; component++) {
            const first = (vertex + 1) * a.itemSize + component, second = (vertex + 2) * a.itemSize + component;
            const value = a.array[first]; a.array[first] = a.array[second]; a.array[second] = value;
          }
        }
      }
      parts[mat].push(copy);
    };
    const oval=(m:number,p:number[],s:number[],r?:number[])=>put(sphere,m,p,s,r);
    oval(0,[0,.043,0],[.025,.035,.020]); oval(1,[0,.042,.017],[.019,.024,.006]);
    oval(0,[0,.087,.003],[.039,.032,.028]);
    oval(1,[0,.073,.024],[.030,.012,.012]);
    for(const side of [-1,1]){
      oval(0,[side*.018,.010,.008],[.015,.010,.023]);
      oval(0,[side*.027,.045,.022],[.010,.017,.010],[0,0,side*.75]);
      oval(1,[side*.020,.094,.023],[.017,.022,.008],[0,0,-side*.25]);
      oval(3,[side*.021,.096,.029],[.0115,.016,.0055],[0,0,-side*.25]);
      oval(5,[side*.019,.105,.0338],[.0033,.004,.0016]);
      for(let j=0;j<3;j++)oval(6,[side*.018+(j-1)*.006,.008,.027],[.0024,.003,.004]);
      const ear=new THREE.Shape(); ear.moveTo(0,0);ear.bezierCurveTo(.019,.003,.035,.03,.025,.061);ear.quadraticCurveTo(.016,.060,.006,.045);ear.lineTo(.010,.038);ear.lineTo(.003,.036);ear.quadraticCurveTo(-.008,.022,0,0);
      const outer=new THREE.ExtrudeGeometry(ear,{depth:.004,bevelEnabled:true,bevelThickness:.0018,bevelSize:.0018,bevelSegments:2,curveSegments:7,steps:1});
      put(outer,0,[side*.027,.082,-.003],[side,1,1],[0,0,-side*.42]);
      put(outer,2,[side*.029,.086,.002],[side*.72,.82,.4],[0,0,-side*.42]);outer.dispose();
    }
    oval(4,[0,.085,.032],[.014,.011,.010]);
    const smile=new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-.018,.073,.032),new THREE.Vector3(0,.068,.035),new THREE.Vector3(.018,.073,.032)]),12,.0009,5,false);put(smile,4,[0,0,0]);smile.dispose();
    const heart=new THREE.Shape();heart.moveTo(0,-.020);heart.bezierCurveTo(-.026,-.002,-.023,.016,-.011,.016);heart.quadraticCurveTo(-.004,.019,0,.010);heart.quadraticCurveTo(.011,.023,.021,.010);heart.bezierCurveTo(.029,-.003,.008,-.015,0,-.020);
    const heartGeo=new THREE.ExtrudeGeometry(heart,{depth:.006,bevelEnabled:true,bevelThickness:.002,bevelSize:.0015,bevelSegments:2,curveSegments:8,steps:1});put(heartGeo,2,[0,.041,.026],[.78,.78,1],[0,0,-.12]);heartGeo.dispose();
    for(const side of [-1,1])oval(0,[side*.016,.042,.035],[.009,.008,.006]);
    oval(0,[0,.116,-.006],[.004,.009,.005],[0,0,-.2]);oval(0,[.008,.114,-.006],[.003,.007,.005],[0,0,-.35]);
    sphere.dispose();
    const geometries:THREE.BufferGeometry[]=[],materials:THREE.Material[]=[];
    parts.forEach((list,i)=>{if(!list.length)return;const geometry=mergeGeometries(list)!;list.forEach(g=>g.dispose());const material=new THREE.MeshStandardMaterial({color:palette[i],roughness:i===3?.24:.61,metalness:0});const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);geometries.push(geometry);materials.push(material);});
    const bounds=new THREE.Box3().setFromObject(group);const scale=.13/(bounds.max.y-bounds.min.y);group.scale.setScalar(scale);group.position.y=-bounds.min.y*scale;
    return {group,dispose:()=>{geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
  },[]);
  useEffect(()=>()=>asset.dispose(),[asset]);
  return <primitive object={asset.group} dispose={null} />;
}
