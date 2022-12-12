import { getContext, setContext, onDestroy } from 'svelte';
import type  {ContextScenes} from '$lib/core/manager.js';
import type {Camera , Object3d} from '$lib/core/objects'
import type {RaycasterManager} from '$lib/core/raycaster.js'
import type { ScrollControlsState } from '$lib/core/ScrollControls'

const SCENES = {};
const PARENT = {};
const LOADMANAGER = {};
const RAYCASTER ={}
const SCROLL = {};
const GROUPS = {};
const GROUP = {};

export function set_scenes( scenes : ContextScenes) {
	setContext(SCENES, scenes);
	return scenes;
}

export function setupCamera (self : Camera ) {
    const contextScenes : ContextScenes  = getContext (SCENES) 
    const parent:THREE.Scene =  contextScenes.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self.target);
        contextScenes.camera =self;
    }
    return  {self, parent , contextScenes};
}

export function setupMesh(self : Object3d ) {
    let contextScenes :ContextScenes  = getContext (SCENES) 
    const parent:THREE.Scene =  contextScenes.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self.target);
        contextScenes.object3d = [...contextScenes.object3d,self ];
    }
    return  {self, parent , contextScenes};
}

export function setupSimplesMesh(self) {
    let contextScenes :ContextScenes  = getContext (SCENES) 
    let raycaster :RaycasterManager  = getContext (RAYCASTER) 
    const parent:THREE.Scene =  contextScenes.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self);
        contextScenes.object = [...contextScenes.object,self ];
    }
    return  {self, parent , contextScenes, raycaster };
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
	const contextScenes : ContextScenes  = getContext (SCENES); 
	return {contextScenes};
}

export function set_scroll( scrollControls : ScrollControlsState) {
	setContext(SCROLL, scrollControls);
	return scrollControls;
}


export function get_scroll() {
	const ScrollControls = getContext(SCROLL);
	return ScrollControls;
}

