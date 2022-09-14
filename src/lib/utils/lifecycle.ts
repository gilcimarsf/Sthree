import { onMount } from 'svelte';


export function onFrame(callback : () => void) {
	onMount(() => {
		let frame :number ;

		requestAnimationFrame(function loop() {
			frame = requestAnimationFrame(loop);
			callback(); // TODO are there useful args we can pass here?
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});
}
