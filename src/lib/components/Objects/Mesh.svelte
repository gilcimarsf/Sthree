<script lang="ts">
    import * as THREE from 'three';
    import * as defaults from '$lib/utils/defaults.js';
    import { setupSimplesMesh } from '$lib/utils/context';
    import { transform  } from '$lib/utils/utils';
    import { createEventDispatcher } from 'svelte';
	import { onDestroy, onMount } from 'svelte';
	
	export let id : string  = "default";
    export let geometry :THREE.BufferGeometry = defaults.geometry;
    export let material : THREE.Material= defaults.material;
	export let position = defaults.position;
	export let rotation = defaults.rotation;
	export let scale = defaults.scale;
	export let castShadow = false;
	export let receiveShadow = false;
	export let frustumCulled = true;
	export let renderOrder = 0;
	
	
	let myMesh = new THREE.Mesh(geometry, material);
	export let isInterative = false; 
	export let group : THREE.Group | null = null;
	
	
	const dispatch = createEventDispatcher();
	const { self, contextCanvas, elementScene } = setupSimplesMesh(id , myMesh);
	$: myObject = elementScene.raycaster?.add (self);
			
			
	onMount( () => { 
		if (elementScene?.raycaster && isInterative) {		
		}		
	});
		
	$: if(myObject) {
	//console.log(myObject.target);
	
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
		contextCanvas.invalidate();
	}
	$: if (group && self  ){
		self.parent=group;
	}
	
</script>

