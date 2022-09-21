import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type  {Camera, Object3d, ControlCamera} from './objects.js'

export class ContextScenes {
    scene :THREE.Scene;
    camera : Camera | undefined ;
    object3d : Object3d[] ;
    object : THREE.Object3D [] ;
    orbitControl : ControlCamera | undefined; 
    renderer : THREE.WebGLRenderer | undefined;
    manager :THREE.LoadingManager | undefined;
    invalidate :() => void ;
    before_render : Array<() => void> = [];
    frame: number | undefined = 0 ;
        constructor( invalidate : () => void ) {
            this.scene = new THREE.Scene ();
            this.invalidate = invalidate;
            this.camera = undefined;
            this.orbitControl  = undefined;
            this.renderer = undefined;
            this.object3d = [];
            this.object = [];
            this.manager = undefined;
            
        }
    update = ( w: number , h : number)=> {
    this.camera?.resize (w,h);
    }
    setRenderer = (renderer : THREE.WebGLRenderer)=>{
        this.renderer = renderer;
        if (this.orbitControl?.set && this.camera) {
            this.orbitControl.set(this.camera.target,this.renderer.domElement );
            
        }
    }
    addBeforeRender = (fn :() => void) =>{
        this.before_render.push(fn);
    }
}
