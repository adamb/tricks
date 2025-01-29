export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.9LbpMfur.js","app":"_app/immutable/entry/app.DXx4Xn1C.js","imports":["_app/immutable/entry/start.9LbpMfur.js","_app/immutable/chunks/C4ZmT8S9.js","_app/immutable/chunks/C67j8XKw.js","_app/immutable/chunks/-tyUihEY.js","_app/immutable/entry/app.DXx4Xn1C.js","_app/immutable/chunks/C67j8XKw.js","_app/immutable/chunks/B8lnCunP.js","_app/immutable/chunks/D8QP7k_R.js","_app/immutable/chunks/-tyUihEY.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base_path = "";
