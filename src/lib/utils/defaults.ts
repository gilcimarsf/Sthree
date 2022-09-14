import * as THREE from 'three';

export type EulerOrder = 'XYZ' | 'XZY' | 'YXZ' | 'YZX' | 'ZXY' | 'ZYX';

export let position : [number, number, number] = [0, 0, 0];
export let rotation : [number, number, number, EulerOrder?] = [0, 0, 0];
export let scale : number | [number, number, number]= [1, 1, 1];
export let geometry = new THREE.BufferGeometry();
export let material = new THREE.MeshNormalMaterial();
