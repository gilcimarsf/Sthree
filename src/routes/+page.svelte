<script lang="ts">
    import * as THREE from 'three';
    import * as St from 'sthree-js';
    import {  useGltf, onFrame, useScroll } from 'sthree-js';
    import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import { onMount , afterUpdate } from "svelte";
    //stores
    import { ScrollProps } from '$lib/utils/stores';
    import OrbitControls from '$lib/components/Controls/OrbitControls.svelte';
    
    //componentes testes
  import Base_pos from '$lib/Base/base_pos.svelte';
  import Base_Splits from '$lib/Base/base_Splits2.svelte';
  import Sprite from '$lib/components/Objects/sprite.svelte';
  import Group from '$lib/components/Objects/Group.svelte';
  
   
   //postProcessing   
    import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
    import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
    import { LUTPass} from 'three/examples/jsm/postprocessing/LUTPass.js';
    import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js';
    import { LUT3dlLoader } from 'three/examples/jsm/loaders/LUT3dlLoader.js';
    import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
  import View from '$lib/components/renderers/view.svelte';
  import Boxes from '$lib/components/Objects/boxes.svelte';
   
    //Lut infos
    const width = 512;
    const height = 512;
    const size = width * height;
    //let lutMap = new LUT3dlLoader().load( 'luts/Bourbon 64.CUBE' , function ( result ) { lutMap = result});
    //'Bourbon 64.CUBE'
    const lutTexture = new THREE.DataTexture( new Uint8Array( 4 * size ), width, height );
    const params = {
    lut: lutTexture,
    intensity: 1,
    };
   
   
    let pass : Pass [] = []; 
    pass[1]= new ShaderPass( GammaCorrectionShader );
   // pass[2] =new LUTPass(params);
   
   
   
    
    // maneger stores 
    
    let ScrollControl : any;
    
    
    export let envMap : THREE.Texture | null = null;
    let myBox = new THREE.SphereGeometry();
    let scroll;
    
    let myMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff })
    $: chromeMaterial = new THREE.MeshLambertMaterial( { color: 0x555fff, envMap: envMap } );
    let model = null;
    let gltf  : GLTF = null;
    let mixer = null;
    const clock = new THREE.Clock()
    
    let texture : THREE.Texture;
    let group : THREE.Group;
    
    function exemplo (event : any) {
   console.log ("Clicou");    
    //document.body.style.cursor = 'pointer';
    }
    
    function play (event : any) {
        console.log (gltf.animations)
        if (gltf != null && model != null){
            mixer = new THREE.AnimationMixer( model );
            mixer.clipAction( gltf.animations[1]).play();
        }
    }
    
    $: r1 =0;
    $: r2 =0;
    $: r3 =0;

    
    St.onFrame(() => {
        if (mixer != null) {
            mixer.update(clock.getDelta());
        }
    });
    
    
    
    onMount(async() => {
         gltf = await useGltf ('/models/gltf/Fox.glb');
         model = gltf.scene; 	
        
        // load a texture, set wrap mode to repeat
        texture = new THREE.TextureLoader().load( "textures/kandao3.jpg" );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 4, 4 );
      });
    
        
    function apertar () {
        scroll = useScroll();
        console.log ($ScrollProps)
        
    }
    $: if ($ScrollProps) {
        //console.log ($ScrollProps.range(0/4, 1/4))
        r1 = $ScrollProps.range(0/4, 1/4);
        //console.log (r1);        
    }
    
    let myfyle = [
          'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
          'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
          'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
          'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
          'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
          'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
        ];
   /**
       
    <St.Canvas>	
        <St.ScrollControls> 
            <div>
                <button class="g" on:click={()=> apertar()} > GIL </button>
            </div>
            <St.PerspectiveCamera/>
            <St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
            <St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true} material ={chromeMaterial} position = {[r1,0,0]}/>
            <St.DirectionalLight/>
        </St.ScrollControls>
    </St.Canvas>
    

        .g{
    font-size:1em;
    padding:0.1em;
    color:red;
    height: 200px;  
    width: 300px;  
    }
    
    <Base_Splits/>
    <St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true} material ={chromeMaterial} />
    
    
>



    <St.Canvas frameloop = {'always'}>	
        <St.PerspectiveCamera/>
        <St.OrbitControls/>
        <St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
        <St.Sprite isInterative = {true} on:click={exemplo} position = {[1,0,-30]}/>
        <St.DirectionalLight/>        
    </St.Canvas>

group = {myGroup}


<St.Canvas frameloop = {'always'}>	
        <St.PerspectiveCamera/>
        <St.OrbitControls/>
        <St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
        <St.Group bind:group  position = {[0,0,0]} >
           <St.Sprite isInterative = {true} on:click={exemplo} position = {[1,0,-30]} group= {group} />
           <St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true} material ={chromeMaterial} group= {group} />
        </St.Group>
        <St.DirectionalLight/>  
       
    </St.Canvas>
    
 <Base_pos/>
 
 <Base_Splits/>
 

  
   <St.View>
 </St.View>
 
     <St.Canvas frameloop = {'always'}>	
        <St.EffectComposer addPass={pass}>
        <St.PerspectiveCamera/>   
        <St.OrbitControls/>
        <St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
        <St.Group bind:group  position = {[0,0,0]} >
           <St.Sprite isInterative = {true} on:click={exemplo} position = {[1,0,-30]} group= {group} />
           <St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true} material ={chromeMaterial} group= {group} />
        </St.Group>
        <St.DirectionalLight/>  
         </St.EffectComposer>        
    </St.Canvas>
    
    <St.Canvas frameloop = {'always'}>	
    <St.ScrollControls> 
    <St.View> 
    </St.View>     
    </St.ScrollControls>   
        <St.View id = {'gil'}> 
    </St.View>   
</St.Canvas>
<St.PerspectiveCamera id= {'view1'}/>   
  <St.Boxes id = {'view2'} isInterative = {true} on:click={exemplo}/>
  

    
   */     
   

    </script>
    
<St.Canvas frameloop = {'always'}>	
     <St.View isInterative = {true} id={'view1'} top ={'0%'} left ={'0%'} > 
        <St.Group bind:group  position = {[5,2,0]} id={'view1'} >
        <St.Mesh isInterative = {true} on:click={exemplo} group={group} id= {'view1'} geometry = {myBox}  position = {[1,1,0]} scale ={3}  material ={chromeMaterial}/>
        <St.Mesh isInterative = {true} on:click={exemplo} group={group} id= {'view1'} geometry = {myBox}  position = {[-1,-1,0]} scale ={1} material ={chromeMaterial}/>
        <St.DirectionalLight id={'view1'} />
        </St.Group>
        <St.OrbitControls id= {'view1'}/>
    </St.View> 
    <St.View id = {'view2'} top ={'50%'} left ={'0%'}> 
        <St.PerspectiveCamera id= {'view2'} fov = {25} /> 
        <St.OrbitControls id= {'view2'}/>
        <St.Mesh isInterative = {true} on:click={exemplo} group={group} id= {'view2'} geometry = {myBox}  position = {[-1,-1,0]} scale ={1} material ={chromeMaterial}/>
    </St.View> 
     
</St.Canvas>
    

    
    <style>
    </style>