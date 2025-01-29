export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico"]),
	mimeTypes: {},
	_: {
		client: {"start":"_app/immutable/entry/start.Bceh-l5O.js","app":"_app/immutable/entry/app.BULa7iKg.js","imports":["_app/immutable/entry/start.Bceh-l5O.js","_app/immutable/chunks/CYpdoqym.js","_app/immutable/chunks/C67j8XKw.js","_app/immutable/chunks/-tyUihEY.js","_app/immutable/entry/app.BULa7iKg.js","_app/immutable/chunks/C67j8XKw.js","_app/immutable/chunks/B8lnCunP.js","_app/immutable/chunks/D8QP7k_R.js","_app/immutable/chunks/-tyUihEY.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
