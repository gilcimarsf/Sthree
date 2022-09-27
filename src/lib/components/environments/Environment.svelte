<script lang="ts">
  import * as THREE from "three";
  import type {
   Texture,
  } from "three";

  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

  import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";

  import { get_scenes } from "../../utils/context.js";
  import { onFrame } from "../../utils/lifecycle.js";
  import { onMount } from "svelte";
  import type { Props } from "../../types/enviromentTypes";
  import type { PresetsType } from "../../utils/environment-assets.js";
  import { presetsObj } from "../../utils/environment-assets.js";
  import { GroundProjectedEnv  } from 'three/examples/jsm/objects/GroundProjectedEnv'


  import { useTexture } from "../../loaders/useLoader.js";
 

  const { contextScenes } = get_scenes();
  const CUBEMAP_ROOT ="https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/";

  export let background: boolean | "only"  = false;
  //export let map: Texture | null = null;
  export let path: string = "";
  //export let encoding: TextureEncoding | null = null;
  export let files: string | string [] = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'];
  export let preset : PresetsType | null = null;
  export let ground :
     | boolean
    | {
        radius?: number,
        height?: number,
        scale?: number
      } = false;
      
  onMount(async () => {
    
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
      contextScenes.scene.background = texture;
      
      if (background == 'only') {  contextScenes.scene.background = texture; }
      else {
        contextScenes.scene.background = texture;
        contextScenes.scene.environment = texture;
      }
      contextScenes.invalidate();
      })      
    }
    
    function EnvironmentCube ( path : string  , files : string[]){
      
    const loader = new THREE.CubeTextureLoader();
    loader.setPath(path);
    const texture = loader.load(files);
    if (background == 'only') {  contextScenes.scene.background = texture; }
      else {
        contextScenes.scene.background = texture;
        contextScenes.scene.environment = texture;
    }
    contextScenes.invalidate();    
    }  
    
    async function EnvironmentGround (){
      console.log ("e nois ground");
      
      const hdrLoader = new RGBELoader();
      //path = 'https://aito.auto/content/dam/aito/cn/model/m5/360-view-0415/files/assets/70321151/1/bg_1.jpg?t=ca07b363fd5dccd109d0f7e8f7400dcb';
      //path = 'textures/equirectangular/royal_esplanade_1k.hdr'
      files ='';
      if (!Array.isArray(files)) { 
        const envMap = await useloadHDR (path , files);
        const env = new GroundProjectedEnv( envMap );
        env.scale.setScalar( 100 );
        contextScenes.scene.add(env);       
      }
    }
    
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
  

  //Environment files="https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/kiara/kiara_1_dawn_1k.hdr"
  /*   
  
  
  export let frames : number = 0;
  export let near : number = 1;
  export let far : number = 1000;
  export let resolution : number = 256;
  export let files : string | string[]  = ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'];
  
  export let preset : PresetsType | undefined = undefined;

      
*/

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

  onFrame(() => {});

  //onMount(async() => {
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
    contextScenes.invalidate();
  }
*/

  /*{  
    new RGBELoader()
      .setPath( path )
      .load(filess ,   function ( texture ) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      contextScenes.scene.background = texture;
      contextScenes.scene.environment = texture;
      contextScenes.invalidate();
      })
    
    }*/

  /*{  
 //Criar Objeto de Destino do Renderizador de Cubo 
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
  
  const sphereGeometry = new THREE.SphereGeometry(10, 10, 10);
     
  let sphere = new THREE.Mesh(sphereGeometry , dynamicEnvMapMaterial) 
  contextScenes.scene.add(sphere);
     
   
  contextScenes.addBeforeRender (()=> {cubeCamera.update (contextScenes.renderer,contextScenes.scene)});
}*/

  $: {
  }
</script>

