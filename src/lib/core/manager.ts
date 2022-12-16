import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type  {Camera, Object3d, ControlCamera} from '$lib/core/objects' 
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
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
    composer : EffectComposer | null = null;
    manager : LoadingManager | null;
    invalidate :() => void ;
    before_render : Array <() => void>;
    frame: number | null = 0 ;
    frameloop: 'always' | 'demand' | 'never';
    el: HTMLElement | null = null;
    container: HTMLElement | null = null;
    clock: THREE.Clock  = new THREE.Clock(); 
    devicePixelRatio: number =0;
    w: number =0;
    h: number =0;
        constructor( invalidate : () => void, frameloop: 'always' | 'demand' | 'never') {
            this.scene = new THREE.Scene ();
            this.invalidate = invalidate;
            this.camera = null;
            this.orbitControl  = null;
            this.renderer = null;
            this.object3d = [];
            this.object = [];
            this.manager = null;
            this.before_render = [];   
            this.frameloop = frameloop;
        }
    update = ( w: number , h : number, devicePixelRatio: number)=> {
    this.w = w;
    this.h = h;
    this.devicePixelRatio = devicePixelRatio; 
    this.camera?.resize (w,h);
    }
    setRenderer = (renderer : WebGLRenderer)=>{
        this.renderer = renderer;
        if (this.orbitControl?.set && this.camera) {
            this.orbitControl.set(this.camera.target,this.renderer.domElement );
            
        }
    }
    setControl = () => {
        if (this.orbitControl?.set && this.camera && this.renderer) {
            this.orbitControl.set(this.camera.target,this.renderer.domElement );
        }
    }
    addBeforeRender = (fn : () => void) =>{
        this.before_render.push(fn);
    }
    setFrameloop = (frameloop: 'always' | 'demand' | 'never' = 'always') =>{
    
    this.clock.elapsedTime = 0
    if (frameloop !== 'never') {
        this.clock.start()
        this.clock.elapsedTime = 0
        }

    }
}
