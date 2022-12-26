<script lang="ts">
import { onDestroy, onMount , afterUpdate } from 'svelte';
import type { Script } from 'svelte/types/compiler/interfaces';
import * as THREE from 'three';
import { get_scenes } from "../utils/context";
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

//ADICIONAIS PARA TESTES
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

const { contextCanvas } = get_scenes();  
$: elementScene = contextCanvas.arrayScenes.get(id); 
export let id : string  = "default";
let composer : EffectComposer 

export let addPass : Pass[] = []; 

function init() { 

   if(elementScene != null ) {
         if ( elementScene.renderer != null) {
            
            composer = new EffectComposer( elementScene.renderer );
            composer.setPixelRatio( elementScene.w / elementScene.h );
            composer.setSize( elementScene.w,  elementScene.h );
        }
    }
}

$: if (elementScene) {
    elementScene.composer = composer;
    elementScene.onComposer = true;
}
$: if (elementScene && elementScene.camera ) {
    console.log(elementScene.composer);
    console.log(elementScene.w , elementScene.h);
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
