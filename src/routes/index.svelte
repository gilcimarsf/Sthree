<script lang="ts">
import * as THREE from 'three';
import Canvas from '$lib/components/Canvas.svelte';
import * as St from 'sthree-js';
import {  useGltf, onFrame } from 'sthree-js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onMount } from "svelte";
  import OrbitControls from 'sthree-js/components/Controls/OrbitControls.svelte';
  import Environment from 'sthree-js/components/environments/Environment.svelte';
  import CubeCamera from 'sthree-js/components/Cameras/CubeCamera.svelte';

export let envMap : THREE.Texture | null = null;
let myBox = new THREE.SphereGeometry();

let myMaterial = new THREE.MeshStandardMaterial({ color: 0xfffff })
$: chromeMaterial = new THREE.MeshLambertMaterial( { color: 0x555fff, envMap: envMap } );
let model = null;
let gltf  : GLTF = null;
let mixer = null;
const clock = new THREE.Clock()

let texture : THREE.Texture;

function exemplo (event : any) {
myMaterial.color.set(0xff0000);
myMaterial.metalness = .1;


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
	
	// load a texture, set wrap mode to repeat
	texture = new THREE.TextureLoader().load( "textures/kandao3.jpg" );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 4, 4 );
	
});

/*
    {#if model}
    <St.Primitive object={model} scale ={.3} on:mouseover ={play} isInterative={true} />
    <St.Mesh geometry = {myBox}  scale ={8} isInterative = {true}/>
    {/if}
    <St.Environment filess={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'}  />
<St.Environment map={texture} />
<St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'}  />
<St.Environment ground={true} path ={'textures/equirectangular/royal_esplanade_1k.hdr'}/>
<St.Environment files={myfyle} />
<St.Environment ground={true} />
*/

$: {

}

let myfyle = [
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg',
      'https://r105.threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg',
    ];


</script>

<St.Canvas>
    <St.PerspectiveCamera/>
	<St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
    <St.OrbitControls/>
	    <St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true} material ={chromeMaterial} />
	<St.DirectionalLight/>
</St.Canvas>