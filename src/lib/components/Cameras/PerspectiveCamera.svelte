<script lang="ts">
import * as THREE from 'three';
import { setupCamera } from '../../utils/context.js';
import { Camera} from '../../core/objects.js';


export let fov = 45;
export let near = 0.1;
export let far = 2000;
export let zoom = 1;

/** @type {{
 *   fullWidth: number;
 *   fullHeight: number;
 *   x: number;
 *   y: number;
 *   width: number;
 *   height: number;
 * }} */
export let viewOffset = undefined;

export let position = [0, 0, 5];

export let target = [0, 0, 0];

const target_vector = new THREE.Vector3();


let camera = new THREE.PerspectiveCamera( );
let cameraObject = new Camera ( camera);
const { self, contextScenes } = setupCamera(cameraObject);


$: {

	self.target.fov = fov;
	self.target.near = near;
	self.target.far = far;
	self.target.zoom = zoom;
	self.target.position.z = 3;		
	
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
}


</script>

<slot/>