import * as THREE from 'three';
import {Camera , Object3d} from '$lib/core/objects'



export class RaycasterEvent {
    type: string
    cancelBubble: boolean
    originalEvent?: Event
    
    // Dummy default values
    coords: THREE.Vector2 = new THREE.Vector2(0, 0)
    distance: number = 0
    intersected: boolean = false
    
    constructor(type: string, originalEvent: Event) {
    this.cancelBubble = false;
    this.type = type;
    this.originalEvent = originalEvent;
    }
    stopPropagation() {
    this.cancelBubble = true;
    }
}

export class RaycasterManager {
    raycaster: THREE.Raycaster
    closestObject?: Object3d
    pointer : THREE.Vector2
    canvas?:HTMLElement
    camera?: THREE.Camera
    object3d: Object3d[]
    renderer? : THREE.WebGLRenderer
    
    //currentObjectRaycaster: Object3d | null;
    constructor( ) {
        this.raycaster = new THREE.Raycaster();
        this.pointer = new THREE.Vector2 (0,0);
        this.object3d = [];       
    }
    onCanvas = (canvas :HTMLElement, renderer : THREE.WebGLRenderer)=>{
        this.canvas = canvas;
        this.renderer = renderer
        this.canvas.addEventListener('click', this.onMouseClick);    
        this.canvas.addEventListener('pointermove', this.onDocumentMouseMove); 
        this.canvas.addEventListener('pointerdown', this.onMouseDown);
        this.canvas.addEventListener('pointerup', this.onMouseUp);
        //this.canvas.addEventListener('mousemove', this.onDocumentMouseMove);
        //this.canvas.addEventListener('mousedown', this.onMouseDown);
        //this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('touchstart', this.onTouchStart, {
            passive: true,
        });
        this.canvas.addEventListener('touchmove', this.onTouchMove, {
            passive: true,
        });
        this.canvas.addEventListener('touchend', this.onTouchEnd, {
            passive: true,
        });   
        
    }
    
    dispose = () => {
        if (this.canvas != null) {
            this.canvas.removeEventListener('click', this.onMouseClick);
            this.canvas.ownerDocument.removeEventListener( 'pointermove', this.onDocumentMouseMove );
            this.canvas.removeEventListener('pointerdown', this.onMouseDown);
            this.canvas.removeEventListener('pointerup', this.onMouseUp);
            this.canvas.removeEventListener('touchstart', this.onTouchStart);
            this.canvas.removeEventListener('touchmove', this.onTouchMove);
            this.canvas.removeEventListener('touchend', this.onTouchEnd);
        }
    };
    
    add = (object: THREE.Object3D)  => {
        if (object) {
            let newObject = new Object3d (object);
            this.object3d.push(newObject);
            return newObject;
        }
    }
    
    update = (pointer : THREE.Vector2, camera : THREE.Camera ) =>{
        //console.log (pointer)
        this.pointer = pointer;
        this.camera = camera;
        let direcition = this.camera.getWorldDirection;
        this.raycaster.setFromCamera (pointer , camera);
        this.raycaster.setFromCamera (pointer , camera);
        if  (this.object3d != null) {
            this.object3d.forEach ((object : Object3d) => {
                if (object.target) this.checkIntersection(object);
            });
        }
        this.object3d.sort(function (a, b) {
            return a.distance - b.distance;
        });
        
        const newClosestObject = this.object3d.find((object) => object.intersected) ?? null;
        if (newClosestObject != this.closestObject){
            if (this.closestObject) {
            const eventOutClosest = new RaycasterEvent('mouseout');
            this.dispatch(this.closestObject, eventOutClosest);
            }
            if (newClosestObject) {
            const eventOverClosest = new RaycasterEvent('mouseover');
            this.dispatch(newClosestObject, eventOverClosest);
            }
            this.closestObject = newClosestObject;
        }
    }
    checkIntersection = (object :Object3d ) => {
        const intersects = this.raycaster.intersectObjects([object.target], true);
        object.wasIntersected = object.intersected;
        if ( intersects.length > 0 ) {
            let distance = intersects[0].distance;
            intersects.forEach((i) => {
                if (i.distance < distance) {
                  distance = i.distance;
                }
                object.intersected = true;
                object.distance = distance;
                if (object.callback) {object.callback();}               
            });
        }else {        
            object.intersected = false;
        }               
    }
    dispatch = (object: Object3d, event: RaycasterEvent) => {
        if (object.target && !event.cancelBubble) {
            event.coords = this.pointer;
            event.distance = object.distance;
            event.intersected = object.intersected;
            object.target.dispatchEvent(event);
        }
    }
    
    onMouseClick = (mouseEvent: MouseEvent) => {
    const event = new RaycasterEvent('click', mouseEvent);
        if (this.object3d !=null){
            this.object3d.forEach((object) => {
                if (object.intersected) {
                  this.dispatch(object, event);
                }
            });
        }
    };
    
    onMouseUp = (mouseEvent: MouseEvent | PointerEvent)  => {
    const event = new RaycasterEvent('mouseup', mouseEvent);
        if (this.object3d !=null){
            this.object3d.forEach((object) => {
                if (object.intersected) {
                  this.dispatch(object, event);
                }
            });
        }        
    };
    
    onDocumentMouseMove = (mouseEvent: MouseEvent | PointerEvent) => {
        const event = new RaycasterEvent('mousemove', mouseEvent);
        if (this.object3d !=null){
            this.object3d.forEach((object) => {
                if (object.intersected) {
                  this.dispatch(object, event);
                }
            });
        }  
    };
    
    onMouseDown = (mouseEvent: MouseEvent | PointerEvent)  => {
       // console.log("onMouseDown");
        const event = new RaycasterEvent('onMouseDown', mouseEvent);
        if (this.object3d !=null){
            this.object3d.forEach((object) => {
                if (object.intersected) {
                  this.dispatch(object, event);
                }
            });
        }  
    };
    
 
    onTouchMove = (touchEvent: TouchEvent)  => {
       //console.log("onTouchMove");
    };
    
        
    onTouchStart = (touchEvent: TouchEvent)  => {
       //console.log("onTouchStart");
    };
    
    onTouchEnd = (touchEvent: TouchEvent)  => {
      //console.log("onTouchEnd");
    };   
      
}

