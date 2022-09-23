import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type  {Camera, Object3d, ControlCamera} from './objects.js'

import type {
    Scene,
    Object3D,
    WebGLRenderer,
    LoadingManager,
} from "three";



export class ContextScenes {
    scene :Scene;
    camera : Camera | null ;
    object3d : Object3d[] ;
    object : Object3D [] ;
    orbitControl : ControlCamera | null; 
    renderer : WebGLRenderer | null;
    manager : LoadingManager | null;
    invalidate :() => void ;
    before_render : Array <() => void>;
    frame: number | null = 0 ;
        constructor( invalidate : () => void ) {
            this.scene = new THREE.Scene ();
            this.invalidate = invalidate;
            this.camera = null;
            this.orbitControl  = null;
            this.renderer = null;
            this.object3d = [];
            this.object = [];
            this.manager = null;
            this.before_render = [];
            
        }
    update = ( w: number , h : number)=> {
    this.camera?.resize (w,h);
    }
    setRenderer = (renderer : WebGLRenderer)=>{
        this.renderer = renderer;
        if (this.orbitControl?.set && this.camera) {
            this.orbitControl.set(this.camera.target,this.renderer.domElement );
            
        }
    }
    addBeforeRender = (fn : () => void) =>{
        this.before_render.push(fn);
    }
}
