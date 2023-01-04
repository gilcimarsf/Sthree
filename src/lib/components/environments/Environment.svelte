<script lang="ts">
import * as THREE from "three";
import type {
  Texture,
} from "three";

export let id : string  = "default";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { get_scenes } from "../../utils/context.js";
import { onFrame } from "../../utils/lifecycle.js";
import { onMount } from "svelte";
import type { PresetsType } from "../../utils/environment-assets.js";
import { presetsObj } from "../../utils/environment-assets.js";
import { GroundProjectedEnv  } from 'three/examples/jsm/objects/GroundProjectedEnv'
import CubeCamera from "../Cameras/CubeCamera.svelte";
import type { ElementScene } from '$lib/core/manager.js';

const CUBEMAP_ROOT ="https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/";

const { contextCanvas } = get_scenes();
$: elementScene = contextCanvas.arrayScenes.get(id); 


export let background: boolean | "only"  = false;
//export let map: Texture | null = null;
export let path: string = "";
//export let encoding: TextureEncoding | null = null;
export let files: string | string [] = [];
//['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'];
export let preset : PresetsType | null = null;
export let envMap : THREE.Texture | null = null;
export let ground :
    | boolean
  | {
      radius?: number,
      height?: number,
      scale?: number
    } = false;
      
function init() { 
    
  if (!Array.isArray(files)) { EnvironmentMap (path ,files ); }
  if (Array.isArray(files)) { EnvironmentCube (path ,files ); }
  if (preset) { defaultEnvironment ();}
  if (ground) { EnvironmentGround(); }
    
  function defaultEnvironment (){
    if (preset) {
    if (!(preset in presetsObj)) throw new Error('Preset must be one of: ' + Object.keys(presetsObj).join(', '));
      files = presetsObj[preset];
      path = CUBEMAP_ROOT;
    }
    if (!Array.isArray(files)) { EnvironmentMap (path ,files ); }
    if (Array.isArray(files)) { EnvironmentCube (path ,files ); }
  }
  
    
  function EnvironmentMap (path : string  , files : string ){
    
    new RGBELoader()
    .setPath( path )
    .load(files ,   function ( texture ) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //contextScenes.scene.environment = texture;
    if (elementScene) {
      elementScene.scene.background = texture;
      
      if (background == 'only') {  elementScene.scene.background = texture; }
      else {
        elementScene.scene.background = texture;
        elementScene.scene.environment = texture;
      }
    }
    //contextCanvas.invalidate();
    })      
  }
    
  function EnvironmentCube ( path : string  , files : string[]){
    
    const loader = new THREE.CubeTextureLoader();
  loader.setPath(path);
      const texture = loader.load(files);
    if (elementScene) {
      if (background == 'only') {  elementScene.scene.background = texture; }
      else {
        elementScene.scene.background = texture;
        elementScene.scene.environment = texture;
      }
    }
  //contextCanvas.invalidate();    
  }  
    
  async function EnvironmentGround (){
    const hdrLoader = new RGBELoader();
    //path = 'https://aito.auto/content/dam/aito/cn/model/m5/360-view-0415/files/assets/70321151/1/bg_1.jpg?t=ca07b363fd5dccd109d0f7e8f7400dcb';
    //path = 'textures/equirectangular/royal_esplanade_1k.hdr'
    files ='';
    if (!Array.isArray(files) && elementScene) { 
      const envMap = await useloadHDR (path , files);
      const env = new GroundProjectedEnv( envMap );
      env.scale.setScalar( 100 );
      elementScene.scene.add(env);       
    }
  }
}
onMount(async () => {
  init()
}); 


  
  async function useloadHDR (path : string  , files : string) {
      const hdrLoader = new RGBELoader();
      const envMap = await hdrLoader.loadAsync( path );
      envMap.mapping = THREE.EquirectangularReflectionMapping;
      return envMap ;
    }
    
    
  async function useLoadCube (path : string  , files : string[]){
        const loader = new THREE.CubeTextureLoader();
        loader.setPath(path);
        const texture =await loader.loadAsync(files);
  }
  
</script>

<CubeCamera id ={id} bind:envMap/>
<slot envMap={envMap}/>

