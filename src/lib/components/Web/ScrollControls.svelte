<script lang="ts">
import * as THREE from "three";
import { onDestroy, onMount, afterUpdate } from 'svelte';
import { get_scenes, set_scroll } from "$lib/utils/context";
import { ScrollControls } from '$lib/core/ScrollControls'
import Canvas from "../Canvas.svelte";
import { writable } from 'svelte/store';
import { useScroll }  from '$lib/components/Web/useScroll'
import { scroll, ScrollProps} from "$lib/utils/stores";
import {onFrame } from "$lib/utils/lifecycle"

export let id : string  = "default";


let el : HTMLElement;
let fill : HTMLDivElement;
let fixed : HTMLDivElement;
export let eps = 0.0001;
export let horizontal = false;
export let pages = 3;
export let distance = 1;
export let damping = 4;
//export let infinite : boolean = false;

const { contextCanvas } = get_scenes();
$: elementScene = contextCanvas.arrayScenes.get(id); 


$ScrollProps.horizontal= horizontal;
$ScrollProps.damping = damping;
$ScrollProps.pages = pages;
$ScrollProps.eps = eps;


let last = 0


onFrame(() => {
  $ScrollProps.offset = THREE.MathUtils.damp((last = $ScrollProps.offset), $scroll, damping, contextCanvas.clock.getDelta());

  if (Math.abs(last - $ScrollProps.offset) > eps) {
    contextCanvas.invalidate();
  }
});


function range () {
  console.log("Gil")
}


let y =0;
let target;
let offset = 0;

let containerLeght : number; 
let scrollLength  : number;
let scrollThreshold : number;

let fillHeight : string;
let fillWidth : string;
onMount( () => { 
 
  el.style[horizontal ? 'overflowX' : 'overflowY'] = 'auto'
  el.style[horizontal ? 'overflowY' : 'overflowX'] = 'hidden'
    
  /*
  fill.style.height = horizontal ? '100%' : `${pages * distance * 100}%`;
  fill.style.width = horizontal ? `${pages * distance * 100}%` : '100%';
  fill.style.pointerEvents = 'none';
  */
  fillHeight = horizontal ? '100%' : `${pages * distance * 100}%`;
  fillWidth = horizontal ? `${pages * distance * 100}%` : '100%';
  
  if (contextCanvas.el && contextCanvas.container){
    containerLeght = contextCanvas.el.clientHeight;
    scrollLength = el[horizontal ? 'scrollWidth' : 'scrollHeight'];
    scrollThreshold = scrollLength  - containerLeght;
    contextCanvas.invalidate();
   
  }
  el.addEventListener('scroll', UpdateScroll, { passive: true })  
})

function UpdateScroll () {
  const current = el[horizontal ? 'scrollLeft' : 'scrollTop'] ;
  $scroll = current / scrollThreshold  
 }
 
 
afterUpdate(() => {
});


$: if ($scroll) {}

/**

*/
 
</script>

<style>
.el {
    position : absolute;
    height: 100vh;
    width: 100vw;
    top : 0px;
    left : 0px; 
}
.fixed {
    position : sticky;
    height: 100vh;
    width: 100vw;
    top : 0px;
    left : 0px; 
    overflow : hidden;
}
.fill {
   pointer-events : none;
   height: var(--fill-height);
   width: var(--fill-Width);
}



</style>

<div class="el" bind:this={el} >

  <slot/>
  
  <div class="fixed" bind:this={fixed} >
    <slot name="fixed" />
  </div> 
  
  <div class="fill" bind:this={fill} style="--fill-height: {fillHeight}; --fill-Width: {fillWidth} "   >
    <slot name="fill" />
  </div> 
  
</div>

