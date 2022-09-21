<script lang="ts">
    import * as THREE from 'three';
    import * as defaults from '../../utils/defaults.js';
    import { setupSimplesMesh } from '../../utils/context.js';
    import { transform  } from '../../utils/utils';
    import type { Object3d } from '../../core/objects.js';
    import { createEventDispatcher } from 'svelte';
  import { browser } from '$app/env';
    
    export let geometry :THREE.BufferGeometry = defaults.geometry;
    export let material = defaults.material;
	export let position = defaults.position;
	export let rotation = defaults.rotation;
	export let scale = defaults.scale;
	export let castShadow = false;
	export let receiveShadow = false;
	export let frustumCulled = true;
	export let renderOrder = 0;
	let myObject : Object3d | undefined = undefined;
	export let isInterative = false; 
	
	const dispatch = createEventDispatcher();
	const { self, contextScenes, raycaster } = setupSimplesMesh(new THREE.Mesh(geometry, material));
	
		
	$: if(self) {
		if (isInterative) {
			myObject = raycaster.add(self);
			}
	}
	
	$: if(myObject) {
    myObject.target.addEventListener('mouseover', (event) => {
	//console.log(event);
	dispatch('mouseover', event);
	});            
	myObject.target.addEventListener('mouseout', (event) => {
		//console.log(event);
		dispatch('mouseout', event);
	});
	myObject.target.addEventListener('mousedown', (event) => {
		//console.log(event);
		dispatch('mousedown', event);
	});
	myObject.target.addEventListener('mouseup', (event) => {
		//console.log(event);
		dispatch('mouseup', event);
	});
	myObject.target.addEventListener('click', (event) => {
		//console.log(event);
		dispatch('click', event);
	});
}	

	$: {
		if (self.geometry && geometry !== self.geometry) {
			self.geometry.dispose();
		}

		self.geometry = geometry;
		self.material = material;
		self.castShadow = castShadow;
		self.receiveShadow = receiveShadow;
		self.frustumCulled = frustumCulled;
		self.renderOrder = renderOrder;
		transform(self, position, rotation, scale);
		//contextScenes.invalidate();
		
	}
	
    
    
</script>