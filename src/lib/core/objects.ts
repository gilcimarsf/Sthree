import { createEventDispatcher } from 'svelte';

export class ControlCamera {
    Callback : (camera:THREE.Camera , canvas:HTMLElement) => void;
    constructor(Callback: (camera:THREE.Camera , canvas:HTMLElement) => void) {
            this.Callback = Callback;            
        } 
    set (camera:THREE.Camera , canvas:HTMLElement) {
        if (camera && canvas) {
            this.Callback(camera, canvas);
        }
    }
}


export class Camera {
    target : THREE.PerspectiveCamera;
    constructor(target: THREE.PerspectiveCamera ) {
            this.target = target;            
        }
    resize (W : number, H : number) {
       this.target.aspect= W /H ;
       this.target.updateProjectionMatrix();
    }
 }



//não usando.
//não usando.
//não usando.
 export class Renderer {
    target : THREE.PerspectiveCamera;
    constructor(target: THREE.PerspectiveCamera ) {
            this.target = target;            
        }
    resize (W : number, H : number) {
       this.target.aspect= W /H ;
    }
 }




 export class Object3d {
    target : THREE.Mesh | THREE.Object3D | THREE.Group;
    isInterative : boolean = false;
    name : string;
    key : string;
    intersected: boolean;
    wasIntersected : boolean = false;
    distance : number;
    callback? : ()=> void;
    constructor (target: THREE.Mesh | THREE.Object3D | THREE.Group ) {
            this.target = target;
            this.name =  target.name;
            this.intersected = false;
            this.distance = 0;
            this.key = '';
    }
}

