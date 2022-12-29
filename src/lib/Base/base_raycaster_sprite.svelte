<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/* variaveis */
let container : HTMLElement;
let canvas : HTMLCanvasElement;
let renderer :THREE.WebGLRenderer;
let scene : THREE.Scene;
let camera : THREE.PerspectiveCamera;
let mesh;
let controls;
/* Variaveis */
let el : HTMLElement;
$: innerWidth = 0
$: innerHeight = 0
const pointer = new THREE.Vector2();
//Raycaster
const raycaster = new THREE.Raycaster();
let selectedObject = null;


function init() {
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x050505 );
	scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );
	//Camera
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set( 15, 15, 15 );
	camera.lookAt( scene.position );
		
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
	
	// CONTROLS
	const controls = new OrbitControls( camera, renderer.domElement );
	controls.minDistance = 15;
	controls.maxDistance = 250
	
	group = new THREE.Group();
	scene.add( group );	
}

let group : THREE.Group;


function onSprite () {

const sprite1 = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#69f' } ) );
sprite1.position.set( 6, 5, 5 );
sprite1.scale.set( 2, 5, 1 );
group.add( sprite1 );

const sprite2 = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#69f', sizeAttenuation: false } ) );
sprite2.material.rotation = Math.PI / 3 * 4;
sprite2.position.set( 8, - 2, 2 );
sprite2.center.set( 0.5, 0 );
sprite2.scale.set( .1, .5, .1 );
group.add( sprite2 );

const group2 = new THREE.Object3D();
group2.scale.set( 1, 2, 1 );
group2.position.set( - 5, 0, 0 );
group2.rotation.set( Math.PI / 2, 0, 0 );
group.add( group2 );

const sprite3 = new THREE.Sprite( new THREE.SpriteMaterial( { color: '#69f' } ) );
sprite3.position.set( 0, 2, 5 );
sprite3.scale.set( 10, 2, 3 );
sprite3.center.set( - 0.1, 0 );
sprite3.material.rotation = Math.PI / 3;
group2.add( sprite3 );
}



function onPointerMove( event : MouseEvent ) {
	pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
	
	if ( selectedObject ) {
	selectedObject.material.color.set( '#69f' );
	selectedObject = null;
	}
	raycaster.setFromCamera( pointer, camera );
	const intersects = raycaster.intersectObject( group, true );
	
	if ( intersects.length > 0 ) {
	const res = intersects.filter( function ( res ) {
	return res && res.object;
	} )[ 0 ];
	
		if ( res && res.object ) {
		selectedObject = res.object;
		selectedObject.material.color.set( '#f00' );
		}
	}
}
















function onWindowResize() {
camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( innerWidth, innerHeight );
}

export const createScene = (el) => {
  init();
  onSprite ();
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