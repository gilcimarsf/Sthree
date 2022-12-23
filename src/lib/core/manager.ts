import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type  {Camera, Object3d, ControlCamera} from '$lib/core/objects' 
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import type {RaycasterManager} from '$lib/core/raycaster.js'

import type {
    Scene,
    Object3D,
    WebGLRenderer,
    LoadingManager,
} from "three";

export class Composer {
    composer : EffectComposer | null =null;   
    target :THREE.WebGLRenderTarget | null =null; 
    //el :HTMLElement | null =null; 
    Callback : () => void ;
    constructor(Callback: () => void) {
        this.Callback = Callback;            
    }        
    initComposer (renderer : THREE.WebGLRenderer | null,  key: string, innerWidth: number , innerHeight: number )  {
        //this.el = el;
        if  (renderer != null) {
        this.target = new THREE.WebGLRenderTarget( innerWidth , innerHeight, 
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBAFormat,
                encoding: THREE.sRGBEncoding
        });
        this.composer = new EffectComposer( renderer, this.target );  
        this.composer.setPixelRatio( innerWidth / innerHeight );
        this.composer.setSize( innerWidth, innerHeight );
        this.Callback();
        }
     }   
 }
 
 
export class ElementScene {
    scene = new THREE.Scene ();
    el: HTMLElement | null = null;
    camera : Camera | null = null ;
    orbitControl : ControlCamera | null = null ; 
    renderer : WebGLRenderer | null = null ;
    composer : Composer | null = null ;
    onComposer : boolean = false;
    raycaster: RaycasterManager | null = null ;
    position : THREE.Vector2 = new THREE.Vector2(10000,10000);
    w : number =0;
    h : number =0;
    devicePixelRatio:number =0;
    id : string;    
        constructor(id : string) { 
        this.id = id;
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
    }
    
}

type mapArrayScenes = {
    
}

export class ContextCanvas {
    arrayScenes : Map<string,ElementScene> = new Map<string,ElementScene>();
    //arrayScenes = new Map<string,ElementScene >();
    //arrayScenes : {[id: string] : ElementScene; } = {};
    scene :Scene;
    scenes :Scene [] = [];
    camera : Camera | null ;
    object3d : Object3d[];
    object : Object3D [] ;
    orbitControl : ControlCamera | null;
    renderer : WebGLRenderer | null;
    composer : EffectComposer | null = null;
    onComposer : boolean = false;
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
    canvasClientX =0;
    canvasClientY=0;
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
    
    addElementScene = () =>{
    }
}



