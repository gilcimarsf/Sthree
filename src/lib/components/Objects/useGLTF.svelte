<script lang="ts">
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { onMount, afterUpdate  } from "svelte";
import { Object3d } from '../../core/objects.js';
import { setupMesh } from '../../utils/context.js';
import { createEventDispatcher } from 'svelte';
import Primitive from '../Objects/Primitive.svelte'



export let urlModel : any;
let character = null;
let myObject : Object3d | null = null;

const loadModels = async () => {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync( urlModel );
    
  return gltf;
}


const meshGltf = async () => { 
  const model = await loadModels ();  
  //myObject = new Object3d(model.scene.children[0]);
  parse (model);
  
  model.scene.traverse ((child) =>{
    if ((<THREE.Mesh> child).isMesh){
      if ((child as THREE.Mesh).geometry){
		myObject = new Object3d(child);
      }
    }
  });
  
  
}


function unicName (attempt: string, index = 0){
  const newAttempt = index > 0 ? attempt + index : attempt;
  if (Object.values(duplicates.geometries).find(({ name }) => name === newAttempt) === undefined) return newAttempt;
  else return unicName(attempt , index + 1);
}
  
  
function parse (gltf: GLTF , options = {}){
	const animations = gltf.animations;
	const hasAnimations = animations.length >0;
	/**collect objects**/
	const objects = [];
	gltf.scene.traverse ((child) =>objects.push(child));

	let meshes = objects.filter((o) => o.isMesh && o.__removed === undefined);
  let bones = objects.filter((o) => o.isBone && !(o.parent && o.parent.isBone) && o.__removed === undefined);
    
  meshes.map (({ name, type, geometry }) => {
  
  });

    //meshes.map(({ name, type }) => (isVarName(name) ? name : `['${name}']`) + ': THREE.' + type).join(',')
    console.log (bones);
}



onMount(() => {
  meshGltf();
})

$: { 
  if (myObject != null) {
    const { self, contextScenes } = setupMesh(myObject);
    //console.log(self);
    const dispatch = createEventDispatcher();
    
  	self.target.addEventListener('mouseover', (event) => {
  		//console.log(event);
  		dispatch('mouseover', event);
  	});            
  	self.target.addEventListener('mouseout', (event) => {
  		//console.log(event);
  		dispatch('mouseout', event);
  	});
    self.target.addEventListener('mousedown', (event) => {
  		//console.log(event);
  		dispatch('mousedown', event);
  	});
    self.target.addEventListener('mouseup', (event) => {
  		//console.log(event);
  		dispatch('mouseup', event);
  	});
  	self.target.addEventListener('click', (event) => {
  		//console.log(event);
  		dispatch('click', event);
  	})
	}
}


</script>

{#if myObject}
  <Primitive
    object={myObject.target}
    scale={[8,8,8]}
  />
{/if}