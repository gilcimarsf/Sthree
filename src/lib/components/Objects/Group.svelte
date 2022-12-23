<script lang="ts">

import * as THREE from 'three';
import * as defaults from '$lib/utils/defaults.js';
import { transform  } from '$lib/utils/utils.js';
import { setupSimplesMesh } from '$lib/utils/context.js';
import type { Object3d } from '$lib/core/objects.js';
import { createEventDispatcher } from 'svelte';


export let id : string  = "default";
export let position = defaults.position;
export let rotation = defaults.rotation;
export let scale = defaults.scale;
export let renderOrder = 0;
export let group : THREE.Group = new THREE.Group();
let onSlot : boolean  = false ;

const { self, contextCanvas } = setupSimplesMesh (id , group);

$: if(self){
    self.renderOrder = renderOrder;
    transform(self, position, rotation, scale);
    contextCanvas.invalidate();
    onSlot = true;
}

</script>
{#if onSlot  }
<slot group={self}/> 
{/if}