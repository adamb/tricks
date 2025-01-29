

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0._RmlNyIT.js","_app/immutable/chunks/D8QP7k_R.js","_app/immutable/chunks/C67j8XKw.js"];
export const stylesheets = [];
export const fonts = [];
