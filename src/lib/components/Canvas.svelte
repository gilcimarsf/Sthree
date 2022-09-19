<script lang="ts">
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';
import { set_scenes, setRaycaster } from '../utils/context.js';
import { ContextScenes } from '../core/manager.js';
import {RaycasterManager} from '../core/raycaster.js'
import { loadingManager } from '../utils/loadingManager.js';
import { browser } from '$app/env';

$: outerWidth = 0
$: innerWidth = 0
$: outerHeight = 0
$: innerHeight = 0

let el : HTMLElement;
let container;
let camera : THREE.PerspectiveCamera ;
let raycasterManager : RaycasterManager;
let renderer : THREE.WebGLRenderer;

let INTERSECTED : THREE.Intersection;
let theta = 0;

const pointer = new THREE.Vector2();
const radius = 100;

let SCENES = new ContextScenes ();
const contextScenes = set_scenes(SCENES);
let frame : number = 0;

let manager = loadingManager();


init();

// onMount/createScene
function init() {
    contextScenes.scene.background = new THREE.Color( 0xf0f0f0 );
    raycasterManager = setRaycaster(new RaycasterManager());  
  }


//onMount / animate
function onWindowResize() {
    
    if (  contextScenes.camera != undefined) {
    contextScenes.camera.target.aspect = innerWidth / innerHeight;
    contextScenes.camera.target.updateProjectionMatrix();
    }
    renderer.setSize( innerWidth, innerHeight );

}

//
function onPointerMove( event ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}




//onMount / animate
function render() {
    theta += 0.1;
    if (  contextScenes.camera != undefined) {
    
    contextScenes.camera.target.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    contextScenes.camera.target.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    contextScenes.camera.target.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    contextScenes.camera.target.lookAt( contextScenes.scene.position );

    contextScenes.camera.target.updateMatrixWorld();

    // find intersections
    raycasterManager.update (pointer, contextScenes.camera.target);
    }
}

const before_render = [];
const run = (fn) => fn();



/*
const invalidate = () => {
		if (frame) return;
    console.log ("fui chamado");
		frame = requestAnimationFrame(() => {
			frame = null;
			before_render.forEach(run);
			if (  contextScenes.camera != undefined) {
			renderer.render(contextScenes.scene,  contextScenes.camera.target);
      }
		});
	};
*/





//onMount
export const createScene = (el) => {
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
raycasterManager.onCanvas (el , renderer );
}

//onMount 
const animate = () => {
  frame = requestAnimationFrame(animate);
  if (  contextScenes.camera != undefined) {
  renderer.render (contextScenes.scene,  contextScenes.camera.target);
  }
  onWindowResize();
  render();
};

function teste (){
console.log ("fui chamada eba!!!!");
}





onMount(() => {
  contextScenes.update (innerWidth , innerHeight);
  createScene(el)
  window.addEventListener( 'resize', onWindowResize );
  animate ();
});





</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />
<canvas bind:this={el} on:mousemove={onPointerMove}  class="background" ></canvas>
<slot/>
<style>
	.background {
		content: '';
		position: absolute;
		background: white;
		width: 100%;
		height: 100%;
		top: 0;
	}
</style>