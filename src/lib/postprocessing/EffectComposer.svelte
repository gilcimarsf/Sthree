<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type { Script } from 'svelte/types/compiler/interfaces';
import * as THREE from 'three';
import { get_scenes } from "../utils/context";
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    
const { contextCanvas } = get_scenes();  
let composer : EffectComposer 
export let addPass : Pass[] = []; 

function init() {
    
    const target = new THREE.WebGLRenderTarget( innerWidth , innerHeight, 
    	{
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
    		encoding: THREE.sRGBEncoding
    });
    
    if(contextCanvas.renderer != null) {
        composer = new EffectComposer( contextCanvas.renderer, target );
        composer.setPixelRatio( contextCanvas.devicePixelRatio );
        composer.setSize( contextCanvas.w, contextCanvas.h );
        
        if (contextCanvas.camera != null) {
            composer.addPass( new RenderPass( contextCanvas.scene, contextCanvas.camera.target ) );
        }
        /*
        composer.addPass( new ShaderPass( GammaCorrectionShader ) );
        */
    }
    
    for (let i = 0; i < addPass.length; i++) {
        if (addPass[i] == undefined) {}
        else {
        console.log(addPass[i]);
        composer.addPass(addPass[i]);
        }
    }
       
}

$: if (composer) {
    contextCanvas.composer = composer;

}

    
onMount(() => {
    init();
});
    
    
</script>    
<slot></slot>