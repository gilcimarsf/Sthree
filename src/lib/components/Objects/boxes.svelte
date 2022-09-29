<script lang="ts">
  import * as THREE from 'three';
  import { setupMesh } from '$lib/utils/context.js';
  import { Object3d } from '$lib/core/objects.js';
  
  const geometry = new THREE.BoxGeometry( 20, 20, 20 );
  

  for ( let i = 0; i < 100; i ++ ) {
    const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

    object.position.x = Math.random() * 800 - 400;
    object.position.y = Math.random() * 800 - 400;
    object.position.z = Math.random() * 800 - 400;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.rotation.z = Math.random() * 2 * Math.PI;

    object.scale.x = Math.random() + 0.5;
    object.scale.y = Math.random() + 0.5;
    object.scale.z = Math.random() + 0.5;
    
    let myObject = new Object3d ( object);
    const { self, contextScenes } = setupMesh(myObject);
      
    self.target.addEventListener('mouseover', (event) => {
      console.log(event);

      event.target.material.color.set(0xff0000);

      document.body.style.cursor = 'pointer';
    });
    self.target.addEventListener('mouseout', (event) => {
      console.log(event);

      event.target.material.color.set(0x000000);

      document.body.style.cursor = 'default';
    });
    self.target.addEventListener('mousedown', (event) => {
      console.log(event);

      event.target.material.color.set(0x0000ff);
    });
    self.target.addEventListener('mouseup', (event) => {
      console.log(event);

      if (event.intersected) {
        event.target.material.color.set(0xff0000);
      } else {
        event.target.material.color.set(0x000000);
      }
    });
    self.target.addEventListener('click', (event) => {
      console.log(event);
    });
}    
</script>