<script lang="ts">
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';
import { set_scenes, setRaycaster } from '$lib/utils/context.js';
import { ContextCanvas } from '$lib/core/manager.js';
import {RaycasterManager} from '$lib/core/raycaster.js'
//import { loadingManager } from '$lib/utils/loadingManager.js';
 

$: outerWidth = 0
$: innerWidth = 0
$: outerHeight = 0
$: innerHeight = 0

let el : HTMLElement;
let container :HTMLElement;
let camera : THREE.PerspectiveCamera ;
let raycasterManager : RaycasterManager;
let renderer : THREE.WebGLRenderer;

let INTERSECTED : THREE.Intersection;
let theta = 0;

const pointer = new THREE.Vector2();
const radius = 100;

export let frameloop : 'always' | 'demand' | 'never' = 'demand';
let frame : number | null = null;

const run = (fn) => fn();
const invalidate = () => {
  contextCanvas.frame = frame;
  if (frame) return;
   	frame = requestAnimationFrame(() => {
      onWindowResize();
    	contextCanvas.before_render.forEach(run);
    	render();
  		frame = null;
  		});
    
	};

let SCENES = new ContextCanvas (invalidate , frameloop);
const contextCanvas = set_scenes(SCENES);

//let manager = loadingManager();

init();

// onMount/createScene
function init() {
  contextCanvas.scene.background = new THREE.Color( 0xf0f0f0 );
    raycasterManager = setRaycaster(new RaycasterManager());  
}

//onMount / animate
function onWindowResize() {
  
    if (  contextCanvas.camera != null) {
      contextCanvas.camera.target.aspect = innerWidth / innerHeight;
      contextCanvas.camera.target.updateProjectionMatrix();
    invalidate();
    }
    renderer.setSize( innerWidth, innerHeight );
    if ( contextCanvas.composer != null ) {
      contextCanvas.composer.setSize( innerWidth, innerHeight);
    }
  }

//
function onPointerMove( event ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}

function rotacionarTudo () {
  theta += 0.1;
    if (  contextCanvas.camera != null) {
     
    contextCanvas.camera.target.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    contextCanvas.camera.target.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    contextCanvas.camera.target.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    contextCanvas.camera.target.lookAt( contextCanvas.scene.position );
    contextCanvas.camera.target.updateMatrixWorld();
  }
}

//PASSA PARA before_render
function render() {
  if (contextCanvas.scenes. length > 0) {
    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( false );
    renderer.clear();
    renderer.setClearColor( 0xe0e0e0 );
    renderer.setScissorTest( true );
    
    contextCanvas.scenes.forEach( function ( myscene ) {
    
        if (renderer != null) {
           // set the viewport
          const element = myscene.userData.element;
          const rect = element.getBoundingClientRect();
          if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
						 rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
						return; // it's off screen
					}
          const width = rect.right - rect.left;
      		const height = rect.bottom - rect.top;
      		const left = rect.left;
      		const bottom = renderer.domElement.clientHeight - rect.bottom;
      		renderer.setViewport( left, bottom, width, height );
      		renderer.setScissor( left, bottom, width, height );
      		const cam = myscene.userData.camera;
          renderer.render (myscene , cam);
        }
      })
  } else {
    if (  contextCanvas.camera != null) {
      if ( contextCanvas.composer == null ) {
          renderer.render(contextCanvas.scene,  contextCanvas.camera.target);
          } else {
            contextCanvas.composer.render();
          }
    }  
  }
  
  if(  contextCanvas.camera != null) {
    raycasterManager.update (pointer, contextCanvas.camera.target);
  }    
}

//onMount
export const createScene = (el : HTMLElement) => {
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
contextCanvas.setRenderer (renderer);
raycasterManager.onCanvas (el , renderer );
}

//onMount 
const animate = () => {
//console.log(contextScenes.frame);
requestAnimationFrame(animate);
  if (contextCanvas.frameloop == "always") {
  //frame = requestAnimationFrame(animate);
   invalidate();
  }
  
};

onMount(() => { 
  contextCanvas.setFrameloop(frameloop);
  contextCanvas.update (innerWidth , innerHeight , window.devicePixelRatio);
  contextCanvas.el = el;
  contextCanvas.container = container;
  createScene(el)
  window.addEventListener( 'resize', onWindowResize );
  onWindowResize();
  animate();
  invalidate();  
});



$: if (renderer) {
 //invalidate();
}
</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<div class="container" bind:this={container}>
<canvas bind:this={el} on:mousemove={onPointerMove}  on:resize={onWindowResize} class="background"/>
  {#if contextCanvas.scene && contextCanvas.el}
  <slot/>
  {/if}
</div>

<style>
	.background {
		content: '';
		position: fixed;
		background: white;
		width: 100%;
		height: 100%;
		top: 0;
	}
</style>