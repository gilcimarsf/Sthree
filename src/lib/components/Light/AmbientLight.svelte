<script lang="ts">
    import * as THREE from 'three';
    import { setupSimplesMesh } from '$lib/utils/context.js';

    export let id: string = "default";
    export let color: string | number | THREE.Color = 0xffffff;
    export let intensity = 1;

    const light = new THREE.AmbientLight(color, intensity);
    const { self, contextCanvas, elementScene } = setupSimplesMesh(id, light);

    $: {
        self.color.set(color);
        self.intensity = intensity;
    }
</script>
