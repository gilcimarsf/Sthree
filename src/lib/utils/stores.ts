import { writable, derived } from 'svelte/store';
import {ScrollControls} from '$lib/core/ScrollControls'
export const scroll = writable(0);

let scrollcontrol = new ScrollControls (false,0,0,0);

export const  ScrollProps = writable(scrollcontrol);

export const ScrollProps2 = writable({});


