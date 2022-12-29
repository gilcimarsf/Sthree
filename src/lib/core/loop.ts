import type  {ContextCanvas} from '../core/manager';


export function createLoop (roots : ContextCanvas) {
let running = false
let repeat : number
let frame : number 

function loop () {
frame = requestAnimationFrame (loop);
running = true;
repeat = 0;


}
}


