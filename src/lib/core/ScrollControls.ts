import { createEventDispatcher } from 'svelte';
import { get_scroll } from "$lib/utils/context";



export type ScrollControlsProps = {
  eps?: number
  horizontal?: boolean
  infinite?: boolean
  pages?: number
  distance?: number
  damping?: number
  enabled?: boolean
  
  //style?: React.CSSProperties
  //children: React.ReactNode
}

export type ScrollControlsState = {
  el?: HTMLElement
  eps?: number 
  fill?: HTMLDivElement 
  fixed?: HTMLDivElement
  horizontal?: boolean
  damping?: number
  offset?: number
  delta?: number
  pages?: number
  range : (from: number, distance: number, margin?: number)=> number
  curve : (from: number, distance: number, margin?: number) => number
  visible : (from: number, distance: number, margin?: number)=> boolean
 }

export class ScrollControls {
  
  el?: HTMLElement;
  eps: number = 0.00001;
  fill?: HTMLDivElement ;
  fixed?: HTMLDivElement;
  horizontal: boolean = false;
  damping: number = 4;
  offset: number =0;
  delta: number = 0;
  pages: number = 1;
  constructor( horizontal: boolean, damping: number, pages: number, eps :number ) { 
  this.horizontal = horizontal;
  this.damping = damping;
  this.pages = pages;
  this.eps = eps;
  } 
  
  range =  (from: number, distance: number, margin: number = 0) =>{
    const start = from - margin
    const end = start + distance + margin * 2
    return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start)

  }
  curve = (from: number, distance: number, margin: number = 0) =>{
    return Math.sin( this.range(from, distance, margin) * Math.PI)
  }
  visible = (from: number, distance: number, margin: number = 0) => {
    const start = from - margin
    const end = start + distance + margin * 2
    return this.offset >= start && this.offset <= end
  }
}



