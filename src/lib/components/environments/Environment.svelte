<script lang="ts"> 

  import * as THREE from 'three';
  import {
    TextureLoader,
    WebGLCubeRenderTarget,
    EquirectangularReflectionMapping,
    CubeTextureLoader,
    Texture,
    Scene,
    Loader,
    CubeCamera,
    HalfFloatType,
    CubeReflectionMapping,
    CubeTexture,
    sRGBEncoding,
    LinearEncoding,
} from 'three' ;

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

  import { get_scenes } from '../../utils/context.js';
  import { onFrame } from '../../utils/lifecycle.js';
  import { onMount } from "svelte";
  import type {Props} from '../../types/enviromentTypes'
  import type {  PresetsType } from '../../utils/environment-assets.js'
  import { presetsObj } from '../../utils/environment-assets.js'
  import { useTexture } from '../../loaders/useLoader.js'
  
  const {contextScenes} = get_scenes ();
  const CUBEMAP_ROOT = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/';
  
  //Environment files="https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/kiara/kiara_1_dawn_1k.hdr"
 /*   
  export let map : THREE.Texture;
  export let background : boolean | 'only' = false;
  export let frames : number = 0;
  export let near : number = 1;
  export let far : number = 1000;
  export let resolution : number = 256;
  export let files : string | string[]  = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'];
  
  export let preset : PresetsType | undefined = undefined;
  export let ground :
     | boolean
    | {
        radius?: number,
        height?: number,
        scale?: number
      } = false;
      
*/      
  export let path: string = '';
  export let encoding : THREE.TextureEncoding | undefined  = undefined;
  export let filess : string;

/*        
function EnvironmentMap({ background = false, map }: Props) {
        if (contextScenes.scene) {
            const target = contextScenes.scene;
            const oldbg = target.background
            const oldenv = target.environment
            
            if (background !== 'only') { contextScenes.scene.environment = map };
            if (background) { contextScenes.scene.background = map };
        }
    }
    
  function useEnvironment( {files = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
  path = '',
  preset = undefined,
  encoding = undefined,
  }: Partial<Props> 
  ){    
        if (preset) {
            if (!(preset in presetsObj)) throw new Error('Preset must be one of: ' + Object.keys(presetsObj).join(', '));
            files = presetsObj[preset];
            path = CUBEMAP_ROOT;
        }
    
    if (Array.isArray(files)) { 
        const loader =  new CubeTextureLoader();
        loader.setPath(path);
        loader.load (files);
        return loader;
    }
    else {
        const texture = new TextureLoader().load( files );
        texture.mapping =EquirectangularReflectionMapping;
        texture.encoding = encoding ? sRGBEncoding :LinearEncoding;
        return texture;
    }
  }
    
    
    export function EnvironmentCube({ background = false, ...rest }: Props) {
        const texture = useEnvironment(rest);
        const target = contextScenes.scene;
        const oldbg = target.background
        const oldenv = target.environment
        if (texture instanceof Texture ) {
          if (background !== 'only') { target.environment = texture }
          if (background) target.background = texture
        }
        return () => {
        if (background !== 'only') target.environment = oldenv
        if (background) target.background = oldbg
        }
    }
    export function EnvironmentPortal({
    near = 1,
    far = 1000,
    resolution = 256,
    frames = 1,
    map,
    background = false,
    scene,
    files,
    path,
    preset = undefined,
    extensions,
    }: Props) {
      const defaultScene = contextScenes.scene;
      const camera = contextScenes.camera;
      const virtualScene = new Scene();
      const fbo = new WebGLCubeRenderTarget(resolution);
      fbo.texture.type = HalfFloatType;
      
      //if (frames === 1) camera.current.update(gl, virtualScene)
      const target = contextScenes.scene;
      const oldbg = target.background;
      const oldenv = target.environment;
      
      if (background !== 'only') { target.environment = fbo.texture };
      if (background) {target.background = fbo.texture};
      return () => {
        if (background !== 'only') target.environment = oldenv
        if (background) target.background = oldbg
      }
    }
    
  */  
    

onFrame(() => {
});


 

      
onMount(async() => {  

/*
  {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
    ]);
    contextScenes.scene.background = texture;
  }
*/
   
    new RGBELoader()
      .setPath( path )
      .load(filess ,   function ( texture ) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      contextScenes.scene.background = texture;
      contextScenes.scene.environment = texture;
      contextScenes.invalidate();
      })
    
    
      
   /*
{ //Criar Objeto de Destino do Renderizador de Cubo 
let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, { 
format: THREE.RGBAFormat, 
generateMipmaps: true, 
minFilter: THREE.LinearMipmapLinearFilter 
}) 


  //Criar Câmera de Cubo 
  let cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget) 
  contextScenes.scene.add(cubeCamera)
     
  const dynamicEnvMapMaterial = new THREE.MeshPhongMaterial({ 
    envMap: cubeRenderTarget.texture 
  }) 
  
  const sphereGeometry = new THREE.SphereGeometry(1, 1, 1);
     
  let sphere = new THREE.Mesh(sphereGeometry , dynamicEnvMapMaterial) 
  contextScenes.scene.add(sphere);
     
  function update (){
    if (contextScenes.renderer) {
      cubeCamera.update (contextScenes.renderer,contextScenes.scene) ;
      console.log("Leru, Leru");
    } 
  }
  
  */
 
});
    
$: {

}
    
    
    </script>
    