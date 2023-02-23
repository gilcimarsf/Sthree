import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Object3d } from '$lib/core/objects';
import { loadingManager } from '$lib/utils/loadingManager.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

let character = null
let myObject = null


const loadModels = async (urlModel: string ) => {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(urlModel);
  //console.log (gltf.scene);
  return gltf;
}

export async function Gltf (urlModel : string){
  const model = await loadModels (urlModel);  
  myObject = new Object3d(model.scene);
    return myObject ;
}

//ATUALIZAÇÃO//
export async function useGltf (urlModel : string){
  const gltf = await loadModel (urlModel);  
  const animations = loadAnimationsFromGLTF (gltf);
  return  {gltf , animations};
}

interface AnimationDictionary {
  [name: string]: THREE.AnimationClip;
}

function loadAnimationsFromGLTF(gltf: GLTF) {
  let animations: THREE.AnimationClip[] = [];
  // Verificar se o GLTF tem animações
  if (gltf.animations && gltf.animations.length) {
  // Para cada animação no GLTF, adicione um AnimationClip ao objeto de animações
    for (let i = 0; i < gltf.animations.length; i++) {
      const animation = gltf.animations[i];
      animations.push(animation);
    }
  }
  return animations;
}

/*
function loadAnimationsFromGLTF(gltf: GLTF) {
  const animations: AnimationDictionary = {};
  // Verificar se o GLTF tem animações
  if (gltf.animations && gltf.animations.length) {
  // Para cada animação no GLTF, adicione um AnimationClip ao objeto de animações
    for (let i = 0; i < gltf.animations.length; i++) {
      const animation = gltf.animations[i];
      animations[animation.name] = animation;
    }
  }
  return animations;
}
*/


//carregamento draco.
const loadModel = async (urlModel: string ) => {
  const manager = loadingManager();
  
  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader(manager)
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  loader.setDRACOLoader(dracoLoader);
  const gltf = await loader.loadAsync(urlModel,LoadProgress );
 
  return gltf;
}




function LoadProgress ( progressEvent ) {
  //console.log("fui totalmente carregado no sistema...." + progressEvent.file );
}

