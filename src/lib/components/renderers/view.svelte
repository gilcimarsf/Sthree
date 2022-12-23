<script lang="ts">
import type { Script } from 'svelte/types/compiler/interfaces';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { setupElementScene} from "../../utils/context.js";
import * as THREE from 'three';
import {Camera, Object3d, ControlCamera} from '$lib/core/objects' 
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ElementScene } from '$lib/core/manager.js';
import { onDestroy, onMount } from 'svelte';
import type { trusted } from 'svelte/internal';
import {RaycasterManager} from '$lib/core/raycaster.js'
//ADICIONAIS PARA TESTES
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

let raycasterManager : RaycasterManager;
export let id : string  = "default";
let elementeScene = new ElementScene (id)
let sceneElement :HTMLElement;
let renderer :THREE.WebGLRenderer;
export let isInterative = false; 
let pointer = new THREE.Vector2();

export let top: string = "0";
export let left : string  = "0";

//Scene
elementeScene.scene = new THREE.Scene();


//light
    elementeScene.scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 1, 1, 1 );
    //elementeScene.scene.add( light );

//INCLUDE ContextCanvas
const { self, contextCanvas } = setupElementScene(id, elementeScene); 

//Camera

let camera = new THREE.PerspectiveCamera();
camera.position.z = 20;
let cameraObject = new Camera (camera);

if (elementeScene.camera == null) {
    elementeScene.camera = cameraObject;
    elementeScene.scene.add (camera);
}



//OrbitControl
/*
let controls : OrbitControls;
let callbackControl = new ControlCamera (
    function OrbitFunction ( camera:THREE.Camera , canvas:HTMLElement ) {
    controls = new OrbitControls(camera, canvas);
    return controls;	
})
elementeScene.orbitControl = callbackControl;
*/

$:{      
}
  
/*
function onPointerMove( event ) {
    const rect = sceneElement.getBoundingClientRect();
    pointer.x = (  event.clientX- rect.x ) / contextCanvas.el?.clientWidth   * 2 - 1;
    pointer.y = - ( event.clientY - rect.y )/ contextCanvas.el?.clientHeight  * 2 + 1;
}
*/

/*
function onPointerMove( event ) {
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * -2 + 1;
}
//fazendo nada
function onPointerMove( event ) {
    const rect = sceneElement.getBoundingClientRect();
    pointer.x = ( event.clientX / innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY /innerHeight ) * 2 + 1;
}

*/

let canvasClientX : number ;
let canvasClientY : number ;

function onPointerMoveWindow( event ) {
    canvasClientX = event.clientX;
    canvasClientY = event.clientY;
}

function onPointerMove( event ) {
    if ( elementeScene.el !=null && elementeScene.camera  !=null) {
        pointer = new THREE.Vector2(10000,10000);
        const element = elementeScene.el
        const rect = element.getBoundingClientRect();
        let canvaswidth = element.clientWidth;
        let canvasHeight = element.clientHeight;
        let posX = ( canvasClientX - rect.left ) * canvaswidth / rect.width;
        let posY = ( canvasClientY - rect.top ) * canvasHeight / rect.height;
        
        pointer.x = (posX  /rect.width ) * 2 - 1;
        pointer.y = (posY /rect.height ) * -2 + 1;
        elementeScene.position = pointer;
        //console.log (pointer);
    }
}





function init () {  
    //HTMLElement
    self.el = sceneElement;
    
    //Renderer
    //renderer = new THREE.WebGLRenderer({ antialias: true});
    //self.renderer = renderer;
    self.renderer = contextCanvas.renderer;
    
    if (isInterative  && self.renderer){
        raycasterManager = new RaycasterManager(); 
        raycasterManager.onCanvas (self.el , self.renderer );
        //raycasterManager.pointer = pointer;
        elementeScene.raycaster = raycasterManager;   
    }
    
    if (elementeScene.orbitControl != null) {
    self.setControl();
    }
    
    
    // Composer
    const target = new THREE.WebGLRenderTarget( contextCanvas.w , contextCanvas.h, 
    {   minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        encoding: THREE.sRGBEncoding
    });
    
    if (self.renderer!= null) {
        let composer = new EffectComposer(self.renderer, target );
        composer.setPixelRatio( contextCanvas.devicePixelRatio );
        composer.setSize( contextCanvas.w, contextCanvas.h );
        self.composer = composer; 
        
        if (self.camera != null) {
            composer.addPass( new RenderPass( self.scene, self.camera.target ) );
        }         
        //ADIÇÕES 
        let pass : Pass [] = []; 
        pass[1]= new ShaderPass( GammaCorrectionShader );
                
        for (let i = 0; i < pass.length; i++) {
            if (pass[i] == undefined) {}
            else {
            //console.log(pass[i]);
            self.composer.addPass(pass[i]);
            }
        }
    }    
}





function onWindowResize() {

}



/*
//const scene = new THREE.Scene();
//const { self, contextCanvas } = setupScenes(scene);  

function init () {
if (self && contextCanvas.renderer) {
    self.userData.element = sceneElement;
    //camera
    const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
    camera.position.z = 2;
    self.userData.camera = camera;
    //Control
    const controls = new OrbitControls( self.userData.camera, self.userData.element );
    controls.minDistance = 2;
    controls.maxDistance = 5;
    controls.enablePan = false;
    controls.enableZoom = false;
    self.userData.controls = controls;
    
    //mesh
    const material = new THREE.MeshStandardMaterial( {
    color new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
    roughness: 0.5,
    metalness: 0,
    flatShading: true
    });
    const geometry =  new THREE.SphereGeometry( 1, 1, 1 );
    self.add( new THREE.Mesh( geometry, material ) );
    //light
    self.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 1, 1, 1 );
    self.add( light );
 
    }    
}*/

$: {    
}

onMount(() => {  
    init ();
});


</script>

<svelte:window on:mousemove={onPointerMoveWindow}/>

<div class="sceneElement" bind:this={sceneElement} style='--top:{top}; --left:{left}' on:mousemove={onPointerMove} on:resize={onWindowResize}>
<slot>
</slot>
</div>

<style>
	.sceneElement {
		content: '';
		position: fixed;
		width: 40%;
		height: 40%;
		top: var(--top);
		left: var(--left);
	}
</style>