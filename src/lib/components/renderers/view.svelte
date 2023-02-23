<script lang="ts">
import { setElementScene, sceneContext} from "../../utils/context.js";
import * as THREE from 'three';
import {Camera} from '$lib/core/objects' 
import { ElementScene } from '$lib/core/manager.js';
import { onDestroy, onMount } from 'svelte';
import type { trusted } from 'svelte/internal';
import {RaycasterManager} from '$lib/core/raycaster.js'

export let id : string  = "default";
let raycasterManager : RaycasterManager;
//let elementScene = new ElementScene (id)
let elElement :HTMLElement;
let renderer :THREE.WebGLRenderer;
export let isInterative = false; 

export let top: string = "0";
export let left : string  = "0";
export let width: string = "50%";
export let height : string  = "50%";
export let position: string = "fixed";

let canvasClientX : number ;
let canvasClientY : number ;
$: outerWidth = 0
$: innerWidth = 0
$: outerHeight = 0
$: innerHeight = 0
$: clientWidth = 0
$: clientHeight = 0



const scene = sceneContext (id , new THREE.Scene())
let  {elementScene, contextCanvas} =  setElementScene (id ,new ElementScene (id, scene ));
elementScene.renderer = contextCanvas.renderer;

function onPointerMoveWindow( event ) {
    canvasClientX = event.clientX;
    canvasClientY = event.clientY;
}

/*
function onPointerMove( event ) {
    for (let [id , value] of contextCanvas.arrayScenes ){
         if ( value.el !=null && value.camera  !=null) {
            let pointer = new THREE.Vector2();
            pointer = new THREE.Vector2(10000,10000);
            const element = value.el
            const rect = element.getBoundingClientRect();
            let canvaswidth = element.clientWidth;
            let canvasHeight = element.clientHeight;
            let posX = ( canvasClientX - rect.left ) * canvaswidth / rect.width;
            let posY = ( canvasClientY - rect.top ) * canvasHeight / rect.height;
            
            pointer.x = (posX  /rect.width ) * 2 - 1;
            pointer.y = (posY /rect.height ) * -2 + 1;
            value.position = pointer;
        }
    }
}*/

function onPointerMove( event ) {    
    if ( elementScene.el !=null && elementScene.camera  !=null) {
    let pointer = new THREE.Vector2();
    pointer = new THREE.Vector2(10000,10000);
    const element = elementScene.el
    const rect = element.getBoundingClientRect();
    let canvaswidth = element.clientWidth;
    let canvasHeight = element.clientHeight;
    let posX = ( canvasClientX - rect.left ) * canvaswidth / rect.width;
    let posY = ( canvasClientY - rect.top ) * canvasHeight / rect.height;
    
    pointer.x = (posX  /rect.width ) * 2 - 1;
    pointer.y = (posY /rect.height ) * -2 + 1;
    elementScene.position = pointer;
    }    
}

function init () {  
    elementScene.el = elElement;
    elementScene.w = clientWidth * 2 ;
    elementScene.h = clientHeight * 2 ;
    
    if (elementScene.camera == null) {
    //Camera
    let camera = new THREE.PerspectiveCamera();
    camera.position.z = 20;
    let cameraObject = new Camera (camera);
    elementScene.camera = cameraObject;
    elementScene.scene.add (camera);
    }
        
    if (isInterative  && elementScene.renderer){
        raycasterManager = new RaycasterManager(); 
        raycasterManager.onCanvas (elementScene.el , elementScene.renderer );
        elementScene.raycaster = raycasterManager;   
    }
    
    if (elementScene.orbitControl != null) {
     elementScene.setControl();
    }         
}
$: if (clientWidth) {
//elementScene.w = clientWidth;
}
$: if (clientHeight) {
//elementScene.h  = clientHeight;
}


function onWindowResize() {
  elementScene.w = clientWidth;
  elementScene.h = clientHeight;
  elementScene.update (clientWidth,clientHeight);  
}

onMount(() => {  
    init ();
});


</script>

<svelte:window on:mousemove={onPointerMoveWindow} bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight on:resize={onWindowResize}/>

<div class="elElement" bind:this={elElement} style='--top:{top}; --left:{left}; --width:{width}; --height:{height}; --position:{position};' on:mousemove={onPointerMove} bind:clientWidth bind:clientHeight>
<slot>
</slot>
</div>

<style>
	.elElement {
		content: '';
		position: var(--position);
		width: var(--width);
		height: var(--height);
		top: var(--top);
		left: var(--left);
	}
</style>