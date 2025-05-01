# MollFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.1.

## Development server

Run

`npm run start`

for a local dev server. Navigate to `http://localhost:4200/`.
The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

First define configuration in environment variables

```shell

export APP_KRAMERIUS_URL="https://api.kramerius.mzk.cz/search"
export APP_ELASTIC_URL="http://localhost:9200/moll"
export APP_ELASTIC_LOGIN="elastic"
export APP_ELASTIC_PASSWORD="password"

```

Now run `npm run build` to build the project. 

The build artifacts will be stored in the `dist/` directory.

The environment configuration will be stored from `APP_*` variables and stored into `dist/moll-frontend/browser/assets/env.json`

To test the build app run 

`npx serve dist/moll-frontend/browser -l 8080` 

And open in browser 

`http://localhost:8080`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
