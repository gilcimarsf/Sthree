import { onMount } from 'svelte';



export function onFrame(callback : () => void) {
	onMount(() => {
		let frame :number ;
		requestAnimationFrame(function loop() {
			frame = requestAnimationFrame(loop);
			callback(); 
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});
}


