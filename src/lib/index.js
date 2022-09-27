export { default as Canvas } from './components/Canvas.svelte';

//CAMERAS
export { default as PerspectiveCamera } from './components/Cameras/PerspectiveCamera.svelte';
export { default as CubeCamera } from './components/Cameras/CubeCamera.svelte';

//OBJECTS
export { default as Boxes } from './components/Objects/boxes.svelte';
export { default as Mesh } from './components/Objects/Mesh.svelte';
export { default as Primitive } from './components/Objects/Primitive.svelte';
export { useGltf } from './loaders/GLTF';

//Enviroment
export { default as Environment } from './components/environments/Environment.svelte';

//Controls
export { default as OrbitControls } from './components/Controls/OrbitControls.svelte';

// lights
export { default as DirectionalLight } from './components/Light/DirectionalLight.svelte';

// lifecycle
export { onFrame } from './utils/lifecycle';