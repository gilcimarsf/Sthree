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
  import Base_Splits from '$lib/Base/base_raycaster_sprite.svelte';
  import Sprite from '$lib/components/Objects/sprite.svelte';
  import Group from '$lib/components/Objects/Group.svelte';
   
    
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
    document.body.style.cursor = 'pointer';
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

<Base_Splits/>

    <St.Canvas frameloop = {'always'}>	
        <St.PerspectiveCamera/>
        <St.OrbitControls/>
        <St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
        <St.Sprite isInterative = {true} on:click={exemplo} position = {[1,0,-30]}/>
        <St.DirectionalLight/>        
    </St.Canvas>

group = {myGroup}
   */     
   
    </script>
    

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

    
    <style>
    </style>