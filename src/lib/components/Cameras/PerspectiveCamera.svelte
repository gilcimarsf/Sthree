<script lang="ts">
import * as THREE from 'three';
import { setupCamera } from '$lib/utils/context.js';
import { Camera} from '$lib/core/objects.js';

export let id : string  = "default";
export let fov = 45;
export let near = 0.1;
export let far = 2000;
export let zoom = 1;

interface viewOffset {
 fullWidth: number;
 fullHeight: number;
 x: number;
 y: number;
 width: number;
 height: number;
}
 
export let viewOffset : viewOffset | undefined = undefined;
export let position = [0, 0, 10];
export let target = [0, 0, 0];
const target_vector = new THREE.Vector3();


let camera = new THREE.PerspectiveCamera() ;
let cameraObject = new Camera (camera);
const { self, contextCanvas} = setupCamera(id , cameraObject);


$: {
	self.target.fov = fov;
	self.target.near = near;
	self.target.far = far;
	self.target.zoom = zoom;
	
	if (viewOffset) {
		self.target.setViewOffset(
				viewOffset.fullWidth,
				viewOffset.fullHeight,
				viewOffset.x,
				viewOffset.y,
				viewOffset.width,
				viewOffset.height
			);
	}
	self.target.position.set(position[0], position[1], position[2]);
	target_vector.set(target[0], target[1], target[2]);
	self.target.lookAt(target_vector);

	self.target.updateProjectionMatrix();
	//contextCanvas.invalidate();
	
}


</script>

<slot/>