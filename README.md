# MollFrontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.1.

## Development
Run `npm run start` for a local dev server. Navigate to http://localhost:4200/.
The application will automatically reload if you change any of the source files.

Don't forget to setup your configuration in file `environment.local.ts`.
If missing, this file will be generated after first `npm run start`.

## Build & Run

### Build

First define configuration in environment variables

```shell
export APP_DEV_MODE=false
export APP_KRAMERIUS_URL="https://api.kramerius.mzk.cz/search"
export APP_ELASTIC_URL="http://localhost:9200/moll"
export APP_ELASTIC_LOGIN="elastic"
export APP_ELASTIC_PASSWORD="password"
export APP_GOOGLE_MAPS_API_KEY="google-maps-key"
```

Now run `npm run build` to build the project. 

The build artifacts will be stored in the `dist/` directory.

The environment configuration from `APP_*` variables will be stored into `dist/moll-frontend/browser/assets/env.json` (except for `APP_GOOGLE_MAPS_API_KEY`).

### Run

To test the the app, that you've just built, run: 

```shell
sh scripts/inject_google_maps_key_into_dist.sh; npx serve dist/moll-frontend/browser -l 8080
``` 

And open in browser

http://localhost:8080

## Docker Build & Run

### Build
```
docker build -t moll-frontend .
```

possibly including version tag  
```
docker build -t trinera/moll-frontend:1.3.1 .
```

### Push to Dockerhub

Only if you have write access to Dockerhub repository trinera/moll-frontend.
You don't need this to run localy built Docker image.

```
docker push trinera/moll-frontend:1.3.1
```

### Build & push to Dockerhub (multiplatform)
```
docker buildx build --platform linux/amd64,linux/arm64 -t trinera/moll-frontend:1.3.1 --push .
```

### Run Docker image

#### Local image

Run locally built Docker image

##### Run
```shell
docker run -p 1234:80 \
  -e APP_DEV_MODE=false \
  -e APP_KRAMERIUS_URL=https://api.kramerius.mzk.cz/search \
  -e APP_ELASTIC_URL=https://elastic.example.com \
  -e APP_ELASTIC_LOGIN=login \
  -e APP_ELASTIC_PASSWORD=password \
  -e APP_GOOGLE_MAPS_API_KEY=google-maps-key \
trinera/moll-frontend
```

##### Run exact version:
```shell
docker run -p 1234:80 \
  -e APP_KRAMERIUS_URL=https://api.kramerius.mzk.cz/search \
  -e APP_ELASTIC_URL=https://elastic.example.com \
  -e APP_ELASTIC_LOGIN=login \
  -e APP_ELASTIC_PASSWORD=password \
  -e APP_GOOGLE_MAPS_API_KEY=google-maps-key \
trinera/moll-frontend:1.3.1
```

#### Image pulled from Docker Hub

Run image that someone built and pushed to Dockerhub.

##### Run

```shell
docker pull trinera/moll-frontend
docker run -p 1234:80 \
  -e APP_KRAMERIUS_URL=https://api.kramerius.mzk.cz/search \
  -e APP_ELASTIC_URL=https://elastic.example.com \
  -e APP_ELASTIC_LOGIN=login \
  -e APP_ELASTIC_PASSWORD=password \
  -e APP_GOOGLE_MAPS_API_KEY=google-maps-key \
trinera/moll-frontend
```

And open in browser

http://localhost:1234

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.