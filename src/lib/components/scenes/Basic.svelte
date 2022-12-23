<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { ElementScene } from '$lib/core/manager.js';
import type { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type  {Camera, Object3d, ControlCamera} from '$lib/core/objects' 
import * as THREE from 'three';

export let id : string  = "default";
export let cameras : THREE.Camera 
export let composer : EffectComposer;
export let orbitControl : OrbitControls; 
export let renderer : THREE.WebGLRenderer;
export let scene : THREE.Scene; 

let elementeScene = new ElementScene (id)

if (cameras == null)  {
    cameras = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 0.25, 20 );
}


/*
elementeScene.cameras = 
elementeScene.composer = composer; 
elementeScene.id
elementeScene.orbitControl
elementeScene.renderer
elementeScene.scene
*/

onMount(() => {  
    //init ();
});
</script>