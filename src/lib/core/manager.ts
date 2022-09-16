import * as THREE from 'three';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type  {Camera, Object3d} from './objects.js'

export class ContextScenes {
    scene :THREE.Scene;
    camera : Camera | undefined ;
    object3d : Object3d[] ;
    object : THREE.Object3D [] ;
    orbitControl : OrbitControls | undefined; 
    renderer : THREE.WebGLRenderer | undefined;
    manager :THREE.LoadingManager | undefined;;
        constructor() {
            this.scene = new THREE.Scene ();
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
    invalidate = ()=>{
    
    }
}