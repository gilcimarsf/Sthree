import { getContext, setContext, onDestroy } from 'svelte';
import type  {ContextCanvas} from '$lib/core/manager.js';
import type {Camera , Object3d} from '$lib/core/objects'
import type {RaycasterManager} from '$lib/core/raycaster.js'
import type { ScrollControlsState } from '$lib/core/ScrollControls'

const SCENE = {};
const PARENT = {};
const LOADMANAGER = {};
const RAYCASTER ={}
const SCROLL = {};
const SCENES = {};

export function set_scenes( scenes : ContextCanvas) {
	setContext(SCENE, scenes);
	return scenes;
}

export function setupCamera (self : Camera ) {
    const contextCanvas : ContextCanvas  = getContext (SCENE) 
    const parent:THREE.Scene =  contextScenes.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self.target);
        contextScenes.camera =self;
    }
    return  {self, parent , contextCanvas};
}

export function setupMesh(self : Object3d ) {
    let contextCanvas :ContextCanvas  = getContext (SCENE) 
    const parent:THREE.Scene =  contextCanvas.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self.target);
        contextCanvas.object3d = [...contextCanvas.object3d,self ];
    }
    return  {self, parent , contextCanvas};
}

export function setupSimplesMesh(self) {
    let contextCanvas :ContextCanvas  = getContext (SCENE) 
    let raycaster :RaycasterManager  = getContext (RAYCASTER) 
    const parent:THREE.Scene =  contextCanvas.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self);
        contextCanvas.object = [...contextCanvas.object,self ];
    }
    return  {self, parent , contextCanvas, raycaster };
}

export function setloadManager( LoadingManager : THREE.LoadingManager) {
	setContext(LOADMANAGER, LoadingManager);
	return LoadingManager;
}

export function setRaycaster( raycaster : RaycasterManager) {
	setContext(RAYCASTER, raycaster);
	return raycaster;
}

export function get_scenes() {
	const contextCanvas : ContextCanvas  = getContext (SCENE); 
	return {contextCanvas};
}

export function set_scroll( scrollControls : ScrollControlsState) {
	setContext(SCROLL, scrollControls);
	return scrollControls;
}


export function get_scroll() {
	const ScrollControls = getContext(SCROLL);
	return ScrollControls;
}

export function setupScenes (self : THREE.Scene ) {
    const contextCanvas : ContextCanvas  = getContext (SCENE) 
    if (self){
        setContext (SCENES, self)
        contextCanvas.scenes = [...contextCanvas.scenes,self ];
    }
    return  {self, contextCanvas};
}