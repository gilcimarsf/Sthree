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

function init() {
//Scenes
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x050505 );
scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

//Camera
camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 1, 3500 );
camera.position.set(0,150,400);
camera.lookAt(scene.position);	

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
//scene.add( Sphere );   

// CONTROLS
controls = new OrbitControls( camera, renderer.domElement );

}





////////////////////////////////////////
function piso () { 

var floorTexture = new THREE.TextureLoader().load( 'textures/base/checkerboard.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

}


function onSprite () {
//Sprite
const ballTexture = new THREE.TextureLoader().load( 'textures/base/redball.png' );
const crateTexture = new THREE.TextureLoader().load( 'textures/base/crate.png' );

var ballMaterial = new THREE.SpriteMaterial( { map: ballTexture, color: 0xffffff  } )
var sprite = new THREE.Sprite( ballMaterial );
sprite.position.set( 50, 50, 0 );
sprite.scale.set( 64, 64, 1.0 );
scene.add( sprite );


var crateMaterial = new THREE.SpriteMaterial( { map: crateTexture , color: 0xffffff } );
var sprite2 = new THREE.Sprite( crateMaterial );
sprite2.position.set( -100, 50, 0 );
sprite2.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
scene.add( sprite2 );

var crateMaterial = new THREE.SpriteMaterial( { map: crateTexture , color: 0x00ff00 } )
;var sprite2 = new THREE.Sprite( crateMaterial );
sprite2.position.set( -0, 50, 0 );
sprite2.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
scene.add( sprite2 );

var crateMaterial = new THREE.SpriteMaterial( { map: crateTexture , color: 0x0000ff  } )
var sprite2 = new THREE.Sprite( crateMaterial );
sprite2.position.set( 100, 50, 0 );
sprite2.scale.set( 64, 64, 1.0 ); // imageWidth, imageHeight
scene.add( sprite2 );
}


////////////////////////////////////////
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
    onSprite ();
    piso ();
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