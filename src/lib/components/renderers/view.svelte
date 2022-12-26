<script lang="ts">
import { setupElementScene} from "../../utils/context.js";
import * as THREE from 'three';
import {Camera} from '$lib/core/objects' 
import { ElementScene } from '$lib/core/manager.js';
import { onDestroy, onMount } from 'svelte';
import type { trusted } from 'svelte/internal';
import {RaycasterManager} from '$lib/core/raycaster.js'


let raycasterManager : RaycasterManager;
export let id : string  = "default";
let elementeScene = new ElementScene (id)
let sceneElement :HTMLElement;
let renderer :THREE.WebGLRenderer;
export let isInterative = false; 

export let top: string = "0";
export let left : string  = "0";
export let width: string = "50%";
export let height : string  = "50%";
let canvasClientX : number ;
let canvasClientY : number ;
$: outerWidth = 0
$: innerWidth = 0
$: outerHeight = 0
$: innerHeight = 0



//INCLUDE ContextCanvas
elementeScene.scene = new THREE.Scene();
const { self, contextCanvas } = setupElementScene(id, elementeScene); 
elementeScene.renderer = contextCanvas.renderer;

//light
elementeScene.scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
light.position.set( 1, 1, 1 );
elementeScene.scene.add( light );


function onPointerMoveWindow( event ) {
    canvasClientX = event.clientX;
    canvasClientY = event.clientY;
}

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
}


function init () {  
    elementeScene.el = sceneElement;
    elementeScene.update (innerWidth ,innerHeight );
    
    if (elementeScene.camera == null) {
    //Camera
    let camera = new THREE.PerspectiveCamera();
    camera.position.z = 20;
    let cameraObject = new Camera (camera);
    elementeScene.camera = cameraObject;
    elementeScene.scene.add (camera);
    }
        
    if (isInterative  && elementeScene.renderer){
        raycasterManager = new RaycasterManager(); 
        raycasterManager.onCanvas (elementeScene.el , elementeScene.renderer );
        elementeScene.raycaster = raycasterManager;   
    }
    
    if (elementeScene.orbitControl != null) {
     elementeScene.setControl();
    }
         
}

function onWindowResize() {
     elementeScene.composer?.setSize (innerWidth ,innerHeight );    
}

onMount(() => {  
    init ();
});


</script>

<svelte:window on:mousemove={onPointerMoveWindow} bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight/>

<div class="sceneElement" bind:this={sceneElement} style='--top:{top}; --left:{left}; --width:{width}; --height:{height};' on:mousemove={onPointerMove} >
<slot>
</slot>
</div>

<style>
	.sceneElement {
		content: '';
		position: fixed;
		width: var(--width);
		height: var(--height);
		top: var(--top);
		left: var(--left);
	}
</style>