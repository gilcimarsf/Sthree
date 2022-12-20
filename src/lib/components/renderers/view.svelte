<script lang="ts">
import type { Script } from 'svelte/types/compiler/interfaces';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupScenes } from "../../utils/context.js";
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';
import { Camera } from 'three';


let sceneElement :HTMLElement;
//export let position;
//export let index; 
//export let track ;

const scene = new THREE.Scene();
const { self, contextCanvas } = setupScenes(scene);  

function init () {
if (self && contextCanvas.renderer) {
    self.userData.element = sceneElement;
    //camera
    const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
    camera.position.z = 2;
    self.userData.camera = camera;
    //Control
    const controls = new OrbitControls( self.userData.camera, self.userData.element );
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.enablePan = false;
    controls.enableZoom = false;
    self.userData.controls = controls;
    
    //mesh
    const material = new THREE.MeshStandardMaterial( {
    color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
    roughness: 0.5,
    metalness: 0,
    flatShading: true
    });
    const geometry =  new THREE.SphereGeometry( 1, 1, 1 );
    self.add( new THREE.Mesh( geometry, material ) );
    //light
    self.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 1, 1, 1 );
    self.add( light );
    
    /*
    */
    }
    
}

$: {    
}

onMount(() => {  
    init ();
});


</script>
<div class="sceneElement" bind:this={sceneElement}>
<slot>
</slot>
</div>

<style>
	.sceneElement {
		content: '';
		position: fixed;
		width: 40%;
		height: 40%;
		top: 0;
	}
</style>