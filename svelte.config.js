import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // Ignore missing favicon
        if (path === '/favicon.ico') return;
        // Otherwise throw errors
        throw new Error(message);
      }
    }
  }
};

export default config;
