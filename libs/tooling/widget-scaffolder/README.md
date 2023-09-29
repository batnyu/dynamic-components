# tooling-widget-scaffolder

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build tooling-widget-scaffolder` to build the library.

## Running unit tests

Run `nx test tooling-widget-scaffolder` to execute the unit tests via [Jest](https://jestjs.io).

## How to setup this

- npm install @nx/plugin -D

npx nx g @test-widgets/widget-scaffolder:tooling-widget-scaffolder --dry-run

Depuix Nx 13, l'index.html d'une app buildé utilise type="module" pour l'import de script. On utilise les ES modules. Le dynamic import est utilisable uniquement avec les ES modules.
https://github.com/angular/angular-cli/issues/22159/
