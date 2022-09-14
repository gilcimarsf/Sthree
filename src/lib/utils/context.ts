import { getContext, setContext, onDestroy } from 'svelte';
import type  {ContextScenes} from '../core/manager.js';
import type {Camera , Object3d} from 'sthree-js/core/objects.js'

const SCENES = {};
const PARENT = {};

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
    const parent:THREE.Scene =  contextScenes.scene;
    if (self){
        setContext (PARENT, self)
        parent.add (self);
        contextScenes.object = [...contextScenes.object,self ];
    }
    return  {self, parent , contextScenes};
}