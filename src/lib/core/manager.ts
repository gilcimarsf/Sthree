import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type  {Camera, Object3d, ControlCamera} from '$lib/core/objects' 
import type{ EffectComposer, Pass} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type {RaycasterManager} from '$lib/core/raycaster.js'

import type {
    Scene,
    Object3D,
    WebGLRenderer,
    LoadingManager,
} from "three";

 
export class ElementScene {
    scene : THREE.Scene
    el?: HTMLElement
    canvas: HTMLCanvasElement | THREE.OffscreenCanvas | undefined
    camera? : Camera
    orbitControl? : ControlCamera
    renderer? : WebGLRenderer
    composer? : EffectComposer
    onComposer : boolean = false
    raycaster?: RaycasterManager
    position : THREE.Vector2 = new THREE.Vector2(10000,10000)
    w : number =0
    h : number =0
    devicePixelRatio:number =0
    id : string;    
        constructor(id : string, scene : THREE.Scene ) { 
        this.id = id;
        this.scene = scene;
        }
    
    setControl = () => {
        if (this.orbitControl && this.camera && this.renderer && this.el )  {
            this.orbitControl.Callback (this.camera.target,this.el)
        } 
    }
    
    update = ( w: number , h : number)=> {
         this.w = w;
        this.h = h;
        this.devicePixelRatio = w /h ;
        this.camera?.resize (w,h);
        if (this.composer != null) {
            this.composer.setSize (w , h);
        }      
    }
    
}

type mapArrayScenes = {    
}

export class ContextCanvas {
    arrayScenes : Map<string,ElementScene> = new Map<string,ElementScene>();
    //arrayScenes = new Map<string,ElementScene >();
    //arrayScenes : {[id: string] : ElementScene; } = {};
    //scene :Scene
    //scenes :Scene [] = []
    camera?: Camera
    object3d : Object3d[]
    object : Object3D []
    //orbitControl? : ControlCamera
    renderer? : WebGLRenderer
    //composer? : EffectComposer
    onComposer : boolean = false
    manager? : LoadingManager
    invalidate :() => void 
    before_render : Array <() => void>
    frame: number = 0 
    frameloop: 'always' | 'demand' | 'never'
    el?: HTMLElement
    container?: HTMLElement
    clock: THREE.Clock  = new THREE.Clock();
    devicePixelRatio: number =0
    w: number =0
    h: number =0
    //canvasClientX =0
    //canvasClientY=0
        constructor( invalidate : () => void, frameloop: 'always' | 'demand' | 'never') {
            this.scene = new THREE.Scene ();
            this.invalidate = invalidate;
            this.object3d = [];
            this.object = [];
            this.before_render = [];   
            this.frameloop = frameloop;
        }
    /*
    update = ( w: number , h : number, devicePixelRatio: number)=> {
    this.w = w;
    this.h = h;
    this.devicePixelRatio = devicePixelRatio; 
    this.camera?.resize (w,h);
      
    }*/
    
    /*
    setRenderer = (renderer : WebGLRenderer)=>{
        this.renderer = renderer;
        if (this.orbitControl?.set && this.camera) {
            this.orbitControl.set(this.camera.target,this.renderer.domElement );
            
        }
    }*/
    
    /*setControl = () => {
        if (this.orbitControl?.set && this.camera && this.renderer) {
            this.orbitControl.set(this.camera.target,this.renderer.domElement );
        }
    }*/
    
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
    
    addElementScene = () =>{
    }
}



