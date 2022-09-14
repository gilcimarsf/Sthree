<script context="module" lang="ts">
    export const ssr = false
</script>

<script lang="ts">
	import * as THREE from 'three';
	import * as defaults from '../../utils/defaults.js';
	import { transform  } from '../../utils/utils.js';
	import { setupMesh } from '../../utils/context.js';
	import { Object3d } from '../../core/objects.js';
	import { createEventDispatcher } from 'svelte';
	
	export let object : THREE.Object3D | THREE.Group;

	export let position = defaults.position;
	export let rotation = defaults.rotation;
	export let scale = defaults.scale;
	
	let myObject = new Object3d (object);
	const { self, contextScenes } = setupMesh(myObject);
	
	const dispatch = createEventDispatcher();
    
	self.target.addEventListener('mouseover', (event) => {
		//console.log(event);
		dispatch('mouseover', event);
	});            
	self.target.addEventListener('mouseout', (event) => {
		//console.log(event);
		dispatch('mouseout', event);
	});
	self.target.addEventListener('mousedown', (event) => {
		//console.log(event);
		dispatch('mousedown', event);
	});
	self.target.addEventListener('mouseup', (event) => {
		//console.log(event);
		dispatch('mouseup', event);
	});
	self.target.addEventListener('click', (event) => {
		//console.log(event);
		dispatch('click', event);
	});
	
		
	/** @type {THREE.Object3D} */
	let previous: THREE.Object3D;
	
	$: {
		transform(self.target, position, rotation, scale);
		contextScenes.invalidate();
	}

/*
	$: {
		if (previous) {
			self.remove(previous);
		}

		if (object) {
			self.add(object);
		}

		previous = object;
		contextScenes.invalidate();
	}

	$: {
		transform(self, position, rotation, scale);
		
		contextScenes.invalidate();
	}
*/	
	
	
	
	
</script>
{#if object}
	<slot></slot>
{/if}
