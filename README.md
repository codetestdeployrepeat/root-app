# SoundSmart.io Root Application

![Micro-frontend](https://github.com/leonelcloudsmart/root-app/raw/master/public/images/micro-frontend-example.jpg)

## Components

* Root app
  * Web server that serves the main app
  * Express JS server with simple templating (EJS)
  * Loads the initial HTML and minimal assets
  * Handles proxy to each micro-frontend assets
    * /assets/micro-config -> micro-config server
    * /assets/micro-deps -> micro-deps server
    * /assets/apm -> apm server
    * /assets/marketplace -> marketplace server
* Micro-Config app
  * Handles configuration for each micro-frontend
  * Maps URL paths to the correct micro-frontend
  * Just a small JS bundle file
* Micro-Deps app
  * Spits out JS files common to all the apps
* Navbar app (Single SPA/React App)
  * Shows the main navigation menu
  * Loads on all pages
  * Full single-spa React app
* APM app (Single SPA/React App)
  * The agile project manager app
  * Maps to /apm URL
  * Full single-spa React app
* Marketplace app  (Single SPA/React App)
  * The marketplace app
  * Maps to /marketplace URL
  * Full single-spa React app 

## How to create a single-spa App

### Create a react app using CRA script (create-react-app script)

```shell script
create-react-app my-awesome-app --typescript
``` 

### Build the app just like a regular React app

Add additional packages if needed, then build the initial components
enough to get started.

### Eject from CRA

```shell script
yarn run eject
```

Ejecting from CRA will allow us to customize the core webpack build process
which is necessary to support any micro-frontends deployments.

### Add single-spa packages

```shell script
yarn add single-spa single-spa-react
yarn add --dev @types/single-spa-react
``` 

### Modify the App.tsx to become a class based component

Single-SPA recommends to add a componentDidCatch handler for the root component
for compatibility/error handling purposes.

```typescript jsx
import React from 'react';

type Props = {
  children?: any
};

type State = {
  hasError: boolean
};

export class App extends React.Component<Props, State> {
  state = {
    hasError: false
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <h1>An unexpected error occurred!</h1>
      )
    } else {
      return (
        <div>
          <h1>This is our awesome app</h1>
        </div>
      );
    }
  }
}
```

### Remove service worker

Service worker should not be used at this point as we don't have clear use cases yet for
progressive web apps.

### Rename index.tsx to index.ts and modify contents

`index.ts` is become the main entry point for the webpack build process.
We replace it from DOM rendering to a single-spa lifecycle hooks
so that receiving root application will be able to handle it.

Basically, we don't render our app here. We just bundle it into a JS file.

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { App } from "./App";

function domElementGetter() {
  return document.querySelectorAll('#my-awesome-app')[0];
}

const reactLifecycle = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  domElementGetter,
});

export const bootstrap = [
  reactLifecycle.bootstrap,
];

export const mount = [
  reactLifecycle.mount,
];

export const unmount = [
  reactLifecycle.unmount,
];
```

### Remove auto-open browser when starting the app

Running `yarn run start` in a react app will usually open a browser window. We need
to disable it as we don't really need to render anything in this app. It would be annoying
to open several browser windows if we have plenty of micro-frontends running in parallel.

Open `scripts/start.js` and find the line that opens the browser. Just search "browser" or something
within the file and clean it up.

### Edit `config/webpack.config.js` to use SystemJS bundling

Find the `output` section and modify it so that it will use AMD bundling style.

```text
    output: {
      // The build folder.
      path: paths.appBuild,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: 'assets/my-awesome-app/js/my-awesome-app.app.js',
      library: 'apm',
      libraryTarget: 'amd',
``` 

Also remove code chunking and splitting. 

Finally, rename all other output files so that it will follow this pattern:

```text
// Pattern
assets/app-name

// Example
name: 'static/media/[name].[hash:8].[ext]',

// To:
name: 'assets/app-name/media/[name].[hash:8].[ext]',
```

## Setup for Root app

### Configure environment

Make sure to define the proxy mapping by copying the contents of `.env.example` into `.env` and
configure your local setup.

```dotenv
PORT=8400
MICRO_CONFIG_URL=http://localhost:8401/assets/micro-config
MICRO_DEPS_URL=http://localhost:8402/assets/micro-deps
NAVBAR_URL=http://localhost:8403/assets/navbar
APM_URL=http://localhost:8404/assets/apm
MARKETPLACE_URL=http://localhost:8405/assets/marketplace
```

### Configure app

Edit `app.js` if you need to modify the proxies, or load some dynamic values into the template.

### Configure template

Edit `views/index.ejs` to modify the generic layout and to modify the import mapping if needed.


## Running the app

Just run the command below:

```shell script
yarn run start
```
