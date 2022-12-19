<script lang="ts">
import type { Script } from 'svelte/types/compiler/interfaces';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';

let sceneElement :HTMLElement;
//export let position;
//export let index; 
//export let track ;


function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
    camera.position.z = 2;
	scene.userData.camera = camera;
	scene.userData.element = sceneElement;
	const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
    controls.minDistance = 2;
	controls.maxDistance = 5;
	controls.enablePan = false;
	controls.enableZoom = false;
	scene.userData.controls = controls;
	
    const material = new THREE.MeshStandardMaterial( {
    color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
    roughness: 0.5,
    metalness: 0,
    flatShading: true
    });
    const geometry =  new THREE.SphereGeometry( 1, 1, 1 );
    scene.add( new THREE.Mesh( geometry, material ) );
    scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
    
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );
    
    //scenes.push( scene );
}

onMount(() => { 
    init ();
});

</script>
<div class="sceneElement" bind:this={sceneElement}>
<slot>
</slot>
</div>