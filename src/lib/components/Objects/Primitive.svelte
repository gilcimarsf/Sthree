<script context="module" lang="ts">
    export const ssr = false
</script>

<script lang="ts">
	import * as THREE from 'three';
	import * as defaults from '../../utils/defaults.js';
	import { transform  } from '../../utils/utils.js';
	import { setupSimplesMesh } from '../../utils/context.js';
	import {RaycasterManager} from '../../core/raycaster.js'
	import type { Object3d } from '../../core/objects.js';
	import { createEventDispatcher } from 'svelte';
	
	export let object : THREE.Object3D | THREE.Group;
	export let isInterative = false; 
	export let position = defaults.position;
	export let rotation = defaults.rotation;
	export let scale = defaults.scale;
	let myObject : Object3d | undefined = undefined;
	const dispatch = createEventDispatcher();
	
	const { self, contextScenes, raycaster } = setupSimplesMesh(object);
	
	$: if(self) {
		if (isInterative) {
			myObject = raycaster.add(self);
			//console.log (myObject);
		}
	}
	
	$: {
		transform(self, position, rotation, scale);
		contextScenes.invalidate();
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
		
	/** @type {THREE.Object3D} */
	let previous: THREE.Object3D;
	
	

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
