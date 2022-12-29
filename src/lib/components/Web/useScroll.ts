import { scroll,ScrollProps } from "../../utils/stores";
import { get_scroll} from "$lib/utils/context";
import { derived, writable} from 'svelte/store';

// maneger stores 
let Scroll : any;
let storeUnsubscribeScroll;
storeUnsubscribeScroll = scroll.subscribe((val) => Scroll = val);

let scrollProps : any;
let storeUnsubscribeProps;
storeUnsubscribeProps = ScrollProps.subscribe((val) => scrollProps = val);


//useScroll
export class ScrollControls {
  
    el?: HTMLElement
    eps: number = scrollProps.eps
    fill?: HTMLDivElement
    fixed?: HTMLDivElement
    horizontal: boolean = scrollProps.horizontal
    damping: number = scrollProps.damping
    offset: number = Scroll
    delta: number = scrollProps.delta
    pages: number = scrollProps.pages
    constructor() { 
    }
    range(from: number, distance: number, margin: number = 0) {
      const start = from - margin
      const end = start + distance + margin * 2
      return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start)
    }
    curve(from: number, distance: number, margin: number = 0) {
      return Math.sin( this.range(from, distance, margin) * Math.PI)
    }
    visible(from: number, distance: number, margin: number = 0) {
      const start = from - margin
      const end = start + distance + margin * 2
      return this.offset >= start && this.offset <= end
    }
  }

 const ScrollControls2 =  {
    eps : scrollProps.eps,
    horizontal: scrollProps.horizontal,
    damping: scrollProps.damping,
    offset: Scroll,
    delta: scrollProps.delta,
    pages: scrollProps.pages,
    
    range(from: number, distance: number, margin: number = 0) {
      const start = from - margin
      const end = start + distance + margin * 2
      return this.offset < start ? 0 : this.offset > end ? 1 : (this.offset - start) / (end - start)
    },
    curve(from: number, distance: number, margin: number = 0) {
      return Math.sin( this.range(from, distance, margin) * Math.PI)
    },
    visible(from: number, distance: number, margin: number = 0) {
      const start = from - margin
      const end = start + distance + margin * 2
      return this.offset >= start && this.offset <= end
    }
  }

  let prop = new ScrollControls();

  
 
export function useScroll (){
  return new ScrollControls();
}


