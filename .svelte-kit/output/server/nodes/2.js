import * as universal from '../entries/pages/_page.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/2.DofdAcpa.js","_app/immutable/chunks/D8QP7k_R.js","_app/immutable/chunks/C67j8XKw.js","_app/immutable/chunks/D-9fIO-n.js"];
export const stylesheets = ["_app/immutable/assets/2.DCM_OL2j.css"];
export const fonts = [];
