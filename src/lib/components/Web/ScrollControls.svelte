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

const { contextScenes } = get_scenes();
let el : HTMLElement;
let fill : HTMLDivElement;
let fixed : HTMLDivElement;
export let eps = 0.0001;
export let horizontal = false;
export let pages = 3;
export let distance = 1;
export let damping = 4;
export let infinite : boolean = false;


$ScrollProps.horizontal= horizontal;
$ScrollProps.damping = damping;
$ScrollProps.pages = pages;
$ScrollProps.eps = eps;


let last = 0


onFrame(() => {
  $ScrollProps.offset = THREE.MathUtils.damp((last = $ScrollProps.offset), $scroll, damping, contextScenes.clock.getDelta());

  if (Math.abs(last - $ScrollProps.offset) > eps) {
    contextScenes.invalidate();
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



onMount( () => { 
  fill =  document.createElement('div');
  fixed =  document.createElement('div');
  
  el.style[horizontal ? 'overflowX' : 'overflowY'] = 'auto'
  el.style[horizontal ? 'overflowY' : 'overflowX'] = 'hidden'
    
  fixed.style.position = 'sticky';
  fixed.style.top = '0px';
  fixed.style.left = '0px';
  fixed.style.width = '100vw';
  fixed.style.height = '100vh';
  fixed.style.overflow = 'hidden';
  el.appendChild(fixed);
  
  fill.style.height = horizontal ? '100%' : `${pages * distance * 100}%`;
  fill.style.width = horizontal ? `${pages * distance * 100}%` : '100%';
  fill.style.pointerEvents = 'none';
  el.appendChild(fill);
  
    if (contextScenes.el && contextScenes.container){
    containerLeght = contextScenes.el.clientHeight;
    scrollLength = el[horizontal ? 'scrollWidth' : 'scrollHeight'];
    scrollThreshold = scrollLength  - containerLeght;
    contextScenes.invalidate();
   
  }
  el.addEventListener('scroll', UpdateScroll, { passive: true })  
})

function UpdateScroll () {
  const current = el[horizontal ? 'scrollLeft' : 'scrollTop'] ;
  $scroll = current / scrollThreshold  
 }
 
 
afterUpdate(() => {
});


$: if ($scroll) {
}

 
</script>

<style>
.el {
    position : absolute;
    height: 100vh;
    width: 100vw;
    top : 0px;
    left : 0px; 
}
</style>

<div class="el" bind:this={el} >
  <slot/>
</div>

