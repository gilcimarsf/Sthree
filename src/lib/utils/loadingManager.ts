import { test } from 'sthree-js/core/objects';
import * as THREE from 'three';


let manager = new THREE.LoadingManager();

export function loadingManager () {
    return manager;
}


/*

export function loadingManager () {
         
    manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
    //console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    
    manager.onLoad = function ( ) {
    // console.log( 'Loading complete!');
    };
    
    
    manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
    //console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
    };
    
    manager.onError = function ( url ) {
    //console.log( 'There was an error loading ' + url );
    };
    
    return manager;
}

*/

