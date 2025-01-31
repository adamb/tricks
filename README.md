# Stupid Cloud Tricks

Welcome to the Stupid Cloud Tricks project! This project showcases interesting and fun experiments with cloud technologies, specifically using Cloudflare Workers and Svelte.

## Features

- **Who Am I?**: A real-time demonstration of Cloudflare's edge network in action. It retrieves your location (latitude and longitude) from the Cloudflare request object and identifies the Cloudflare data center (colo) handling your request. The app calculates the distance between you and the worker, displaying detailed information about both endpoints.

- **Colo Mapping**: The mapping of colos to locations is sourced from [this repo](https://github.com/adamb/cloudflare-colo-list).

## Live Demo

Check out the live demo at [tricks.dev.pr](https://tricks.dev.pr).

## Code

The source code for this project is available on [GitHub](https://github.com/adamb/tricks).

## Development

To start developing locally, clone the repository and install dependencies:

```bash
git clone https://github.com/adamb/tricks.git
cd tricks
npm install
```

Start the development server:

```bash
npm run dev
```

## Building

To create a production build of the app:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

## Deployment

To deploy the app, ensure you have the necessary Cloudflare Workers setup and configurations.

> Note: You may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
