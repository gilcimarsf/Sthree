<script lang="ts">
    import * as THREE from 'three';
    import * as defaults from '../../utils/defaults.js';
    import { setupMesh } from '../../utils/context.js';
    import { transform  } from '../../utils/utils';
    import { Object3d } from '../../core/objects.js';
    import { createEventDispatcher } from 'svelte';
    
    export let geometry :THREE.BufferGeometry = defaults.geometry;
    export let material = defaults.material;
	export let position = defaults.position;
	export let rotation = defaults.rotation;
	export let scale = defaults.scale;
	export let castShadow = false;
	export let receiveShadow = false;
	export let frustumCulled = true;
	export let renderOrder = 0;
	
	
	let myObject = new Object3d ( new THREE.Mesh(geometry, material));
    const { self, contextScenes } = setupMesh(myObject);
    
    const dispatch = createEventDispatcher();
    
	self.target.addEventListener('mouseover', (event) => {
		console.log(event);
		dispatch('mouseover', event);
	});            
	self.target.addEventListener('mouseout', (event) => {
		console.log(event);
		dispatch('mouseout', event);
	});
	self.target.addEventListener('mousedown', (event) => {
		console.log(event);
		dispatch('mousedown', event);
	});
	self.target.addEventListener('mouseup', (event) => {
		console.log(event);
		dispatch('mouseup', event);
	});
	self.target.addEventListener('click', (event) => {
		console.log(event);
		dispatch('click', event);
	});
    
    $: {
		if (self.target.geometry && geometry !== self.target.geometry) {
			self.target.geometry.dispose();
		}

		self.target.geometry = geometry;
		self.target.material = material;
		self.target.castShadow = castShadow;
		self.target.receiveShadow = receiveShadow;
		self.target.frustumCulled = frustumCulled;
		self.target.renderOrder = renderOrder;

		transform(self.target, position, rotation, scale);
		contextScenes.invalidate();
	}
    
    
</script>