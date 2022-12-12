<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/* variaveis */
let container : HTMLElement;
let canvas : HTMLCanvasElement;
let renderer :THREE.WebGLRenderer;
let scene : THREE.Scene;
let camera :THREE.PerspectiveCamera;
let mesh;
let controls;
let cameraOrtho : THREE.OrthographicCamera;
let sceneOrtho : THREE.Scene;;
let spriteTL:THREE.Sprite, spriteTR:THREE.Sprite, spriteBL:THREE.Sprite, spriteBR :THREE.Sprite, spriteC :THREE.Sprite;
let mapC : THREE.Texture ;
let group :THREE.Group ;


/* Variaveis */
let el : HTMLElement;
$: innerWidth = 0
$: innerHeight = 0
const pointer = new THREE.Vector2();

function init() {
//Scenes
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x050505 );
scene.fog = new THREE.Fog( 0x000000, 1500, 2100 );
//newScenes
sceneOrtho = new THREE.Scene();

//Camera
camera = new THREE.PerspectiveCamera( 60, innerWidth / innerHeight, 1, 2100 );
camera.position.z= 2000;
camera.lookAt(scene.position);	

//Camera2
cameraOrtho = new THREE.OrthographicCamera( - innerWidth / 2, innerWidth / 2, innerHeight / 2, - innerHeight / 2, 1, 10 );
cameraOrtho.position.z = 10;

//Renderer
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.autoClear = false; // como te 2 renderes não pode limpar  automaticamente.
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
	// create sprites
	const amount = 200;
	const radius = 500
	
	const textureLoader = new THREE.TextureLoader();
	textureLoader.load( 'textures/sprite0.png', createHUDSprites );
	const mapB = textureLoader.load( 'textures/sprite1.png' );
	mapC = textureLoader.load( 'textures/sprite2.png' );
		
	const materialC = new THREE.SpriteMaterial( { map: mapC, color: 0xffffff, fog: true } );
	const materialB = new THREE.SpriteMaterial( { map: mapB, color: 0xffffff, fog: true } );
	
	group = new THREE.Group();
	
	for ( let a = 0; a < amount; a ++ ) {
		const x = Math.random() - 0.5;
		const y = Math.random() - 0.5;
		const z = Math.random() - 0.5;
		let material;
		if ( z < 0 ) {
			material = materialB.clone();
		} else {
			material = materialC.clone();
			material.color.setHSL( 0.5 * Math.random(), 0.75, 0.5 )
			if (material.map) {
			material.map.offset.set( - 0.5, - 0.5 );
			material.map.repeat.set( 2, 2 );
			}
		}
		
		const sprite = new THREE.Sprite( material );
		sprite.position.set( x, y, z );
		sprite.position.normalize();
		sprite.position.multiplyScalar( radius );
		group.add( sprite );
	}
	scene.add( group );
}


function createHUDSprites( texture :THREE.Texture) {
	const material = new THREE.SpriteMaterial( { map: texture } );
	
	if (material.map) {
	const width = material.map.image.width;
	const height = material.map.image.height;
	
	spriteTL = new THREE.Sprite( material );
	spriteTL.center.set(0.0, 1.0 );
	spriteTL.scale.set( width, height, 1 );
	sceneOrtho.add( spriteTL );
	
	spriteTR = new THREE.Sprite( material );
	spriteTR.center.set( 1.0, 1.0 );
	spriteTR.scale.set( width, height, 1 );
	sceneOrtho.add( spriteTR );
	
	spriteBL = new THREE.Sprite( material );
	spriteBL.center.set( 0.0, 0.0 );
	spriteBL.scale.set( width, height, 1 );
	sceneOrtho.add( spriteBL );
	
	spriteBR = new THREE.Sprite( material );
	spriteBR.center.set( 1.0, 0.0 );
	spriteBR.scale.set( width, height, 1 );
	sceneOrtho.add( spriteBR );
	
	spriteC = new THREE.Sprite( material );
	spriteC.center.set( 0.5, 0.5 );
	spriteC.scale.set( width, height, 1 );
	sceneOrtho.add( spriteC );
	}
	updateHUDSprites();
}


function updateHUDSprites() {
	const width =innerWidth / 2;
	const height = innerHeight / 2;
	
	if (spriteTL) {
		spriteTL.position.set( - width, height, 1 ); // top left
		spriteTR.position.set( width, height, 1 ); // top right
		spriteBL.position.set( - width, - height, 1 ); // bottom left
		spriteBR.position.set( width, - height, 1 ); // bottom right
		spriteC.position.set( 0, 0, 1 ); // center
	}
}

////////////////////////////////////////
function onPointerMove( event ) {
	pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}

function onWindowResize() {
camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();

cameraOrtho.left = - innerWidth / 2;
cameraOrtho.right = innerWidth / 2;
cameraOrtho.top = innerHeight / 2;
cameraOrtho.bottom = - innerHeight / 2;
cameraOrtho.updateProjectionMatrix();
updateHUDSprites();

renderer.setSize( innerWidth, innerHeight );					
}

export const createScene = (el) => {
  init();
  onSprite ();
  piso ();
 }
 
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  render();
  onWindowResize();
}

function render() {
camera.updateMatrixWorld();

const time = Date.now() / 1000;

for ( let i = 0, l = group.children.length; i < l; i ++ ) {
	
	const sprite = group.children[ i ];
	const material = sprite.material;
	const scale = Math.sin( time + sprite.position.x * 0.01 ) * 0.3 + 1.0;
	
	let imageWidth = 1;
	let imageHeight = 1;
	
	if ( material.map && material.map.image && material.map.image.width ) {
		imageWidth = material.map.image.width;
		imageHeight = material.map.image.height;	
	}
	sprite.material.rotation += 0.1 * ( i / l );
	sprite.scale.set( scale * imageWidth, scale * imageHeight, 1.0 );
	
	if ( material.map !== mapC ) {
		material.opacity = Math.sin( time + sprite.position.x * 0.01 ) * 0.4 + 0.6;
	}
}
	group.rotation.x = time * 0.5;
	group.rotation.y = time * 0.75;
	group.rotation.z = time * 1.0;
	
	renderer.clear();
	renderer.render( scene, camera );
	renderer.clearDepth();
	// super reder
	renderer.render( sceneOrtho, cameraOrtho );				
}

onMount(() => { 
	window.addEventListener( 'resize', onWindowResize );
    createScene(el);
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