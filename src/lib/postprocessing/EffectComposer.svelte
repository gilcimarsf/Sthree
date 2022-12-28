<script lang="ts">
import { onDestroy, onMount , afterUpdate } from 'svelte';
import type { Script } from 'svelte/types/compiler/interfaces';
import * as THREE from 'three';
import { get_scenes, getElementScene } from "../utils/context";
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

//ADICIONAIS PARA TESTES
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
let composer : EffectComposer 
export let addPass : Pass[] = []; 
export let id : string  = "default";

const {elementScene, contextCanvas} = getElementScene (id);


function init() { 
   if(elementScene != null ) {
        if ( elementScene.renderer != null) {
            composer = new EffectComposer( elementScene.renderer );
            contextCanvas.onComposer = true;            
        }
    }
}

$: if (elementScene) {
    elementScene.composer = composer;    
    elementScene.onComposer = true;
    if (elementScene.composer) {
    elementScene.composer.setPixelRatio( elementScene.w / elementScene.h );
    elementScene.composer.setSize( elementScene.w,  elementScene.h );
    console.log(elementScene.w, elementScene.h);
}
}
$: if (elementScene && elementScene.camera ) {
    const target = new THREE.WebGLRenderTarget( elementScene.w , elementScene.h, 
    	{
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
    		encoding: THREE.sRGBEncoding
    });
    
   elementScene.composer?.reset (target);
   const renderBackground = new RenderPass( elementScene.scene, elementScene.camera.target ) ;
   composer.addPass( renderBackground);
   composer.addPass( new ShaderPass( GammaCorrectionShader ) )
   
   for (let i = 0; i < addPass.length; i++) {
        if (addPass[i] == undefined) {}
        else {
        composer.addPass(addPass[i]);
        }
    }
}

onMount(() => {
    init();
})

</script>   

<slot></slot>
