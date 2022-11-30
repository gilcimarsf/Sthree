![logo](sthree.jpg)
# STHREE
A Three.js component library project inspired by the svelte-cubed project, 
and other wonderful tools like React Three Fiber and react-three/drei

## Getting Started

```bash
npm install sthree-js
```

## Usage
```bash
import * as St from 'sthree-js';
```

### Index Basic Features
<table>
<tr>
 <td valign="top">
 <ul>
  <li><a href="#cameras">Cameras</a></li>
 <ul>
  <li><a href="#perspectivecamera">PerspectiveCamera</a></li>
  <li><a href="#cubecamera">CubeCamera</a></li>
 </ul>
  <li><a href="#controls">Controls</a></li>
 <ul>
  <li><a href="#OrbitControls">OrbitControls</a></li>
 </ul>
  <li><a href="#Light">Light</a></li>
 <ul>
  <li><a href="#DirectionalLight">DirectionalLight</a></li>
 </ul>
  <li><a href="#Loader">Loader</a></li>
  <ul>
  <li><a href="#useGLTF">useGLTF</a></li>
  </ul>
  <li><a href="#Objects">Objects</a></li>
  <ul>
  <li><a href="#Mesh">Mesh</a></li>
  <li><a href="#Primitive">Primitive</a></li>
  </ul>
  <li><a href="#Raycaster">Raycaster</a></li>
  <ul>
  <li><a href="#Raycaster">Raycaster</a></li>
  </ul>
 
 </td>     
</tr>
</table>

### Index Advanced Features
<table>
<tr>
 <td valign="top">
  <ul>
    <li><a href="#Controls">Controls</a></li>
     <ul>
     <li><a href="#ScrollControls">ScrollControls</a></li>
     </ul>
  </ul> 
  <ul>
    <li><a href="#Enviroment">Enviroment</a></li>
     <ul>
     <li><a href="#Environment">Environment</a></li>
     </ul>
  </ul> 
  </td>     
</table>

# Index Basic Features

# Cameras
### PerspectiveCamera
A standard [THREE.PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera) 

```js
<St.PerspectiveCamera/>
```
### CubeCamera
A standard [THREE.CubeCamera](https://threejs.org/docs/#api/en/cameras/CubeCamera) 

```js
export let envMap
$: chromeMaterial = new THREE.MeshLambertMaterial( { color: 0x555fff, envMap: envMap } );
<St.CubeCamera bind:envMap/>
```

# Controls
### OrbitControls
A standard [OrbitControls](https://threejs.org/docs/?q=OrbitControls#examples/en/controls/OrbitControls) 

```js
<St.OrbitControls/>
```

# Light
### DirectionalLight
A standard [THREE.DirectionalLight](https://threejs.org/docs/?q=DirectionalLight#api/en/lights/DirectionalLight) 

```js
<St.DirectionalLight/>
```

# Loader
### useGLTF
useGLTF an easy way to async load 3d models in gltf format 

```js
import {useGltf} from 'sthree-js';
onMount(async() => {
	 gltf = await useGltf ('/models/gltf/Fox.glb');
	 model = gltf.scene; 	
	 <St.Primitive object={model} scale ={1} on:mouseover ={play} isInterative={true} />
});
```

# Objects
### Mesh
A standard [THREE.Mesh](https://threejs.org/docs/?q=Mesh#api/en/objects/Mesh) 

```js
let Sphere = new THREE.SphereGeometry();
<St.Mesh geometry = {Sphere}  scale ={1} isInterative = {true} material ={material} />
```

### Primitive
an easy way to place objects, cameras, light, etc.
```js
<St.Primitive object={model} scale ={1} on:mouseover ={play} isInterative={true} />
```
# Raycaster
### Raycaster
A standard [THREE.Raycaster](https://threejs.org/docs/#api/en/core/Raycaster) 
to activate the raycaster sister, simply activate it on the objects: isInterative = {true} and on:eventname

```js
<St.Primitive object={model} scale ={.3} on:mouseover ={play} isInterative={true} />
```
<br/>
<br/>

# Index Advanced Features
# Controls
### ScrollControls
ScrollControls allow you to make scroll effects.
it works with a container in front of the threejs screen. everything inside < ScrollControls > will be affected, including HTML components.

```js
 <St.Canvas>	
        <St.ScrollControls> 
            <div>
                <button class="class" on:click={()=> press()} > button </button>
            </div>
            <St.PerspectiveCamera/>
            <St.Mesh geometry = {myBox}  scale ={.5} isInterative = {true} material ={chromeMaterial}/>
            <St.DirectionalLight/>
        </St.ScrollControls>
    </St.Canvas>	
    

```
it is possible to access scroll data through the ScrollProps store, the current scroll, and range functions: range, curve and visible
```js
 import { ScrollProps } from 'sthree-js';
 $: if ($ScrollProps) {
        r1 = $ScrollProps.range(0/4, 1/4);
 }
 ```
 
# Enviroment
### Enviroment
Enviroment allows you to easily include an environment map or an equirectangular Texture such as a CubeTexture in the 3d scene, in addition to providing an integrated access to a CubeCamera that returns a texture already mapped from the current camera to be applied to your materials

```js
<St.Environment files={'royal_esplanade_1k.hdr'} path ={'textures/equirectangular/'} bind:envMap />
```
for convenience is available by default: a selection of HDRI Haven presets.
```js
<St.Environment preset={sunset} />
```
The option to activate a GroundProjectedEnv is also available
```js
<St.Environment ground={true} />
```

<br/>
<br/>

## development 
This is a study project and still under development can expect errors