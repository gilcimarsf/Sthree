<script lang="ts">
import * as THREE from 'three';
import { onDestroy, onMount, afterUpdate} from 'svelte';
import { set_scenes, sceneContext, setElementScene } from '$lib/utils/context.js';
import { ContextCanvas } from '$lib/core/manager.js';
import type {RaycasterManager} from '$lib/core/raycaster.js'
//import { loadingManager } from '$lib/utils/loadingManager.js';
import { ElementScene } from '$lib/core/manager.js';
  import { compute_slots } from 'svelte/internal';

$: outerWidth = 0
$: innerWidth = 0
$: outerHeight = 0
$: innerHeight = 0
$: clientWidth = 0
$: clientHeight= 0

let el : HTMLElement;
let container :HTMLElement;
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
  //onWindowResize()  
  if (frame !=null) {  contextCanvas.frame = frame; }
  if (frame) return;
   	frame = requestAnimationFrame(() => {
      contextCanvas.before_render.forEach(run);
    	render();
  		frame = null;
  		});
    
};

let id = "default";
let SCENES = new ContextCanvas (invalidate , frameloop);
const contextCanvas = set_scenes(SCENES);
const scene = sceneContext (id , new THREE.Scene())
let  {elementScene} =  setElementScene (id ,new ElementScene (id, scene ));

//contextCanvas.arrayScenes.set(id , elementeScene);

/*
function onWindowResize() {
  
  for (let [id , value] of contextCanvas.arrayScenes ){
    if(value.composer != null && value.el != null) {
    value.composer.setSize(value.w, value.h );
    }
     console.log(value.camera);
    if (value) {
   
    //value.update (value.el.clientWidth,value.el.clientHeight);
    }
    /*
    if (value.camera != null && value.el != null) {
    console.log(value);
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
  
}
*/



export const createScene = (container : HTMLElement) => {
renderer = new THREE.WebGLRenderer({ antialias: true, canvas: container });
elementScene.renderer = renderer;
elementScene.w = clientWidth;
elementScene.h = clientHeight;
contextCanvas.renderer = renderer;

}

function onPointerMove( event : MouseEvent ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
    contextCanvas.canvasClientX = event.clientX;
    contextCanvas.canvasClientX = event.clientY; 
    elementScene.position = pointer;
}

const delta = 0.01;
function render() { 
  const time = Date.now() * 0.0004;
  if ( contextCanvas.arrayScenes.size <= 0 ) {  
    if(elementScene.camera != null) {
      renderer.render (elementScene.scene , elementScene.camera.target);
    }
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
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;
        renderer.setViewport( left, bottom, width, height );
        renderer.setScissor( left, bottom, width, height );
                
        if ( value.composer == null ) {
        renderer.render (value.scene , value.camera.target);
        } else { 
        value.composer.render(delta);
        
          /*if (contextCanvas.onComposer == false){
              contextCanvas.onComposer = true;        
          }*/
        }        
        if (value.raycaster != null ) {
          value.raycaster.update (value.position, value.camera.target);
        }    
        
      }
    }
  }

  if(  elementScene.camera != null && elementScene.raycaster != null ) {
    elementScene.raycaster.update (elementScene.position, elementScene.camera.target);
  }    
}

const animate = () => {
requestAnimationFrame(animate);
  if (contextCanvas.frameloop == "always") {
    invalidate();
  }  
};

function onWindowResize() {
  elementScene.w = clientWidth;
  elementScene.h = clientHeight;
  console.log (clientWidth, clientHeight)
if (contextCanvas.onComposer) { allUpdate ();}
else {renderer.setSize( innerWidth, innerHeight );}
}

function allUpdate (){
  for (let [id , value] of contextCanvas.arrayScenes ){
    if(value.composer != null && value.composer != null && value.el != null) {
    //value.composer.setSize(value.w, value.h );    
    }
    if (value.camera != null && value.el != null) {
    value.update (value.el.clientWidth,value.el.clientHeight);    
    }
  }  
}


onMount(() => {     
contextCanvas.setFrameloop(frameloop);
contextCanvas.container = container;
createScene(el)
 //window.addEventListener( 'resize', onWindowResize );
animate();
invalidate();  
allUpdate () 
});


init();
function init() {
  contextCanvas.scene.background = new THREE.Color( 0xf0f0f0 );
    //raycasterManager = setRaycaster(new RaycasterManager());  
}

$: if (container) {
  elementScene.el = container;
  onWindowResize()  
}

$: if (elementScene) {
//console.log(elementScene.onComposer);
 //allUpdate ()
 }

</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight on:resize={onWindowResize} />

<div class="container" bind:this={container} bind:clientWidth bind:clientHeight >
<canvas bind:this={el} on:mousemove={onPointerMove} class="background" />
  {#if elementScene.scene && elementScene.el}
  <slot/>
  {/if}
</div>

<style>
	.background {
    position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}
  .container {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
	}
</style>