<script lang="ts">
import * as THREE from 'three';
import Canvas from '$lib/components/Canvas.svelte';
import * as St from 'sthree-js';
import {  useGltf, onFrame } from 'sthree-js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onMount } from "svelte";
  import OrbitControls from 'sthree-js/components/Controls/OrbitControls.svelte';

let myBox = new THREE.BoxGeometry();
let myMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff })
let model = null;
let gltf  : GLTF = null;
let mixer = null;
const clock = new THREE.Clock()

function exemplo (event : any) {
myMaterial.color.set(0xff0000);
document.body.style.cursor = 'pointer';
}

function play (event : any) {
	console.log (gltf.animations)
	if (gltf != null && model != null){
		mixer = new THREE.AnimationMixer( model );
		mixer.clipAction( gltf.animations[1]).play();
	}
}
	
St.onFrame(() => {
	if (mixer != null) {
	    mixer.update(clock.getDelta());
	}
});


onMount(async() => {
	 gltf = await useGltf ('/models/gltf/Fox.glb');
	 model = gltf.scene; 	
});

/*
    {#if model}
    <St.Primitive object={model} scale ={.3} on:mouseover ={play} isInterative={true} />
    <St.Mesh geometry = {myBox}  scale ={8} isInterative = {true}/>
    {/if}

*/

$: {
}

</script>

<St.Canvas>
    <St.PerspectiveCamera/>
    <St.OrbitControls/>
	<St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true}/>
	<St.DirectionalLight/>
</St.Canvas>