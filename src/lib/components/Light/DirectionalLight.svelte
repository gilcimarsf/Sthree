<script lang="ts">
    import * as THREE from 'three';
    import { setupSimplesMesh } from '$lib/utils/context.js';
   
	export let id : string  = "default";
    export let color : string | number | THREE.Color = 0xffffff;
	export let intensity = 1;
    export let position = [0, 1, 0];
    export let target = [0, 0, 0];
    export let shadow : boolean |THREE.DirectionalLightShadow = true;
   
    
    const light = new THREE.DirectionalLight( 0xffffff, 1);
    const { self, contextCanvas, elementScene } = setupSimplesMesh(id , light);
    
    $: {
		self.color.set(color);
		self.intensity = intensity;

		self.position.set(position[0], position[1], position[2]);
		self.target.position.set(target[0], target[1], target[2]);

	}
	
    $: {
		if (shadow) {
			const {
				mapSize = new THREE.Vector2(512, 512),
				camera: { left = -5, bottom = -5, right = 5, top = 5, near = 0.5, far = 500 } = {},
				bias = 0,
				radius = 1
			} = shadow === true ? {} : shadow;

			self.shadow.mapSize.set(mapSize[0], mapSize[1]);
			self.shadow.camera.left = left;
			self.shadow.camera.top = top;
			self.shadow.camera.right = right;
			self.shadow.camera.bottom = bottom;
			self.shadow.camera.near = near;
			self.shadow.camera.far = far;
			self.shadow.bias = bias;
			self.shadow.radius = radius;

			self.castShadow = true;
		} else {
			self.castShadow = false;
		}
	}
       
    </script>