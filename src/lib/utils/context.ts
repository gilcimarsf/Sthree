import { getContext, setContext, onDestroy } from 'svelte';
import type  {ContextCanvas} from '$lib/core/manager.js';
import type {Camera , Object3d} from '$lib/core/objects'
import type {RaycasterManager} from '$lib/core/raycaster.js'
import type { ScrollControlsState } from '$lib/core/ScrollControls'
import type { ElementScene } from '$lib/core/manager.js';


const SCENE = {};
const PARENT = {};
const LOADMANAGER = {};
const RAYCASTER ={}
const SCROLL = {};
const SCENES = {};
const ELEMENTSCENES = {};

export function set_scenes( scenes : ContextCanvas) {
	setContext(SCENE, scenes);
	return scenes;
}



export function setloadManager( LoadingManager : THREE.LoadingManager) {
	setContext(LOADMANAGER, LoadingManager);
	return LoadingManager;
}

//talvez deletada
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

export function setupElementScene(id : string, self : ElementScene ) {
    const contextCanvas : ContextCanvas  = getContext (SCENE) 
    if (self){
        setContext (ELEMENTSCENES, self)
        contextCanvas.arrayScenes.set (id , self);
        contextCanvas.arrayScenes = contextCanvas.arrayScenes;
    }
    return  {self, contextCanvas};
}

export function setupCamera (key : string  , self : Camera ) {
    const contextCanvas : ContextCanvas  = getContext (SCENE) 
    const parent:THREE.Scene =  contextCanvas.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self.target);
        contextCanvas.camera =self;
             
        let value = contextCanvas.arrayScenes.get(key);
        if (value) {
            value.camera = self; 
            value.scene.add(self.target);
        }               
    }
    return  {self, parent , contextCanvas};
}

export function getElementScene(key : string ) {
	const contextCanvas : ContextCanvas  = getContext (SCENE); 
	let elementScene = contextCanvas.arrayScenes.get(key);
	return {elementScene , contextCanvas};
}

export function setupSimplesMesh(key : string , self ) {
    let contextCanvas :ContextCanvas  = getContext (SCENE) 
    let elementScene;  
    if (self){
        //setContext (PARENT, self)
        elementScene = contextCanvas.arrayScenes.get(key);
        if (elementScene) {
            elementScene.scene.add(self);
        }  
        
    }
    return  {self, contextCanvas, elementScene };
}

export function setupMesh(key : string , self : Object3d ) {
    let contextCanvas :ContextCanvas  = getContext (SCENE) 
    const parent:THREE.Scene =  contextCanvas.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self.target);
        contextCanvas.object3d = [...contextCanvas.object3d,self ];
        
        let value = contextCanvas.arrayScenes.get(key);
        if (value) {
            value.scene.add(self.target);
        }  
    }
    return  {self, parent , contextCanvas};
}
