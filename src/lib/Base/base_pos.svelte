<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import * as THREE from 'three';



import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LUTPass} from 'three/examples/jsm/postprocessing/LUTPass.js';
import { LUTCubeLoader } from 'three/examples/jsm/loaders/LUTCubeLoader.js';
import { LUT3dlLoader } from 'three/examples/jsm/loaders/LUT3dlLoader.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';


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

//////////////////////
const params = {
enabled: true,
lut: 'Bourbon 64.CUBE',
intensity: 1,
use2DLut: false,
};

const lutMap = {
'Bourbon 64.CUBE': null,
'Chemical 168.CUBE': null,
'Clayton 33.CUBE': null,
'Cubicle 99.CUBE': null,
'Remy 24.CUBE': null,
'Presetpro-Cinematic.3dl': null
};


let gui;
let composer : EffectComposer , lutPass : LUTPass;


function init() {
//Camera
camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 0.25, 20 );
camera.position.set( - 1.8, 0.6, 2.7 );
//Scenes
scene = new THREE.Scene();
scene.background = new THREE.Color( 0x050505 );
scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

////////////////////////////////
new RGBELoader()
.setPath( 'textures/equirectangular/' )
.load( 'royal_esplanade_1k.hdr', function ( texture ) {

	texture.mapping = THREE.EquirectangularReflectionMapping;

	scene.background = texture;
	scene.environment = texture;

	// model

	const loader = new GLTFLoader().setPath( 'models/gltf/DamagedHelmet/glTF/' );
	loader.load( 'DamagedHelmet.gltf', function ( gltf ) {

		scene.add( gltf.scene );

	} );

} );

Object.keys( lutMap ).forEach( name  => {

if ( /\.CUBE$/i.test( name  ) ) {

	new LUTCubeLoader()
		.load( 'luts/' + name, function ( result ) {

			lutMap[ name ] = result;

		} );

} else {

	new LUT3dlLoader()
		.load( 'luts/' + name, function ( result ) {

			lutMap[ name ] = result;

		} );

}

} );


//Renderer
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

////////////////////

const target = new THREE.WebGLRenderTarget( innerWidth , innerHeight, 
	{
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
		encoding: THREE.sRGBEncoding
});

composer = new EffectComposer( renderer, target );
composer.setPixelRatio( window.devicePixelRatio );
composer.setSize( window.innerWidth, window.innerHeight );
composer.addPass( new RenderPass( scene, camera ) );
composer.addPass( new ShaderPass( GammaCorrectionShader ) );



lutPass = new LUTPass();
composer.addPass( lutPass );

// CONTROLS
const controls = new OrbitControls( camera, renderer.domElement );
controls.minDistance = 2;
controls.maxDistance = 10;
controls.target.set( 0, 0, - 0.2 );
controls.update();

gui = new GUI();
gui.width = 350;
gui.add( params, 'enabled' );
gui.add( params, 'lut', Object.keys( lutMap ) );
gui.add( params, 'intensity' ).min( 0 ).max( 1 );

if ( renderer.capabilities.isWebGL2 ) {
gui.add( params, 'use2DLut' );
} else {
params.use2DLut = true;
}


//Light
scene.add( new THREE.AmbientLight( 0x444444 ) );

const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
light2.position.set( 0, - 1, 0 );
scene.add( light2 );
// Mesh
const geometry = new THREE.SphereGeometry( 1 );const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
let Sphere = new THREE.Mesh( geometry, material );
//scene.add( Sphere );    
}


function onPointerMove( event ) {
	pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}

function onWindowResize() {
camera.aspect = innerWidth / innerHeight;
camera.updateProjectionMatrix();
renderer.setSize( innerWidth, innerHeight );
composer.setSize( window.innerWidth, window.innerHeight );
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
lutPass.enabled = params.enabled && Boolean( lutMap[ params.lut ] );
lutPass.intensity = params.intensity;
if ( lutMap[ params.lut ] ) {
	const lut = lutMap[ params.lut ];
	lutPass.lut = params.use2DLut ? lut.texture : lut.texture3D;
}
composer.render();

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