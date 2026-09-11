"use client";
import {useGLTF} from '@react-three/drei';
import {useMemo} from 'react';
import * as THREE from 'three';

/** Blender geometry is fitted to the existing Room dimensions at authoring time. */
export function RoomFurnitureAsset({url}:{url:string}){
 const {scene}=useGLTF(url);
 const instance=useMemo(()=>{
  const copy=scene.clone(true);
  copy.traverse(object=>{
   if(!(object instanceof THREE.Mesh))return;
   const materials=Array.isArray(object.material)?object.material:[object.material];
   object.castShadow=!materials.some(m=>m.transparent);object.receiveShadow=true;
   for(const material of materials){
    if(material instanceof THREE.MeshStandardMaterial&&material.map)material.map.anisotropy=8;
    if(material.transparent)material.depthWrite=false;
   }
  });
  return copy;
 },[scene]);
 return <primitive object={instance} dispose={null}/>;
}
