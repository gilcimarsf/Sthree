<script lang="ts"> 

import * as THREE from 'three';
import * as defaults from '$lib/utils/defaults.js';
import { transform  } from '$lib/utils/utils.js';
import { setupSimplesMesh } from '$lib/utils/context.js';
import type { Object3d } from '$lib/core/objects.js';
import { createEventDispatcher } from 'svelte';


export let material : THREE.SpriteMaterial = new THREE.SpriteMaterial( { color: '#69f' }) ;
export let center : THREE.Vector2 = new THREE.Vector2 (0, 0);
export let isInterative : boolean = false; 
export let sprite :THREE.Sprite = new THREE.Sprite(material);
export let position :[number, number, number] = defaults.position;
export let rotation = defaults.rotation;
export let scale = defaults.scale;
export let group : THREE.Group | null = null;
let myObject : Object3d | undefined = undefined;

const dispatch = createEventDispatcher();

	
	const { self, contextCanvas, raycaster, parent } = 	setupSimplesMesh (sprite);
	
	$: if (group){
		let myObject = parent.getObjectById(sprite.id);
		if (myObject) {
			myObject.parent =group;
		}
	}
				
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
		self.center = center;
		transform(self, position, rotation, scale);
		contextCanvas.invalidate();
	}
</script>