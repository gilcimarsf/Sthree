import * as THREE from 'three';
//const { ref, mixer, names, actions, clips } = useAnimations(animations)

interface AnimationDictionary {
    [name: string]: THREE.AnimationClip;
}
  
export function useAnimations<T extends THREE.AnimationClip>(
    clips: T[],
    model: THREE.Object3D
    ){    
    let actions: { [key in string]: THREE.AnimationAction | null } ={};
    let mixer = new THREE.AnimationMixer( model );
    let names : string[] = [];
    clips.forEach((clip) => {
       const action = mixer.clipAction(clip);
       actions[clip.name] = action ;    
    })
    names = clips.map((c) => c.name); 
       
    return {mixer , names, actions, clips}
}






/*
function loadAnimationsFromGLTF(gltf: GLTF) {
  const animations: AnimationDictionary = {};
  // Verificar se o GLTF tem animações
  if (gltf.animations && gltf.animations.length) {
  // Para cada animação no GLTF, adicione um AnimationClip ao objeto de animações
    for (let i = 0; i < gltf.animations.length; i++) {
      const animation = gltf.animations[i];
      animations[animation.name] = animation;
    }
  }
  return animations;
}
*/