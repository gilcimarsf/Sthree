import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Object3d } from '../core/objects.js';


let character = null;
let myObject = null;


const loadModels = async (urlModel: any ) => {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(urlModel);
  //console.log (gltf.scene);
  return gltf;
}

export async function Gltf (urlModel : any){
  const model = await loadModels (urlModel);  
  myObject = new Object3d(model.scene);
    return myObject ;
}

//ATUALIZAÇÃO//
export async function useGltf (urlModel : any){
  const gltf = await loadModel (urlModel);  
  return gltf ;
}

//carregamento draco.
const loadModel = async (urlModel: any ) => {
  const dracoLoader = new DRACOLoader();
  const loader = new GLTFLoader()
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.setDecoderConfig({ type: 'js' });
  loader.setDRACOLoader(dracoLoader);
  const gltf = await loader.loadAsync(urlModel);
  return gltf;
}


