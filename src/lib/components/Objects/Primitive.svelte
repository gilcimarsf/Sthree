<script context="module" lang="ts">
    export const ssr = false
</script>

<script lang="ts">
	import type * as THREE from 'three';
	import * as defaults from '$lib/utils/defaults.js';
	import { transform  } from '$lib/utils/utils.js';
	import { setupSimplesMesh } from '$lib/utils/context.js';
	import type { Object3d } from '$lib/core/objects.js';
	import { createEventDispatcher } from 'svelte';
	import { onDestroy, onMount } from 'svelte';
	
	export let id : string  = "default";
	export let object : THREE.Object3D | THREE.Group;
	export let isInterative = false; 
	export let position = defaults.position;
	export let rotation = defaults.rotation;
	export let scale = defaults.scale;
	export let group : THREE.Group | null = null;
	
	let myObject : Object3d | undefined = undefined;
	const dispatch = createEventDispatcher();
	
	const { self, contextCanvas, elementScene } = setupSimplesMesh(id , object);
	$: myObject = elementScene.raycaster?.add (self);
	
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
		transform(self, position, rotation, scale);
		contextCanvas.invalidate();
	}
	

	$: if (group && self  ){
		self.parent=group;
	}
	
	// atualmente o objeto é automaticamente raycaste //
	//mudar isso.
	onMount( () => { 
		if (elementScene?.raycaster && isInterative) {			
		}		
	});
	
	
	/*
	$: if (group){
		let myObject = parent.getObjectById(object.id);
		if (myObject) {
			myObject.parent =group;
		}
	}
	*/
	
</script>
{#if object}
	<slot></slot>
{/if}

