<script lang="ts">
import * as THREE from "three";
import { get_scenes } from "../../utils/context.js";
import { onMount } from "svelte";

export let envMap : THREE.Texture | null = null;

const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
const cubeCamera = new THREE.CubeCamera( 1, 100000, cubeRenderTarget );
const { contextScenes } = get_scenes();

onMount(async () => {
    contextScenes.scene.add( cubeCamera );
    contextScenes.addBeforeRender (()=> {if (contextScenes.renderer) {cubeCamera.update (contextScenes.renderer, contextScenes.scene)}});
    envMap = cubeRenderTarget.texture ;
    })


$: {
}
</script>

<slot envMap={envMap}/>