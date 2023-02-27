<script lang="ts">
    import * as THREE from 'three';
    import { setupSimplesMesh } from '$lib/utils/context.js';

    export let id: string = "default";
    export let color: string | number | THREE.Color = 0xffffff;
    export let intensity = 1;
    export let distance = 0;
    export let decay = 1;
    export let position = [0, 0, 0];

    const light = new THREE.PointLight(color, intensity, distance, decay);
    const { self, contextCanvas, elementScene } = setupSimplesMesh(id, light);

    $: {
        self.color.set(color);
        self.intensity = intensity;
        self.distance = distance;
        self.decay = decay;
        self.position.set(position[0], position[1], position[2]);
    }
</script>
