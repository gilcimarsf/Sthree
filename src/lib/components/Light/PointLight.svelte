<script lang="ts">
    import * as THREE from 'three';
    import { setupSimplesMesh } from '$lib/utils/context.js';

    export let id: string = "default";
    export let color: string | number | THREE.Color = 0xffffff;
    export let intensity = 1;
    export let distance = 0;
    export let decay = 1;
    export let position = [0, 0, 0];
    export let shadow: boolean | THREE.PointLightShadow = true;
    
    export let shadowMapWidth = 2048;
    export let shadowMapHeight = 2048;
    export let shadowCameraNear = 0.1;
    export let shadowCameraFar = 1000;
    

    const light = new THREE.PointLight(color, intensity, distance, decay);
    const { self, contextCanvas, elementScene } = setupSimplesMesh(id, light);

    $: {
        self.color.set(color);
        self.intensity = intensity;
        self.distance = distance;
        self.decay = decay;
        self.position.set(position[0], position[1], position[2]);
    }
    $: {
		if (shadow) {
            light.castShadow = true;
            light.shadow.mapSize.width = shadowMapWidth;
            light.shadow.mapSize.height = shadowMapHeight;
            light.shadow.camera.near = shadowCameraNear;
            light.shadow.camera.far = shadowCameraFar;
	    }
	}
</script>
