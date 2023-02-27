export { default as Canvas } from './components/Canvas.svelte';

//CAMERAS
export { default as PerspectiveCamera } from './components/Cameras/PerspectiveCamera.svelte';
export { default as CubeCamera } from './components/Cameras/CubeCamera.svelte';

//OBJECTS
export { default as Boxes } from './components/Objects/boxes.svelte';
export { default as Mesh } from './components/Objects/Mesh.svelte';
export { default as Primitive } from './components/Objects/Primitive.svelte';
export { default as Sprite } from './components/Objects/Sprite.svelte';
export { default as Group } from './components/Objects/Group.svelte';
export { useGltf } from './loaders/useGLTF';
export { useAnimations } from './core/useAnimation';

//Enviroment
export { default as Environment } from './components/environments/Environment.svelte';

//Controls
export { default as OrbitControls } from './components/Controls/OrbitControls.svelte';

// lights
export { default as DirectionalLight } from './components/Light/DirectionalLight.svelte';
export { default as AmbientLight } from './components/Light/AmbientLight.svelte';
export { default as HemisphereLight } from './components/Light/HemisphereLight.svelte';
export { default as PointLight } from './components/Light/PointLight.svelte';
export { default as SpotLight } from './components/Light/SpotLight.svelte';

// lifecycle
export { onFrame } from './utils/lifecycle';

//Web
//ScrollControls
export { default as ScrollControls } from './components/Web/ScrollControls.svelte';


//postprocesing
export { default as EffectComposer} from './postprocessing/EffectComposer.svelte'

//renderers
export { default as View} from './components/renderers/view.svelte'