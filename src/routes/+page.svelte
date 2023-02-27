<script lang="ts">
    import * as THREE from 'three';
    import * as St from 'sthree-js';
    import { onMount , afterUpdate } from "svelte";
    import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
    import {useGltf, useAnimations} from 'sthree-js';
    import { browser } from '$app/environment';
    
    
    let model : THREE.Group | null = null;
    const gltf  : GLTF | null = null;
    let animations : {mixer: THREE.AnimationMixer,names: string[],actions: {[x: string]: THREE.AnimationAction | null}, clips: THREE.AnimationClip[]}
    let promise : {gltf: GLTF; animations: THREE.AnimationClip[]};
    
    
    onMount(async() => {
    	promise = await useGltf ('/models/gltf/Fox.glb');
    	animations = useAnimations (promise.animations , promise.gltf.scene);
    	model = promise.gltf.scene;	
    });
    
    const clock = new THREE.Clock()
    
    function play (event : any) {
       animations.actions["Run"]?.play();
    } 

    St.onFrame(() => {     
    if (animations) {
        animations.mixer.update(clock.getDelta());  
        }    
    });

  
let myBox = new THREE.SphereGeometry();

function exemplo (event : any) {
   console.log ("Clicou");    
}
 
 //
 
</script>


{#if model}
<St.Canvas frameloop = {'always'} isInterative = {true}>	
    <St.PerspectiveCamera/>  
    <St.PointLight position={[0, 3, 6]}/>  
    <St.OrbitControls/>
    <St.Primitive object={model} scale ={0.03} isInterative = {true}  on:click= {play}/>
</St.Canvas>
{/if}  








<style>
</style>