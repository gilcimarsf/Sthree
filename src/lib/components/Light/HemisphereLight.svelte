<script lang="ts">
    import * as THREE from 'three';
    import { setupSimplesMesh } from '$lib/utils/context.js';

    export let id: string = "default";
    export let skyColor: string | number | THREE.Color = 0xffffff;
    export let groundColor: string | number | THREE.Color = 0xffffff;
    export let intensity = 1;

    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    const { self, contextCanvas, elementScene } = setupSimplesMesh(id, light);

    $: {
        self.color.set(skyColor);
        self.groundColor.set(groundColor);
        self.intensity = intensity;
    }
</script>
