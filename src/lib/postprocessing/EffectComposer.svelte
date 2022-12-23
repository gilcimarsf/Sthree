<script lang="ts">
import { onDestroy, onMount , afterUpdate } from 'svelte';
import type { Script } from 'svelte/types/compiler/interfaces';
import * as THREE from 'three';
import { get_scenes } from "../utils/context";
import { EffectComposer, Pass } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { Composer } from '$lib/core/manager.js';

export let id : string  = "default";
const { contextCanvas } = get_scenes();  
let composer : EffectComposer;
export let addPass : Pass[] = []; 

$: elementScene = contextCanvas.arrayScenes.get(id);


/*

*/
    
function init() {       
    
    if (elementScene) {
        elementScene.composer = new Composer(()=>{ onAddPass ()});
        elementScene.onComposer = true; 
    }
}

function onAddPass() {  
console.log ("estou sendo chamado via callbak...")
  
if(elementScene != null && elementScene.renderer != null) {        
        /*
        composer = new EffectComposer( elementScene.renderer, target );
        composer.setPixelRatio( elementScene.devicePixelRatio );
        composer.setSize( elementScene.w, elementScene.h );
        
        if (contextCanvas.camera != null) {
            composer.addPass( new RenderPass( contextCanvas.scene, contextCanvas.camera.target ) );
        }
                
        for (let i = 0; i < addPass.length; i++) {
            if (addPass[i] == undefined) {}
            else {
            console.log(addPass[i]);
            composer.addPass(addPass[i]);
            }
        }*/
           
    }
}


addEventListener('useComposer', (event) => {
console.log (event)
}); 

$: if (elementScene) {
}

$: if (composer) {
    contextCanvas.composer = composer;
}

afterUpdate(() => {
    init();
});
    
onMount(() => {
    init();
});
    
    
</script>    
<slot></slot>