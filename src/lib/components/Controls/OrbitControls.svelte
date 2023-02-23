<script lang="ts">
import * as THREE from 'three';
import { onDestroy, onMount } from 'svelte';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getElementScene } from '$lib/utils/context.js';
import { ControlCamera} from '$lib/core/objects.js';
import { createEventDispatcher } from 'svelte';
import { onFrame } from '$lib/utils/lifecycle.js';

export let id : string  = "default";

	export let autoRotate = false;
	export let autoRotateSpeed = 2;
	export let dampingFactor = 0.05;
	export let enableDamping = false;
	export let enabled = true;
	export let enablePan = true;
	export let enableRotate = true;
	export let enableZoom = true;
	export let keyPanSpeed = 7;
	export let keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };
	export let maxAzimuthAngle = Infinity;
	export let maxDistance = Infinity;
	export let maxPolarAngle = Math.PI;
	export let maxZoom = Infinity;
	export let minAzimuthAngle = Infinity;
	export let minDistance = 0;
	export let minPolarAngle = 0;
	export let minZoom = 0;
	export let mouseButtons = {
		LEFT: THREE.MOUSE.ROTATE,
		MIDDLE: THREE.MOUSE.DOLLY,
		RIGHT: THREE.MOUSE.PAN
	};
	export let panSpeed = 1;
	export let rotateSpeed = 1;
	export let screenSpacePanning = true;
	export let touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
	export let zoomSpeed = 1;
    //export let target = [0, 0, 0]; TODO
   
   
	let controls : OrbitControls;
	
	const {elementScene, contextCanvas} = getElementScene (id);
		
	let control = new ControlCamera (
        function OrbitFunction ( camera:THREE.Camera , canvas:HTMLElement ) {
		controls = new OrbitControls(camera, canvas);
		return controls;	
	})
	
	if (elementScene) {
	elementScene.orbitControl = control;
	elementScene.setControl();
    contextCanvas.invalidate();
   	}
 		
	$: if (controls) {
	
		controls.autoRotate = autoRotate;
		controls.autoRotateSpeed = autoRotateSpeed;
		controls.dampingFactor = dampingFactor;
		controls.enableDamping = enableDamping;
		controls.enabled = enabled;
		controls.enablePan = enablePan;
		controls.enableRotate = enableRotate;
		controls.enableZoom = enableZoom;
		controls.keyPanSpeed = keyPanSpeed;
		controls.keys = keys;
		controls.maxAzimuthAngle = maxAzimuthAngle;
		controls.maxDistance = maxDistance;
		controls.maxPolarAngle = maxPolarAngle;
		controls.maxZoom = maxZoom;
		controls.minAzimuthAngle = minAzimuthAngle;
		controls.minDistance = minDistance;
		controls.minPolarAngle = minPolarAngle;
		controls.minZoom = minZoom;
		controls.mouseButtons = mouseButtons;
		controls.panSpeed = panSpeed;
		controls.rotateSpeed = rotateSpeed;
		controls.screenSpacePanning = screenSpacePanning;
		controls.touches = touches;
		controls.zoomSpeed = zoomSpeed;
		controls.update();
		contextCanvas.invalidate();
		
	}
	
	$: if (elementScene) {
		elementScene.setControl();
	}
	
	onFrame(() => {
		//controls.update();
    });
 	
</script>