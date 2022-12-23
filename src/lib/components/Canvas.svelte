<script lang="ts">
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';
import { set_scenes, setRaycaster } from '$lib/utils/context.js';
import { ContextCanvas } from '$lib/core/manager.js';
import {RaycasterManager} from '$lib/core/raycaster.js'
//import { loadingManager } from '$lib/utils/loadingManager.js';
import type { ElementScene } from '$lib/core/manager.js';

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
    //raycasterManager = setRaycaster(new RaycasterManager());  
}

//onMount / animate
function onWindowResize() {
  
  for (let [id , value] of contextCanvas.arrayScenes ){
  /*
    if(value.composer != null) {
    //REVER ISSO  
      //value.composer.setSize( contextCanvas.w, contextCanvas.h );
    }*/
    if (value.camera != null && value.el != null) {
      //value.camera.resize (value.el.clientWidth,value.el.clientHeight);
      value.update (value.el.clientWidth,value.el.clientHeight);
      }
  }

  // atualiza todas as cameras incluindo as dos views
  contextCanvas.update (innerWidth , innerHeight , window.devicePixelRatio);
  
  //provavel tenha deletar tudo ai em baixo.
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


function onPointerMove( event ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
    contextCanvas.canvasClientX = event.clientX;
    contextCanvas.canvasClientX = event.clientY;    
}


/*
function onPointerMove( event ) {
  for (let [id , value] of contextCanvas.arrayScenes ){
      if (renderer != null && value.el !=null && value.camera !=null) {
      let myPointer = new THREE.Vector2(10000,10000);
      const element = value.el
      const rect = element.getBoundingClientRect();
      let canvaswidth = element.clientWidth;
      let canvasHeight = element.clientHeight;
      let posX = ( event.clientX - rect.left ) * canvaswidth / rect.width;
      let posY = - ( event.clientY - rect.top ) * canvasHeight / rect.height;
            
      myPointer.x = (posX  /rect.width ) * 2 - 1;
      myPointer.y = (posY /rect.height ) * -2 + 1;
      value.position = myPointer;
      }
  }
}
/*
function onPointerMoveScissor( rect: DOMRect , value : ElementScene ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}*/


//PASSA PARA before_render
function render() { 
  if ( contextCanvas.onComposer ) {  
  console.log ("Aqui");  
  }else { 
    renderer.setClearColor( 0xffffff );
    renderer.setScissorTest( false );
    renderer.clear();
    renderer.setClearColor( 0xe0e0e0 );
    renderer.setScissorTest( true );
    
    for (let [id , value] of contextCanvas.arrayScenes ){
      if (renderer != null && value.el !=null && value.camera !=null) {
        // set the viewport
        const element = value.el
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
        const cam = value.camera;
        if ( value.composer == null ) {
        renderer.render (value.scene , value.camera.target);
        } else {
        //REVER ISSO  
         // value.composer.render();
        }
        
        if (value.raycaster != null ) {
          //let rectPoint = onPointerMoveScissor ( pointer , rect, value );
          value.raycaster.update (value.position, value.camera.target);
          //console.log(value.position);
          //console.log (pointer)
        }      
      }
    }  
  }

  /*
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
  */
  if(  contextCanvas.camera != null) {
    //raycasterManager.update (pointer, contextCanvas.camera.target);
  }    
}

//onMount
export const createScene = (el : HTMLElement) => {
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
contextCanvas.setRenderer (renderer);
//raycasterManager.onCanvas (el , renderer );  
}

export const endMount = () => {
  for (let [id , value] of contextCanvas.arrayScenes ){
      if (value.composer != null) {
        contextCanvas.onComposer = true;
      }
  }
  console.log (contextCanvas.onComposer);
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
  endMount();
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