<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import type { Script } from 'svelte/types/compiler/interfaces';
import * as THREE from 'three';
import { get_scenes } from "../utils/context";
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
    
const { contextScenes } = get_scenes();  
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
    
    if(contextScenes.renderer != null) {
        composer = new EffectComposer( contextScenes.renderer, target );
        composer.setPixelRatio( contextScenes.devicePixelRatio );
        composer.setSize( contextScenes.w, contextScenes.h );
        
        if (contextScenes.camera != null) {
            composer.addPass( new RenderPass( contextScenes.scene, contextScenes.camera.target ) );
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
contextScenes.composer = composer;

}

    
onMount(() => {
    init();
});
    
    
</script>    
<slot></slot>