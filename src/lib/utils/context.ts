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
const CAMERAS = {};

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

export function setElementScene(key : string, elementScene : ElementScene ) {
    const contextCanvas : ContextCanvas  = getContext (SCENE) 
    if (elementScene){
        setContext ('ELEMENTSCENES'+key, elementScene)
        contextCanvas.arrayScenes.set (key , elementScene);
        contextCanvas.arrayScenes = contextCanvas.arrayScenes;
    }
    return  {elementScene, contextCanvas};
}

export function getElementScene(key : string ) {
	const contextCanvas : ContextCanvas  = getContext (SCENE);
	const elementScene : ElementScene = getContext ('ELEMENTSCENES'+key);
	// let elementScene = contextCanvas.arrayScenes.get(key);
	return {elementScene , contextCanvas};
}


export function sceneContext (key : string  , scene: THREE.Scene){
    setContext(('SCENE'+key) , scene);
	return scene;
}



export function setupCamera (key : string  , self : Camera ) {
    const contextCanvas : ContextCanvas  = getContext (SCENE) 
    let elementScene = contextCanvas.arrayScenes.get(key);
    if (elementScene !=null) {
        setContext('CAMERA'+key, self);
        const parent : THREE.Scene = getContext(('SCENE'+key)) || elementScene.scene;
            parent.add(self.target);
            elementScene.camera = self;
    }
    return  {self ,parent, contextCanvas};
}

export function getCamera(key : string ) {	
	const elementScene : ElementScene = getContext ('ELEMENTSCENES'+key);
	const camera : Camera  = getContext ('CAMERA'+key);
	return {elementScene , camera};
}


export function setupSimplesMesh(key : string , self ) {
    let contextCanvas :ContextCanvas  = getContext (SCENE) 
    let parent:THREE.Scene | undefined;
    let elementScene = contextCanvas.arrayScenes.get(key);
    if (elementScene !=null){
        parent = getContext(('SCENE'+key)) || elementScene.scene;
        parent.add(self);
    }
    return  {self, contextCanvas, elementScene, parent};
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
