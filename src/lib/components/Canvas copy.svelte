<script lang="ts">
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';
import { set_scenes, setRaycaster } from '$lib/utils/context.js';
import { ContextCanvas } from '$lib/core/manager.js';
import type {RaycasterManager} from '$lib/core/raycaster.js'
//import { loadingManager } from '$lib/utils/loadingManager.js';
import { ElementScene } from '$lib/core/manager.js';

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
//export let SCENES | RENDERER



const run = (fn) => fn();
const invalidate = () => {
  if (frame !=null) {  contextCanvas.frame = frame; }
  if (frame) return;
   	frame = requestAnimationFrame(() => {
      onWindowResize();
    	contextCanvas.before_render.forEach(run);
    	render();
  		frame = null;
  		});
    
	};

let id = "default";
let SCENES = new ContextCanvas (invalidate , frameloop);
const contextCanvas = set_scenes(SCENES);
let elementeScene = new ElementScene (id)
contextCanvas.arrayScenes.set(id , elementeScene);



function onWindowResize() {

  for (let [id , value] of contextCanvas.arrayScenes ){
    if(value.composer != null && value.composer != null && value.el != null) {
    //value.composer.setSiz(e value.w, value.h );
    }
    if (value.camera != null && value.el != null) {
    value.update (value.el.clientWidth,value.el.clientHeight);
    }
  }  
  
  renderer.setSize( innerWidth, innerHeight );
  /*
  // atualiza todas as cameras incluindo as dos views
  contextCanvas.update (innerWidth , innerHeight , window.devicePixelRatio);
  
  //provavel tenha deletar tudo ai em baixo.
  if (  contextCanvas.camera != null) {
  contextCanvas.camera.target.aspect = innerWidth / innerHeight;
  contextCanvas.camera.target.updateProjectionMatrix();
  invalidate();
  }
  
  if ( contextCanvas.composer != null ) {
  contextCanvas.composer.setSize( innerWidth, innerHeight);
  }
  */
}

function onPointerMove( event ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
    contextCanvas.canvasClientX = event.clientX;
    contextCanvas.canvasClientX = event.clientY;    
}
















//let manager = loadingManager();

init();

// onMount/createScene
function init() {
  contextCanvas.scene.background = new THREE.Color( 0xf0f0f0 );
    //raycasterManager = setRaycaster(new RaycasterManager());  
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

const delta = 0.01;

//PASSA PARA before_render
function render() { 
  const time = Date.now() * 0.0004;
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
        
        //ajustar isso para que ele desative a tela apenas se:
        // todos os elementos tiverem saido da cena...
        /*
        if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
            rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
          return; // it's off screen
        }
        */
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
        value.composer.render(delta);
        }        
        if (value.raycaster != null ) {
          value.raycaster.update (value.position, value.camera.target);
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
?? window.addEventListener( 'resize', onWindowResize );
?? onWindowResize();
?? animate();
?? invalidate();?? 

??});

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