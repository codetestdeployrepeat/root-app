# SoundSmart.io Root Application

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
* Navbar app
  * Shows the main navigation menu
  * Loads on all pages
  * Full single-spa React app
* APM app
  * The agile project manager app
  * Maps to /apm URL
  * Full single-spa React app
* Marketplace app
  * The marketplace app
  * Maps to /marketplace URL
  * Full single-spa React app 
