<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import * as THREE from 'three';

/* variaveis */
let container : HTMLElement;
let canvas : HTMLCanvasElement;
let renderer :THREE.WebGLRenderer;
let scene : THREE.Scene;
let camera : THREE.PerspectiveCamera;
let mesh;
/* Variaveis */
let el : HTMLElement;
$: innerWidth = 0
$: innerHeight = 0
const pointer = new THREE.Vector2();

function init() {
//Camera
camera = new THREE.PerspectiveCamera( 27, innerWidth / innerHeight, 1, 3500 );
camera.position.z = 20;
//Scenes
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x050505 );
scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );
//Renderer
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
//Light
scene.add( new THREE.AmbientLight( 0x444444 ) );

const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
light2.position.set( 0, - 1, 0 );
scene.add( light2 );
// Mesh
const geometry = new THREE.SphereGeometry( 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
let Sphere = new THREE.Mesh( geometry, material );
scene.add( Sphere );    
}


function onPointerMove( event ) {
	pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}

function onWindowResize() {
camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( innerWidth, innerHeight );
}

export const createScene = (el) => {
  init();
 }

const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  onWindowResize();
  render();
}

function render() {
camera.updateMatrixWorld();
}

onMount(() => { 
    createScene(el);
    window.addEventListener( 'resize', onWindowResize );
    animate();
})



</script>


<!-- BASE PARA EXIBIÇÃO NA TELA-->
<svelte:window bind:innerWidth bind:innerHeight />


<div class="container" bind:this={container}>
<canvas bind:this={el} on:mousemove={onPointerMove}  class="background"></canvas>
<slot />	
</div>

<style>
	.container,
	canvas {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}
</style>