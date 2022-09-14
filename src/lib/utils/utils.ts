import type * as THREE from 'three';
import { createEventDispatcher } from 'svelte';
import type { position,rotation,scale } from './defaults.js';


export function transform(object :THREE.Mesh | THREE.Object3D , Position: typeof position , Rotation : typeof rotation, Scale : typeof scale ) {
	object.position.set(Position[0], Position[1], Position[2]);

	object.rotation.set(Rotation[0], Rotation[1], Rotation[2], Rotation[3]);

	if (typeof Scale === 'number') {
		object.scale.set(Scale, Scale, Scale);
	} else {
		object.scale.set(Scale[0], Scale[1], Scale[2]);
	}
}


export function dispatchEvent () {
	const dispatch = createEventDispatcher();
	dispatch('message', { text: 'Hello!' });
}


